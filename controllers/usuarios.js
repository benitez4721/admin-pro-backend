const {response} = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT} = require('../helpers/jwt')

const { validationResult} = require('express-validator')

const Usuario = require('../models/usuarios')


const getUsuarios = async (req,res = response) => {
    
    const usuarios = await Usuario.find({}, 'nombre role email google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })

}

const crearUsuario = async(req,res = response) => {
    const { email, password, nombre} = req.body
    

    try {
        
        const existeEmail = await Usuario.findOne({ email})
        
        if( existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario( req.body )

        // Encriptar contrasena
        const salt =  bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar Usuario
        await usuario.save();
        
        //crear token
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        })
    }


}

const actualizarUsuario = async(req, res = response) => {
    // Validar token



    const uid = req.params.id

    try {

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }
        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        
        if( usuarioDB.email !== email ) {
            
            const existeEmail = await Usuario.findOne({ email: req.body.email})
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con ese email"
                })
            }
        }

        campos.email = email;

        const userActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true});

        res.json({
            ok: true,
            usario: userActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado"
        })
    }
}

const borrarUsuario = async(req, res = response) =>{
    
    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Error inesperado"
        })
    }
}



module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}