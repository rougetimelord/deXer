(() => {
    const orig = history.pushState;
    history.pushState = async function() {
        let event = new CustomEvent("pushstate", {detail: {state: arguments[0]}});
        window.dispatchEvent(event);
        return orig.apply(this, arguments);
}})()