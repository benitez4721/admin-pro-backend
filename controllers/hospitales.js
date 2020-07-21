
const {response} = require('express')

const Hospital = require('../models/hospital')

const getHospitales = async (req, res) => {

    try {
        const hospitales = await Hospital.find().populate('usuario','nombre');
        
        res.json({
            ok: true,
            hospitales
        })
    
    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            ok: true,
            msg: "Ocurrio algo inesperado"
        })
    }
    res.json({
        ok: true,
        msg: 'geHospitales'
    })
}

const crearHospitales = async (req, res) => {

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body});
        
    try {


        const hospitalDB = await hospital.save()

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrio algo inesperado'
        })
    }
    res.json({
        ok: true,
        msg: 'crearHospitales'
    })
}

const actualizarHospitales = (req, res) => {
    res.json({
        ok: true,
        msg: 'actualizarHospitales'
    })
}

const borrarHospitales = (req, res) => {
    res.json({
        ok: true,
        msg: 'borrarHospitales'
    })
}


module.exports = {
    getHospitales,
    actualizarHospitales,
    borrarHospitales,
    crearHospitales
}