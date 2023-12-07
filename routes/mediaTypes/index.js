const express = require('express')
const Database = require('better-sqlite3');

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');



//GET all MediaType
router.get('/', (req, res) => {
    const statement = db.prepare('SELECT * FROM media_types')
    const mediaTypes = statement.all();

    res.json(mediaTypes)
});


module.exports = router