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
        this.checkPermission().then((response) => {
            this.permission = response;
            console.log('Web notification status: ' + response);
            this.listGroups();
            this.listNumbers();
            this.listTemplates();
            this.socketInteraction();
        }, (error) => {
            console.error(error);
        });
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
            return new Promise((resolve, reject) => {
                try {
                    Notification.requestPermission().then(function (status) {
                        resolve(status);
                    });
                } catch (error) {
                    Notification.requestPermission(function (status) {
                        resolve(status);
                    });
                }
            });
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
                    this_.messageStatus('Error: ' + data.error, this_.permission);
                } else {
                    this_.messageStatus('Message ID ' + data.id + ' successfully sent to ' + data.number, this_.permission);
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
            const this_ = this;
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
                    this.messageStatus(response.statusText, this_.permission);
                }
            })
            .catch(function (e) {
                this.messageStatus(e, this_.permission);
            });
        }
    }
});