// Validación del esquema de objeto
const Joi = require('joi')

// ORM de dialectos múltiples para Node.JS postgresql
const Sequelize = require('sequelize')

// framework HTTP Server
const Hapi = require('hapi');

// Complemento de controladores de directorios y archivos estáticos para hapi.js
const Inert = require("inert");

// Soporte de plugin de renderizado de plantillas para hapi.js
const Vision = require("vision");

// Un plugin generador de interfaz de usuario de documentación swagger para hapi
const HapiSwagger = require("hapi-swagger");

// puerto de funcionamiento aplicacion node.js e inicializacion de hapi.js
const port = process.env.PORT || 3000;
const server = new Hapi.Server(
  {
    port
  }
);

// declaramos la funcion tipo flecha principal de la aplicacion API
(async () => {

})();