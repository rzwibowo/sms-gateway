const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('users/index.html');
});

module.exports = router;