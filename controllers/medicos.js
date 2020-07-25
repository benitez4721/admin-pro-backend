const { response } = require('express')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

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

        return res.status(500).json({
            ok: false,
            msg: "Sucedio algo inesperado"
        })
    }

}

const actualizarMedicos = async(req, res) => {
    
    const uid = req.uid
    const id = req.params.id
    const hospId = req.body.hospital

    try {
        
        

        const [medico, hospital] = await Promise.all([
            Medico.findById(id),
            Hospital.findById(hospId)
        ])

        if( !medico ){
            return res.status(400).json({
                ok: false,
                msg: "Error al actualizar medico, medico con ese id no existe"
            })
        }


        if( !hospital ){
            return res.status(400).json({
                ok: false,
                msg: "Error al actualizar medico, campo hospital no existe"
            })
        }
        
        
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
        
        const medicoActualizado = await Medico.findByIdAndUpdate(id,cambiosMedico, {new : true})


        res.json({
            ok: true,
            medicoActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error al actualizar medico" 

        })
    }
}

const borrarMedicos = async(req, res) => {

    const id = req.params.id
    try {
        
        const medico = await Medico.findByIdAndDelete(id)

        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: "Medico con ese id no existe"
            })
        }

        res.json({
            ok: true,
            msg: "Medico eliminado correctamente",
            medico
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error al intentar eliminar un medico"
        })
    }
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