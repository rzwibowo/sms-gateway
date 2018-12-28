const numberBox = document.querySelector('input[name=number]');
const textBox = document.querySelector('input[name=text]');
const sendBtn = document.querySelector('input[type=button][value="Send SMS"]');
const sendMass = document.querySelector('input[type=button][value="Massive Send"]');
const msg = document.querySelector('.response');
const listBox = document.getElementById('list');

textBox.addEventListener('keyup', function (e) {
    if ((e.keyCode || e.charCode) === 13) send();
}, false);

sendBtn.addEventListener('click', send, false);

function send() {
    const number = numberBox.value.replace(/\D/g, '');
    const text = textBox.value;

    fetch('/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({number: number, text: text})
    })
    .then((res) => console.log(res))
    .catch((error) => console.error(error));
}

sendMass.addEventListener('click', sendmass, false);

function sendmass() {
    const text = textBox.value;

    const checkedNumbers = document.querySelectorAll('input[type=checkbox]');
    for (let n = 0; n < checkedNumbers.length; n++) {
        if (checkedNumbers[n].checked) {
            fetch('/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({number: checkedNumbers[n].value, text: text})
            })
            .then((res) => console.log(res))
            .catch((error) => console.error(error));
        }
    }
}

const socket = io();
socket.on('smsStatus', (data) => {
    displayStatus(`Message ID ${data.id} successfully sent to ${data.number}`);
});

Notification.requestPermission().then((status) => console.info(status));

function displayStatus(message) {
    const notification = new Notification('Nexmo', {
        body: message,
        icon: 'img/icon-nexmo.png'
    });
}

(function listNumbers() {
    fetch('/api/listNumbers')
    .then((res) => {return res.json()})
    .then((data) => {
        let numbers = ``;
        numbers += `<table>
        <thead>
        <tr>
        <th>Kirimin!</th>
        <th>Nama</th>
        <th>Nomor</th>
        </tr>
        </thead>
        <tbody>`;
        data.data.forEach((n) => {
            numbers += `<tr>
            <td><input type="checkbox" value="${n.nomor}"></td>
            <td>${n.nama}</td>
            <td>${n.nomor}</td>
            </tr>`;
        });
        numbers += `</tbody></table>`
        listBox.innerHTML = numbers;
    })
    .catch((err) => console.error(err));   
})()