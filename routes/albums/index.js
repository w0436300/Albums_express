const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')
const joi = require('joi')
const multer = require('multer')

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');

//Define SCHEMA FOR albums
const albumsSchema = joi.object({
    Title: joi.string().max(100).required(),
    ArtistId:joi.number().integer().positive(),
    AlbumArt:joi.string().max(50),
    ReleaseYear:joi.date()
})


//GET all ALBUMS
router.get('/', (req, res) => {
    const statement = db.prepare('SELECT * FROM albums')
    const albums = statement.all();

    res.json(albums)
});

//GET one ALBUM
router.get('/:id', (req, res) => {
    const albumId = req.params.id
    const statement = db.prepare('SELECT * FROM albums WHERE AlbumId = ?')
    const data = statement.get(albumId)

    if (data != undefined){
        res.json(data)
    } else{
        res.status(404).send()
    }
});

//GET TRACK by an ALBUM's ID
router.get('/:id/tracks', (req, res) => {
    const statement = db.prepare('SELECT * FROM tracks WHERE AlbumId = ?');
    const tracks = statement.all(req.params.id)

    res.json(tracks);
    
});

//CREATE a NEW ALBUM
router.post('/',express.json(),(req,res) => {
    const{error} = albumsSchema.validate(req.body,{abortEarly:false})
    if(error){
        return res.status(422).send(error.details);
    }

    const columns = [];
    const parameters = [];
    const values = [];
    
    for(key in req.body){
        parameters.push('?');
        columns.push(key);
        values.push(req.body[key])
    }
    let sql = `INSERT INTO albums (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
    console.log(sql);
    const statement = db.prepare(sql) 
    const result = statement.run(values)
    
    console.log(result);
    res.status(201).json(result);

})

//UPDATE an ALBUM TITLE
router.patch('/:id',(req,res)=>{
    // validate our req.body
    const {error} = albumsSchema.validate(req.body,{abortEarly: false } )
    if(error){
        return res.status(422).send(error.details);
    }

    const columns = []
    const values=[]
    for(key in req.body){                        
        columns.push(`${key}=?`)
        values.push(req.body[key])
    }
    values.push(req.params.id)
                
    const sql = `UPDATE albums SET ${columns.join(',')} WHERE AlbumId = ?;`
    console.log(sql);
    const statement = db.prepare(sql)
    const result = statement.run(values)

    //make sure a record was indeed updated
    if(result.changes > 0){
        res.json(result)
    } else {
        res.status(404).json(result)
    }
})

//DELETE an exicting ALBUM
router.delete('/:id', (req,res) => {
    const deleteSql = `DELETE FROM albums WHERE AlbumId = ?;`;
    const DeleteStatement = db.prepare(deleteSql)
    const DeleteResult = DeleteStatement.run([req.params.id])
 
    if(DeleteResult.changes > 0){
        res.json(DeleteResult)
    } else {
        res.status(404).json(DeleteResult)
    }
 })

//HANDLE ALBUMS image UPLOAD
const storage = multer.diskStorage({
    destination:'./_FrontendStarterFiles/albumart/',
    filename: function(req,file,callback){
       callback(null,Date.now().toString() + file.originalname )
    }
})
const upload = multer({storage:storage});
router.post(`/:id/albumart`, upload.single('albumart'), (req, res) => {
        const updateStatement = db.prepare('UPDATE albums SET Albumart = ? WHERE AlbumId = ?');
        const result = updateStatement.run([req.file.filename,req.params.id]);
        console.log(result);
        res.json(result);
    });




module.exports = router