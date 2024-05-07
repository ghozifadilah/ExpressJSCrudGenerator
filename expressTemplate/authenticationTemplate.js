
function AuthenticationTemplate(authTable,table) {
            

            
    var querySelect = '`SELECT * FROM '+table+' WHERE Email = LOWER("${req.body.Email}");`';
    // `INSERT INTO useradmin (Email, Password, Name, akses) VALUES ('${req.body.Email}', '${password}', '${req.body.Name}','root')`

    var registrasiInsert = 'INSERT INTO useradmin ('
        registrasiInsert += '';

    for (let i = 0; i < authTable.length; i++) { 
        registrasiInsert += `${authTable[i]},`;
    }
    
    registrasiInsert += 'akses) VALUES (';

    for (let i = 0; i < authTable.length; i++) {
        registrasiInsert += `'${authTable[i]}',`;
    }

    registrasiInsert += `'root')`;

    let petik = '`';



    var updateQuery = "`UPDATE "+table+" SET token = '${token}' WHERE Id = '${result[0].Id}'`"

    var authCode = `
    module.exports = app => {
    const connection = require('../config/database');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    //--------------------------------------------------------------------------------------
    // controller Registrasi
    app.post('/registrasi', (req, res, next) => {
        connection.query( ${querySelect},
            (err, result) => {
                if (result.length) {
                    return res.status(409).send({
                        msg: 'Email Sudah Terdaftar!'
                    });
                } else {
                    // email is available
                    const salt = bcrypt.genSaltSync(10);
                    const password = bcrypt.hashSync(req.body.Password, salt);
                    connection.query(
                       ${petik} ${registrasiInsert}  ${petik},
                        (err, result) => {
                            if (err) {
                                return res.status(400).send({
                                    msg: err
                                });
                            }
                            return res.status(201).send({
                                msg: 'Pendaftaran Berhasil!'
                            });
                        }
                    );
                }
            }
        );
    });

        //--------------------------------------------------------------------------------------
        // controller Login
        app.post('/login', (req, res, next) => {
            connection.query(
                ${querySelect},
                (err, result) => {
                    // user tidak ditemukan
                    if (err) {
                        return res.status(400).send({
                            msg: err
                        });
                    }
                    if (!result.length) {
                        return res.status(401).send({
                            msg: 'Email Salah!'
                        });
                    }
                    // cek password
                    bcrypt.compare(
                        req.body.Password,
                        result[0]['Password'],
                        (bErr, bResult) => {
                            // password salah
                            if (bErr) {
                                return res.status(401).send({
                                    msg: 'Password Salah!'
                                });
                            }
                            if (bResult) {
                                const token = jwt.sign({ Id: result[0].Id }, 'pasti-secure', { expiresIn: '1h' });
                                connection.query( ${updateQuery} );
                                return res.status(200).send({
                                    msg: 'Anda Berhasil Login!',
                                    token,
                                    user: result[0]
                                });
                            }
                            return res.status(401).send({
                                msg: 'Email atau Password Salah!'
                            });
                        }
                    );
                }
            );
        });
        
    };
    `

    return authCode;

}
