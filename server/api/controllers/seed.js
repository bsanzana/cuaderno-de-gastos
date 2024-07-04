const mongoose = require("mongoose");
const Seed = mongoose.model("Seed");
const utils = require("./utils");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllSeeds = function (req, res) {
  let hostname = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber = requestData.queryData.page.number || 0;
  let pageSize = requestData.queryData.page.size || 10;
  let fields = requestData.queryData.fields;
  let sort = requestData.queryData.sort;
  let collation = { locale: "es" };
  let query = {};

  Object.keys(fields).forEach(function (key) {
    if (fields[key] !== null) {
      query[key] = fields[key], "i";
    }
  });
  Seed.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, seeds) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de las semillas.",
        });
        console.log(err);
      } else
        Seed.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/seeds",
            },
            data: seeds,
          });
        });
    }
  ).populate(["crop", "category"]);
};

module.exports.getSeed = function (req, res) {
  Seed.findById(req.params.pid, (err, seed) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información de la semilla.",
      });
      console.log(err);
    } else
      utils.sendJSONresponse(res, 200, {
        data: seed,
      });
  });
};

module.exports.createSeed = function (req, res) {
  let seed = new Seed();
  seed.name = req.body.seed.name;
  seed.active = req.body.seed.active;
  seed.crop = req.body.seed.crop;
  seed.category = req.body.seed.category;

  seed.save(function (err) {
    if (err)
      utils.sendJSONresponse(res, 404, {
        message: "Ha ocurrido un error al crear la semilla.",
        error: err,
      });
    else {
      utils.sendJSONresponse(res, 200, {
        message:
          "La semilla <strong>" +
          seed.name +
          "</strong> fue creada exitosamente.",
      });
    }
  });
};

module.exports.editSeed = function (req, res) {
  if (req.params.pid) {
    Seed.findById(req.params.pid).exec(function (err, seed) {
      if (!seed) {
        utils.sendJSONresponse(res, 404, {
          message: "Semilla no encontrada.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al actualizar la semilla.",
        });
        console.log(err);
        return;
      }
      seed.name = req.body.seed.name;
      seed.crop = req.body.seed.crop;
      seed.active = req.body.seed.active;
      seed.category = req.body.seed.category;

      seed.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message: "Ha ocurrido un error al actualizar la semilla.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message:
              "La semilla " + seed.name + " ha sido actualizada exitosamente.",
          });
        }
      });
    });
  } else
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró la semilla.",
    });
};

module.exports.deleteSeed = function (req, res) {
  /** TODO: VER QUE PASA CUANDO SEMILLA ESTÁ SIENDO UTILIZADA */
  if (req.params.pid) {
    Seed.findByIdAndRemove(req.params.pid).exec(function (err, seed) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al eliminar la semilla.",
        });
        console.log(err);
        return;
      }
      utils.sendJSONresponse(res, 200, {
        message: "La semilla " + seed.name + " fue eliminada exitosamente.",
      });
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró la semilla.",
    });
  }
};

module.exports.seedList = function (req, res) {
  Seed.find({}, function (err, seeds) {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    } else {
      utils.sendJSONresponse(res, 201, {
        data: seeds,
      });
    }
  });
};
