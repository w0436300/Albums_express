const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')
const joi = require('joi')

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');

//Define SCHEMA FOR tracks
const tracksSchema = joi.object({
    Name: joi.string().max(100).required(),
    AlbumId:joi.number().integer().positive(),
    MediaTypeId:joi.number().integer().positive(),
    Genreld:joi.number().integer().positive(),
    Composer: joi.string().max(100),
    Milliseconds: joi.number().integer().positive(),
    Bytes: joi.number().integer().positive(),
    UnitPrice: joi.number().positive()
})

//GET all TRACKS
router.get('/', (req, res) => {
    const statement = db.prepare('SELECT * FROM tracks')
    const tracks = statement.all();

    res.json(tracks)
});

//GET one TRACKS
router.get('/:id', (req, res) => {
    const albumId = req.params.id
    const statement = db.prepare('SELECT * FROM tracks WHERE TrackId = ?')
    const data = statement.get(albumId)

    if (data != undefined){
        res.json(data)
    } else{
        res.status(404).send()
    }
});

//CREATE a NEW TRACK
router.post('/',express.json(),(req,res) => {
    const{error} = tracksSchema.validate(req.body,{abortEarly:false})
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
    let sql = `INSERT INTO tracks (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
    console.log(sql);
    const statement = db.prepare(sql) 
    const result = statement.run(values)
    
    console.log(result);
    res.status(201).json(result);

})

//UPDATE an TRACK Name
router.patch('/:id',(req,res)=>{
    const {error} = tracksSchema.validate(req.body,{abortEarly: false } )
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
                
    const sql = `UPDATE tracks SET ${columns.join(',')} WHERE TrackId = ?;`
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

//DELETE an exicting TRACK
router.delete('/:id', (req,res) => {
    const deleteSql = `DELETE FROM tracks WHERE TrackId = ?;`;
    const DeleteStatement = db.prepare(deleteSql)
    const DeleteResult = DeleteStatement.run([req.params.id])
 
    if(DeleteResult.changes > 0){
        res.json(DeleteResult)
    } else {
        res.status(404).json(DeleteResult)
    }
 })



module.exports = router