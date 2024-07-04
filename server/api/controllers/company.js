const mongoose = require("mongoose");
const Company = mongoose.model("Company");
const User = mongoose.model("User");
const Form = mongoose.model("Form");
const utils = require("./utils");
const Rut = require("rutjs");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllCompanies = function (req, res) {
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
      if (fields[key]) {
        query[key] = fields[key];
      } else if (!fields[key]) {
        query[key] = fields[key];
      } else {
        query[key] = new RegExp(fields[key], "i");
      }
    }
  });

  console.log("todas las company: ", query);

  Company.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, companies) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de las empresas.",
        });
        console.log(err);
      } else
        Company.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/companies",
            },
            data: companies,
          });
        });
    }
  ).populate(["group"]);
};

module.exports.getCompany = function (req, res) {
  Company.findById(req.params.cid, (err, company) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información de la empresa.",
      });
      console.log(err);
    } else
      company.fields.forEach(function (field, index, array) {
        array[index].ha = field.ha.toString();
      });
    utils.sendJSONresponse(res, 200, {
      data: company,
    });
  }).populate(["group"]);
};

module.exports.createCompany = function (req, res) {
  const companyBody = req.body.company;
  if (
    !req.body.company ||
    !companyBody.name ||
    !companyBody.rut ||
    !companyBody.group
  ) {
    utils.sendJSONresponse(res, 400, {
      message: "Faltan campos requeridos.",
    });
    return;
  } else if (!new Rut(companyBody.rut).isValid) {
    utils.sendJSONresponse(res, 400, {
      message: "El rut ingresado no es válido.",
    });
    return;
  }
  Company.findOne({
    rut: new RegExp(new Rut(companyBody.rut).getNiceRut(false), "i"),
  }).exec(function (err, company) {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message: "Ha ocurrido un error al crear la empresa.",
      });
      console.log(err);
    } else {
      if (company) {
        utils.sendJSONresponse(res, 400, {
          message: "El rut ingresado ya se encuentra registrado.",
        });
        return;
      } else {
        let company = new Company();
        company.active = companyBody.active;
        company.name = companyBody.name;
        company.birth_date = companyBody.birth_date;
        company.gender = companyBody.gender;
        company.activities_sii = companyBody.activities_sii;
        company.lastname = companyBody.lastname;
        company.rut = new Rut(companyBody.rut).getNiceRut(false);
        company.group = companyBody.group;
        company.fields = companyBody.fields;
        company.machinery = companyBody.machinery;
        company.save(function (err) {
          if (err) {
            utils.sendJSONresponse(res, 400, {
              message: "Ha ocurrido un error al crear el productor.",
              error: err,
            });
            console.log(err);
          } else {
            utils.sendJSONresponse(res, 200, {
              message:
                "El productor " + company.name + " a sido creada exitosamente.",
            });
            return;
          }
        });
      }
    }
  });
};

module.exports.editCompany = function (req, res) {
  if (req.params.cid) {
    const companyBody = req.body.company;
    if (
      !req.body.company ||
      !companyBody.name ||
      !companyBody.rut ||
      !companyBody.group
    ) {
      utils.sendJSONresponse(res, 400, {
        message: "Faltan campos requeridos.",
      });
      return;
    } else if (!new Rut(companyBody.rut).isValid) {
      utils.sendJSONresponse(res, 400, {
        message: "El rut ingresado no es válido.",
      });
      return;
    }
    Company.findById(req.params.cid).exec(function (err, company) {
      if (!company) {
        utils.sendJSONresponse(res, 404, {
          message: "Productor no encontrada.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al actualizar el productor.",
        });
        console.log(err);
        return;
      }
      company.name = companyBody.name;
      company.password = companyBody.password;
      company.lastname = companyBody.lastname;
      company.birth_date = companyBody.birth_date;
      company.gender = companyBody.gender;
      company.activities_sii = companyBody.activities_sii;
      company.rut = new Rut(companyBody.rut).getNiceRut(false);
      company.group = companyBody.group;
      company.fields = companyBody.fields;
      company.machinery = companyBody.machinery;
      company.active = companyBody.active;
      company.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message: "Ha ocurrido un error al actualizar el productor.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message:
              "El productor " +
              company.name +
              " ha sido actualizada exitosamente.",
          });
        }
      });
    });
  } else
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el productor.",
    });
};

module.exports.deleteCompany = function (req, res) {
  if (req.params.cid) {
    Company.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "company",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "forms",
          localField: "_id",
          foreignField: "company",
          as: "forms",
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.cid),
        },
      },
    ]).exec(function (err, company) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al eliminar la temporada.",
        });
        console.log(err);
      } else {
        if (
          typeof company[0].users !== "undefined" &&
          company[0].users.length > 0
        ) {
          User.updateMany(
            {
              company: mongoose.Types.ObjectId(req.params.cid),
            },
            {
              $set: {
                company: null,
                active: false,
              },
            },
            function (err) {
              if (err) {
                utils.sendJSONresponse(res, 400, {
                  message:
                    "Ha ocurrido un error al desactivar los usuarios asociados a la empresa.",
                });
                console.log(err);
              } else {
                console.log(
                  "Todos los usuarios asociados a la empresa fueron desactivados."
                );
              }
            }
          );
        }
        if (
          typeof company[0].forms !== "undefined" &&
          company[0].forms.length > 0
        ) {
          try {
            Form.deleteMany(
              {
                company: mongoose.Types.ObjectId(req.params.cid),
              },
              function (err) {
                if (err) {
                  utils.sendJSONresponse(res, 400, {
                    message:
                      "Ha ocurrido un error al eliminar los cuadernos de campo asociados a la empresa.",
                  });
                  console.log(err);
                } else {
                  console.log(
                    "Todos los cuadernos de campo asociados a la empresa fueron eliminados."
                  );
                }
              }
            );
          } catch (e) {
            utils.sendJSONresponse(res, 400, {
              message:
                "Ha ocurrido un error al eliminar los cuadernos de campo asociados a la empresa.",
            });
            console.log(e);
          }
        }
        Company.findByIdAndRemove(req.params.cid).exec(function (err, company) {
          if (err) {
            utils.sendJSONresponse(res, 400, {
              message: "Ha ocurrido un error al eliminar la empresa.",
            });
            console.log(err);
            return;
          }
          utils.sendJSONresponse(res, 200, {
            message:
              "La empresa " + company.name + " fue eliminada exitosamente.",
          });
        });
      }
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró la empresa.",
    });
  }
};

module.exports.companyList = function (req, res) {
  Company.find({}, function (err, companies) {
    if (err) {
      console.log(err);
      utils.sendJSONresponse(res, 400, err);
    } else {
      utils.sendJSONresponse(res, 201, {
        data: companies,
      });
    }
  });
};
