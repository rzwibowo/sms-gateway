//#region Number operations
function listNumbers (con) {
    con.query("SELECT * FROM numbers", function (err, result) {
        if (err) throw err;
        const data = result;
        console.table(data);
        return data;
    });
}

function getNumber () {
    
}

function saveNumber () {

}

function deleteNumber() {

}

exports.listNumbers = listNumbers;
//#endregion

//#region Group operations
function listGroups () {

}

function getGroup () {

}

function saveGroup () {

}

function deleteGroup () {

}
//#endregion

//#region Template operations
function listTemplates () {

}

function getTemplate () {

}

function saveTemplate () {

}

function deleteTemplate () {

}
//#endregion

//#region History operations
function listHistory () {

}

function getHistory () {

}

function saveHistory () {

}

function deleteHistory () {

}
//#endregion

//#region User operations
function listUsers () {

}

function getUser () {

}

function saveUser () {

}

function deleteUser () {

}
//#endregion
