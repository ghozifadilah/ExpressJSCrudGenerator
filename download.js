

    // =====================================================================
    // Download Features
    function copyController() {
        // Select the code content
        var codeElement = document.querySelector("#exportedController code");
        var code = codeElement.innerText;

        // Create a textarea element to temporarily hold the code
        var textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);

        // Select and copy the code from the textarea
        textarea.select();
        document.execCommand("copy");

        // Remove the textarea
        document.body.removeChild(textarea);

        // Inform the user that the code has been copied
        alert("Code copied to clipboard!");
    }

    function copyModel() {
        // Select the code content
        var codeElement = document.querySelector("#exportedModel code");
        var code = codeElement.innerText;

        // Create a textarea element to temporarily hold the code
        var textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);

        // Select and copy the code from the textarea
        textarea.select();
        document.execCommand("copy");

        // Remove the textarea
        document.body.removeChild(textarea);

        // Inform the user that the code has been copied
        alert("Code copied to clipboard!");
    }

    function downloadController() {
    // Get the code content
    var codeElement = document.querySelector("#exportedController code");
    var code = codeElement.innerText;

    // Create a Blob containing the code
    var blob = new Blob([code], { type: "text/javascript" });

    // Create a link element to trigger the download
    var link = document.createElement("a");
    link.download = ''+tableShowed+'.js';
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

    function downloadModel() {
    // Get the code content
    var codeElement = document.querySelector("#exportedModel code");
    var code = codeElement.innerText;

    // Create a Blob containing the code
    var blob = new Blob([code], { type: "text/javascript" });

    // Create a link element to trigger the download
    var link = document.createElement("a");
    link.download = ''+tableShowed+'_model.js';
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

//   feature download
function downloadProject() {
    showCodeProject()
    // ambil data kodingan database
    var codeDatabase = document.querySelector("#exportedDatabase code");
        codeDatabase = codeDatabase.innerText;

    // ambil data kodingan index
    var codeIndex = document.querySelector("#exportedIndex code");
        codeIndex = codeIndex.innerText;

    // ambil data kodingan package
    var codePackage = document.querySelector("#exportedPackage code");
    codePackage = codePackage.innerText;
    
    var codeauthTable = document.querySelector("#exportedAuthTable code");
    codeauthTable = codeauthTable.innerText;


let configStorage = localStorage.getItem("configApp");
// output : {"project":{"name":"merpaikoding","port":"4000"},"database":{"host":"localhost","user":"root","password":"''","database":"merapikoding"}}
configStorage = JSON.parse(configStorage);

    // Create a new JSZip instance
    var zip = new JSZip();

    // Add directories to the zip (manually specify)
    zip.folder("project/");
    zip.folder("project/assets/");
    zip.folder("project/public/");


    
    zip.file("project/config/database.js", codeDatabase );
    zip.file("project/index.js", codeIndex );
    zip.file("project/package.json", codePackage );
    
    zip.file("project/controller/login.js", codeauthTable ); // auth table

    // get controller and model code
    let keyDataStorage = localStorage.getItem("keyData");


    if (keyDataStorage != null) {
        keyDataStorage = JSON.parse(keyDataStorage);
        for (let i = 0; i < keyDataStorage.length; i++) {
            let data = JSON.parse(localStorage.getItem(keyDataStorage[i]));
            let getController = data.code.controller;
            let getModal = data.code.modal;
            // cleaning code from  "<pre><code class="javascript"> </code></pre> "
            getController = getController.replace("<pre><code class=\"javascript\">", "");
            getController = getController.replace("</code></pre>", "");

            getModal = getModal.replace("<pre><code class=\"javascript\">", "");
            getModal = getModal.replace("</code></pre>", "");

            zip.file(`project/controller/${data.table}.js`, getController );
            zip.file(`project/model/${data.table}_model.js`,getModal );

        }
    }

     


    // Generate the ZIP file asynchronously
    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            // Use saveAs function to save the generated ZIP file
            saveAs(content, ""+configStorage.project.name+"_crudGenerator.zip");
        })

    .catch(function(error) {
        console.error("Error generating ZIP:", error);
    });

}
