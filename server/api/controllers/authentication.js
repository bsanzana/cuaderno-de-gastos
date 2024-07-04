const passport = require("passport");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const utils = require("./utils");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const Company = mongoose.model("Company");

module.exports.loginProducer = (req, res) => {
  if (!req.body.rut || !req.body.password) {
    return utils.sendJSONresponse(res, 400, {
      message: "Faltan campos requeridos.",
    });
  }

  Company.findOne({ rut: req.body.rut }, (err, producer) => {
    if (err) {
      return utils.sendJSONresponse(res, 400, {
        message:
          "Ha ocurrido un error al obtener la información del productor.",
      });
    }
    if (!producer) {
      return utils.sendJSONresponse(res, 400, {
        message: "No existe este rut de Productor",
      });
    }

    if (req.body.password == producer.password) {
      const token = jwt.sign(
        {
          _id: producer._id,
          rut: producer.rut,
          role: "producer",
        },
        process.env.JWT_SECRET
      );
      return utils.sendJSONresponse(res, 200, {
        token: token,
      });
    } else {
      return utils.sendJSONresponse(res, 400, {
        message: "Credenciales incorrectas",
      });
    }
  });
};

module.exports.login = (req, res) => {
  if (!req.body.rut || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      message: "Faltan campos requeridos.",
    });
    return;
  }

  /// console.log('llega: ', req.body)

  passport.authenticate("local", function (err, user, info) {
    let token;

    if (err) {
      utils.sendJSONresponse(res, 404, err);
      return;
    }

    if (user && user.active) {
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        token: token,
      });
    } else if (user && !user.active) {
      utils.sendJSONresponse(res, 401, { message: "Usuario Desactivado." });
      return;
    } else {
      utils.sendJSONresponse(res, 401, { message: info.message });
      return;
    }
  })(req, res);
};

exports.roleAuthorization = function (roles) {
  return function (req, res, next) {
    let user = req.user;

    User.findById(user._id, function (err, foundUser) {
      if (err) {
        utils.sendJSONresponse(res, 404, {
          message: "Usuario no encontrado.",
        });
        return next(err);
      }

      if (roles.indexOf(foundUser.role) > -1) {
        return next();
      }
      utils.sendJSONresponse(res, 401, {
        message: "No tienes autorización para ver este contenido.",
      });
      return next("Unauthorized");
    });
  };
};

exports.isUserActive = function () {
  return function (req, res, next) {
    let user = req.user;
    User.findById(user._id, function (err, foundUser) {
      if (err) {
        utils.sendJSONresponse(res, 404, {
          message: "Usuario no encontrado.",
        });
        return next(err);
      }

      if (foundUser.active) {
        return next();
      }

      utils.sendJSONresponse(res, 401, {
        message: "Usuario desactivado.",
      });
      return next("Unauthorized");
    });
  };
};

exports.isPasswordChanged = function () {
  return function (req, res, next) {
    let user = req.user;
    User.findById(user._id, function (err, foundUser) {
      if (err) {
        utils.sendJSONresponse(res, 404, {
          message: "Usuario no encontrado.",
        });
        return next(err);
      }

      if (!foundUser.force_password_update) {
        return next();
      }

      utils.sendJSONresponse(res, 401, {
        message: "Cambio de clave.",
      });
      return next("Unauthorized");
    });
  };
};

exports.checkUser = function (roles) {
  return function (req, res, next) {

    if (roles.some((rol) => rol === req.user.role)) {
      return next();
    } else {
      utils.sendJSONresponse(res, 401, {
        message: "No tienes autorización para ver este contenido.",
      });
    }
  };
};

exports.logLogOut = (req, res) => {
  utils.sendJSONresponse(res, 200, {
    "log LogOut": true,
  });
  return;
};
