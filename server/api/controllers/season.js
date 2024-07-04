const mongoose = require('mongoose');
const Season = mongoose.model('Season');
const utils = require('./utils');
const JsonApiQueryParserClass = require('jsonapi-query-parser');
const JsonApiQueryParser = new JsonApiQueryParserClass();

module.exports.getAllSeasons = function (req, res) {
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
            query[key] = fields[key];
        }
    });

    Season.find(
        query,
        null,
        {
            sort: sort,
            skip: pageNumber * pageSize,
            limit: pageSize * 1,
            collation: collation
        },
        function (err, seasons) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al obtener la información de las temporadas."
                });
                console.log(err);
            } else
                Season.countDocuments(query, (err, count) => {
                    utils.sendJSONresponse(res, 200, {
                        meta: {
                            "total-pages": count / pageSize,
                            "total-items": count
                        },
                        links: {
                            self: hostname + '/api/v1/seasons'
                        },
                        data: seasons
                    });
                });
        }
    )
};

module.exports.getSeason = function (req, res) {
    Season.findById(req.params.sid, (err, season) => {
        if (err) {
            utils.sendJSONresponse(res, 400, {
                "message": "Ha ocurrido un error al obtener la información de la temporada."
            });
            console.log(err);
        } else
            utils.sendJSONresponse(res, 200, {
                data: season
            });
    });
};

module.exports.createSeason = function (req, res) {
    console.log
    let season = new Season();
    season.name = req.body.season.name;
    season.init_date = req.body.season.init_date;
    season.end_date = req.body.season.end_date;
    season.active = req.body.season.active;

    Season.find(
        {},
        function (err, seasons) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "Ha ocurrido un error al crear la temporada."
                });
                console.log(err);
            } else {
                let flag = true;
                // Verificamos que la temporada actual no se encuentre incluida en otra temporada
                for (let season of seasons) {
                    if (
                        (new Date(req.body.season.init_date).getTime() >= new Date(season.init_date).getTime() && new Date(req.body.season.init_date).getTime() <= new Date(season.end_date).getTime()) ||
                        (new Date(req.body.season.end_date).getTime() >= new Date(season.init_date).getTime() && new Date(req.body.season.end_date).getTime() <= new Date(season.end_date).getTime())
                    ) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "La fecha de inicio o término ya se encuentra incluida en otra temporada."
                        });
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    season.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al crear la temporada."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "La temporada <strong>" + season.name + "</strong> fue creada exitosamente."
                            });
                        }
                    });
                }
            }
        })
};

module.exports.editSeason = function (req, res) {
    if (req.params.sid) {
        Season.findById(req.params.sid)
            .exec(
                function (err, season) {
                    if (!season) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Temporada no encontrada."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al actualizar la temporada."
                        });
                        console.log(err);
                        return;
                    }
                    season.name = req.body.season.name;
                    season.init_date = req.body.season.init_date;
                    season.end_date = req.body.season.end_date;
                    season.active = req.body.season.active;
                    season.save(function (err) {
                        if (err) {
                            utils.sendJSONresponse(res, 400, {
                                "message": "Ha ocurrido un error al actualizar la temporada."
                            });
                            console.log(err);
                        } else {
                            utils.sendJSONresponse(res, 200, {
                                "message": "La temporada " + season.name + " ha sido actualizada exitosamente."
                            });
                        }
                    });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la temporada."
        });
};

module.exports.deleteSeason = function (req, res) {
    if (req.params.sid) {
        Season.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'forms',
                        'localField': '_id',
                        'foreignField': 'season',
                        'as': 'forms'
                    }
                }, {
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.params.sid)
                }
            }
            ]
        ).exec(
            function (err, season) {
                if (err) {
                    utils.sendJSONresponse(res, 400, {
                        "message": "Ha ocurrido un error al eliminar la temporada."
                    });
                    console.log(err);
                } else if (typeof season[0].forms !== 'undefined' && season[0].forms.length > 0) {
                    utils.sendJSONresponse(res, 400, {
                        "message": "La temporada a eliminar posee salidas."
                    });
                    console.log("La temporada a eliminar posee salidas");
                } else {
                    Season.findByIdAndRemove(req.params.sid)
                        .exec(
                            function (err, season) {
                                if (err) {
                                    utils.sendJSONresponse(res, 400, {
                                        "message": "Ha ocurrido un error al eliminar la temporada."
                                    });
                                    console.log(err);
                                    return;
                                }
                                utils.sendJSONresponse(res, 200, {
                                    "message": "La temporada " + season.name + " fue eliminada exitosamente."
                                });
                            }
                        )
                }

            }
        )
    } else {
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la temporada."
        });
    }
};

module.exports.activeSeason = function (req, res) {
    if (req.params.sid) {
        Season.findById(req.params.sid)
            .exec(
                function (err, season) {
                    if (!season) {
                        utils.sendJSONresponse(res, 404, {
                            "message": "Temporada no encontrada."
                        });
                        return;
                    } else if (err) {
                        utils.sendJSONresponse(res, 400, {
                            "message": "Ha ocurrido un error al activar la temporada."
                        });
                        console.log(err);
                        return;
                    }

                    Season.updateMany(
                        {},
                        {
                            $set: {
                                actual: false
                            }
                        },
                        function (err) {
                            if (err) {
                                utils.sendJSONresponse(res, 400, {
                                    "message": "Ha ocurrido un error al desactivar las temporadas restantes."
                                });
                                console.log(err);
                            } else {
                                console.log("Todas las temporadas restantes desactivadas.");
                                season.actual = true;
                                season.save(function (err) {
                                    if (err) {
                                        utils.sendJSONresponse(res, 400, {
                                            "message": "Ha ocurrido un error al activar la temporada."
                                        });
                                        console.log(err);
                                    } else {
                                        utils.sendJSONresponse(res, 200, {
                                            "message": "La temporada " + season.name + " ha sido activada exitosamente."
                                        });
                                    }
                                });
                            }
                        });
                }
            );
    } else
        utils.sendJSONresponse(res, 404, {
            "message": "No se encontró la temporada."
        });
};

module.exports.getActiveSeason = function (req, res) {
    Season.findOne({
        actual: true
    }).exec(
        function (err, season) {
            if (err) {
                utils.sendJSONresponse(res, 400, {
                    "message": "No hay temporada activa."
                });
                console.log(err);
            } else
                utils.sendJSONresponse(res, 200, {
                    data: season
                });
        });
};

module.exports.seasonList = function (req, res) {
    Season.find({}, function (err, seasons) {
        if (err) {
            console.log(err);
            utils.sendJSONresponse(res, 400, err);
        } else {
            utils.sendJSONresponse(res, 201, {
                data: seasons
            });
        }
    })
}
