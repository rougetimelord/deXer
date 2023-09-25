(async () => {
    const inject = await import(
        (!!chrome ? chrome : browser).runtime
        .getURL("./helpers/index.js"));
    inject.main();
})();