/* ==========================================
   calendar.js
   Neurology Diary v2
   Calendar Module
========================================== */

let currentCalendarDate = new Date();

/* ==========================================
   Initialize Calendar
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderCalendar(currentCalendarDate);

});

/* ==========================================
   Render Calendar
========================================== */

function renderCalendar(date = new Date()) {

    const calendar = document.getElementById("calendar");

    if (!calendar) return;

    calendar.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay =
        new Date(year, month, 1).getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();

    const header = document.createElement("div");
    header.className = "calendar-header";

    header.innerHTML = `
        <button id="prevMonth">◀</button>
        <h3>${date.toLocaleString("default", {
            month: "long",
            year: "numeric"
        })}</h3>
        <button id="nextMonth">▶</button>
    `;

    calendar.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    days.forEach(day => {

        const cell = document.createElement("div");
        cell.className = "calendar-day-name";
        cell.textContent = day;

        grid.appendChild(cell);

    });

    for (let i = 0; i < firstDay; i++) {

        const blank = document.createElement("div");
        blank.className = "calendar-empty";

        grid.appendChild(blank);

    }

    const records = getRecords();

    for (let day = 1; day <= lastDate; day++) {

        const fullDate =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const entries =
            records.filter(r => r.date === fullDate);

        const cell = document.createElement("div");
        cell.className = "calendar-cell";

        const today = new Date();

        if (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        ) {

            cell.classList.add("today");

        }

        if (entries.length > 0) {

            cell.classList.add("has-record");

        }

        cell.innerHTML = `
            <div class="calendar-number">${day}</div>

            ${
                entries.length
                    ? `<span class="calendar-badge">${entries.length}</span>`
                    : ""
            }
        `;

        cell.addEventListener("click", () => {

            showDayRecords(fullDate);

        });

        grid.appendChild(cell);

    }

    calendar.appendChild(grid);

    document
        .getElementById("prevMonth")
        .addEventListener("click", () => {

            currentCalendarDate =
                new Date(year, month - 1, 1);

            renderCalendar(currentCalendarDate);

        });

    document
        .getElementById("nextMonth")
        .addEventListener("click", () => {

            currentCalendarDate =
                new Date(year, month + 1, 1);

            renderCalendar(currentCalendarDate);

        });

}

/* ==========================================
   Show Records of Selected Day
========================================== */

function showDayRecords(date) {

    const records =
        getRecords().filter(r => r.date === date);

    if (records.length === 0) {

        alert("No records for " + date);

        return;

    }

    let text = `Records for ${date}\n\n`;

    records.forEach((r, i) => {

        const symptoms = Array.isArray(r.symptoms)
            ? r.symptoms.join(", ")
            : (r.symptoms || "None");

        text +=
`#${i + 1}
Time: ${r.time || "-"}
Dose: ${r.dose || "-"}
Severity: ${r.severity}
Symptoms: ${symptoms}
Resolved: ${r.resolved ? "Yes" : "No"}
Notes: ${r.notes || "-"}

`;

    });

    alert(text);

}

/* ==========================================
   Jump To Today
========================================== */

function goToToday() {

    currentCalendarDate = new Date();

    renderCalendar(currentCalendarDate);

}

/* ==========================================
   Refresh Calendar
========================================== */

function refreshCalendar() {

    renderCalendar(currentCalendarDate);

}

/* ==========================================
   Auto Refresh After History Update
========================================== */

if (typeof window.renderHistory === "function") {

    const originalRenderHistory = window.renderHistory;

    window.renderHistory = function(records = getRecords()) {

        originalRenderHistory(records);

        refreshCalendar();

    };

}
