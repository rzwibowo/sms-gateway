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

router.get('/listAnggotaGroups', async (req, res) => {
    let r1, r2, r3 = [];
    await connection.query("SELECT * FROM groups", function (err, result) {
        if (err) throw err;
        r1 = result;
    });
    await connection.query(`SELECT n.id, n.nama, n.nomor, n.id_group
        FROM numbers n
        JOIN groups g
        ON n.id_group = g.id
        ORDER BY g.id`, function (err, result) {
        if (err) throw err;
        r2 = result;

        r1.forEach((g, idx) => {
            r3[idx] = {};
            r3[idx].id = g.id;
            r3[idx].nama_group = g.nama;
            r3[idx].members = [];
            r2.forEach(m => {
                if (m.id_group === g.id) {
                    r3[idx].members.push(m);
                }
            })
        });
        
        res.status(200).send({
            success: 'true',
            data: r3
        });
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

router.get('/getAnggotaGroup/:group_id', async (req, res) => {
    let r1, r2, r3 = [];
    await connection.query(`SELECT * FROM groups
        WHERE id = ?`,
        [req.params.group_id],
        function (err, result) {
            if (err) throw err;
            r1 = result;
    });
    await connection.query(`SELECT n.id, n.nama, n.nomor, 
        g.id as id_group, g.nama as nama_group
        FROM numbers n
        JOIN groups g
        ON n.id_group = g.id
        WHERE g.id = ?`,
        [req.params.group_id],
        function (err, result) {
        if (err) throw err;
        r2 = result;

        r1.forEach((g, idx) => {
            r3[idx] = {};
            r3[idx].id = g.id;
            r3[idx].nama_group = g.nama;
            r3[idx].members = [];
            r2.forEach(m => {
                if (m.id_group === g.id) {
                    r3[idx].members.push(m);
                }
            })
        });
        
        res.status(200).send({
            success: 'true',
            data: r3
        });
    });
});

router.post('/saveGroup', async (req, res) => {
    await connection.query("INSERT INTO groups (nama) VALUES (?)", 
        [req.body.nama_group],
        function (err, result) {
            if (err) console.error(err);
        });
    connection.query(`SELECT id FROM groups
        WHERE timestamp =
        (SELECT MAX(timestamp)
         FROM groups)`,
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true',
                last_id: result.id
            })
        })
});

router.put('/saveAnggotaGroup', (req, res) => {
    connection.query("UPDATE numbers SET id_group = ? WHERE id IN (?)", 
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
        [req.body.nama_group, req.body.id],
        function (err, result) {
            if (err) console.error(err);
            res.status(200).send({
                success: 'true'
            })
        });
});

router.delete('/deleteGroup', (req, res) => {
    req.body.id === 1
        ? res.status(403).send({
                success: 'false',
                message: 'restricted to delete'
            })
        : connection.query("DELETE FROM groups WHERE id = ?", 
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