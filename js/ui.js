/* ==========================================
   ui.js
   Neurology Diary v2
   Responsible for:
   - Rendering History Table
   - Dashboard Updates
   - Search Filter
========================================== */

function renderHistory(records = getRecords()) {

    const table = document.getElementById("historyTable");

    if (!table) return;

    table.innerHTML = "";

    if (records.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-muted">
                No records yet.
            </td>
        </tr>
        `;

        updateDashboard([]);
        return;
    }

    // Newest first
    records.sort((a, b) => b.id - a.id);

    records.forEach(record => {

        const tr = document.createElement("tr");

        tr.classList.add("fade-in");

        const resolvedBadge = record.resolved
            ? `<span class="badge bg-success">Yes</span>`
            : `<span class="badge bg-danger">No</span>`;

        tr.innerHTML = `

            <td>${record.date || ""}</td>

            <td>${record.time || ""}</td>

            <td>${record.dose || ""}</td>

            <td>${record.severity ?? ""}</td>

            <td>${formatSymptoms(record.symptoms)}</td>

            <td>${resolvedBadge}</td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    onclick="editRecord(${record.id})">

                    Edit

                </button>

                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="deleteRecord(${record.id})">

                    Delete

                </button>

            </td>

        `;

        table.appendChild(tr);

    });

    updateDashboard(records);

}

/* ==========================================
   Dashboard
========================================== */

function updateDashboard(records) {

    const todaySymptoms =
        document.getElementById("todaySymptoms");

    const lastDose =
        document.getElementById("lastDose");

    const avgSeverity =
        document.getElementById("avgSeverity");

    const commonSymptom =
        document.getElementById("commonSymptom");

    if (!todaySymptoms) return;

    const today = new Date().toISOString().split("T")[0];

    const todayRecords =
        records.filter(r => r.date === today);

    todaySymptoms.textContent =
        todayRecords.length;

    const doses =
        records.filter(r => r.dose && r.dose !== "None");

    lastDose.textContent =
        doses.length
            ? doses[doses.length - 1].dose
            : "--";

    if (records.length > 0) {

        const total =
            records.reduce(
                (sum, r) => sum + Number(r.severity || 0),
                0
            );

        avgSeverity.textContent =
            (total / records.length).toFixed(1);

    } else {

        avgSeverity.textContent = "0";

    }

    commonSymptom.textContent =
        getMostCommonSymptom(records);

}

/* ==========================================
   Search
========================================== */

function filterRecords(keyword) {

    keyword = keyword.toLowerCase();

    const records = getRecords();

    const filtered = records.filter(r => {

        return JSON.stringify(r)
            .toLowerCase()
            .includes(keyword);

    });

    renderHistory(filtered);

}

/* ==========================================
   Symptoms Formatter
========================================== */

function formatSymptoms(symptoms) {

    if (!symptoms) return "";

    if (Array.isArray(symptoms)) {

        return symptoms.join(", ");

    }

    return symptoms;

}

/* ==========================================
   Most Common Symptom
========================================== */

function getMostCommonSymptom(records) {

    const counter = {};

    records.forEach(record => {

        let list = record.symptoms;

        if (!list) return;

        if (!Array.isArray(list)) {

            list = list.split(",");

        }

        list.forEach(symptom => {

            symptom = symptom.trim();

            if (!symptom) return;

            counter[symptom] =
                (counter[symptom] || 0) + 1;

        });

    });

    let winner = "None";

    let highest = 0;

    for (const key in counter) {

        if (counter[key] > highest) {

            highest = counter[key];

            winner = key;

        }

    }

    return winner;

}

/* ==========================================
   Edit Record
========================================== */

function editRecord(id) {

    const record = findRecord(id);

    if (!record) return;

    document.getElementById("date").value =
        record.date || "";

    document.getElementById("time").value =
        record.time || "";

    document.getElementById("dose").value =
        record.dose || "None";

    document.getElementById("severity").value =
        record.severity || 0;

    document.getElementById("severityValue").textContent =
        record.severity || 0;

    document.getElementById("startTime").value =
        record.startTime || "";

    document.getElementById("endTime").value =
        record.endTime || "";

    document.getElementById("notes").value =
        record.notes || "";

    document.getElementById("resolved").checked =
        !!record.resolved;

    document
        .querySelectorAll('input[type="checkbox"][value]')
        .forEach(cb => {

            cb.checked = false;

        });

    let symptoms = record.symptoms;

    if (!Array.isArray(symptoms)) {

        symptoms = (symptoms || "")
            .split(",");

    }

    symptoms.forEach(symptom => {

        symptom = symptom.trim();

        const cb = document.querySelector(
            `input[type="checkbox"][value="${symptom}"]`
        );

        if (cb) cb.checked = true;

    });

    window.currentEditingId = id;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================
   Initial Load
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderHistory();

    const search =
        document.getElementById("search");

    if (search) {

        search.addEventListener("input", e => {

            filterRecords(e.target.value);

        });

    }

});
