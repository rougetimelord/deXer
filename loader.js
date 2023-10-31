(async () => {
  /**
   * Replaces the inner text of an HTMLElement
   *
   * @param {string | RegExp} searchValue The value to search for
   * @param {string} replaceValue The value to replace with
   */
  HTMLElement.prototype.replaceText = async function (
    searchValue,
    replaceValue,
  ) {
    this.innerHTML = this.innerHTML.replace(searchValue, replaceValue);
  };
  import(
    (!!chrome ? chrome : browser).runtime.getURL("/src/inject.js")
  )
  .then(injectModule => injectModule.main())
  .catch(err => console.error("[Dexer] Error in injection", err));
})();
