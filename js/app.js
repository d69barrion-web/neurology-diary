/* ==========================================
   app.js
   Neurology Diary v2
   Main Application Controller
========================================== */

let currentEditingId = null;

/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/* ==========================================
   Initialize
========================================== */

function initializeApp() {

    setCurrentDateTime();

    initializeSeveritySlider();

    initializeTheme();

    initializeForm();

    renderHistory();

}

/* ==========================================
   Default Date & Time
========================================== */

function setCurrentDateTime() {

    const now = new Date();

    const date =
        now.toISOString().split("T")[0];

    const time =
        now.toTimeString().slice(0,5);

    document.getElementById("date").value = date;
    document.getElementById("time").value = time;

}

/* ==========================================
   Severity Slider
========================================== */

function initializeSeveritySlider() {

    const slider =
        document.getElementById("severity");

    const value =
        document.getElementById("severityValue");

    if(!slider) return;

    value.textContent = slider.value;

    slider.addEventListener("input",()=>{

        value.textContent = slider.value;

    });

}

/* ==========================================
   Theme
========================================== */

function initializeTheme(){

    const btn =
        document.getElementById("themeToggle");

    if(!btn) return;

    const saved =
        localStorage.getItem("theme");

    if(saved==="dark"){

        document.body.classList.add("dark");

        btn.textContent="☀️ Light Mode";

    }

    btn.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){

            btn.textContent="☀️ Light Mode";

            localStorage.setItem("theme","dark");

        }else{

            btn.textContent="🌙 Dark Mode";

            localStorage.setItem("theme","light");

        }

    });

}

/* ==========================================
   Form
========================================== */

function initializeForm(){

    const form =
        document.getElementById("entryForm");

    if(!form) return;

    form.addEventListener("submit",saveEntry);

}

/* ==========================================
   Save Entry
========================================== */

function saveEntry(e){

    e.preventDefault();

    const symptoms =
        [...document.querySelectorAll('input[type="checkbox"][value]:checked')]
        .map(cb=>cb.value);

    const record={

        date:
        document.getElementById("date").value,

        time:
        document.getElementById("time").value,

        dose:
        document.getElementById("dose").value,

        severity:
        Number(document.getElementById("severity").value),

        symptoms,

        startTime:
        document.getElementById("startTime").value,

        endTime:
        document.getElementById("endTime").value,

        notes:
        document.getElementById("notes").value,

        resolved:
        document.getElementById("resolved").checked

    };

    if(currentEditingId===null){

        addRecord(record);

        showToast("Record saved.");

    }

    else{

        updateRecord(currentEditingId,record);

        currentEditingId=null;

        showToast("Record updated.");

    }

    clearForm();

    renderHistory();

}

/* ==========================================
   Clear Form
========================================== */

function clearForm(){

    document.getElementById("entryForm").reset();

    document
        .querySelectorAll('input[type="checkbox"][value]')
        .forEach(cb=>cb.checked=false);

    document.getElementById("severity").value=0;

    document.getElementById("severityValue").textContent=0;

    setCurrentDateTime();

}

/* ==========================================
   Toast
========================================== */

function showToast(message){

    const toast=document.createElement("div");

    toast.textContent=message;

    toast.style.position="fixed";
    toast.style.bottom="20px";
    toast.style.right="20px";
    toast.style.background="#198754";
    toast.style.color="#fff";
    toast.style.padding="12px 20px";
    toast.style.borderRadius="10px";
    toast.style.boxShadow="0 6px 20px rgba(0,0,0,.25)";
    toast.style.zIndex="9999";
    toast.style.opacity="0";
    toast.style.transition="opacity .3s";

    document.body.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.style.opacity="1";

    });

    setTimeout(()=>{

        toast.style.opacity="0";

        setTimeout(()=>{

            toast.remove();

        },300);

    },2200);

}

/* ==========================================
   Keyboard Shortcut
========================================== */

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        document
            .getElementById("entryForm")
            .requestSubmit();

    }

});

/* ==========================================
   Auto Refresh Dashboard
========================================== */

setInterval(()=>{

    renderHistory();

},60000);
