//Detect chrome
let runtime = !!chrome ? chrome : browser;
//Load saved theme or default
document.addEventListener("DOMContentLoaded", () => {
    //Add event listener
    document.getElementById("flex").addEventListener("click", event => {
        try {document.getElementsByClassName("sel").item(0).classList.remove("sel")} catch{}
        event.target.classList.add("sel");
        runtime.storage.sync.set({
            theme: event.target.id.replace("opt","")
        });
    });
    document.getElementById("desc").innerText = runtime.i18n.getMessage("themeDescription");
    runtime.storage.sync.get({theme: 1}).then(res => {
        console.log(res)
        try{document.getElementsByClassName("sel").item(0).classList.remove("sel");}catch{}
        document.getElementById(`opt${res.theme}`).classList.add("sel");
    });
})