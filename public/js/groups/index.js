const index = new Vue({
    el: '#app',
    data: {
        groupsmember: [],
        groupmember: {},
        groupno: [],
        selected: [],
        unselected: [],
        lastid: null,
        open: false
    },
    mounted: function () {
        this.listGroupsMember();
    },
    computed: {
        headerModal: function () {
            if (this.groupmember.id) {
                return "Ubah"
            } else {
                return "Tambah"
            }
        }
    },
    methods: {
        listGroupsMember: function () {
            fetch('/api/listAnggotaGroups')
            .then((res) => { return res.json() })
            .then((data) => {
                this.groupsmember = data.data;
                this.listNoGroupMember();
            })
            .catch((err) => console.error(err));
        },
        listNoGroupMember: function () {
            this.groupno = this.groupsmember.filter(m => {
                return m.id === 1
            })[0];
        },
        deleteGroup: async function (id) {
            const cnf = confirm('Hapus data?');
            if (cnf) {
                await fetch('/api/getAnggotaGroup/' + id)
                .then((res) => { return res.json() })
                .then((data) => {
                    this.groupmember = data.data[0];
                    this.groupmember.members.forEach(g => {
                        this.selected.push(g.id);
                    });

                    return fetch('/api/deleteGroup', {
                        method: 'delete',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({id: id})
                    });
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => console.error(error));
                
                for (let i = 0; i < this.selected.length; i++) {
                    await this.updateGroupMember(1, this.selected[i]);
                }
                
                alert('Terhapus');

                this.emptyAll();
                this.listGroupsMember();
            }
        },
        toggleForm: function () {
            this.open = !this.open;
            if (!this.open) {
                this.emptyAll();
            }
        },
        editGroup: function (id) {
            fetch('/api/getAnggotaGroup/' + id)
            .then((res) => { return res.json() })
            .then((data) => {
                this.groupmember = data.data[0];
                this.groupmember.members.forEach(g => {
                    this.selected.push(g.id);
                });
            })
            .catch((err) => console.error(err));
            this.open = !this.open;
        },
        saveGroup: async function (id) {
            if (id) {
                await fetch('/api/updateGroup', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.groupmember)
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => console.error(error));

                for (let i = 0; i < this.selected.length; i++) {
                    await this.updateGroupMember(id, this.selected[i]);
                }

                await this.notSelected();
                
                for (let i = 0; i < this.unselected.length; i++) {
                    await this.updateGroupMember(1, this.unselected[i]);
                }
            } else {
                await fetch('/api/saveGroup', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.groupmember)
                })
                .then((res) => { return res.json() })
                .then((res) => {
                    console.log(res);
                    this.lastid = res.last_id;
                })
                .catch((error) => console.error(error));

                for (let i = 0; i < this.selected.length; i++) {
                    await this.updateGroupMember(this.lastid, this.selected[i]);
                }
            }

            this.emptyAll();

            this.open = !this.open;
            this.listGroupsMember();
        },
        updateGroupMember: function (gid, id) {
            fetch('/api/saveAnggotaGroup', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_group: gid,
                    id: id
                })
            })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => console.error(error));
        },
        notSelected: function () {
            this.unselected = this.groupmember.members.filter(u => {
                return this.selected.indexOf(u.id) < 0;
            }).map(uu => {
                return uu.id;
            })
        },
        emptyAll: function() {
            this.groupmember = {};
            this.selected = [];
            this.unselected = [];
            this.lastid = null;
        }
    }
});
