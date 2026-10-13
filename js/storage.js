/* ==========================================
   storage.js
   Neurology Diary v2
========================================== */

const STORAGE_KEY = "neurologyDiaryRecords";

/* ------------------------------
   Load Records
------------------------------ */
function loadRecords() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) return [];

        return JSON.parse(data);

    } catch (err) {
        console.error("Load Error:", err);
        return [];
    }
}

/* ------------------------------
   Save Records
------------------------------ */
function saveRecords(records) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(records)
    );

}

/* ------------------------------
   Get All Records
------------------------------ */

function getRecords() {

    return loadRecords();

}

/* ------------------------------
   Add Record
------------------------------ */

function addRecord(record) {

    const records = loadRecords();

    record.id = Date.now();

    records.push(record);

    saveRecords(records);

}

/* ------------------------------
   Update Record
------------------------------ */

function updateRecord(id, updatedRecord) {

    let records = loadRecords();

    records = records.map(record => {

        if (record.id == id) {

            return {
                ...updatedRecord,
                id:id
            };

        }

        return record;

    });

    saveRecords(records);

}

/* ------------------------------
   Delete Record
------------------------------ */

function deleteRecord(id){

    const ok = confirm(
        "Delete this record?"
    );

    if(!ok) return;

    let records = loadRecords();

    records = records.filter(
        r => r.id != id
    );

    saveRecords(records);

    if(typeof renderHistory==="function")
        renderHistory();

}

/* ------------------------------
   Clear All
------------------------------ */

function clearRecords(){

    const ok = confirm(
        "Delete ALL records?"
    );

    if(!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    if(typeof renderHistory==="function")
        renderHistory();

}

/* ------------------------------
   Export JSON
------------------------------ */

function exportJSON(){

    const records = loadRecords();

    const blob = new Blob(

        [JSON.stringify(records,null,2)],

        {
            type:"application/json"
        }

    );

    const link = document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "neurology-diary.json";

    link.click();

}

/* ------------------------------
   Import JSON
------------------------------ */

function importJSON(file){

    const reader =
        new FileReader();

    reader.onload=function(e){

        try{

            const records =
                JSON.parse(e.target.result);

            saveRecords(records);

            if(typeof renderHistory==="function")
                renderHistory();

            alert("Import Successful");

        }

        catch{

            alert("Invalid JSON File");

        }

    }

    reader.readAsText(file);

}

/* ------------------------------
   Export CSV
------------------------------ */

function exportCSV(){

    const records = loadRecords();

    if(records.length===0){

        alert("No records found.");

        return;

    }

    const headers = Object.keys(records[0]);

    let csv = headers.join(",") + "\n";

    records.forEach(record=>{

        const row = headers.map(h=>{

            return `"${record[h] ?? ""}"`;

        });

        csv += row.join(",") + "\n";

    });

    const blob = new Blob(

        [csv],

        {

            type:"text/csv"

        }

    );

    const link = document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "neurology-diary.csv";

    link.click();

}

/* ------------------------------
   Count Records
------------------------------ */

function countRecords(){

    return loadRecords().length;

}

/* ------------------------------
   Find Record
------------------------------ */

function findRecord(id){

    return loadRecords().find(

        r=>r.id==id

    );

}
