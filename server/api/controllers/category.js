const mongoose = require("mongoose");
const CategoryProduct = mongoose.model("CategoryProducts");
const utils = require("./utils");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllCategory = function (req, res) {
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
  CategoryProduct.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, category) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de las categorias de los productos.",
        });
        console.log(err);
      } else
        CategoryProduct.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/categorys",
            },
            data: category,
          });
        });
    }
  );
};

module.exports.createCategory = function (req, res) {
  // Validar datos de entrada
  if (
    !req.body.category ||
    !req.body.category.name ||
    typeof req.body.category.active !== "boolean"
  ) {
    return utils.sendJSONresponse(res, 400, {
      message: "Datos de entrada no válidos.",
    });
  }

  // Crear nueva instancia de Category
  const newCategoryProduct = new CategoryProduct({
    name: req.body.category.name,
    active: req.body.category.active,
  });

  // Guardar en la base de datos
  newCategoryProduct.save(function (err, savedCategoryProduct) {
    if (err) {
      console.error("Error al guardar la categoria:", err);
      return utils.sendJSONresponse(res, 500, {
        message: "Ha ocurrido un error al crear la categoria.",
        error: err,
      });
    }

    // Enviar respuesta al cliente
    utils.sendJSONresponse(res, 201, {
      message: `La categoria "${savedCategoryProduct.name}" fue creada exitosamente.`,
      data: savedCategoryProduct,
    });
  });
};

module.exports.editCategory = function (req, res) {
  // Validar datos de entrada
  if (
    !req.body.category ||
    !req.body.category.name ||
    typeof req.body.category.active !== "boolean"
  ) {
    return utils.sendJSONresponse(res, 400, {
      message: "Datos de entrada no válidos.",
    });
  }

  if (!req.params.cid) {
    return utils.sendJSONresponse(res, 400, {
      message: "Falta el ID categoria.",
    });
  }

  // Buscar la categoría a editar por su ID
  CategoryProduct.findById(
    req.params.cid,
    function (err, categoryProduct) {
      if (err) {
        console.error("Error al buscar la categoría:", err);
        return utils.sendJSONresponse(res, 500, {
          message: "Ha ocurrido un error al buscar la categoría.",
          error: err,
        });
      }

      if (!categoryProduct) {
        return utils.sendJSONresponse(res, 404, {
          message: "La categoría no se encontró.",
        });
      }

      // Actualizar los datos de la categoría
      categoryProduct.name = req.body.category.name;
      categoryProduct.active = req.body.category.active;

      // Guardar los cambios en la base de datos
      categoryProduct.save(function (err, updatedCategoryProduct) {
        if (err) {
          console.error("Error al guardar la categoría actualizada:", err);
          return utils.sendJSONresponse(res, 500, {
            message:
              "Ha ocurrido un error al guardar la categoría actualizada.",
            error: err,
          });
        }

        // Enviar respuesta al cliente
        utils.sendJSONresponse(res, 200, {
          message: `La categoría "${updatedCategoryProduct.name}" fue actualizada exitosamente.`,
          data: updatedCategoryProduct,
        });
      });
    }
  );
};
