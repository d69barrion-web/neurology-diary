/* ==========================================
   backup.js
   Neurology Diary v2
   Backup & Restore Manager
========================================== */

/* ==========================================
   CONFIG
========================================== */

const BACKUP_FILE_PREFIX = "neurology-diary";

/* ==========================================
   EXPORT BACKUP
========================================== */

function exportBackup() {

    const records = getRecords();

    const backup = {

        app: "Neurology Diary",

        version: "2.0",

        createdAt: new Date().toISOString(),

        recordCount: records.length,

        records: records

    };

    const json =
        JSON.stringify(backup, null, 2);

    const blob = new Blob(
        [json],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const date =
        new Date().toISOString().split("T")[0];

    a.href = url;

    a.download =
        `${BACKUP_FILE_PREFIX}-${date}.json`;

    a.click();

    URL.revokeObjectURL(url);

    alert("✅ Backup downloaded.");

}

/* ==========================================
   OPEN FILE PICKER
========================================== */

function chooseBackupFile() {

    document
        .getElementById("backupFile")
        .click();

}

/* ==========================================
   READ FILE
========================================== */

function importBackup(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {

        try {

            const backup =
                JSON.parse(e.target.result);

            validateBackup(backup);

        }

        catch {

            alert("❌ Invalid JSON file.");

        }

    };

    reader.readAsText(file);

}

/* ==========================================
   VALIDATION
========================================== */

function validateBackup(backup) {

    if (!backup.app) {

        alert("Invalid backup.");

        return;

    }

    if (!backup.records) {

        alert("No records found.");

        return;

    }

    if (!Array.isArray(backup.records)) {

        alert("Records must be array.");

        return;

    }

    previewImport(backup);

}

/* ==========================================
   PREVIEW
========================================== */

function previewImport(backup) {

    const existing =
        getRecords();

    let duplicate = 0;

    let newRecords = 0;

    backup.records.forEach(record => {

        const found = existing.find(r =>

            r.date === record.date &&
            r.time === record.time &&
            r.notes === record.notes

        );

        if (found)
            duplicate++;
        else
            newRecords++;

    });

    const message =

`Backup Information

App:
${backup.app}

Version:
${backup.version}

Created:
${backup.createdAt}

Records:
${backup.recordCount}

New:
${newRecords}

Duplicate:
${duplicate}

Press OK to continue.`;

    if (confirm(message)) {

        const mode =
            document.querySelector(
                'input[name="importMode"]:checked'
            )?.value || "merge";

        if (mode === "replace") {

            replaceImport(backup.records);

        }

        else {

            mergeImport(backup.records);

        }

    }

}

/* ==========================================
   REPLACE
========================================== */

function replaceImport(records) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(records)
    );

    renderHistory();

    if (typeof refreshCalendar === "function")
        refreshCalendar();

    if (typeof refreshCharts === "function")
        refreshCharts();

    alert(
        `✅ ${records.length} records restored.`
    );

}

/* ==========================================
   MERGE
========================================== */

function mergeImport(imported) {

    const existing =
        getRecords();

    let added = 0;

    let skipped = 0;

    imported.forEach(record => {

        const duplicate = existing.find(r =>

            r.date === record.date &&
            r.time === record.time &&
            r.notes === record.notes

        );

        if (!duplicate) {

            existing.push(record);

            added++;

        }

        else {

            skipped++;

        }

    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(existing)
    );

    renderHistory();

    if (typeof refreshCalendar === "function")
        refreshCalendar();

    if (typeof refreshCharts === "function")
        refreshCharts();

    alert(

`Import Complete

Added:
${added}

Skipped:
${skipped}`

    );

}

/* ==========================================
   CLEAR ALL DATA
========================================== */

function clearAllRecords() {

    if (!confirm(
        "Delete ALL records?"
    )) return;

    localStorage.removeItem(STORAGE_KEY);

    renderHistory();

    if (typeof refreshCalendar === "function")
        refreshCalendar();

    if (typeof refreshCharts === "function")
        refreshCharts();

    alert("All records deleted.");

}

/* ==========================================
   CREATE UI
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const footer =
        document.querySelector("footer");

    if (!footer) return;

    const card =
        document.createElement("div");

    card.className = "backup-card";

    card.innerHTML = `

<h2>💾 Backup & Restore</h2>

<button onclick="exportBackup()">
Download Backup
</button>

<br><br>

<input
type="file"
id="backupFile"
accept=".json"
style="display:none"
onchange="importBackup(event)">

<button onclick="chooseBackupFile()">
Choose Backup File
</button>

<br><br>

<label>

<input
type="radio"
name="importMode"
value="merge"
checked>

Merge

</label>

<label style="margin-left:20px;">

<input
type="radio"
name="importMode"
value="replace">

Replace

</label>

<br><br>

<button
style="background:#c0392b;color:white"
onclick="clearAllRecords()">

Delete All Records

</button>

`;

    footer.parentNode.insertBefore(
        card,
        footer
    );

});
