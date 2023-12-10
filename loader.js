(async () => {
  /**
   * Replaces the inner text of an HTMLElement
   *
   * @param {string | RegExp} searchValue The value to search for
   * @param {string} replaceValue The value to replace with
   */
  HTMLElement.prototype.replaceText = function (searchValue, replaceValue) {
    this.innerHTML = this.innerHTML.replace(searchValue, replaceValue);
  };
  /**
   * Finds the deepest child of an element
   *
   * Only traverses first children so no guarantees that it will be the deepest child overall.
   * @returns {HTMLElement}
   */
  HTMLElement.prototype.deepestChild = function () {
    let e = this;
    for (
      ;
      e.hasChildNodes() && e.firstChild instanceof HTMLElement;
      e = e.firstChild
    ) {}
    return e;
  };
  import((!!chrome ? chrome : browser).runtime.getURL("./src/inject.js"))
    .then((injectModule) => injectModule.main())
    .catch((err) => console.error("[deXer] Error in injection", err));
})();
