'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_backend_zemoga'

exports.createToken = function(user){
    var payload = {
        sub: user.userId,
        votos: user.votos,
        name: user.name,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret)
}