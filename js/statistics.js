/* ==========================================
   statistics.js
   Neurology Diary v2
   Statistics & Analytics Module
========================================== */

/* ==========================================
   Safe Record Loader
========================================== */

function statsRecords() {
    if (typeof getRecords === "function") {
        return getRecords();
    }
    return [];
}

/* ==========================================
   Total Records
========================================== */

function getTotalRecords() {
    return statsRecords().length;
}

/* ==========================================
   Average Severity
========================================== */

function getAverageSeverity() {

    const records = statsRecords();

    if (records.length === 0)
        return 0;

    const total = records.reduce(
        (sum, r) => sum + Number(r.severity || 0),
        0
    );

    return +(total / records.length).toFixed(1);

}

/* ==========================================
   Maximum Severity
========================================== */

function getMaxSeverity() {

    const records = statsRecords();

    if(records.length===0) return 0;

    return Math.max(
        ...records.map(r=>Number(r.severity||0))
    );

}

/* ==========================================
   Minimum Severity
========================================== */

function getMinSeverity(){

    const records=statsRecords();

    if(records.length===0) return 0;

    return Math.min(
        ...records.map(r=>Number(r.severity||0))
    );

}

/* ==========================================
   Today's Records
========================================== */

function getTodayRecords(){

    const today=
        new Date().toISOString().split("T")[0];

    return statsRecords().filter(
        r=>r.date===today
    );

}

/* ==========================================
   Records This Week
========================================== */

function getWeekRecords(){

    const today=new Date();

    return statsRecords().filter(r=>{

        if(!r.date) return false;

        const d=new Date(r.date);

        const diff=(today-d)/(1000*60*60*24);

        return diff<=7;

    });

}

/* ==========================================
   Records This Month
========================================== */

function getMonthRecords(){

    const now=new Date();

    const month=now.getMonth();

    const year=now.getFullYear();

    return statsRecords().filter(r=>{

        if(!r.date) return false;

        const d=new Date(r.date);

        return (
            d.getMonth()===month &&
            d.getFullYear()===year
        );

    });

}

/* ==========================================
   Symptom Frequency
========================================== */

function getSymptomFrequency(){

    const counter={};

    statsRecords().forEach(record=>{

        let symptoms=record.symptoms;

        if(!symptoms) return;

        if(!Array.isArray(symptoms))
            symptoms=symptoms.split(",");

        symptoms.forEach(symptom=>{

            symptom=symptom.trim();

            if(!symptom) return;

            counter[symptom]=(counter[symptom]||0)+1;

        });

    });

    return counter;

}

/* ==========================================
   Most Common Symptom
========================================== */

function getMostCommonSymptomStats(){

    const freq=getSymptomFrequency();

    let winner="None";
    let count=0;

    Object.keys(freq).forEach(key=>{

        if(freq[key]>count){

            count=freq[key];

            winner=key;

        }

    });

    return {

        symptom:winner,

        count:count

    };

}

/* ==========================================
   Dose Frequency
========================================== */

function getDoseCounts(){

    const counts={};

    statsRecords().forEach(r=>{

        const dose=r.dose||"None";

        counts[dose]=(counts[dose]||0)+1;

    });

    return counts;

}

/* ==========================================
   Resolved %
========================================== */

function getResolvedPercentage(){

    const records=statsRecords();

    if(records.length===0) return 0;

    const resolved=records.filter(
        r=>r.resolved
    ).length;

    return Math.round(
        resolved/records.length*100
    );

}

/* ==========================================
   Average Duration
========================================== */

function getAverageDuration(){

    const records=statsRecords();

    let totalMinutes=0;
    let count=0;

    records.forEach(r=>{

        if(!r.startTime||!r.endTime)
            return;

        const start=r.startTime.split(":");
        const end=r.endTime.split(":");

        const s=
            Number(start[0])*60+
            Number(start[1]);

        const e=
            Number(end[0])*60+
            Number(end[1]);

        if(e>=s){

            totalMinutes+=(e-s);

            count++;

        }

    });

    if(count===0) return 0;

    return Math.round(
        totalMinutes/count
    );

}

/* ==========================================
   Pattern Analyzer
========================================== */

function generateInsights(){

    const insight=[];

    const common=getMostCommonSymptomStats();

    if(common.count>0){

        insight.push(
            `Most common symptom: ${common.symptom} (${common.count}x)`
        );

    }

    insight.push(
        `Average severity: ${getAverageSeverity()}`
    );

    insight.push(
        `Resolved symptoms: ${getResolvedPercentage()}%`
    );

    const duration=getAverageDuration();

    if(duration){

        insight.push(
            `Average duration: ${duration} minutes`
        );

    }

    return insight;

}

/* ==========================================
   Summary Object
========================================== */

function getStatisticsSummary(){

    return{

        totalRecords:getTotalRecords(),

        today:getTodayRecords().length,

        week:getWeekRecords().length,

        month:getMonthRecords().length,

        averageSeverity:getAverageSeverity(),

        maxSeverity:getMaxSeverity(),

        minSeverity:getMinSeverity(),

        resolved:getResolvedPercentage(),

        averageDuration:getAverageDuration(),

        common:getMostCommonSymptomStats(),

        doses:getDoseCounts(),

        symptoms:getSymptomFrequency(),

        insights:generateInsights()

    };

}

/* ==========================================
   Console Summary (Developer)
========================================== */

function printStatistics(){

    console.table(getStatisticsSummary());

}

/* ==========================================
   Auto Refresh Statistics
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    console.log(
        "Statistics Module Loaded"
    );

});
