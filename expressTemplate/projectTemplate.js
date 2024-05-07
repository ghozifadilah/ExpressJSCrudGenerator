function DatabaseTemplate(configStorage) { 

    var host = configStorage.database.host;
    var user = configStorage.database.user;
    var password = configStorage.database.password;
    var database = configStorage.database.database;

    if (password == '') {
        password = '""';
    }

    var databaseExport = `
        var mysql = require('mysql')

        var connection = mysql.createConnection({
            host: '${host}',
            user: '${user}',
            password: ${password},
            database: '${database}'
        })

        connection.connect(error => {
            if (error) throw error;
            console.log("Anda Berhasil terhubung pada Database...");
        });

        module.exports = connection;
    `;

    return databaseExport
}

function IndexTemplate(configStorage) {

    var route = '';

    // Get list of table 
    let keyDataStorage = localStorage.getItem("keyData");
    let authStorage = localStorage.getItem("configAuth");

    if (keyDataStorage != null) {
        keyDataStorage = JSON.parse(keyDataStorage);
        for (let i = 0; i < keyDataStorage.length; i++) {
            let data = JSON.parse(localStorage.getItem(keyDataStorage[i]));
             route += `
             //${data.table} route
             require("./controller/${data.table}")(app);
             `;

        }
    }

    if (authStorage != null) {
        authStorage = JSON.parse(authStorage);
        route += `require("./controller/Login")(app);`;
    }

    var indexExport = `
    const express = require('express');
        const db = require('./config/database');
        const cors = require("cors");

        //-------------------------------------------------------------------------
        // load body-parser
        const bodyParser = require("body-parser");
        const app = express();
        app.use('/assets', express.static('assets/'));
        app.use(cors());

        //-------------------------------------------------------------------------
        // parse permintaan express - application / json
        app.use(express.json());
        // parse permintaan jenis konten - application / json
        app.use(bodyParser.json());
        // parse permintaan jenis konten - application / x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        //-------------------------------------------------------------------------
        // port untuk server lokal
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log('Server berjalan pada port :');
        });

        //-------------------------------------------------------------------------
        // route index
        app.get("/", (req, res) => {
            res.json({ message: "Hello World" });
        });

        ${route}


        //-------------------------------------------------------------------------
        // Handling Errors
        app.use((err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.message = err.message || "Internal Server Error";
            res.status(err.statusCode).json({
                message: err.message,
            });
        });
        `
    return indexExport;
}

function packageJsonTemplate(configStorage) {

    var project = configStorage.project.name;
    // convert to lower case
    project = project.toLowerCase();

    let testString = 'echo  && exit 1'

    var packageJsonExport = `
    {
        "name": "${project}-backend",
        "version": "1.0.0",
        "description": "backend ${project}",
        "main": "index.js",
        "scripts": {
          "test": "${testString}"
        },
        "keywords": [
          "${project}-backend"
        ],
        "author": "${project}",
        "license": "ISC",
        "dependencies": {
          "bcrypt": "^5.1.1",
          "body-parser": "^1.20.2",
          "cors": "^2.8.5",
          "crypto-js": "^4.1.1",
          "express": "^4.18.2",
          "express-flash": "^0.0.2",
          "fs": "^0.0.1-security",
          "jsonwebtoken": "^9.0.2",
          "multer": "^1.4.5-lts.1",
          "mysql": "^2.18.1",
          "path": "^0.12.7"
        }
      }
      
    `

    return packageJsonExport;
    
}