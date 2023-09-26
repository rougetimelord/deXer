(function() {const orig = history.pushState;
history.pushState = async function () {
    let pushStateReturn = orig.apply(this, arguments), event = new CustomEvent("pushstate", {
        detail: {
            state: arguments[0]
        }
    });
    window.dispatchEvent(event);
    return pushStateReturn;
}})()