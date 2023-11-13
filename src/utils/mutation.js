/**
 * Callback waiting for an element
 *
 * @callback waitForElementCallback
 * @param {NodeListOf<Element>} elements
 * @param {MutationObserver} observer
 */
/**
 * Creates a mutation listener that waits for all elements in the selector list to exist
 *
 * @param {string} selectorList Selectors to look for
 * @param {waitForElementCallback} callback
 * @param {WaitForElementsOpts} options
 * @param {Node | undefined} [options.target = document.body]
 * @param {boolean | undefined} [options.once = true]
 * @returns {MutationObserver}
 */
export const waitForElement = async (selectorList, callback, options = {}) => {
  options = { ...{ target: document.body, once: true }, ...options };
  try {
    const es0 = document.querySelectorAll(selectorList);
    if (es0.length >= selectorList.split(/,\s*/).length) {
      callback(es0, null);
      return;
    }
  } catch (err) {
    console.error(`[deXer] error in WFE pre-check:`, err, selectorList);
  }
  let observer = new MutationObserver(async (mutations, observer) => {
    const elements = document.querySelectorAll(selectorList);
    if (elements.length >= selectorList.split(/,\s*/).length) {
      callback(elements, observer);
      if (options.once) {
        observer.disconnect();
      }
    }
  });
  try {
    observer.observe(options.target, { subtree: true, childList: true });
    return observer;
  } catch (err) {
    console.error(`[deXer] error in WFE:`, err, selectorList, target);
  }
};

/**
 * Extended callback with parameters that allow observer reconnect
 *
 * @callback ExtendedMutationCallBack
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 * @param {HTMLElement} target The target supplied to the parent watch call
 * @param {MutationObserverInit} options The options provided to the parent watch call
 */
/**
 * Creates and connects an observer for the target with input callback
 *
 * @param {HTMLElement} target
 * @param {MutationCallback | ExtendedMutationCallBack} callback
 * @param {MutationObserverInit} [options={childList:true}]
 * @returns {MutationObserver}
 */
export const watchElement = async (
  target,
  callback,
  options = { childList: true },
) => {
  try {
    let observer = new MutationObserver((mutations, observer) => {
      callback(mutations, observer, target, options);
    });
    observer.observe(target, options);
    return observer;
  } catch (err) {
    console.error(`[deXer] error in WE: ${err}`, target, callback.name);
  }
};

/**
 * Returns a promise that resolves once it least one of each element that matches a selector exists.
 *
 * Can not be used to fire functions multiple times, resolves once and is done.
 * @param {string} selectorList
 * @returns {Promise<NodeListOf<Element>>}
 */
export const resolveOnElement = async (selectorList) => {
  return new Promise((resolve, reject) => {
    try {
      const es0 = document.querySelectorAll(selectorList);
      if (es0.length >= selectorList.split(/,\s*/).length) {
        resolve(es0);
      }
    } catch (err) {
      console.error(
        `[deXer] error in ROE pre-check:`,
        err,
        selectorList,
        target,
      );
      reject(err);
    }
    let observer = new MutationObserver(async (mutations, observer) => {
      const elements = document.querySelectorAll(selectorList);
      if (elements.length >= selectorList.split(/,\s*/).length) {
        resolve(elements);
        observer.disconnect();
      }
    });
    try {
      observer.observe(document, { subtree: true, childList: true });
    } catch (err) {
      console.error(`[deXer] error in ROE:`, err, selectorList, target);
      reject(err);
    }
  });
};
