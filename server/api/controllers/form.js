const mongoose = require("mongoose");
const Form = mongoose.model("Form");
const utils = require("./utils");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

module.exports.getAllForms = function (req, res) {
  console.log("GET ALL FORMS ");
  let hostname = req.headers.host;
  let requestData = JsonApiQueryParser.parseRequest(req.url);
  let pageNumber = requestData.queryData.page.number || 0;
  let pageSize = requestData.queryData.page.size || 10;
  let fields = requestData.queryData.fields;
  let sort = requestData.queryData.sort;
  let collation = { locale: "es" };
  let query = {};
  let user = req.user;
  let company_group = "";
  let advisorId = "";
  let advisorRut = "";
  Object.keys(fields).forEach(function (key) {
    if (fields[key] !== null) {
      if (key === "company_group") {
        company_group = fields["company_group"][0];
      }
      if (key == "advisor") {
        advisorId = fields["advisor"][0];
      }

      if (key == "rut") {
        advisorRut = fields["rut"][0];
      } else {
        query[key] = fields[key];
      }
    }
  });

  //if (query['company_group']) company_group = query['company_group'][0];

  // Traemos sólo los cuadernos de campo asociados a la empresa del usuario.
  if (user.company !== null) {
    query["company"] = user.company;
  }

  Form.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, forms) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los cuadernos de campo.",
        });
      } else {
        // Filtra los formularios si se proporciona el advisorId
        let filteredForms = forms;
        console.log(advisorId);
        if (advisorId != "") {
          filteredForms = forms.filter((form) => {
            return form.informacion_del_campo.company.group.advisors.includes(
              advisorId
            );
          });
        }
        if (advisorRut != "") {
          filteredForms = forms.filter((form) => {
            return form.informacion_del_campo.company.rut == advisorRut;
          });
        }

        Form.countDocuments(filteredForms, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/forms",
            },
            data: filteredForms,
          });
        });
      }
    }
  ).populate([
    {
      path: "informacion_del_campo.company",
      populate: {
        path: "group",
      },
    },
    "informacion_del_campo.season",
    "informacion_del_campo.crop.variety",
    "informacion_del_campo.crop.seed_type",
    "informacion_del_campo.crop.type_crop",
    "maquinarias.labor",
    "maquinarias.machinery",
    "insumos.category",
    "mano_de_obra.mo",
    "mano_de_obra.labor",
    "otros_costos.labor",
    "otros_costos.otro_costo",
  ]);
};

module.exports.getForm = function (req, res) {
  console.log("GET FORM");

  Form.findById(req.params.pid, (err, form) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información del cuaderno de campo.",
      });
      console.log(err);
    } else
      utils.sendJSONresponse(res, 201, {
        data: form,
      });
  }).populate([
    "company",
    "season",
    "crop.variety",
    "crop.seed_type",
    "crop.type_crop",
    "maquinarias.labor",
    "maquinarias.machinery",
    "insumos.category",
    "mano_de_obra.mo",
    "mano_de_obra.labor",
    "otros_costos.labor",
    "otros_costos.otro_costo",
  ]);
};

module.exports.viewForm = function (req, res) {
  console.log("VIEW FORM");

  Form.findById(req.params.pid, (err, form) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información del cuaderno de campo.",
      });
      console.log(err);
    } else
      utils.sendJSONresponse(res, 201, {
        data: form,
      });
  }).populate([
    "company",
    "season",
    { path: "soil_preparation.work", select: "name" },
    { path: "planting.seeds.variety", select: "name" },
    { path: "planting.seeds.type", select: "name" },
    { path: "planting.planting_method", select: "name" },
    { path: "fertilization.application_method", select: "name" },
    { path: "weed_control.application_method", select: "name" },
    "fertilization.products",
    "pest_control.products",
    "pest_control.application_method",
    "weed_control.products",
  ]);
};

module.exports.createForm = function (req, res) {
  // Se reciben los datos y se parsean
  data = JSON.parse(req.body.datos);
  // Se crea el Formulario
  let form = new Form(data);

  // Se reciben los archivos
  // Si viene el archivo se crea la ruta y se guarda en el servidor como en el documento
  // fs.renameSync para renombrar y mover archivo
  // fs.unlink eliminar el tmp
  const analisisSuelo = req.files.filter(
    (file) => file.fieldname === "analisis_suelo"
  );
  if (analisisSuelo.length > 0) {
    let ext = analisisSuelo[0].originalname.split(".");
    let nameFile = `${form._id}.${ext[ext.length - 1]}`;
    const rutaArchivoAnalisisSuelo = `./uploads/analisis_suelo/${nameFile}`;
    utils.guardarArchivos(rutaArchivoAnalisisSuelo, analisisSuelo[0].path);
    form.pathAnalisisSuelo = rutaArchivoAnalisisSuelo;
  }
  const guiaAnalisis = req.files.filter(
    (file) => file.fieldname === "guia_analisis"
  );
  if (guiaAnalisis.length > 0) {
    let ext = guiaAnalisis[0].originalname.split(".");
    let nameFile = `${form._id}.${ext[ext.length - 1]}`;
    const rutaGuiaAnalisis = `./uploads/guia_analisis/${nameFile}`;
    utils.guardarArchivos(rutaGuiaAnalisis, guiaAnalisis[0].path);
    form.pathGuiaAnalisis = rutaGuiaAnalisis;
  }

  const adopcion1 = req.files.filter(
    (file) => file.fieldname === "adopcion1"
  );
  if (adopcion1.length > 0) {
    let ext = adopcion1[0].originalname.split(".");
    let nameFile = `${form._id}.${ext[ext.length - 1]}`;
    let rutaAdopcion1 = `./uploads/adopcion1/${nameFile}`;
    utils.guardarArchivos(rutaAdopcion1, adopcion1[0].path);
    form.pathAdopcion1 = rutaAdopcion1;
  }

  const adopcion2 = req.files.filter(
    (file) => file.fieldname === "adopcion2"
  );
  if (adopcion2.length > 0) {
    let ext = adopcion2[0].originalname.split(".");
    let nameFile = `${form._id}.${ext[ext.length - 1]}`;
    let rutaAdopcion2 = `./uploads/adopcion2/${nameFile}`;
    utils.guardarArchivos(rutaAdopcion2, adopcion2[0].path);
    form.pathAdopcion2 = rutaAdopcion2;
  }

  // Se guarda la colección
  form.save(function (err) {
    if (err) {
      utils.sendJSONresponse(res, 404, {
        message: "Ha ocurrido un error al crear el cuaderno de campo.",
      });
      console.log(err);
    } else {
      utils.sendJSONresponse(res, 200, {
        message: "El cuaderno de campo fue creado exitosamente.",
      });
    }
  });
};

module.exports.editForm = function (req, res) {
  // Se reciben los datos y se parsean
  data = JSON.parse(req.body.datos);
  //console.log(data);
  //console.log(req.files);
  if (data._id) {
    Form.findById(data._id).exec(function (err, form) {
      if (!form) {
        utils.sendJSONresponse(res, 404, {
          message: "Cuaderno de campo no encontrado.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al actualizar el cuaderno de campo.",
        });
        console.log(err);
        return;
      }

      const analisisSuelo = req.files.filter(
        (file) => file.fieldname === "analisis_suelo"
      );
      if (analisisSuelo.length > 0) {
        fs.unlink(form.pathAnalisisSuelo, () => {})
        let ext = analisisSuelo[0].originalname.split(".");
        let nameFile = `${data._id}.${ext[ext.length - 1]}`;
        const rutaArchivoAnalisisSuelo = `./uploads/analisis_suelo/${nameFile}`;
        utils.guardarArchivos(rutaArchivoAnalisisSuelo, analisisSuelo[0].path);
        form.pathAnalisisSuelo = rutaArchivoAnalisisSuelo;
      }
      const guiaAnalisis = req.files.filter(
        (file) => file.fieldname === "guia_analisis"
      );
      if (guiaAnalisis.length > 0) {
        fs.unlink(form.pathGuiaAnalisis, () => {})
        let ext = guiaAnalisis[0].originalname.split(".");
        let nameFile = `${data._id}.${ext[ext.length - 1]}`;
        const rutaGuiaAnalisis = `./uploads/guia_analisis/${nameFile}`;
        utils.guardarArchivos(rutaGuiaAnalisis, guiaAnalisis[0].path);
        form.pathGuiaAnalisis = rutaGuiaAnalisis;
      }

      const adopcion1 = req.files.filter(
        (file) => file.fieldname === "adopcion1"
      );
      if (adopcion1.length > 0) {
        fs.unlink(form.pathAdopcion1, () => {})
        let ext = adopcion1[0].originalname.split(".");
        let nameFile = `${form._id}.${ext[ext.length - 1]}`;
        let rutaAdopcion1 = `./uploads/adopcion1/${nameFile}`;
        utils.guardarArchivos(rutaAdopcion1, adopcion1[0].path);
        form.pathAdopcion1 = rutaAdopcion1;
      }
    
      const adopcion2 = req.files.filter(
        (file) => file.fieldname === "adopcion2"
      );
      if (adopcion2.length > 0) {
        fs.unlink(form.pathAdopcion2, () => {})
        let ext = adopcion2[0].originalname.split(".");
        let nameFile = `${form._id}.${ext[ext.length - 1]}`;
        let rutaAdopcion2 = `./uploads/adopcion2/${nameFile}`;
        utils.guardarArchivos(rutaAdopcion2, adopcion2[0].path);
        form.pathAdopcion2 = rutaAdopcion2;
      }
      Object.assign(form, data);

      form.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 404, {
            message: "Ha ocurrido un error al actualizar el cuaderno de campo.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message: "El cuaderno de campo ha sido actualizado exitosamente.",
          });
        }
      });
    });
  } else
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el cuaderno de campo.",
    });
};

module.exports.deleteForm = function (req, res) {
  /** TODO: VER QUE PASA CUANDO TEMPORADA ESTÁ SIENDO UTILIZADA */
  if (req.params.pid) {
    Form.findByIdAndRemove(req.params.pid).exec(function (err, form) {
      if (err) {
        utils.sendJSONresponse(res, 404, {
          message: "Ha ocurrido un error al eliminar el cuaderno de campo.",
        });
        console.log(err);
        return;
      }
      utils.sendJSONresponse(res, 200, {
        message: "El cuaderno de campo fue eliminado exitosamente.",
      });
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el cuaderno de campo.",
    });
  }
};

module.exports.existForm = function (req, res) {
  console.log("EXIST FORM");

  if (req.params.cid) {
    let query = {};
    // Traemos sólo los cuadernos de campo asociados a la empresa y al campo.
    query["informacion_del_campo.company"] = req.params.cid;
    query["informacion_del_campo.season"] = req.params.sid;
    query["informacion_del_campo.company_field"] = req.params.fid;

    console.log("query: ", query);

    Form.findOne(query, function (err, form) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información del cuaderno de campo.",
        });
        console.log(err);
      } else {
        utils.sendJSONresponse(res, 201, {
          data: form,
        });
        console.log(form);
      }
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontró el cuaderno de campo para esta empresa.",
    });
  }
};

module.exports.getExportForms = function (req, res) {
  let collation = { locale: "es" };
  let query = req.query;

  Form.find(
    query,
    null,
    {
      collation: collation,
    },
    function (err, forms) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los cuadernos de campo.",
        });
        console.log(err);
      } else
        utils.sendJSONresponse(res, 200, {
          data: forms,
        });
    }
  ).populate([
    "season",
    "company",
    { path: "soil_preparation.work", select: "name -_id" },
    { path: "planting.seeds.variety", select: "name -_id" },
    { path: "planting.seeds.type", select: "name -_id" },
    { path: "fertilization.products", select: "name -_id" },
    { path: "fertilization.application_method", select: "name -_id" },
    { path: "weed_control.products", select: "name -_id" },
    { path: "weed_control.application_method", select: "name -_id" },
  ]);
};

module.exports.getFormList = function (req, res) {
  console.log(req);

  let collation = { locale: "es" };
  let query = {};

  if (req.body.company) {
    query["company"] = req.body.company;
  }

  console.log(query);

  Form.find(
    query,
    null,
    {
      collation: collation,
    },
    function (err, forms) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los cuadernos de campo.",
        });
        console.log(err);
      } else
        utils.sendJSONresponse(res, 200, {
          data: forms,
        });
    }
  )
    .populate([
      { path: "season", select: "name" },
      {
        path: "company",
        select: "-rut -machinery -active -createdAt -updatedAt -__v",
      },
    ])
    .select(["season", "company_field"]);
};

module.exports.getCompanyForms = function (req, res) {
  console.log("COMPANY FORMS");

  if (req.params.cid) {
    let query = {};
    let collation = { locale: "es" };
    query["company"] = req.params.cid;

    Form.find(
      query,
      null,
      {
        collation: collation,
      },
      function (err, forms) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message:
              "Ha ocurrido un error al obtener la información de los cuadernos de campo de la empresa.",
          });
          console.log(err);
        } else
          utils.sendJSONresponse(res, 200, {
            data: forms,
          });
      }
    ).populate([
      "season",
      "company",
      { path: "soil_preparation.work", select: "name -_id" },
      { path: "planting.seeds.variety", select: "name -_id" },
      { path: "planting.seeds.type", select: "name -_id" },
      { path: "fertilization.products", select: "name -_id" },
      { path: "fertilization.application_method", select: "name -_id" },
      { path: "weed_control.products", select: "name -_id" },
      { path: "weed_control.application_method", select: "name -_id" },
    ]);
  }
};

module.exports.downloadFiles = async function (req, res) {
  //console.log(req)
  try {
    const cuadernoId = req.query.id;
    const tipoArchivo = req.query.typeFile;
    const cuaderno = await Form.findById(cuadernoId).populate([
      "informacion_del_campo.company",
    ]);
    ///console.log(cuaderno)
    if (!cuaderno) {
      return res.status(404).send({ message: "Cuaderno no encontrado" });
    }
    const filePath = path.join(__dirname, "/../../", cuaderno[tipoArchivo]);
    res.download(filePath, (err) => {
      if (err) {
        res
          .status(500)
          .send({ message: "No se ha podido descargar el archivo." });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
};
module.exports.exportToPDF = function (req, res) {};
