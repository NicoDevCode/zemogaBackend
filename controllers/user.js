'use strict';
let configDB = require('../conectDB/dynamoDB')
const USERS_TABLE = process.env.USERS_TABLE;
let dynamoDB = configDB.DB();
const QueriesPrueba = require('../queries/query-prueba');

var jwt = require('../services/jwt')

const pruebas = async (req, res) => {
    const newQuery = await QueriesPrueba.select_test;
    console.log('test', newQuery)
    res.send('Hola mundo con expressjs');
}

const saveUser = async (req, res) => {
    let {userId, name, email, password, votos} = req.body;
    if (req.body.password && req.body.name && req.body.email) {
        const paramsUser = {
            TableName: USERS_TABLE,
            Item: {
              userId, name, email, password, votos
            },
            Key: {
                email: email, 
            }
        };

         dynamoDB.get(paramsUser, (error, result) => {
             console.log('error', error)
             if(error){
                res.status(500).json({
                    succes: 'Internal error'
                })
             } else {
                 if(result.Item){
                     res.status(200).json({
                         succes: 'usuario existe'
                     })
                 } else {
                    dynamoDB.put(paramsUser, (error) => {
                        if(error) {
                            console.log(error);
                            res.status(400).json({
                              error: 'No se ha podido crear el usuario'
                            })
                          } else {
                            res.status(200).json({
                              succes: 'usuario creado'
                            })
                          }
                    });
                 }
             }
         });
    } else {
        res.status(200).json({
            error: 'introduce los datos correctos'
        })
    }
}

const loginUser = async (req, res) => {
    let {email, password, gettoken} = req.body;
    console.log('token', gettoken )
    const paramsUser = {
        TableName: USERS_TABLE,
        Key: {
            email: email, 
        }
    };
    dynamoDB.get(paramsUser, (error, result) => {
        if(error){
           res.status(500).json({
               succes: 'Internal error'
           })
        } else {
            if(result.Item){
                const {Item} = result;
                if(Item.password == password){
                    if(gettoken){
                        console.log('entra', gettoken )
                        res.status(200).json({
                            token: jwt.createToken(Item)
                        })
                    } else {
                        res.status(200).json({
                            succes: 'usuario existe',
                            user: Item
                        })
                    }
                    
                }else {
                    res.status(404).json({
                        succes: 'el usuario no ha podido loguearse'
                    })
                }
            } else {
                res.status(404).json({
                    succes: 'el usuario no existe'
                })
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
}