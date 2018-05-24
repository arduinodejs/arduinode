let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('./config');
let moment = require('moment');
let bodyParser = require('body-parser');
let mysqlCloud = require('../db/dbCloud');

let verifyToken = require('./verifyToken');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended:true }));

    app.post('/registerNoExp', function(req, res){ // register arduino device

        if(req.body){

            let hashedBrown = bcrypt.hashSync(req.body.pass); // encrypt pass

            function registerDevice(){
                return new Promise(function(resolve, reject){
                    mysqlCloud.connectAuth.getConnection(function(err, connection){
                        if(err){ return res.send({ err: 'DB connection error from authcontroller.' }) }
                        
                        connection.query({
                            sql: 'INSERT INTO arduinode_login SET registration_date = ?, device_name = ?, device_pass = ?',
                            values: [new Date(), req.body.name, hashedBrown ]
                        },  function(err, results, fields){
                            if(err){ return res.send({ err: 'INSERT error from authcontroller.' }) }

                            let token = jwt.sign(
                                { id : results.insertID },
                                config.secret
                            );

                            res.status(200).send({auth: true, token: token});

                        });
                        connection.release();
                    });
                });
            }

            registerDevice();

        }

    });
    
}