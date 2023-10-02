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
 * @param {HTMLElement=document.body} target
 * @param {boolean=true} once Whether to run once
 * @param {boolean=false} useMutations
 */
export const waitForElement = async (selectorList, callback, target=document, once=true) => {
    try{
        const es0 = document.querySelectorAll(selectorList);
        if(es0.length >= selectorList.split(/,\s*/).length){
            callback(es0, null);
            return;}
    } catch (err) {
        console.error(`[Dexer] error in WFE pre-check: ${selectorList} ${target} ${err}`);
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
        console.error(`[Dexer] error in WFE: ${selectorList} ${target} ${err}`)
    }
}

/**
 * Creates and connects an observer for the target with input callback
 * 
 * @param {HTMLElement} target 
 * @param {MutationCallback} callback
 */
export const watchElement = async (target, callback) =>{
    try{
        let observer = new MutationObserver(callback);
        observer.observe(target, {childList: true});
        return observer;
    } catch (err) {
        console.error(`[Dexer] error in WE: ${target} ${err}`)
        return;
    }
}