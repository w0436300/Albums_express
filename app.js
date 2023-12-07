const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')

const joi = require('joi')

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');

//IMPORT ANY ROUTER MODULES
const artistsRouter = require('./routes/artists') //will look for index.js
const albumsRouter = require('./routes/albums') 
const tracksRouter = require('./routes/tracks') 
const mediaTypesRouter = require('./routes/mediaTypes') 
const themesRouter = require('./routes/themes') 

//create an instance of an express app
const app = express();

//configure a folder to serve static content
app.use(express.static('_FrontendStarterFiles'))
app.use(express.urlencoded({extended: false}))//capture date to req.body
app.use(express.json())//capture data in a post and assign to req.body

//INJECT our ROUTERS INTO the APP
app.use('/api/artists', artistsRouter)
app.use('/api/albums', albumsRouter)
app.use('/api/tracks', tracksRouter)
app.use('/api/mediatypes', mediaTypesRouter)
app.use('/api/themes', themesRouter)





//Listen on the port number, start the service. After successful start-up (nodemon), execute the callback function.
app.listen(3000,()=>{
    console.log('Listening on port 3000');
})

