/* ==========================================
   report.js
   Neurology Diary v2
   Doctor Report Generator
========================================== */

/* ==========================================
   Generate Report HTML
========================================== */

function generateDoctorReport() {

    const records = getRecords();

    const stats = getStatisticsSummary();

    let html = "";

    html += `
    <!DOCTYPE html>
    <html>
    <head>

    <meta charset="UTF-8">

    <title>Neurology Diary Report</title>

    <style>

    body{

        font-family:Arial,sans-serif;

        margin:40px;

        color:#222;

        line-height:1.5;

    }

    h1,h2{

        color:#0d6efd;

    }

    table{

        width:100%;

        border-collapse:collapse;

        margin-top:15px;

    }

    th,td{

        border:1px solid #999;

        padding:8px;

        font-size:13px;

    }

    th{

        background:#e9f2ff;

    }

    .section{

        margin-top:35px;

    }

    ul{

        padding-left:20px;

    }

    .footer{

        margin-top:50px;

        font-size:12px;

        color:#666;

    }

    </style>

    </head>

    <body>

    <h1>Neurology Symptom Diary</h1>

    <p>
    Generated:
    ${new Date().toLocaleString()}
    </p>

    <div class="section">

    <h2>Patient Summary</h2>

    <table>

    <tr>
        <th>Total Records</th>
        <td>${stats.totalRecords}</td>
    </tr>

    <tr>
        <th>Today's Entries</th>
        <td>${stats.today}</td>
    </tr>

    <tr>
        <th>This Week</th>
        <td>${stats.week}</td>
    </tr>

    <tr>
        <th>This Month</th>
        <td>${stats.month}</td>
    </tr>

    <tr>
        <th>Average Severity</th>
        <td>${stats.averageSeverity}</td>
    </tr>

    <tr>
        <th>Maximum Severity</th>
        <td>${stats.maxSeverity}</td>
    </tr>

    <tr>
        <th>Minimum Severity</th>
        <td>${stats.minSeverity}</td>
    </tr>

    <tr>
        <th>Resolved Symptoms</th>
        <td>${stats.resolved}%</td>
    </tr>

    <tr>
        <th>Average Duration</th>
        <td>${stats.averageDuration} minutes</td>
    </tr>

    <tr>
        <th>Most Common Symptom</th>
        <td>${stats.common.symptom}</td>
    </tr>

    </table>

    </div>

    <div class="section">

    <h2>Clinical Insights</h2>

    <ul>
    `;

    stats.insights.forEach(i => {

        html += `<li>${i}</li>`;

    });

    html += `

    </ul>

    </div>

    <div class="section">

    <h2>Medication Frequency</h2>

    <table>

    <tr>

    <th>Dose</th>

    <th>Occurrences</th>

    </tr>
    `;

    Object.keys(stats.doses).forEach(key => {

        html += `
        <tr>
            <td>${key}</td>
            <td>${stats.doses[key]}</td>
        </tr>
        `;

    });

    html += `

    </table>

    </div>

    <div class="section">

    <h2>Symptom Frequency</h2>

    <table>

    <tr>

    <th>Symptom</th>

    <th>Occurrences</th>

    </tr>
    `;

    Object.keys(stats.symptoms).forEach(key => {

        html += `
        <tr>
            <td>${key}</td>
            <td>${stats.symptoms[key]}</td>
        </tr>
        `;

    });

    html += `

    </table>

    </div>

    <div class="section">

    <h2>Detailed Timeline</h2>

    <table>

    <tr>

    <th>Date</th>

    <th>Time</th>

    <th>Dose</th>

    <th>Severity</th>

    <th>Symptoms</th>

    <th>Duration</th>

    <th>Resolved</th>

    <th>Notes</th>

    </tr>
    `;

    records.forEach(r => {

        const symptoms = Array.isArray(r.symptoms)
            ? r.symptoms.join(", ")
            : (r.symptoms || "");

        const duration =
            (r.startTime || "-") +
            " → " +
            (r.endTime || "-");

        html += `

        <tr>

        <td>${r.date || ""}</td>

        <td>${r.time || ""}</td>

        <td>${r.dose || ""}</td>

        <td>${r.severity || ""}</td>

        <td>${symptoms}</td>

        <td>${duration}</td>

        <td>${r.resolved ? "Yes" : "No"}</td>

        <td>${r.notes || ""}</td>

        </tr>

        `;

    });

    html += `

    </table>

    </div>

    <div class="footer">

    <hr>

    <strong>Neurology Diary v2</strong>

    <br>

    This report is intended to assist the attending physician
    by providing a chronological record of medication intake,
    symptoms, severity, duration, and patient observations.

    </div>

    </body>

    </html>
    `;

    return html;

}

/* ==========================================
   Open Printable Report
========================================== */

function openDoctorReport() {

    const reportWindow = window.open("", "_blank");

    reportWindow.document.open();

    reportWindow.document.write(generateDoctorReport());

    reportWindow.document.close();

}

/* ==========================================
   Print Report
========================================== */

function printDoctorReport() {

    const reportWindow = window.open("", "_blank");

    reportWindow.document.open();

    reportWindow.document.write(generateDoctorReport());

    reportWindow.document.close();

    reportWindow.focus();

    reportWindow.print();

}

/* ==========================================
   Download Report (HTML)
========================================== */

function downloadDoctorReport() {

    const html = generateDoctorReport();

    const blob = new Blob(
        [html],
        { type: "text/html" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Neurology_Doctor_Report.html";

    link.click();

}

/* ==========================================
   Add Buttons Automatically
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const footer = document.querySelector("footer");

    if (!footer) return;

    const div = document.createElement("div");

    div.className = "mt-3";

    div.innerHTML = `

        <button
            class="btn btn-success me-2"
            onclick="openDoctorReport()">

            📄 Preview Report

        </button>

        <button
            class="btn btn-primary me-2"
            onclick="printDoctorReport()">

            🖨 Print / Save PDF

        </button>

        <button
            class="btn btn-secondary"
            onclick="downloadDoctorReport()">

            ⬇ Download HTML

        </button>

    `;

    footer.parentNode.insertBefore(div, footer);

});
