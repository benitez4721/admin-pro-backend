/*
    ruta: api/todo/:busqueda
*/
const { Router } = require('express')
const { getBusqueda, getDocumentosColeccion } = require('../controllers/busquedas')
const { validarJWT } = require('../middlewares/validar-jwt')


const router = Router()


router.get('/:busqueda', validarJWT ,getBusqueda)

router.get('/:tabla/:busqueda', validarJWT ,getDocumentosColeccion)







module.exports = router