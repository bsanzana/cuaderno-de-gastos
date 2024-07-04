const mongoose = require('mongoose');
const ChemicalProduct = mongoose.model('ChemicalProduct');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllChemicalProducts = function (req, res) {
    let hostname = req.headers.host;
    let requestData = JsonApiQueryParser.parseRequest(req.url);
    let pageNumber = requestData.queryData.page.number || 0;
    let pageSize = requestData.queryData.page.size || 10;
    let fields = requestData.queryData.fields;
    let sort = requestData.queryData.sort;
    let collation = {locale: 'es'};
    let query = {};

    console.log(pageNumber);
    console.log(pageSize);

    Object.keys(fields).forEach(function (key) {
        if (fields[key] !== null) {
            query[key] = new RegExp(fields[key], 'i');
        }
    });
    ChemicalProduct.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, chemicalProducts) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de los productos químicos."
                });
                console.log(err);
            }
            else
                ChemicalProduct.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/chemicalProducts'
                        },
                        data: chemicalProducts
                    });
                });
        }
    )
};

module.exports.getChemicalProduct = function (req, res) {
    ChemicalProduct.findById(req.params.pid, (err, chemicalProduct) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información del producto químico."
            });
            console.log(err);
        }
        else
            utils.sendJSONresponse(res, 200, {
                data: chemicalProduct
            });
    });
};

module.exports.createChemicalProduct = function (req, res) {
    let chemicalProduct = new ChemicalProduct();
    chemicalProduct.name = req.body.chemicalProduct.name;
    chemicalProduct.save(function (err) {
        if (err){
            utils.sendJSONresponse(res, 404, {
                "message": "Ha ocurrido un error al crear el producto químico.",
                error: err
            });
        }
        else {
            utils.sendJSONresponse(res, 200, {
                "message": "El producto químico <strong>" + chemicalProduct.name + "</strong> fue creado exitosamente.",
                data: chemicalProduct
            });
        }
    });
};

module.exports.editChemicalProduct = function (req, res) {
    if (req.params.pid) {
        ChemicalProduct.findById(req.params.pid)
            .exec(
                function (err, chemicalProduct) {
                    if (!chemicalProduct) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Producto químico no encontrado."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar el producto químico."
                        });
                        console.log(err);
                        return;
                    }
                    chemicalProduct.name = req.body.chemicalProduct.name;
                    chemicalProduct.save(function (err) {
                        if (err){
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar el producto químico."
                            });
                            console.log(err);
                        }
                        else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "El producto químico " + chemicalProduct.name + " ha sido actualizado exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el producto químico."
        });
};

module.exports.deleteChemicalProduct = function (req, res) {
    /** TODO: VER QUE PASA CUANDO PRODUCTO QUÍMICO ESTÁ SIENDO UTILIZADO */
    if (req.params.pid) {
        ChemicalProduct.findByIdAndRemove(req.params.pid)
            .exec(
                function (err, chemicalProduct) {
                    if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al eliminar el producto químico."
                        });
                        console.log(err);
                        return;
                    }
                    utils.sendJSONresponse(res, 200, {
                        "message": "El producto químico " + chemicalProduct.name + " fue eliminado exitosamente."
                    });
                }
            )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró el producto químico."
        });
    }
};

module.exports.chemicalProductList = function (req, res) {
    ChemicalProduct.find({}, function (err, chemicalProducts) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: chemicalProducts
            });
        }
    })
}
