const express = require('express');
const app = express();

require('dotenv').config();

const server = app.listen(process.env.PORT || 4000, () => console.log("App running"));

const bodyParser = require('body-parser');
const ejs = require('ejs');

const Nexmo = require('nexmo')
const nexmo = new Nexmo({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
}, {debug: true});

const socketIo = require('socket.io');
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnected', () => {
        console.log('Disconnected');
    });
});

app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const apiRoute = require('./api.js');
app.use('/api', apiRoute);

const groupsRoute = require(__dirname + '/../views/groups/route.js');
app.use('/groups', groupsRoute);
app.use('/groups', express.static(__dirname + '/../public'));

const numbersRoute = require(__dirname + '/../views/numbers/route.js');
app.use('/numbers', numbersRoute);
app.use('/numbers', express.static(__dirname + '/../public'));

const templatesRoute = require(__dirname + '/../views/templates/route.js');
app.use('/templates', templatesRoute);
app.use('/templates', express.static(__dirname + '/../public'));

const usersRoute = require(__dirname + '/../views/users/route.js');
app.use('/users', usersRoute);
app.use('/users', express.static(__dirname + '/../public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    res.send(req.body);
    console.log(req.body);
    const toNumber = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        'Wibowo Dev', toNumber, text, {type: 'unicode'},
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);

                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                };
                io.emit('smsStatus', data)
            }
        }
    );
});