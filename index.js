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

    // validamos datos correctos de postgresql
    if (!process.env.POSTGRES_HOST) {
        throw Error(
            "process.env.POSTGRES_HOST debe ser: user:pass@ipService:port ",
        );
    }

    // Configuramos sequelize para que se conecte a postgresql
    const sequelize = new Sequelize(
        `postgres://${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB || "personas"}`,
        {
            ssl: process.env.POSTGRES_SSL,
            dialectOptions: {
                ssl: process.env.POSTGRES_SSL,
            },
        }
    );

    // validamos la conexion de sequelize con postgresql
    await sequelize.authenticate();
    console.log("base de datos postgres iniciada con exito");

    // definimos el modelo que tendra los datos de una persona
    const persona = sequelize.define("persona", {
        fullname: Sequelize.STRING,
        birth: Sequelize.DATE,
    });
    await persona.sync({ force: true });

    // iniciamos el servicio de documentacion para el usuario de la API
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: "API Rest nodejs y postgresql prueba DIGITAL BdB",
                    version: "1.0",
                },
            }
        },
    ]);

    // creamos las rutas de acceso a la API
    server.route([

        // metodo de consultar todos los registros
        {
            method: "GET",
            path: "/personas",
            handler: () => {
                return persona.findAll();
            },

            // informacion guardada en la documentacion para el ususario
            config: {
                description: "Lista de personas",
                notes: "personas registradas en la base de datos",
                tags: ["api"],
            },
        },

        // metodo de consultar registros por Id
        {
            method: "GET",
            path: "/personas/{id}",
            handler: (req) => {
                return persona.findAll({ where: { id: req.params.id } });
            },

            // informacion guardada en la documentacion para el ususario
            config: {
                description: "Consultar persona por Id",
                notes: "persona de la base de datos",
                tags: ["api"],
            },
        },

        // metodo para crear registros
        {
            method: "POST",
            path: "/personas",
            config: {
                handler: (req) => {
                    const { payload } = req;
                    return persona.create(payload);
                },

                // informacion guardada en la documentacion para el ususario
                description: "Registrar una persona",
                notes: "crear una persona en la base de datos",
                tags: ["api"],

                // validamos que no lleguen campos vacios
                validate: {
                    failAction,
                    payload: {
                        fullname: Joi.string().required(),
                        birth: Joi.string().required(),
                    },
                },
            },
        },

        // metodo para actualizar registros
        {
            method: "PUT",
            path: "/personas/{id}",
            config: {
                handler: (req) => {
                    const { payload } = req;
                    return persona.update(payload, { where: { id: req.params.id } });
                },

                // informacion guardada en la documentacion para el ususario
                description: "Actualizar a persona",
                notes: "actualizar una persona en la base de datos",
                tags: ["api"],

                // validamos que no lleguen campos vacios
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required(),
                    },
                    payload: {
                        fullname: Joi.string(),
                        birth: Joi.string(),
                    },
                },
            },
        },

        // metodo para eliminar registros
        {
            method: "DELETE",
            path: "/personas/{id}",
            config: {
                handler: (req) => {
                    return persona.destroy({ where: { id: req.params.id } });
                },

                // informacion guardada en la documentacion para el ususario
                description: "Borrar una persona",
                notes: "elimina el registro de una persona en la base de datos",
                tags: ["api"],

                // validamos que no lleguen campos vacios
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required(),
                    },
                },
            },
        }
    ]);

    // si todo sale bien muestra mensaje por consola
    await server.start();
    console.log("servidor corriendo en el puerto: ", server.info.port);
})();