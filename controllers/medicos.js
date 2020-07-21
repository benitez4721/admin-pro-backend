const { response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async (req, res) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre')
                                .populate('hospital','nombre')


    res.json({
        ok: true,
        medicos    
    })
}

const crearMedicos = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        
        const medicoDB = await medico.save()

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Sucedio algo inesperado"
        })
    }


    res.json({
        ok: true,
        msg: 'crearMedicos'
    })
}

const actualizarMedicos = (req, res) => {
    
    res.json({
        msg: 'actualizarMedicos'
    })
}

const borrarMedicos = (req, res) => {
    res.json({
        ok: true,
        msg: 'borrarMedicos'
    })
}


module.exports = {
    getMedicos,
    actualizarMedicos,
    borrarMedicos,
    crearMedicos
}