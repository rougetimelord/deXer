/**
 * Listens for copies and interrupts them
 */
export default async () => {
  window.addEventListener(
    "copy",
    async (event) => {
      if (event.target.style.opacity == "0") {
        event.preventDefault();
        let val = event.target.innerText
          .replace("x.com", "twitter.com")
          .split(/\?\w+=/)[0];
        event.clipboardData.setData("text/plain", val);
      }
    },
    { capture: false },
  );
};
