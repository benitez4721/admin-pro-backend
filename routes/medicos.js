

/*  
    Ruta
    api/Medicos
*/

const {Router} = require('express');
const{ check } = require('express-validator')
const{ validarCampos } = require('../middlewares/validar-campos')
const {validarJWT} = require('../middlewares/validar-jwt')

const {getMedicos,actualizarMedicos,borrarMedicos,crearMedicos} = require('../controllers/medicos')

const router = Router();


router.get( '/', getMedicos);

router.post( '/',
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos

    ]  
    ,crearMedicos);

router.put( '/:id',  
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos

    ]  
    ,actualizarMedicos); 
    
router.delete( '/:id',
    [
    
    validarJWT,

    ],
   borrarMedicos)    





module.exports = router