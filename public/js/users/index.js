const index = new Vue({
    el: '#app',
    data: {
        users: [],
        user: {},
        open: false
    },
    mounted: function () {
        this.listUsers();
    },
    computed: {
        headerModal: function () {
            if (this.user.id) {
                return "Ubah"
            } else {
                return "Tambah"
            }
        }
    },
    methods: {
        listUsers: function () {
            fetch('/api/listUsers')
            .then((res) => { return res.json() })
            .then((data) => { this.users = data.data })
            .catch((err) => console.error(err));
        },
        deleteUser: function (id) {
            const cnf = confirm('Hapus data?');
            if (cnf) {
                fetch('/api/deleteUser', {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: id})
                })
                .then((res) => {
                    console.log(res);
                    alert('Terhapus');
                    this.listUsers();
                })
                .catch((error) => console.error(error));
            }
        },
        toggleForm: function () {
            this.open = !this.open;
            if (!this.open) { this.user = {} }
        },
        editUser: function (id) {
            fetch('/api/getUser/' + id)
            .then((res) => { return res.json() })
            .then((data) => { this.user = data.data[0] })
            .catch((err) => console.error(err));
            this.open = !this.open;
        },
        saveUser: function (id) {
            if (id) {
                fetch('/api/updateUser', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.user)
                })
                .then((res) => {
                        console.log(res);
                        this.user = {};
                        this.open = !this.open;
                        this.listUsers();
                    })
                .catch((error) => console.error(error));
            } else {
                fetch('/api/saveUser', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.user)
                })
                .then((res) => {
                        console.log(res);
                        this.user = {};
                        this.open = !this.open;
                        this.listUsers();
                    })
                .catch((error) => console.error(error));
            }
        }
    }
});