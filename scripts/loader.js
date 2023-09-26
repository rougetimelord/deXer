(async () => {
    const orig = history.pushState;
    history.pushState = async () => {
        var pushStateReturn = orig.apply(this, arguments);
        var event = new Event("pushstate");
        event.state = arguments[0];
        window.dispatchEvent(event);
        return pushStateReturn;
    };
    const inject = await import(
        (!!chrome ? chrome : browser).runtime
        .getURL("/scripts/inject.js"));
    inject.main();
})();