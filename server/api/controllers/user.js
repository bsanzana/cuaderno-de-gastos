const mongoose = require("mongoose");
const User = mongoose.model("User");
const utils = require("./utils");
const Rut = require("rutjs");
const JsonApiQueryParserClass = require("jsonapi-query-parser");
const JsonApiQueryParser = new JsonApiQueryParserClass();
const fs = require("fs");

module.exports.getAllUsers = function (req, res) {
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

  console.log("query user: ", query);
  User.find(
    query,
    null,
    {
      sort: sort,
      skip: pageNumber * pageSize,
      limit: pageSize * 1,
      collation: collation,
    },
    function (err, users) {
      if (err) {
        utils.sendJSONresponse(res, 400, {
          message:
            "Ha ocurrido un error al obtener la información de los usuarios.",
        });
        console.log(err);
      } else
        User.countDocuments(query, (err, count) => {
          utils.sendJSONresponse(res, 200, {
            meta: {
              "total-pages": count / pageSize,
              "total-items": count,
            },
            links: {
              self: hostname + "/api/v1/users",
            },
            data: users,
          });
        });
    }
  ).populate({ path: "specialists", select: "-_id name lastname" });
};

module.exports.getUser = function (req, res) {
  User.findById(req.params.uid, (err, user) => {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información del producto químico.",
      });
      console.log(err);
    } else {
      utils.sendJSONresponse(res, 201, {
        data: user,
      });
    }
  });
};

module.exports.createUser = function (req, res) {
  let user = new User();
  console.log(data)
  // user.rut = new Rut(req.body.user.rut).getNiceRut(false);+
  user.rut = data.rut;
  user.name = data.name;
  user.email = data.email;
  user.phone = data.phone;
  user.role = data.role;
  if (user.role === "adviser") {
    user.company = null;
  }
  // if (typeof req.body.user.company !== 'undefined' && user.role === 'producer') {
  //     user.company = req.body.user.company;
  // }
  user.address = {
    address: data.address.address,
    region: data.address.region,
    province: data.address.province,
    commune: data.address.commune,
  };
  user.active = data.active;
  user.show = data.show || true;
  const avatar = req.files.filter((file) => file.fieldname === "avatar");
  if (avatar.length > 0) {
    let ext = avatar[0].originalname.split(".");
    let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
    let rutaArchivo = `./uploads/avatar/${nameFile}`;
    utils.guardarArchivos(rutaArchivo, avatar[0].path);
    user.avatar = nameFile;
  }
  const logo = req.files.filter((file) => file.fieldname === "logo");
  if (logo.length > 0) {
    let ext = logo[0].originalname.split(".");
    let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
    let rutaArchivo = `./uploads/logo/${nameFile}`;
    utils.guardarArchivos(rutaArchivo, logo[0].path);
    user.logo = nameFile;
  }

  const firma = req.files.filter((file) => file.fieldname === "firma");
  if (firma.length > 0) {
    let ext = firma[0].originalname.split(".");
    let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
    let rutaArchivo = `./uploads/firma/${nameFile}`;
    utils.guardarArchivos(rutaArchivo, firma[0].path);
    user.firma = nameFile;
  }
  user.specialists = data.specialists;

  user.setPassword(data.password);

  user.save(function (err) {
    if (err) {
      utils.sendJSONresponse(res, 400, {
        message: "Ha ocurrido un error al crear el usuario.",
      });
      console.log(err);
    } else {
      utils.sendJSONresponse(res, 200, {
        message:
          "El usuario <strong>" +
          user.name +
          "</strong> fue creado exitosamente.",
        data: user,
      });
    }
  });
};

module.exports.editUser = function (req, res) {
  // console.log(req.files);
  // console.log(data);
  // console.log(req.params.uid);
  data = JSON.parse(req.body.data);
  if (req.params.uid) {
    User.findById(req.params.uid).exec(function (err, user) {
      if (!user) {
        utils.sendJSONresponse(res, 404, {
          message: "Usuario no encontrado.",
        });
        return;
      } else if (err) {
        utils.sendJSONresponse(res, 400, {
          message: "Ha ocurrido un error al actualizar el usuario.",
        });
        console.log(err);
        return;
      }
      user.rut = new Rut(data.rut).getNiceRut(false);
      user.name = data.name;
      user.lastname = data.lastname;
      user.email = data.email;
      user.phone = data.phone;
      user.role = data.role;
      user.active = data.active;
      user.show = data.show;
      if (user.role === "adviser" || user.role === "admin") {
        user.company = null;
      }
      if (typeof data.company !== "undefined" && user.role === "producer") {
        user.company = data.company;
      }
      user.address = {
        address: data.address.address,
        region: data.address.region,
        province: data.address.province,
        commune: data.address.commune,
      };

      const avatar = req.files.filter((file) => file.fieldname === "avatar");
      if (avatar.length > 0) {
        let ext = avatar[0].originalname.split(".");
        let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
        let rutaArchivo = `./uploads/avatar/${nameFile}`;
        utils.guardarArchivos(rutaArchivo, avatar[0].path);
        user.avatar = nameFile;
      }

      const logo = req.files.filter((file) => file.fieldname === "logo");
      if (logo.length > 0) {
        let ext = logo[0].originalname.split(".");
        let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
        let rutaArchivo = `./uploads/logo/${nameFile}`;
        utils.guardarArchivos(rutaArchivo, logo[0].path);
        user.logo = nameFile;
      }

      const firma = req.files.filter((file) => file.fieldname === "firma");
      if (firma.length > 0) {
        let ext = firma[0].originalname.split(".");
        let nameFile = `${req.params.uid}.${ext[ext.length - 1]}`;
        let rutaArchivo = `./uploads/firma/${nameFile}`;
        utils.guardarArchivos(rutaArchivo, firma[0].path);
        user.firma = nameFile;
      }

      user.specialists = data.specialists;

      user.save(function (err) {
        if (err) {
          utils.sendJSONresponse(res, 400, {
            message: "Ha ocurrido un error al actualizar el usuario.",
          });
          console.log(err);
        } else {
          utils.sendJSONresponse(res, 200, {
            message:
              "El usuario " + user.name + " ha sido actualizado exitosamente.",
          });
        }
      });
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "Usuario no encontrado.",
    });
  }
};

module.exports.editUserPassword = (req, res) => {
  if (!req.params.uid) {
    utils.sendJSONresponse(res, 404, {
      message: "Usuario no encontrado. Se requiere un ID para buscarlo.",
    });
    return;
  } else if (!req.body.password || req.body.password == "") {
    utils.sendJSONresponse(res, 400, {
      message: "La contraseña no puede ir en blanco.",
    });
    return;
  }
  User.findById(req.params.uid).exec(function (err, user) {
    if (!user) {
      utils.sendJSONresponse(res, 404, {
        message: "ID de usuario no encontrado.",
      });
      return;
    } else if (err) {
      utils.sendJSONresponse(res, 400, err);
      return;
    }
    user.setPassword(req.body.password);
    user.force_password_update = true;
    user.save(function (err) {
      if (err) {
        console.log("Error: " + err);
        utils.sendJSONresponse(res, 404, {
          message: "Ha ocurrido un error en la actualización de contraseña.",
        });
        return;
      } else {
        utils.sendJSONresponse(res, 200, {
          message: "La ha actualizado la contraseña.",
        });
        return;
      }
    });
  });
};

module.exports.deleteUser = function (req, res) {
  console.log(req.params);
  if (req.params.uid) {
    User.findByIdAndRemove(req.params.uid).exec(function (err, user) {
      if (err) {
        utils.sendJSONresponse(res, 404, err);
        return;
      }
      if (user.image) {
        const old = "./uploads/avatar/" + user.image;
        if (fs.existsSync(old)) {
          fs.unlinkSync(old);
        }
      }
      utils.sendJSONresponse(res, 204, null);
      return;
    });
  } else {
    utils.sendJSONresponse(res, 404, {
      message: "No se encontro el usuario.",
    });
    return;
  }
};
