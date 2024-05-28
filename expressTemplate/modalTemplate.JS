
function modalTemplate(route,row,ID) {
var modalExport = '';
var fieldTableRoute = `this.${ID} = ${route}.${ID};\n`;

// ---------------------------------------------------------------------------------------
// Query List
// ---------------------------------------------------------------------------------------

var keyString = '${key}';
var kutipString ='`';
var likeQuery = `WHERE ${ID} = "${keyString}" OR `
var fieldLikeQuery  = ``;

var updateQuery = ``;

var updateField = `[${route}.${ID},`;

// count pencarian
var countPencarianQuery = `SELECT COUNT(*) AS jumlah FROM ${route} `;

// Pencarian Data
var pencarianQuery = `SELECT * FROM ${route} `

// get All Data
var getAllData = `SELECT * FROM ${route}`

// get Pagination
var getPagination = `SELECT * FROM ${route} ORDER BY ${ID} DESC LIMIT `+'${offset}, ${limit}';

// find by ID
var findById = `SELECT * FROM ${route} WHERE ${ID} = `+' ${ID}'

// insert
var insert = `INSERT INTO ${route} SET ?`

// update
var update = `UPDATE ${route} SET ${ID} = ?,`;

// delete
var deleteData = `DELETE FROM ${route} WHERE ${ID} = ?`


// ---------------------------------------------------------------------------------------

for (let i = 0; i < row ; i++) {    
    // ${route}Name: req.body.${route}Name
    let fieldName = $(`#field${i+1}`).val();

    fieldTableRoute += `this.${fieldName} = ${route}.${fieldName};\n`; // field table route
    // 
    updateField += `${route}.${fieldName},`

    // Query List
    // ---------------------------------------------------------------------------------------
    // fieldLike Query
    fieldLikeQuery += `${fieldName} LIKE `;
    fieldLikeQuery += '"%${key}%"' ;

    // update Query
    updateQuery += `${fieldName} = ? `;

    // if last field not use OR
    if (i != row-1) fieldLikeQuery += ' OR ';

    // if last field not use ,
    if (i != row-1) updateQuery += ', ';
    
    
}

likeQuery += fieldLikeQuery;
countPencarianQuery += likeQuery;
pencarianQuery += likeQuery+' LIMIT ${offset}, ${limit}';

update += updateQuery+` WHERE ${ID} = ?`;
updateField += `${ID}]`;

console.log(update);

var begining = `
const sql = require("../config/database");
const ${route} = function (${route}) {
   ${fieldTableRoute}
};`

modalExport += begining;

// jumlah total data  
// ---------------------------------------------------------------------------------------
var countAllData = `

// ---------------------------------------------------------------------------------------
// model menampilkan jumlah semua data di tabel
${route}.jumlah = (result) => {
    sql.query('SELECT COUNT(*) AS jumlah FROM ${route}', (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
`
modalExport += countAllData;


// Jumlah Total Pencarian Data
// ---------------------------------------------------------------------------------------
var countSearchData = `
//model menampilkan jumlah semua data di tabel
${route}.jumlahPencarian = (key, result) => {
    sql.query(${kutipString} ${countPencarianQuery} ${kutipString}, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
`
modalExport += countSearchData;

// pencarian data
// ---------------------------------------------------------------------------------------
var searchData = `
//--------------------------------------------------------------------------------------
//model menampilkan semua data di tabel
${route}.pencarian = (key, offset, limit, result) => {
    var dataAll = [];
    sql.query(${kutipString} ${pencarianQuery} ${kutipString}, (err, res1) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        dataAll.push(res1);
        sql.query(${kutipString} ${countPencarianQuery} ${kutipString}, (err, res2) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            dataAll.push(res2[0]);
            result(null, dataAll);
        });
    });
};
`;

modalExport += searchData;

var getAll = `
// get All Data
// ---------------------------------------------------------------------------------------
${route}.getAll = (result) => {
    sql.query("${getAllData}", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};
`;
modalExport += getAll;

// get Pagination
// ---------------------------------------------------------------------------------------
var getPagination = `
//--------------------------------------------------------------------------------------
//model menampilkan semua data di tabel per limit
${route}.getPagination = (offset, limit, result) => {
    var dataAll = [];
    sql.query(${kutipString} ${getPagination} ${kutipString}, (err, res1) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      dataAll.push(res1);
      sql.query('SELECT COUNT(*) AS jumlah FROM ${route}', (err, res2) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        dataAll.push(res2[0]);
        result(null, dataAll);
      });
    });
};
`;

modalExport += getPagination;

// find by id
// ---------------------------------------------------------------------------------------
var findById = `

//--------------------------------------------------------------------------------------
//model menampilkan data per id
${route}.findById = (${ID}, result) => {
    sql.query(${kutipString} ${findById} ${kutipString}, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("data ${route}: ", res[0]);
            result(null, res[0]);
            return;
        }
        result(null,[]);
    });
};
`

modalExport += findById;

// insert
// ---------------------------------------------------------------------------------------
var insertData = `
//--------------------------------------------------------------------------------------
//model insert data ke tabel
${route}.create = (new${route}, result) => {
    sql.query("${insert}", new${route}, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("berhasil : ", { ID: res.insertId, ...new${route} });
        result(null, { ID: res.insertId, ...new${route} });
    });
};
`
modalExport += insertData;

// update
// ---------------------------------------------------------------------------------------
var updateData = `
//--------------------------------------------------------------------------------------
// model update data
${route}.updateById = (${ID}, ${route}, result) => {
    sql.query(
        "${update}",
         ${updateField},
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "tidak ada data" }, null);
                return;
            }
            console.log("update data.. : ", { ID: ${ID}, ...${route} });
            result(null, { ID: ${ID}, ...${route} });
        }
    );
};`;

modalExport += updateData;

// Delete
// ---------------------------------------------------------------------------------------
var deleteData = ` 
//--------------------------------------------------------------------------------------
// hapus data per-id
${route}.remove = (${ID}, result) => {
    sql.query('${deleteData}', ${ID}, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "tidak ada data" }, null);
            return;
        }
        console.log("terhapus data ID : ", ${ID});
        result(null, res);
    });
};
`


modalExport += deleteData;

var ending =`module.exports = ${route};`
modalExport += ending;

return modalExport;
    
}
