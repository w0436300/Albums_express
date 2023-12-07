const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')
const joi = require('joi')

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');

//Define SCHEMA FOR artist
const artistSchema = joi.object({
    Name: joi.string().max(20).required(),
})

//GET all ARTISTS.
router.get('/', (req, res) => {
    const statement = db.prepare('SELECT * FROM artists')
    const artists = statement.all();

    res.json(artists)
});

//GET one ARTIST
router.get('/:id', (req, res) => {
    const statement = db.prepare('SELECT * FROM artists WHERE ArtistId = ?')
    const data = statement.get(req.params.id)

    if (data != undefined){
        res.json(data)
    } else{
        res.status(404).send()
    }
});

//CREATE a NEW ARTIST
router.post('/',express.json(),(req,res) => {
    const{error} = artistSchema.validate(req.body,{abortEarly:false})
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
    let sql = `INSERT INTO artists (${columns.join(', ')}) VALUES (${parameters.join(', ')});`
    console.log(sql);
    const statement = db.prepare(sql) 
    const result = statement.run(values)
    
    console.log(result);
    res.status(201).json(result);

})

//UPDATE an ARTIST NAME
router.patch('/:id',(req,res)=>{
    // validate our req.body
     const {error} = artistSchema.validate(req.body,{abortEarly: false } )
     if(error){
         return res.status(422).send(error.details);
     }

 const columns = []
 const values=[]
 for(key in req.body){
     //append our keys for our UPDATE statement                           
     columns.push(`${key}=?`)
     //push the corresponding values into an array
     values.push(req.body[key])
 }
 //push the id into the array
 values.push(req.params.id)
              
 //JSON data will be available in req.body
 const sql = `UPDATE artists SET ${columns.join(',')} WHERE ArtistId = ?;`
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

//DELETE an exicting ARTIST
router.delete('/:id', (req,res) => {

   //excutr the delete jin the empljoyee table
   const deleteSql = `DELETE FROM artists WHERE ArtistId = ?;`;
   const DeleteStatement = db.prepare(deleteSql)
   const DeleteResult = DeleteStatement.run([req.params.id])

   //make sure a record was indeed updated
   if(DeleteResult.changes > 0){
       res.json(DeleteResult)
   } else {
       res.status(404).json(DeleteResult)
   }
})

//GET ALBUMS by an ARTIST
router.get('/:id/albums', (req, res) => {
    const ArtistId = req.params.id;
    const statement = db.prepare('SELECT * FROM albums WHERE ArtistId = ?');
    const albums = statement.all(ArtistId);

    res.json(albums);

});

module.exports = router