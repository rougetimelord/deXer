(() => {
    const orig = history.pushState;
    history.pushState = async function() {
        orig.apply(this, arguments);
        window.dispatchEvent(new CustomEvent("pushstate", {detail: {state: arguments[0]}}));
}})()