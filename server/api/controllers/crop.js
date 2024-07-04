const mongoose = require("mongoose");
const Crop = mongoose.model("Crop");
const utils = require("./utils");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllCrops = function (req, res) {
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
      query[key] = fields[key];
    }
  });
  Crop.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, crops) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los cultivos.",
        });
        console.log(err);
      } else
        Crop.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/crops",
            },
            data: crops,
          });
        });
    }
  );
};

// module.exports.getSeed = function (req, res) {
//     Seed.findById(req.params.pid, (err, seed) => {
//         if (err) {
//             utils.sendJSONresponse(res, 400, {
//                 "message": "Ha ocurrido un error al obtener la información de la semilla."
//             });
//             console.log(err);
//         } else
//             utils.sendJSONresponse(res, 200, {
//                 data: seed
//             });
//     });
// };

module.exports.createCrop = function (req, res) {
  let crop = new Crop();
  crop.name = req.body.crop.name;
  crop.active = req.body.crop.active;

  crop.save(function (err) {
    if (err)
      utils.sendJSONresponse(res, 404, {
        message: "Ha ocurrido un error al crear el cultivo.",
        error: err,
      });
    else {
      utils.sendJSONresponse(res, 200, {
        message: "El cultivo " + crop.name + " fue creada exitosamente.",
      });
    }
  });
};

module.exports.editCrop = function (req, res) {
  if (req.params.cid) {
    Crop.findById(req.params.cid).exec(function (err, crop) {
      if (!crop) {
        utils.sendJSONresponse(res, 404, {
          message: "Semilla no encontrada.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al actualizar el cultivo.",
        });
        console.log(err);
        return;
      }
      crop.name = req.body.crop.name;
      crop.active = req.body.crop.active;
      crop.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message: "Ha ocurrido un error al actualizar el cultivo.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message:
              "El cultivo " + crop.name + " ha sido actualizada exitosamente.",
          });
        }
      });
    });
  } else
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró la semilla.",
    });
};

// module.exports.deleteSeed = function (req, res) {
//     /** TODO: VER QUE PASA CUANDO SEMILLA ESTÁ SIENDO UTILIZADA */
//     if (req.params.pid) {
//         Seed.findByIdAndRemove(req.params.pid)
//             .exec(
//                 function (err, seed) {
//                     if (err) {
//                         utils.sendJSONresponse(res, 400, {
//                             "message": "Ha ocurrido un error al eliminar la semilla."
//                         });
//                         console.log(err);
//                         return;
//                     }
//                     utils.sendJSONresponse(res, 200, {
//                         "message": "La semilla " + seed.name + " fue eliminada exitosamente."
//                     });
//                 }
//             )
//     } else {
//         utils.sendJSONresponse(res, 404, {
//             "message": "No se encontró la semilla."
//         });
//     }
// };

module.exports.cropList = function (req, res) {
  Crop.find({ active: true }, {}, function (err, crops) {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
      return;
    } else {
      utils.sendJSONresponse(res, 201, {
        data: crops,
      });
    }
  });
};
