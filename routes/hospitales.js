
/*  
    Ruta
    api/hospitales
*/

const {Router} = require('express');
const{ check } = require('express-validator')
const{ validarCampos } = require('../middlewares/validar-campos')
const {validarJWT} = require('../middlewares/validar-jwt')

const {getHospitales,actualizarHospitales,borrarHospitales,crearHospitales} = require('../controllers/hospitales')

const router = Router();


router.get( '/', getHospitales);

router.post( '/', 
            [
                validarJWT,
                check('nombre', 'El nombre es requerido').not().isEmpty(),
                validarCampos
        
            ] 
            ,crearHospitales);

router.put( '/:id', actualizarHospitales); 
    
router.delete( '/:id', borrarHospitales)    





module.exports = router