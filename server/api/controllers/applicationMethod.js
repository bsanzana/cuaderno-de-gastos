const mongoose = require("mongoose");
const ApplicationMethod = mongoose.model("ApplicationMethod");
const utils = require("./utils");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllApplicationMethods = function (req, res) {
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
  ApplicationMethod.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, applicationMethods) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los métodos de aplicación.",
        });
        console.log(err);
      } else
        ApplicationMethod.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/applicationMethods",
            },
            data: applicationMethods,
          });
        });
    }
  ).populate(["labor"]);
};

module.exports.getApplicationMethod = function (req, res) {
  ApplicationMethod.findById(req.params.pid, (err, applicationMethod) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información del método de aplicación.",
      });
      console.log(err);
    } else
      utils.sendJSONresponse(res, 200, {
        data: applicationMethod,
      });
  });
};

module.exports.createApplicationMethod = function (req, res) {
  let applicationMethod = new ApplicationMethod();
  applicationMethod.name = req.body.applicationMethod.name;
  applicationMethod.active = req.body.applicationMethod.active;
  applicationMethod.labor = req.body.applicationMethod.labor;

  applicationMethod.save(function (err) {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message: "Ha ocurrido un error al crear el método de aplicación.",
      });
      console.log(err);
    } else {
      utils.sendJSONresponse(res, 200, {
        message:
          "El método de aplicación <strong>" +
          applicationMethod.name +
          "</strong> fue creado exitosamente.",
      });
    }
  });
};

module.exports.editApplicationMethod = function (req, res) {
  if (req.params.pid) {
    ApplicationMethod.findById(req.params.pid).exec(function (
      err,
      applicationMethod
    ) {
      if (!applicationMethod) {
        utils.sendJSONresponse(res, 404, {
          message: "Método de aplicación no encontrado.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al actualizar el método de aplicación.",
        });
        console.log(err);
        return;
      }
      applicationMethod.name = req.body.applicationMethod.name;
      applicationMethod.active = req.body.applicationMethod.active;
      applicationMethod.labor = req.body.applicationMethod.labor;
      applicationMethod.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message:
              "Ha ocurrido un error al actualizar el método de aplicación.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message:
              "El método de aplicación " +
              applicationMethod.name +
              " ha sido actualizado exitosamente.",
          });
        }
      });
    });
  } else
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el método de aplicación.",
    });
};

module.exports.deleteApplicationMethod = function (req, res) {
  /** TODO: VER QUE PASA CUANDO MÉTODO DE APLICACIÓN ESTÁ SIENDO UTILIZADO */
  if (req.params.pid) {
    ApplicationMethod.findByIdAndRemove(req.params.pid).exec(function (
      err,
      applicationMethod
    ) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al eliminar el método de aplicación.",
        });
        console.log(err);
        return;
      }
      utils.sendJSONresponse(res, 200, {
        message:
          "El método de aplicación " +
          applicationMethod.name +
          " fue eliminado exitosamente.",
      });
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el método de aplicación.",
    });
  }
};

module.exports.applicationMethodList = function (req, res) {
  ApplicationMethod.find({}, function (err, applicationMethods) {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    } else {
      utils.sendJSONresponse(res, 201, {
        data: applicationMethods,
      });
    }
  });
};
