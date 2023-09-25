//Detect chrome
let extStore = !!chrome ? chrome.storage : browser.storage;
//Basic bitch event listener, send of whatever user picked
let react = elem => {
    document.getElementsByClassName("sel").item(0).classList.remove("sel");
    elem.classList.add("sel");
    extStore.sync.set({
        theme: elem.id.replace("opt","")
    });
}
//Add event listener
document.body.addEventListener("click", event => {
    if (event.target.classList.contains("opt")){
        react(event.target);
    }
    if (event.target.parentNode.classList.contains("opt")){
        react(event.target.parentNode)
    }
});
//Load saved theme or default
document.addEventListener("DOMContentLoaded", () => {
    extStore.sync.get({theme: 1}).then(res => {
        document.getElementsByClassName("sel").item(0).classList.remove("sel");
        document.getElementById(`opt${res.theme}`).classList.add("sel");
    }, err => {
        console.log(`Error: ${err}`);
    })
})