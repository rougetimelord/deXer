export const intercept = async () => {window.addEventListener("copy", async event => {
    event.preventDefault();
    let val = event.target.innerText.replace("x.com","twitter.com");
    event.clipboardData.setData("text/plain", val);
}, {capture: false})}