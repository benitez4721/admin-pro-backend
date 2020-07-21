require('dotenv').config()

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config')

//Crear el servido express
const app = express()

//Configurar corse
app.use( cors() )

//Lectura y parseo del body
app.use( express.json());

// Base de datos
dbConnection()
app.use( express.static('public'))

// Directorio publico


//Rutas
app.use( '/api/usuarios', require('./routes/usuarios'))
app.use( '/api/login', require('./routes/auth'))
app.use( '/api/hospitales', require('./routes/hospitales'))
app.use( '/api/medicos', require('./routes/medicos'))
app.use( '/api/todo', require('./routes/busquedas'))
app.use( '/api/upload', require('./routes/uploads'))




app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto' +  process.env.PORT);
})