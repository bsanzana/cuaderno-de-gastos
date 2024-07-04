const mongoose = require('mongoose');
const Product = mongoose.model('Products');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllProduct = function (req, res) {
    let hostname = req.headers.host;
    let requestData = JsonApiQueryParser.parseRequest(req.url);
    let pageNumber = requestData.queryData.page.number || 0;
    let pageSize = requestData.queryData.page.size || 10;
    let fields = requestData.queryData.fields;
    let sort = requestData.queryData.sort;
    let collation = {locale: 'es'};
    let query = {};

    Object.keys(fields).forEach(function (key) {
        if (fields[key] !== null) {
            query[key] = fields[key], 'i';
        }
    });
    Product.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, category) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los productos."
                });
                console.log(err);
            } else
                Product.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/products'
                        },
                        data: category
                    });
                });
        }
    ).populate("category")
};

module.exports.createProduct = function (req, res) {
    // Validar datos de entrada
    if (!req.body.product || !req.body.product.name || !req.body.product.category || typeof req.body.product.active !== 'boolean') {
        return utils.sendJSONresponse(res, 400, {
            "message": "Datos de entrada no válidos."
        });
    }

    // Crear una nueva instancia de Producto
    const newProduct = new Product({
        name: req.body.product.name,
        active: req.body.product.active,
        category: req.body.product.category
    });

    // Guardar en la base de datos
    newProduct.save(function (err, savedProduct) {
        if (err) {
            console.error("Error al guardar el producto:", err);
            return utils.sendJSONresponse(res, 500, {
                "message": "Ha ocurrido un error al crear el producto.",
                "error": err
            });
        }

        // Enviar respuesta al cliente
        utils.sendJSONresponse(res, 201, {
            "message": `El producto "${savedProduct.name}" fue creado exitosamente.`,
            "data": savedProduct
        });
    });
};

module.exports.editProduct = function (req, res) {
    // Validar datos de entrada
    if (!req.body.product || !req.body.product.name || !req.body.product.category || typeof req.body.product.active !== 'boolean') {
        return utils.sendJSONresponse(res, 400, {
            "message": "Datos de entrada no válidos."
        });
    }

    // Buscar el producto a editar por su ID
    Product.findById(req.params.pid, function (err, product) {
        if (err) {
            console.error("Error al buscar el producto:", err);
            return utils.sendJSONresponse(res, 500, {
                "message": "Ha ocurrido un error al buscar el producto.",
                "error": err
            });
        }

        if (!product) {
            return utils.sendJSONresponse(res, 404, {
                "message": "El producto no se encontró."
            });
        }

        // Actualizar los datos del producto
        product.name = req.body.product.name;
        product.active = req.body.product.active;
        product.category = req.body.product.category;

        // Guardar los cambios en la base de datos
        product.save(function (err, updatedProduct) {
            if (err) {
                console.error("Error al guardar el producto actualizado:", err);
                return utils.sendJSONresponse(res, 500, {
                    "message": "Ha ocurrido un error al guardar el producto actualizado.",
                    "error": err
                });
            }

            // Enviar respuesta al cliente
            utils.sendJSONresponse(res, 200, {
                "message": `El producto "${updatedProduct.name}" fue actualizado exitosamente.`,
                "data": updatedProduct
            });
        });
    });
};
