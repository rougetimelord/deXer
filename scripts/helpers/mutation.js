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
 * @param {HTMLElement} [target=document.body]
 * @param {boolean} [once=true] Whether to run once
 */
export const waitForElement = async (selectorList, callback, target=document, once=true) => {
    try{
        const es0 = document.querySelectorAll(selectorList);
        if(es0.length >= selectorList.split(/,\s*/).length){
            callback(es0, null);
            return;}
    } catch (err) {
        console.error(`[Dexer] error in WFE pre-check:`, err, selectorList, target);
    }
    let observer = new MutationObserver(
        async (mutations, observer) => {
            const elements = document.querySelectorAll(selectorList);
            if(elements.length >= selectorList.split(/,\s*/).length){
                callback(elements, observer);
                if(once){observer.disconnect()}
            }
        }
    );
    try{
        observer.observe(target, {subtree: true, childList: true});
        return observer;
    } catch (err) {
        console.error(`[Dexer] error in WFE:`, err, selectorList, target)
    }
}


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
 *
 */
export const watchElement = async (target, callback, options={childList: true}) =>{
    try{
        let observer = new MutationObserver((mutations, observer)=>{callback(mutations, observer, target, options)});
        observer.observe(target, options);
        return observer;
    } catch (err) {
        console.error(`[Dexer] error in WE: ${err}`, target, callback.name)
        return;
    }
}