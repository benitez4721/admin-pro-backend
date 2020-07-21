
const { response, request } = require('express')
const Usuario = require('../models/usuarios');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getBusqueda = async (req = request,res = response) => {
    
    const busqueda = req.params.busqueda
    const regex = new RegExp( busqueda, 'i');

    
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex},).limit(3),
        Medico.find({nombre: regex},),
        Hospital.find({nombre: regex},)
    ])


    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async (req = request,res = response) => {
    
    const tabla = req.params.tabla
    const busqueda = req.params.busqueda
    const regex = new RegExp( busqueda, 'i');
    let data = []

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({nombre: regex},)            
                                       .populate('usuario','nombre img')
                                       .populate('hospital','nombre img')
            break;
    
        case 'hospitales':
            data = await Hospital.find({nombre: regex},)
                                     .populate('usuario', 'nombre img')
            break;
    
        case 'usuarios':
            data = await Usuario.find({nombre: regex},)
            break;
    
        default:

            res.status(400).json({
                ok: false,
                msg: "Argumento invalido"
        })

    }

    res.json({
        ok: true,
        data
    })
}

module.exports = {
    getBusqueda,
    getDocumentosColeccion
}