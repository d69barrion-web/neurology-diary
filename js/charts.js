/* ==========================================
   charts.js
   Neurology Diary v2
   Chart.js Module
========================================== */

let severityChart = null;

/* ==========================================
   Render Chart
========================================== */

function renderChart(records = getRecords()) {

    const canvas = document.getElementById("severityChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Destroy previous chart
    if (severityChart) {
        severityChart.destroy();
    }

    // Sort by Date + Time
    const sorted = [...records].sort((a, b) => {

        const aDate = new Date(`${a.date} ${a.time}`);
        const bDate = new Date(`${b.date} ${b.time}`);

        return aDate - bDate;

    });

    const labels = sorted.map(r => {

        if (!r.date) return "";

        return `${r.date}\n${r.time || ""}`;

    });

    const severity = sorted.map(r =>
        Number(r.severity || 0)
    );

    severityChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "Severity",

                    data: severity,

                    borderColor: "#2563eb",

                    backgroundColor: "rgba(37,99,235,.15)",

                    pointBackgroundColor: "#2563eb",

                    pointRadius: 5,

                    pointHoverRadius: 7,

                    borderWidth: 3,

                    fill: true,

                    tension: .35

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: true

                },

                tooltip: {

                    callbacks: {

                        afterLabel(context) {

                            const r = sorted[context.dataIndex];

                            return [
                                "Dose: " + (r.dose || "None"),
                                "Symptoms: " + formatSymptoms(r.symptoms),
                                "Resolved: " + (r.resolved ? "Yes" : "No")
                            ];

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 10,

                    ticks: {

                        stepSize: 1

                    },

                    title: {

                        display: true,

                        text: "Severity"

                    }

                },

                x: {

                    title: {

                        display: true,

                        text: "Date / Time"

                    }

                }

            }

        }

    });

}

/* ==========================================
   Refresh Charts
========================================== */

function refreshCharts() {

    renderChart(getRecords());

}

/* ==========================================
   Symptom Frequency
========================================== */

function getSymptomCounts(records = getRecords()) {

    const counts = {};

    records.forEach(record => {

        let symptoms = record.symptoms;

        if (!symptoms) return;

        if (!Array.isArray(symptoms)) {

            symptoms = symptoms.split(",");

        }

        symptoms.forEach(symptom => {

            symptom = symptom.trim();

            if (!symptom) return;

            counts[symptom] = (counts[symptom] || 0) + 1;

        });

    });

    return counts;

}

/* ==========================================
   Average Severity
========================================== */

function calculateAverageSeverity(records = getRecords()) {

    if (records.length === 0)
        return 0;

    const total = records.reduce(

        (sum, r) => sum + Number(r.severity || 0),

        0

    );

    return (total / records.length).toFixed(1);

}

/* ==========================================
   Today's Statistics
========================================== */

function getTodayStats() {

    const today =
        new Date().toISOString().split("T")[0];

    const todayRecords =
        getRecords().filter(r => r.date === today);

    return {

        entries: todayRecords.length,

        average: calculateAverageSeverity(todayRecords),

        symptoms: getSymptomCounts(todayRecords)

    };

}

/* ==========================================
   Hook Into UI
========================================== */

const originalRenderHistory = window.renderHistory;

window.renderHistory = function(records = getRecords()) {

    originalRenderHistory(records);

    renderChart(records);

};

/* ==========================================
   Initial Load
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderChart();

});
