// const numberBox = document.querySelector('input[name=number]');
// const textBox = document.querySelector('input[name=text]');
// const sendBtn = document.querySelector('input[type=button][value="Send SMS"]');
// const sendMass = document.querySelector('input[type=button][value="Massive Send"]');
// const msg = document.querySelector('.response');
// const listBox = document.getElementById('list');

// textBox.addEventListener('keyup', function (e) {
//     if ((e.keyCode || e.charCode) === 13) send();
// }, false);

// sendBtn.addEventListener('click', send, false);

// function send() {
//     const number = numberBox.value.replace(/\D/g, '');
//     const text = textBox.value;

//     fetch('/', {
//         method: 'post',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({number: number, text: text})
//     })
//     .then((res) => console.log(res))
//     .catch((error) => console.error(error));
// }

// sendMass.addEventListener('click', sendmass, false);

// function sendmass() {
//     const text = textBox.value;

//     const checkedNumbers = document.querySelectorAll('input[type=checkbox]');
//     for (let n = 0; n < checkedNumbers.length; n++) {
//         if (checkedNumbers[n].checked) {
//             fetch('/', {
//                 method: 'post',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({number: checkedNumbers[n].value, text: text})
//             })
//             .then((res) => console.log(res))
//             .catch((error) => console.error(error));
//         }
//     }
// }

// const socket = io();
// socket.on('smsStatus', (data) => {
//     messageStatus(`Message ID ${data.id} successfully sent to ${data.number}`);
// });

// Notification.requestPermission().then((status) => console.info(status));

// function messageStatus(message) {
//     const notification = new Notification('Nexmo', {
//         body: message,
//         icon: 'img/icon-nexmo.png'
//     });
// }

// (function listNumbers() {
//     fetch('/api/listNumbers')
//     .then((res) => {return res.json()})
//     .then((data) => {
//         let numbers = ``;
//         numbers += `<table>
//         <thead>
//         <tr>
//         <th>Kirimin!</th>
//         <th>Nama</th>
//         <th>Nomor</th>
//         </tr>
//         </thead>
//         <tbody>`;
//         data.data.forEach((n) => {
//             numbers += `<tr>
//             <td><input type="checkbox" value="${n.nomor}"></td>
//             <td>${n.nama}</td>
//             <td>${n.nomor}</td>
//             </tr>`;
//         });
//         numbers += `</tbody></table>`
//         listBox.innerHTML = numbers;
//     })
//     .catch((err) => console.error(err));   
// })()

const index = new Vue({
    el: '#app',
    data: {
        selectedtype: 'g',
        group: '',
        number: '',
        message: '',
        groups: [],
        numbers: [],
        templates: [],
        groupmembernumber: [],
        socket: io(),
        permission: 'denied'
    },
    mounted: function () {
        this.checkPermission();
        this.listGroups();
        this.listNumbers();
        this.listTemplates();
        this.socketInteraction();
    },
    methods: {
        listGroups: function () {
            fetch('/api/listGroups')
            .then((res) => { return res.json() })
            .then((data) => { this.groups = data.data })
            .catch((err) => console.error(err)); 
        },
        listNumbers: function () {
            fetch('/api/listNumbers')
            .then((res) => { return res.json() })
            .then((data) => { this.numbers = data.data })
            .catch((err) => console.error(err));
        },
        listTemplates: function () {
            fetch('/api/listTemplates')
            .then((res) => { return res.json() })
            .then((data) => { this.templates = data.data })
            .catch((err) => console.error(err));
        },
        checkPermission: function () {
            try {
                Notification.requestPermission().then(function(status) {
                    this.permission = status;
                    console.log('Web notification status: '+ this.permission);
                });
            } catch (error) { // Safari 9 doesn't return a promise for requestPermissions
                Notification.requestPermission(function(status) {
                    this.permission = status;
                    console.log('Web notification status: '+ this.permission);
                });
            }
        },
        socketInteraction: function () {
            this.socket.on('connect', function () {
                console.log('Socket connected');
            });
            const this_ = this;
            this.socket.on('smsStatus', function (data) {
                console.log(data);
                if (!data) return;
                if (data.error) {
                    this_.messageStatus('Error: ' + data.error, this.permission);
                } else {
                    this_.messageStatus('Message ID ' + data.id + ' successfully sent to ' + data.number, this.permission);
                }
            });
        },
        messageStatus: function (message, notification) {
            console.log(notification);

            if (notification === 'granted') { // web notification
                const notify = new Notification('Nexmo', {
                    body: message,
                    icon: '../images/icon-nexmo.png'
                });
            } else { // Notification is denied by a user. just show text
                alert(message);
            }
        },
        sendMessage: async function () {
            if (this.selectedtype === 'g') {
                await fetch('/api/getAnggotaGroup/' + this.group)
                .then((res) => { return res.json() })
                .then((data) => {
                    this.groupmembernumber = data.data[0].members.map(m => {
                        return m.nomor;
                    });
                })
                .catch((err) => console.error(err));

                await this.groupmembernumber.forEach(m => {
                    this.sendProcess(m, this.message);
                });
            } else {
                await this.sendProcess(this.number, this.message);
            }
            this.group = '';
            this.number = '';
            this.message = '';
            this.groupmembernumber = [];
        },
        sendProcess: function (number, text) {
            fetch('/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    text: text
                })
            })
            .then(function (response) {
                if (response.status !== 200) {
                    this.messageStatus(statusText, this.permission);
                }
            })
            .catch(function (e) {
                this.messageStatus(e, this.permission);
            });
        }
    }
});