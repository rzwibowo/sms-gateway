const index = new Vue({
    el: '#app',
    data: {
        templates: [],
        template: {},
        open: false
    },
    mounted: function () {
        this.listTemplates();
    },
    computed: {
        headerModal: function () {
            if (this.template.id) {
                return "Ubah"
            } else {
                return "Tambah"
            }
        }
    },
    methods: {
        listTemplates: function () {
            fetch('/api/listTemplates')
            .then((res) => { return res.json() })
            .then((data) => { this.templates = data.data })
            .catch((err) => console.error(err));
        },
        deleteTemplate: function (id) {
            const cnf = confirm('Hapus data?');
            if (cnf) {
                fetch('/api/deleteTemplate', {
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: id})
                })
                .then((res) => {
                    console.log(res);
                    alert('Terhapus');
                    this.listTemplates();
                })
                .catch((error) => console.error(error));
            }
        },
        toggleForm: function () {
            this.open = !this.open;
            if (!this.open) { this.template = {} }
        },
        editTemplate: function (id) {
            fetch('/api/getTemplate/' + id)
            .then((res) => { return res.json() })
            .then((data) => { this.template = data.data[0] })
            .catch((err) => console.error(err));
            this.open = !this.open;
        },
        saveTemplate: function (id) {
            if (id) {
                fetch('/api/updateTemplate', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.template)
                })
                .then((res) => {
                        console.log(res);
                        this.template = {};
                        this.open = !this.open;
                        this.listTemplates();
                    })
                .catch((error) => console.error(error));
            } else {
                fetch('/api/saveTemplate', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.template)
                })
                .then((res) => {
                        console.log(res);
                        this.template = {};
                        this.open = !this.open;
                        this.listTemplates();
                    })
                .catch((error) => console.error(error));
            }
        }
    }
});