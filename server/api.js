const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sms_gateway'
});
connection.connect(function (err) {
    err ? console.error(err) 
        : console.log('Database connected')
});

//#region NUMBERS data operation
router.get('/listNumbers', (req, res) => {
    connection.query(`SELECT n.id, n.nama, n.nomor, n.id_group, g.nama AS nama_group
        FROM numbers n JOIN groups g ON n.id_group = g.id`,
        function (err, result) {
            if (err) throw err;
            const data = result;
            res.status(200).send({
                success: 'true',
                data: data
            })
    });
});

router.get('/getNumber/:number_id', (req, res) => {
    connection.query(`SELECT n.id, n.nama, n.nomor, n.id_group, g.nama AS nama_group
        FROM numbers n
        JOIN groups g
        ON n.id_group = g.id
        WHERE n.id = ?`,
        [req.params.number_id],
        function (err, result) {
            if (err) throw err;
            const data = result;
            res.status(200).send({
                success: 'true',
                data: data
            })
    });
});

router.post('/saveNumber', (req, res) => {
    connection.query("INSERT INTO numbers (nama, nomor, id_group) VALUES (?, ?, ?)", 
        [req.body.nama, req.body.nomor, req.body.id_group],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.put('/updateNumber', (req, res) => {
    connection.query("UPDATE numbers SET nama = ?, nomor = ?, id_group = ? WHERE id = ?", 
        [req.body.nama, req.body.nomor, req.body.id_group, req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.delete('/deleteNumber', (req, res) => {
    connection.query("DELETE FROM numbers WHERE id = ?", 
        [req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});
//#endregion NUMBERS data operation

//#region GROUPS data operation
router.get('/listGroups', (req, res) => {
    connection.query("SELECT * FROM groups", function (err, result) {
        if (err) throw err;
        const data = result;
        res.status(200).send({
            success: 'true',
            data: data
        })
    });
});

router.get('/listAnggotaGroups', (req, res) => {
    connection.query(`SELECT n.id, n.nama, n.nomor, 
        g.id as id_group, g.nama as nama_group
        FROM numbers n
        JOIN groups g
        ON n.id_group = g.id`, function (err, result) {
        if (err) throw err;
        const data = result;
        res.status(200).send({
            success: 'true',
            data: data
        })
    });
});

router.get('/getGroup/:group_id', (req, res) => {
    connection.query(`SELECT *
        FROM groups
        WHERE id = ?`,
        [req.params.group_id],
        function (err, result) {
        if (err) throw err;
        const data = result;
        res.status(200).send({
            success: 'true',
            data: data
        })
    });
});

router.get('/getAnggotaGroup/:group_id', (req, res) => {
    connection.query(`SELECT n.id, n.nama, n.nomor, 
        g.id as id_group, g.nama as nama_group
        FROM numbers n
        JOIN groups g
        ON n.id_group = g.id
        WHERE g.id = ?`,
        [req.params.group_id],
        function (err, result) {
        if (err) throw err;
        const data = result;
        res.status(200).send({
            success: 'true',
            data: data
        })
    });
});

router.post('/saveGroup', (req, res) => {
    connection.query("INSERT INTO groups (nama) VALUES (?)", 
        [req.body.nama],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.put('/saveAnggotaGroup', (req, res) => {
    connection.query("UPDATE numbers SET id_group = ? WHERE id = ?", 
        [req.body.id_group, req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.put('/updateGroup', (req, res) => {
    connection.query("UPDATE groups SET nama = ? WHERE id = ?", 
        [req.body.nama, req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.delete('/deleteGroup', (req, res) => {
    connection.query("DELETE FROM groups WHERE id = ?", 
        [req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});
//#endregion GROUPS data operation

//#region TEMPLATES data operation
router.get('/listTemplates', (req, res) => {
    connection.query("SELECT * FROM templates", function (err, result) {
        if (err) throw err;
        const data = result;
        res.status(200).send({
            success: 'true',
            data: data
        })
    });
});

router.get('/getTemplate/:template_id', (req, res) => {
    connection.query(`SELECT *
        FROM templates
        WHERE id = ?`,
        [req.params.template_id],
        function (err, result) {
            if (err) throw err;
            const data = result;
            res.status(200).send({
                success: 'true',
                data: data
            })
    });
});

router.post('/saveTemplate', (req, res) => {
    connection.query("INSERT INTO templates (judul, teks) VALUES (?, ?)", 
        [req.body.judul, req.body.teks],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.put('/updateTemplate', (req, res) => {
    connection.query("UPDATE templates SET judul = ?, teks = ? WHERE id = ?", 
        [req.body.judul, req.body.teks, req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.delete('/deleteTemplate', (req, res) => {
    connection.query("DELETE FROM templates WHERE id = ?", 
        [req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});
//#endregion TEMPLATES data operation

module.exports = router;