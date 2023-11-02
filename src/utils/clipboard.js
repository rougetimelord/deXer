import { storageGetter, storageListener } from "./runtime.js";

let fx = (await storageGetter({ fx: false }))["fx"];
storageListener((value) => (fx = value), "fx");

/**
 * Handles copy events
 * @param {ClipboardEvent} event
 */
const copyHandler = async (event) => {
  if (event.target.style.opacity == "0") {
    event.preventDefault();
    let val = event.target.innerText
      .replace("x.com", fx ? "fxtwiiter.com" : "twitter.com")
      .split(/\?\w+=/)[0];
    event.clipboardData.setData("text/plain", val);
  }
};

/**
 * Listens for copies and interrupts them
 */
export default async () => {
  window.addEventListener("copy", copyHandler, { capture: false });
};
