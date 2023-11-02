//Detect chrome
let runtime = !!chrome ? chrome : browser;
//Load saved theme or default
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fxCheck").addEventListener("click", event =>
    runtime.storage.sync.set({fx: event.target.checked})
  , {passive: true})
  //Add event listener
  document.getElementById("flex").addEventListener("click", (event) => {
    try {
      document.getElementsByClassName("sel").item(0).classList.remove("sel");
    } catch {}
    event.target.classList.add("sel");
    const option = parseInt(event.target.id);
    runtime.storage.sync.set({
      theme: option > 0 ? option : 1,
    });
  }, {passive: true});
  document.getElementById("desc").innerText =
    runtime.i18n.getMessage("themeDescription");
  document.getElementById("fx").innerText = runtime.i18n.getMessage("fxDescription");
  runtime.storage.sync.get({ theme: 1, fx: false}).then((res) => {
    try {
      document.getElementsByClassName("sel").item(0).classList.remove("sel");
    } catch {}
    document.getElementById(`opt${res.theme}`).classList.add("sel");
    document.getElementById("fxCheck").checked=res.fx;
  });
});
