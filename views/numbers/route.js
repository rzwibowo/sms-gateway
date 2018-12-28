const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('numbers/index.html');
});

router.get('/add', function(req, res){
    res.render('numbers/add.html');
});

module.exports = router;