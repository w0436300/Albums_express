const express = require('express')
const Database = require('better-sqlite3');

const router = express.Router()
const db = Database(process.cwd() + '/database/chinook.sqlite');

//GET all THEMES
router.get('/', (req, res) => {
    const statement = db.prepare('SELECT * FROM themes')
    const themes = statement.all();

    res.json(themes)
});


module.exports = router