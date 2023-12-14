let logFromMain = [];
function myLog(e) {
    console.log(e),
    logFromMain.push(e)
}
let itmHome = document.querySelector(".home"), 
  itmShow = document.querySelector(".show_log"),
  itmApi = document.querySelector(".api"),
  itmContact = document.querySelector(".contact");
let cur = null,
  content = document.querySelector("#cont");

function createHandle(e) {
    return t=>{
        t.preventDefault(),
        t.stopPropagation(),
        document.body.className = "",
        content.className = "",
        cur && cur.classList.toggle("CURRENT-ITEM"),
        (cur = t.target).classList.toggle("CURRENT-ITEM"),
        fetch(`resources/${e}`).then(t=>{
            if (!t.ok)
                throw new Error(`${e}: ${t.status}`);
            t.text().then(e=>{
                content.innerHTML = e
            }
            )
        }
        ).catch(e=>console.log(`${e.name} | ${e.message}`))
    }
}
itmHome.addEventListener("click", createHandle("home.html")),
itmContact.addEventListener("click", createHandle("contacts.html")),
itmShow.addEventListener("click", e=>{
    e.preventDefault(),
    e.stopPropagation(),
    document.body.className = "",
    content.className = "",
    content.innerHTML = "";
    for (let e = 0; e < logFromMain.length; e++) {
        let t = document.createElement("p");
        t.className = "logstr",
        t.textContent = logFromMain[e],
        content.append(t)
    }
    fetch("log.html").then(e=>{
        e.ok ? e.text().then(e=>{
            let t = JSON.parse(e);
            for (let e = 0; e < t.length; e++) {
                let n = document.createElement("p");
                n.className = "logswstr",
                n.textContent = t[e],
                content.append(n)
            }
        }
        ) : myLog(`log.html: ${e.status}`),
        itmShow.disabled = !1
    }
    )
}
),
itmApi.addEventListener("click", e=>{
    e.preventDefault(),
    e.stopPropagation(),
    document.body.className = "",
    content.className = "emojis",
    cur && cur.classList.toggle("CURRENT-ITEM"),
    (cur = e.target).classList.toggle("CURRENT-ITEM");
    let t = "https://api.github.com/emojis";
    fetch(t).then(e=>{
        if (e.ok)
            return e.json();
        throw new Error(`${t}: ${e.status}`)
    }
    ).then(e=>{
        showEmojis(content, e)
    }
    ).catch(e=>console.error(e))
}
);
let event = null;
function showEmojis(e, t) {
    const n = "<article>\n<img src='resources/placeholder.png' data-src='emojisUrl' alt='NAME'>\n<h3>NM</h3>\n</article>";
    let o = "";
    for (let e in t) {
        o += n.replace(/NM/gi, e).replace(/emojisUrl/gi, t[e])
    }
    e.innerHTML = o,
    progressiveLoadingImages()
}
function progressiveLoadingImages() {
    const e = document.querySelectorAll("img[data-src]")
      , t = e=>{
        e.setAttribute("src", e.getAttribute("data-src")),
        e.onload = (()=>{
            e.removeAttribute("data-src")
        }
        )
    }
    ;
    if ("IntersectionObserver"in window) {
        const n = new IntersectionObserver(e=>{
            e.forEach(e=>{
                e.isIntersecting && (t(e.target),
                n.unobserve(e.target))
            }
            )
        }
        );
        e.forEach(e=>n.observe(e))
    } else
        e.forEach(e=>t(e))
}
document.createEvent ? ((event = document.createEvent("HTMLEvents")).initEvent("click", !0, !0),
event.eventName = "click",
itmHome.dispatchEvent(event)) : ((event = document.createEventObject()).eventName = "click",
event.eventType = "click",
itmHome.fireEvent("on" + event.eventType, event)),
"serviceWorker"in navigator ? (myLog("'serviceWorker' in navigator"),
navigator.serviceWorker.register("serviceWorker.js").then(e=>{
    myLog("ServiceWorker registered!"),
    navigator.serviceWorker.ready.then(e=>{
        myLog("ServiceWorker ready!")
    }
    )
}
).catch(e=>{
    console.error(e)
}
)) : myLog("No 'serviceWorker' in navigator");
let installBtn = document.querySelector("#install-btn")
  , deferredPrompt = null;
function installApp(e) {
    deferredPrompt.prompt(),
    installBtn.disabled = !0,
    deferredPrompt.userChoice.then(e=>{
        "accepted" === e.outcome ? (console.log("PWA setup accepted"),
        installBtn.style.visibility = "hidden") : console.log("PWA setup rejected"),
        installBtn.disabled = !1,
        deferredPrompt = null
    }
    )
}
window.addEventListener("beforeinstallprompt", e=>{
    e.preventDefault(),
    deferredPrompt = e,
    installBtn && (installBtn.className = "active"),
    myLog("beforeinstallprompt event was fired"),
    installBtn.addEventListener("click", installApp)
}
);
