
var route = ''; // route menurut nama table
var jumlahRow = '';
var controllerLoaded = false; // Tambahkan variabel global untuk menandakan apakah file controllerTemplate.JS telah dimuat
var fieldList = [];
var lastID = 0;
var tableShowed = '';

// on load page
$(document).ready(function() {

    // check if localstorage is empty
    if (localStorage.length == 0) {
        // set default localstorage
        let defaultData = [];
        localStorage.setItem("keyData", JSON.stringify(defaultData));
    }
  
    getDataLocal();

});



function saveSetting() {


    let namaProject = $('#namaProject').val();
    let portProject = $('#portProject').val();
    let hostDatabase = $('#hostDatabase').val();
    let userDatabase = $('#userDatabase').val();
    let passwordDatabase = $('#passwordDatabase').val();
    let namaDatabase = $('#namaDatabase').val();

    var configApp = {
        "project": {
            "name": namaProject,
            "port": portProject
        },
        "database": {
            "host": hostDatabase,
            "user": userDatabase,
            "password": passwordDatabase,
            "database": namaDatabase
        }
    }


    localStorage.setItem("configApp", JSON.stringify(configApp));
    getDataLocal();
    
}

function next() {

        jumlahRow = $("#jumlahRow").val();
        route = $("#namaTable").val();



    for (let i = 0; i < jumlahRow; i++) {
        $("#field").append(`
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Field ${i+1}</label>
                <input type="text" class="form-control" id="field${i+1}" placeholder="Masukan Nama Field ${i+1}">
            </div>
        `)
   
    }


    $("#field").removeClass("hidden");
}

function save() {

    let getController = controllerTemplate(route, jumlahRow, $("#fieldPrimary").val());
        getController = '<pre><code class="javascript">' + getController + '</code></pre>';

        console.log(jumlahRow);
    let getModal = modalTemplate(route, jumlahRow, $("#fieldPrimary").val());
        getModal = '<pre><code class="javascript">' + getModal + '</code></pre>';

  

    // for field table
    for (let i = 0; i < jumlahRow; i++) {
        let jml = i+1;
        let getfield = $('#field'+jml).val();

        fieldList.push(getfield);
    }

    console.log(fieldList);
    
    addDataLocal(getModal, getController);

    // // refresh data
    setTimeout(() => {
        return refresh();
    }, 500);

    
 }

 function refresh() {
    $("#listTables").html('');
    $("#field").html('');
    $("#field").addClass("hidden");
    $("#tambahTable").modal('hide');
    $("#fieldPrimary").val('');
    $("#field").val('');
    $("#jumlahRow").val('');
    $("#namaTable").val('');
    $("#tambahTable").modal('hide');

    // refresh
    getDataLocal();

 }

 function getDataLocal() {

    // get config localstorage
    let configStorage = localStorage.getItem("configApp");
    // output : {"project":{"name":"merpaikoding","port":"4000"},"database":{"host":"localhost","user":"root","password":"''","database":"merapikoding"}}
    configStorage = JSON.parse(configStorage);

    $("#textProjectName").text(configStorage.project.name);
    $("#textPort").text(configStorage.project.port);
    $("#textHost").text(configStorage.database.host);
    $("#textUser").text(configStorage.database.user);
    $("#textPassword").text(configStorage.database.password);
    $("#textDatabase").text(configStorage.database.database);

    $('#namaProject').val(configStorage.project.name);
    $('#portProject').val(configStorage.project.port);
    $('#hostDatabase').val(configStorage.database.host);
    $('#userDatabase').val(configStorage.database.user);
    $('#passwordDatabase').val(configStorage.database.password);
    $('#namaDatabase').val(configStorage.database.database);



    console.log(configStorage);

    
    
    // get last id
    lastID = localStorage.getItem("lastID");
    lastID = lastID == null ? 0 : lastID;

    if (lastID == 0) {
        $("#listTables").html('no data');
    }

    //get array keydata on local storage
    let keyDataStorage = localStorage.getItem("keyData");

    if (keyDataStorage != null) {
        keyDataStorage = JSON.parse(keyDataStorage);
        for (let i = 0; i < keyDataStorage.length; i++) {
            let data = JSON.parse(localStorage.getItem(keyDataStorage[i]));
            let listTable = `
                <li class="list-group-item mt-2" id="listTable_${data.id}" >
                    ${data.table}
                    <a onclick="deleteTable(${data.id})" class="btn btn-danger btn-sm float-end">Delete</a>
                 
                    <button onclick="showTable(${data.id})" class="btn btn-secondary btn-sm float-end me-2">Show Code</button>
                </li>
            `;

            $("#listTables").append(listTable);

        }
    }
    

 }

 function deleteTable(key) {
    localStorage.removeItem("dataCRUd_"+key+"");
    // delete key on array keyData
    let keyDataStorage = localStorage.getItem("keyData");
    keyDataStorage = JSON.parse(keyDataStorage);
    
    keyDataStorage = keyDataStorage.filter(function(item) {
        return item !== "dataCRUd_"+key+"";
    });

    console.log('------------------------');
    console.log(keyDataStorage);

    // update localStorage
    localStorage.setItem("keyData", JSON.stringify(keyDataStorage));

   return refresh();

 }

 function showTable(key) {
    // remove class
    $('#tableDetail').removeClass('hidden');
    $('#codeEditor').removeClass('hidden');

    // get data
    let data = JSON.parse(localStorage.getItem("dataCRUd_"+key+""));
    let getController = data.code.controller;
    let getModal = data.code.modal;

    tableShowed = data.table;
    $('#namaModel').text(data.table+'_model.js');
    $('#namaController').text(data.table+'.js');

    $("#exportedController").html(getController);
    $("#exportedModel").html(getModal);
    hljs.highlightAll(); // Apply syntax highlighting
    let getTable = '';
    // list filed table listFieldTables
    for (let i = 0; i < data.jumlahRow; i++) {
        let getFieldList = data.dataTable.field[i];
        let jml = i+1;
        getTable += `
        <tr>
                <td>${jml}</td>
                <td>${getFieldList}</td>
            </tr>
        `
    }

    $("#titleTable").text(data.table);
    $("#listFieldTables").html(getTable);

 }

 function showCodeProject() {
    let configStorage = localStorage.getItem("configApp");
    configStorage = JSON.parse(configStorage);



    $('#codeEditorProject').removeClass('hidden');

    // show code of database.js
    let codeDatabase = DatabaseTemplate(configStorage);
    codeDatabase = '<pre><code class="javascript">' + codeDatabase + '</code></pre>';
   
    // show code of index.js
    let codeIndex = IndexTemplate(configStorage);
    codeIndex = '<pre><code class="javascript">' + codeIndex + '</code></pre>';

    // show code of package.json
    let codePackage = packageJsonTemplate(configStorage);
    codePackage = '<pre><code class="javascript">' + codePackage + '</code></pre>';

    
    $("#exportedPackage").html(codePackage);
    $("#exportedIndex").html(codeIndex);
    $("#exportedDatabase").html(codeDatabase);

    // jika pakai table authentication
    let authStorage = localStorage.getItem("configAuth");
    if (authStorage != null) {
        authStorage = JSON.parse(authStorage);
        let codeAuth = AuthenticationTemplate(authStorage.auth.field, authStorage.auth.table);
        codeAuth = '<pre><code class="javascript">' + codeAuth + '</code></pre>';
        $("#exportedAuthTable").html(codeAuth); // table user authentication
    }


    hljs.highlightAll();


 }

 function addDataLocal(getModal, getController) {
    let key  = Number(lastID)+1;
    
    
    var data = {
        id: key,
        table: route,
        jumlahRow: jumlahRow,
        dataTable:{
            primary: $("#fieldPrimary").val(),
            field: fieldList
        },
        code:{
            controller: getController,
            modal: getModal
        }
    }

    // get keydata on local storage
    let keyDataStorage = localStorage.getItem("keyData");

    let newKey = "dataCRUd_"+key+"";

    if (keyDataStorage == null) {
        localStorage.setItem("keyData", newKey);
    } else {
        keyDataStorage = JSON.parse(keyDataStorage);
        localStorage.setItem("keyData", JSON.stringify([...keyDataStorage, newKey]));
    }


    localStorage.setItem(newKey, JSON.stringify(data));
    localStorage.setItem("lastID", key);

 }


 
/*
                        .:.      .           :+***=              .-++=:   .-+++**:==+:.  .*%+-++++++++++++++#*++++++++++
                       .:::              .  =****=             .-++++-:...:-++++*--+++=...-#%-=++++++++++++++#*+++++++++
                         .:             -:.+****+            .-++++++-+=:--=+++++=-+++++---#%*-++++++++++++++*%*++++++++
                    .      .          :+.:*++**+  :         :==+++++++*+===+++++++=*+++++++*%%-+++++++++++++++*#*+++++++
                        .            =*.:++++**..=-.      .---=++++++*++++=++++++++*+++++++*#%+-+++++++++++==++##+++++++
                      .:           .*+ :++++**-.++::     :=-::-++++++*++++=*+++++++*+++++++*#%%-+++++=+++==-==++%*++++++
                    .:.   :.      :#+..++++**+.+*=-.   .-=--:---=+++**===+=+==+++++*++++++++##%=+++==--=-----=++*#*+++++
              .    -:   :+-      -#*..=+++***.+**=-   .==-----------+=---+*=------+*==++++=+*#%+==-===----==+++++##*++++
             .   :+.  .+*=   .  =**: =+++***=-***+-  .===+++--------*---=+%-------+*=----===*#%#---=+==-==+++++++*#*++++
           .   .+=   :*+=. .-. -**= -++++***:****+: .=+++++++++++++**+=++*#=====+=+*=---====+##%=++++++=++++++++++%**+++
          .   -+:   =*++. :=. :**+.:++++***=+***++: -+++++++++++++***++++#*+++***+**+===+++++*#%+++++++++++++++**+##**++
         .  .--.  .***+-.-+. :**+=.=+++****=*+++++:.=++++++++++++******+*%++++*****#+++++++++*#%+++++++++++++++*#++%****
       ..  ..:   .***++:=+. .+*++-=+++***#*+++++++-:=++++++++++****#*****%++*******%+++++++++*#%*++++++++++++++*##+%****
      .   : .   .***++=++. .+*++=-==+***%#++++++++=:=+++***++***********%#+*******#%*+++++++**##*++++++++++++++*##**#***
     .  .. .    ***+++++. .+*++====++*#%+#=++++++++-=++***********#*****@*********%%*+++++++**##*++++++++++++++*###+%***
    .  .. .    +***++++-  +*++=====+*#=--*+**#*++++--+++***************%%********##%*+++++++**##++++++++++++++**###*%***
   .  .  .    -****+++=  -**+======**:::-*+++#+++++=:+++******++*#+****@*********%-%***+++++**##++++++++==++++**######**
  .  .  ..    #****+++. .#*+==--=+++::::=*+++#++++++:=+++***+++***+***%@**********:#****+++***##++++++++--++++**%###*#**
 .  :   :    +****+++- .+*+=----+=+:::..++++*#++++++--+++++++++*#+***#@%#*******#--+#*********##++++++++-.=++***%###*%**
.  :   .    .@#***+++ .-#*=----==+-::.  *=++##++++++=:=++++++++#*+***%@*****####+-:=#*********##++++++++-.=+****%#####**
  :    .    *@****+*:.-**+----=#==--.   *-=+%%++++++==:+++++++*#++++#*%*+++++**#**=-%*********##+++++**+=-#*****%####*#*
 :    .    .@%****++ -=#*=---=#**+#*-::-#-=+#%=+=+++++=-++++++#+++++*+*++++=+**=::=*%*********#*++*+=--==+#+****%####*#*
..    .    +@#*****-.-+#+--=+%%%@@@@@*-.+===+%==-++++++=-++++#+===+*-#+=====+++: :--=**##*****%*=-::-=*++*=-****%####*#*
:    .     %@##****.-=**++**@@@@@%#%@@@*+--+=*==-=+++++++==+#=====*-+*===---=*:  .:--*+**###+=-:--+*##%**%.:****@%###*#*
     :    .@@%**##+.-=#==++%@+:--..*@@@@@+-===*---=-+++++++*=----+--#==-----+:    :--+++*+--=+==#%#**#*++* :****@@####*#
     :    =@@@####=:-=%---+%@+..-..%@@@@@#=+-:*-------=+=++-----+-:+=----=-=:      :-=+:.:-+#***#*****++*= .****@@####+#
     .    #@@@####-:-=%--*#*#*    .@@@@@@@++=:+=--------+===---+-:-+--==*=+-.      .:=-:-+##%**%%#%%%#+++. :***#@@%###+#
    ..    %@@@###%:-==@-+%%%-+    .@@@@@@@*==..*------=+=*---=+-:.+----*=+:::---=--.::-*+=+#***%*****-     -***%@@@###+#
    ..    @@@@%##%.-==@+%@@@-:.    -*@@@@@@==  -=---=+=++---+=:. =---+%*%@#####*%%***++=*-=+++##*****      =***@@@@###+#
     :    @@@@%%#%:-==@#@@@@:.:    *@**=+*#+=   +--=--==--==:. .===+%@%%#@@@@@@@@@@@@@%##*=+*#%****#=     .****@@@@###+#
     -    %@@@@@#%---=@@@@@%...-.  :%-:.::-.-.  .+--=+--=++.  :==++==:..=@@@@@@@@@@@@@@@%%#+#*****#%.   . -***%@%%@%##+*
    --    %@@@@@##+---%@@@@* .......=+-:.:   .   :===-==-=:  :::.    ..:@@@@@@@@@@@@@@@@@@@%#=***#@=     .+***@@##@%#*+*
   -=:    *@@@@@###---*@@@@: ......             .:=-==---=             -@@@@@@@@@@@@@@@@%@@@#+**#@*  .. .-***#@%##%%%++*
 :-==.    -@@@@@##@*--=@@@%  ......             .  .-*---:             .-*#%*%@@@@@@@@%@-:+%*#%%@#  .....#***@@###%@%++*
--=- .    .@@@@@#%@@+--#@@=  .....                   -==-.             =%=--==***#@@@@@*.:*###@@#:......##**#@#####@*++*
--.  .     #@@@@%@@@@+-=@%.           .                .-.             :%-....:-=++@@%- -%%#@@@+:......*@#**@%#####%+++#
     :     -@@@@@@@@@@*-+#                                              =+--...:=*#+.  -+##@@@#-......+@%**%%######*+++#
     .  .   #@@@@@@@@@@#==:                                          ......:-+*+-:.-...-@@@@@#:......+@%**#%#######+*+*#
     .   .  .@@@@@@@@@%%%*=-                                       ..................:*@@@@#-.......*%%#**%###*##%*#++*%
     .    =  -@@@@@%@@%%%%+.:.                                     ...............:=#@@@@+:..    .-%%%#*+%%##**#%*#*++*%
      :   ##  -@@@@@@%%%#*..                                        ..........:=*%@@@%+-..      :#%%%#++#%###*#%##**+*##
      :   +@%- -%@@@@%%%#: ..                                         :=+*##%@@@%#*=.         -*%###*++##%##*#@#****+*%*
       :  .@@@#=:*%%%%%##   :.                                           ........:.        :+##**##*++%%%####%#*******#*
       ..  *@@@@%**#%%%#*    ::           .:.                               .::        :=*#**++*##+++#@#%#***#*******%**
        :  .@@@@%%%%%#%%*    .-:                                        .:::.    ..::-#**+++++***++#*+%###***#****#*#**#
         -  =@@%%######%#    .:.=                                    ..:....:::...  .**+==++***++*#*:##%#***##***#*##**#
          :. *@%######%=#.   :. -+:                                                :#*===+*#*++*##*-+%##***##****##****#
           .-.+######%%:+-   :. --==                                              :*+--=**++*###*%@@@##*+**##**#%#****#*
            -:==######%..*   -. :-=%#.                                           =*===+++**#**#*%%%@%##+**##**##******#*
            : +#######%  =:  -  ::=%@%:                                      .:-**+=====+****#*%%%@@**+***%**********##*
            .. *#######   +  -  ..+%@%%=                                ..::::-+------=+++**#*%%%%@***+**##**********##*
         .   . :*######    - -  ..*@@%%%+                        ...:::---:::==------==++****@%%%%%**+**#%#**********##*
         .  . .:=+#####     :=    +@@%%%%*-:::..::::---===--------------:::-+--------==+**+*@%%%%%++++*#@%#**********##*
         .  .  .-++*##%      -    +@@%%%%%%%%%%%%%%%####%%=-----------::::==-=+-----==++*+***+=*%#+++**#@@#*********###*
          . .  ..-****#.    .:    *@%%%%%%%#####%%%#######%--------:::::==-=*+----===++++*=::::=@++++**@%@#+********###*
          . .   .:-***#-    :.    *@%%%%%%%#####%%%#########-----::::-==-=+*+----===++++#*=-==--%=++=*#@%@#++*******###*
           . .    -=***=    :     *%%#@%%%%%####%%#####%#+=*=--:::-=======*+---===+++=++-----::===+=+*%@%@#++*******###*
            ..     .=***    :   . *%%#+%%%%%####%%###%#+====*-=======--=+*=--====++=++------:::=::=-**@%%@#++*******###*
             ..      -**=   :   :.*%##:%#%%%####%%####+=====#-::::::==--+--=======+=--::----:::=..--**@%%%%+++******###*
               .      .=*: .:   -:*##+:##%%%%###%%##%=+=====*+:::-==:.==-=====-==+--:::----:::+:..-=*#%#%%@*+++*****###*

  */