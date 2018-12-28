const index = new Vue({
    el: '#app',
    data: {
        numbers: [],
        groups:  [],
        number: {},
        open: false
    },
    mounted: function () {
        this.listNumbers();
    },
    methods: {
        listNumbers: function () {
            fetch('/api/listNumbers')
            .then((res) => { return res.json() })
            .then((data) => { this.numbers = data.data })
            .catch((err) => console.error(err));
        },
        deleteNumber: function (id) {
            const cnf = confirm('Hapus data?');
            if (cnf) {
                fetch('/api/deleteNumber', {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: id})
                })
                .then((res) => {
                    console.log(res);
                    alert('Terhapus');
                    this.listNumbers();
                })
                .catch((error) => console.error(error));
            }
        },
        openForm: function () {
            this.listGroups();
            this.open = !this.open;
        },
        editNumber: function (id) {
            this.listGroups();
            fetch('/api/getNumber/' + id)
            .then((res) => { return res.json() })
            .then((data) => { this.number = data.data[0] })
            .catch((err) => console.error(err));
            this.open = !this.open;
        },
        listGroups: function () {
            fetch('/api/listGroups')
            .then((res) => { return res.json() })
            .then((data) => { this.groups = data.data })
            .catch((err) => console.error(err));
        },
        saveNumber: function (id) {
            if (id) {
                fetch('/api/updateNumber', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.number)
                })
                .then((res) => {
                        console.log(res);
                        this.number = {};
                        this.open = !this.open;
                        this.listNumbers();
                    })
                .catch((error) => console.error(error));
            } else {
                fetch('/api/saveNumber', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.number)
                })
                .then((res) => {
                        console.log(res);
                        this.number = {};
                        this.open = !this.open;
                        this.listNumbers();
                    })
                .catch((error) => console.error(error));
            }
        }
    }
});