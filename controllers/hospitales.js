
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

const actualizarHospitales = async(req, res) => {
    const uid = req.uid
    const id = req.params.id
    try {

        const hospital = await Hospital.findById(id)
    
        if(!hospital){
            res.status(500).json({
                ok: true,
                msg: "Error al actualizar el hospital"
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }
        
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambiosHospital, {new : true})
        res.json({
            ok: true,
            hospitalActualizado
        })
        
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: "Error al actualizar el hospital"
        })
    }
    res.json({
        ok: true,
        msg: 'actualizarHospitales'
    })
}

const borrarHospitales = async (req, res) => {

    const id = req.params.id
    try {

        const hospital = await Hospital.findById(id)
    
        if(!hospital){
            return res.status(400).json({
                ok: false,
                msg: "El hospital no existe"
            })
        }


        const hospitalBorrado = await Hospital.findByIdAndDelete(id)

        res.json({
            ok: true,
            msg: "Hospital borrado",
            hospitalBorrado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error al borrar hospital"
        })
    }
}



module.exports = {
    getHospitales,
    actualizarHospitales,
    borrarHospitales,
    crearHospitales
}