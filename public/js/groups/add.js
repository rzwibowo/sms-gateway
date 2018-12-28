const namaBox = document.querySelector('input[name=nama]');
const simpanBtn = document.querySelector('input[type=button][value="Simpan"]');

simpanBtn.addEventListener('click', saveGrup, false);

function saveGrup() {
    const nama = namaBox.value;

    fetch('/api/saveGroup', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nama: nama})
    })
    .then((res) => console.log(res))
    .catch((error) => console.error(error));
}
