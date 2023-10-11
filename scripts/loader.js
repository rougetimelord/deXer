(async () => {
    /**
     * Replaces the inner text of an HTMLElement
     * 
     * @param {string | RegExp} searchValue The value to search for
     * @param {string} replaceValue The value to replace with
     */
    HTMLElement.prototype.replaceText = async function(searchValue, replaceValue) {
        this.innerHTML = this.innerHTML.replace(searchValue, replaceValue);
    }
    const inject = await import(
        (!!chrome ? chrome : browser).runtime
        .getURL("/scripts/inject.js"));
    inject.main();
})();