//Detect chrome
let runtimeStorage = !!chrome ? chrome.storage : browser.storage;
//Add event listener
document.body.addEventListener("click", event => {
    document.getElementsByClassName("sel").item(0).classList.remove("sel");
    event.target.classList.add("sel");
    runtimeStorage.sync.set({
        theme: event.target.id.replace("opt","")
    });
});
//Load saved theme or default
document.addEventListener("DOMContentLoaded", () => {
    runtimeStorage.sync.get({theme: 1}).then(res => {
        document.getElementsByClassName("sel").item(0).classList.remove("sel");
        document.getElementById(`opt${res.theme}`).classList.add("sel");
    });
})