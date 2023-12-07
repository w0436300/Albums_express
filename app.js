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


//GET all MediaType
app.get('/api/mediatypes', (req, res) => {
    const statement = db.prepare('SELECT * FROM media_types')
    const MediaType = statement.all();

    res.json(MediaType)
});



//THEME
app.get('/api/themes', (req, res) => {
    const statement = db.prepare('SELECT * FROM themes')
    const themes = statement.all();

    res.json(themes)
});


//Listen on the port number, start the service. After successful start-up (nodemon), execute the callback function.
app.listen(3000,()=>{
    console.log('Listening on port 3000');
})

