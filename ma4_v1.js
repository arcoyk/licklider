const firebaseConfig = {
    apiKey: "AIzaSyD4IRsENjO3VNmAJGBZQ_25-Cq6jdOdB4g",
    authDomain: "kuru-b7c9c.firebaseapp.com",
    databaseURL: "https://kuru-b7c9c-default-rtdb.firebaseio.com",
    projectId: "kuru-b7c9c",
    storageBucket: "kuru-b7c9c.appspot.com",
    messagingSenderId: "680275255732",
    appId: "1:680275255732:web:50d8c81ab45818da90d2e1",
    measurementId: "G-KJRRWDDBW2"
}
function getCookie() {
    let h = {};
    document.cookie.split("; ").map(a => h[a.split("=")[0]] = a.split("=")[1]);
    let k1 = "_ma4_v1_uid";
    h[k1] = h[k1] ? h[k1] : "u" + Math.floor(Math.random() * 100000000);
    document.cookie = k1 + "=" + h[k1] + ";expires=Fri, 31 Dec 9999 23:59:59 GMT";
    return h;
}
function saveData(type, d) {
    if (!d) return;
    db2.ref("ma4_v1/" + type + "/" + getCookie()["_ma4_v1_uid"] + "/" + d.t).set(d);
}
const app = firebase.initializeApp(firebaseConfig);
const db2 = firebase.database();
let env = {pointerX: 0, pointerY: 0, scrollY: 0, bufs: [], prof: {}};
// Consume buf every 10msec, otherwise too many request.
setInterval(e => {
    let rec = env.bufs.shift();
    if (rec) {
        saveData("events", rec);
        env.prof.cnt = env.prof.cnt ? env.prof.cnt + 1 : 1;
        env.prof.last = Date.now();
        saveData("profs", env.prof);
    }
}, 10);
function rec(name, e) {
    let rec = {
        n: name,
        i: e.target.id || "",
        s: window.scrollY,
        p: e.pressure || 0,
        x: env.pointerX,
        y: env.pointerY,
        t: Date.now()
    };
    env.bufs.push(rec);
}
function appendGeo() {
    fetch("https://hutils.loxal.net/whois").then(e => (
        e.json()
    )).then(e => {
        if (!e) return;
        env.prof.geo = e;
        saveData("profs", env.prof);
    });
}
function connection() {
    let c = navigator.connection;
    if (!c) return;
    let d = {};
    d.effectiveType = c.effectiveType;
    d.rtt = c.rtt;
    d.downlink = c.downlink;
    d.saveData = c.saveData;
    return d;
}
function init() {
    window.addEventListener("pointermove", e => {env.pointerX = e.x;env.pointerY = e.y;});
    window.addEventListener("pointermove", e => rec("pointermove", e));
    window.addEventListener("pointerdown", e => rec("pointerdown", e));
    window.addEventListener("pointerup", e => rec("pointerup", e));
    setInterval(e => {
        if (env.scrollY == window.scrollY) return;
        rec("scroll", {target: {}});
        env.scrollY = window.scrollY;
    }, 10);
    window.addEventListener("load", e => {
        let h = getCookie();
        env.prof.t = Date.now();
        env.prof._ma4_v1_uid = h["_ma4_v1_uid"];
        env.prof.title = document.title;
        env.prof.url = location.href;
        env.prof.ref = document.referrer;
        env.prof.agent = navigator.userAgent;
        env.prof.screen = {height: window.screen.height, width: window.screen.width};
        env.prof.body = {height: document.body.scrollHeight, width: document.body.scrollWidth};
        env.prof.inner = {height: window.innerHeight, width: window.innerWidth};
        env.prof.memory = navigator.deviceMemory || "?";
        env.prof.languages = navigator.languages || "?";
        env.prof.connection = connection() || "?";
        env.prof.maxTouchPoint = navigator.maxTouchPoints || (navigator.maxTouchPoints == 0 ? 0 : "?");
        env.prof.description  = platform.description || "?";
        env.prof.layout = platform.layout || "?";
        env.prof.name = platform.name || "?";
        env.prof.architecture = platform.os.architecture || "?";
        env.prof.family = platform.os.family || "?";
        env.prof.last = Date.now();
        env.prof.cnt = 0;
        saveData("profs", env.prof);
        appendGeo();
    });
}
function clear() {
    db2.ref("ma4_v1/recs/u55332230").remove();
    db2.ref("ma4_v1/recs/u25941588").remove();
    db2.ref("ma4_v1/recs/u56420909").remove();
    db2.ref("ma4_v1/recs/").remove();
}
if (window.self === window.top) {
    // clear();
    init();
}