
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuarios')


const validarJWT = (req, res, next) => {

    //Leer token
    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const {uid} = jwt.verify( token, process.env.JWT_SECRET);
        
        req.uid = uid
        
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

}

const validarAdmin_ROLE = async(req, res, next) => {

    const uid = req.uid
    const id = req.params.id
    try {
        const usuarioDB = await Usuario.findById(uid)
        if( !usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        if( usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            })
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "Hable con el amdin"
        })
    }

}


module.exports = {
    validarJWT,
    validarAdmin_ROLE
}