const add = new Vue({
    el: '#app',
    data: {
        number: {},
        groups: []
    },
    mounted: function() {
        this.listGroups();
    },
    methods: {
        listGroups: function () {
            fetch('/api/listGroups')
            .then((res) => { return res.json() })
            .then((data) => { this.groups = data.data })
            .catch((err) => console.error(err));
        },
        saveNumber: function () {
            fetch('/api/saveNumber', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.number)
            })
            .then((res) => console.log(res))
            .catch((error) => console.error(error));
        }
    }
})