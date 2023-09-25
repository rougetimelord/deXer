(async () => {
    const inject = await import(
        (!!chrome ? chrome : browser).runtime
        .getURL("/scripts/inject.js"));
    inject.main();
})();