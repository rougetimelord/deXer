//Detect chrome
let runtime = !!chrome ? chrome : browser;
//Add event listener
document.body.addEventListener("click", event => {
    document.getElementsByClassName("sel").item(0).classList.remove("sel");
    event.target.classList.add("sel");
    runtime.storage.sync.set({
        theme: event.target.id.replace("opt","")
    });
});
//Load saved theme or default
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("desc").innerText = runtime.i18n.getMessage(themeDescription)
    runtime.storage.sync.get({theme: 1}).then(res => {
        document.getElementsByClassName("sel").item(0).classList.remove("sel");
        document.getElementById(`opt${res.theme}`).classList.add("sel");
    });
})