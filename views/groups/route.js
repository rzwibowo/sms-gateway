const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('groups/index.html');
});

router.get('/add', function(req, res) {
    res.render('groups/add.html');
});

module.exports = router;