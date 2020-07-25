const { response } = require('express');
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const {actualizarImagen} = require('../helpers/actualizar-imagen')

const fileUpload = ( req, res = reponse ) => {

    
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios'];

    if ( !tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo invalido'
        })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay ningun archivo"
        });
    }

    // Procesar la imagen

    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[ nombreCortado.length - 1];

    // validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: "Extension no valida"
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extension}`;

    // Path
    const path = `./uploads/${ tipo }/${ nombreArchivo }`

    // Mover la imagen
    file.mv(path , function(err) {
        if (err)
          return res.status(500).json({
              ok: false,
              msg: "Error al mover la imagen"
          });
    
        
    });

    // Actualizar base de datos

    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
        ok: true,
        msg: "fileUpload",
        nombreArchivo
    })

}

const fileDownload = ( req, res) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}`);
    // imagen por defecto
    if ( fs.existsSync(pathImg)){


        res.sendFile( pathImg );
        
    }else{
        const pathImg =  path.join( __dirname, `../uploads/no-img.jpg`);
        res.sendFile( pathImg );
      
    }



}


module.exports = {
    fileUpload,
    fileDownload
}