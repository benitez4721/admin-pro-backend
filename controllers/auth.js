const { response } = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuarios')
const { generarJWT } = require('../helpers/jwt')
const {googleVerify } = require('../helpers/google-verify')


const login = async( req, res = response) => {
    
    const { email,password} = req.body
    
    try {
        
        // Verificar contrasena 

        const usuarioDB = await Usuario.findOne({email})

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: '(email) o contrasena no valido'
            })
        }

        // Verificar contrasena 

        const validPassword = bcrypt.compareSync( password, usuarioDB.password);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contrasena no valida'
            });
        }

        // Generar el token
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        })
        


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    }
}

const googleSignIn = async(req, res = response) => {

    const  googleToken = req.body.token

    try {
        const {name, email, picture} = await googleVerify( googleToken)

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if( !usuarioDB){
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@',
                img: picture,
                google: true
            })
        } else{
            //Si ya existe un usuario
            usuario = usuarioDB;
            usuario.google = true;

        }

        //Guardar en bd
        await usuario.save();
        console.log(usuario.id);

        //Generar el token - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Error inesperado google sign in"
        })
    }
}


module.exports = {
    login,
    googleSignIn
}