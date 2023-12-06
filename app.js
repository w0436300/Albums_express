//1.require
const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')
const multer = require('multer')


//Establish a connection with the SQLite database.
const db = Database(__dirname + '/database/chinook.sqlite');

//create an instance of an express app
const app = express();

//configure a folder to serve static content
app.use(express.static('_FrontendStarterFiles'))

//THEME
app.get('/api/themes', (req, res) => {
    const statement = db.prepare('SELECT * FROM themes')
    const themes = statement.all();

    res.json(themes)
});


//Retrieve the endpoints of all artists.
app.get('/api/artists', (req, res) => {
    const statement = db.prepare('SELECT * FROM artists')
    const artists = statement.all();

    res.json(artists)
});

//Retrieve the endpoint of all artist's album.
app.get('/api/albums', (req, res) => {
    const statement = db.prepare('SELECT * FROM albums')
    const albums = statement.all();

    res.json(albums)
});

//get tracks by an albums's id
app.get('/api/albums/:id/tracks', (req, res) => {
    const statement = db.prepare('SELECT * FROM tracks WHERE AlbumId = ?');
    const tracks = statement.all(req.params.id)

    res.json(tracks);
    
});

//get one artist
app.get('/api/artists/:id', (req, res) => {
    const statement = db.prepare('SELECT * FROM artists WHERE ArtistId = ?')
    const data = statement.get(req.params.id)

    if (data != undefined){
        res.json(data)
    } else{
        res.status(404).send()
    }
});

//get one albums
app.get('/api/albums/:id', (req, res) => {
    const albumId = req.params.id
    const statement = db.prepare('SELECT * FROM albums WHERE AlbumId = ?')
    const data = statement.get(albumId)

    if (data != undefined){
        res.json(data)
    } else{
        res.status(404).send()
    }
});

//get albums by an artist's id
app.get('/api/artists/:id/albums', (req, res) => {
    const ArtistId = req.params.id;
    const statement = db.prepare('SELECT * FROM albums WHERE ArtistId = ?');
    const albums = statement.all(ArtistId);

    res.json(albums);

});

//endpoinnt to handle file upload
const storage = multer.diskStorage({
    destination:path.join(__dirname, './_FrontendStarterFiles/albumart/'),
    filename: function(req,file,callback){
       callback(null,Date.now().toString() + file.originalname )
    }
})
const upload = multer({storage:storage});
app.post(`/api/albums/:id/albumart`, upload.single('albumart'), (req, res) => {
        const updateStatement = db.prepare('UPDATE albums SET Albumart = ? WHERE AlbumId = ?');
        const result = updateStatement.run([req.file.filename,req.params.id]);
        console.log(result);
        res.json(result);
    });
   

//Listen on the port number, start the service. After successful start-up (nodemon), execute the callback function.
app.listen(3000,()=>{
    console.log('Listening on port 3000');
})

