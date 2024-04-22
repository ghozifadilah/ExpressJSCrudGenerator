
function controllerTemplate(route,row,ID) {
var controllerExport = '';
var field = '';


for (let i = 0; i < row ; i++) {
    // ${route}Name: req.body.${route}Name
    let fieldName = $(`#field${i+1}`).val();
    field += `${fieldName}: req.body.${fieldName},\n`; // field untuk insert
}

var begining = `
module.exports = app => {
    const ${route} = require("../model/${route}_model");
`

controllerExport += begining;

// Get Data
// ---------------------------------------------------------------------------------------
var controllerGetData = `
//--------------------------------------------------------------------------------------
// controller temukan semua data
app.get("/${route}", (req, res) => {
    const { page = null, limit = null } = req.query;
    if (page != null) {
        const offset = (page - 1) * limit;
        ${route}.getPagination(offset, limit, (err, data) => {
                if (err)
                res.status(500).send({
                    message:
                    err.message || "ada beberapa yang error."
                });
                else res.send(data);
            });
    } else {
        ${route}.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "ada beberapa yang error."
                });
            else res.send(data);
        });
    }
});
`
controllerExport += controllerGetData

// Search Data
// ---------------------------------------------------------------------------------------
var controllerSearchData = `
//--------------------------------------------------------------------------------------
// controller temukan data dengan key
app.get("/${route}/pencarian", (req, res) => {
    const { page = 1, limit = 20, key = null } = req.query;
    const offset = (page - 1) * limit;
    ${route}.pencarian(key, offset, limit, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "ada beberapa yang error."
            });
        else res.send(data);
    });
});
`
controllerExport += controllerSearchData

// Jumlah Data
// ---------------------------------------------------------------------------------------
var controllerJumlahData = `
//--------------------------------------------------------------------------------------
// controller jumlah data
app.get("/${route}/total", (req, res) => {
    ${route}.jumlah((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "ada beberapa yang error."
            });
        else res.send(data);
    });
});
`
controllerExport += controllerJumlahData

// Total pencarian
// ---------------------------------------------------------------------------------------
var controllerTotalPencarian = `
//--------------------------------------------------------------------------------------
// controller jumlah data dengan key
app.get("/${route}/totalPencarian", (req, res) => {
    const { key = null } = req.query;
    ${route}.jumlahPencarian(key, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "ada beberapa yang error."
            });
        else res.send(data);
    });
});
`
controllerExport += controllerTotalPencarian


// Get data per-id
// ---------------------------------------------------------------------------------------
var controllerGetId = `
//--------------------------------------------------------------------------------------
// controller temukan data per-id
app.get("/${route}/:${ID}", (req, res) => {
    ${route}.findById(req.params.${ID}, (err, data) => {
        if (err) {
            if (err.kind === "tidak_ada") {
                res.status(404).send({
                    message: 'tidak ada data dengan id ${ID}.'
                });
            } else {
                res.status(500).send({
                    message: "error tidak ada data dengan id : ${ID}" 
                });
            }
        } else res.send(data);
    });
});`
controllerExport += controllerGetId


// Post Data
// ---------------------------------------------------------------------------------------
var controllerPostData = `
//--------------------------------------------------------------------------------------
// controller buat dan simpan data
app.post('/${route}', async (req, res) => {
    // validasi
    if (!req.body) {
        res.status(400).send({
            message: "form tidak boleh kosong!"
        });
    }
    // buatdata
    const ${route}Post = new ${route}({
        ${field}
    });
    
    // simpan data ke tabel  
    ${route}.create(${route}Post, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "ada beberapa yang error."
            });
        else res.send(data);
    });
});
`
controllerExport += controllerPostData

// Put Data
// ---------------------------------------------------------------------------------------
var controllerPutData = ` // --------------------------------------------------------------------------------------
// controller update data ${route}
app.put("/${route}/:${ID}", async (req, res) => {
    // validasi
    if (!req.body) {
        res.status(400).send({
            message: "form tidak boleh kosong!"
        });
    }
    //update per-id
    ${route}.updateById(
        req.params.${ID},
        new ${route}(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "tidak_ada") {
                    res.status(404).send({
                        message: 'tidak ada data  id .'
                    });
                } else {
                    res.status(500).send({
                        message: "tidak bisa update data dengan id :${ID} "
                    });
                }
            } else res.send(data);
        }
    );
});`
controllerExport += controllerPutData

// Delete Data
// ---------------------------------------------------------------------------------------
var controllerDeleteData = ` // --------------------------------------------------------------------------------------
// Delete ${route} data per-id
app.delete("/${route}/:${ID}", (req, res) => {
    ${route}.remove(req.params.${ID}, (err, data) => {
        if (err) {
            if (err.kind === "tidak_ada") {
                res.status(404).send({
                    message: 'tidak ada data dengan id : ${ID}.'
                });
            } else {
                res.status(500).send({
                    message: "tidak bisa hapus data dengan id :${ID} "
                });
            }
        } else res.send({ message: 'data terhapus!' });
    });
});`
controllerExport += controllerDeleteData

var ending = `
};
`
controllerExport += ending;


return controllerExport;
    
}
