/**
 * Callback waiting for an element
 * 
 * @callback waitForElementCallback
 * @param {NodeListOf<Element>} elements
 */
/**
 * Creates a mutation listener that waits for all elements in the selector list to exist, callsback and dies
 * 
 * @param {string} selectorList Selectors to look for
 * @param {waitForElementCallback} callback 
 * @param {HTMLElement=document.body} target
 * @param {boolean=true} once Whether to run once
 * @param {boolean=false} useMutations
 */
export const waitForElement = async (
    selectorList, callback, target=document.body, once=true
) => {
    let observer = new MutationObserver(
        async (mutations, observer) => {
            const elements =document.body.querySelectorAll(selectorList);
            if(
                elements.length >= selectorList.split(/,\s*/).length
            ) {
                callback(elements);
                if(once){
                    observer.disconnect();
                }
            }
        }
    );
    observer.observe(target,{
        subtree: true,
        childList: true,

    });
}

/**
 * Creates and connects an observer for the target with input callback
 * 
 * @param {HTMLElement} target 
 * @param {MutationCallback} callback 
 */
export const watchElement = async (target, callback) =>{
    let observer = new MutationObserver(callback);
    observer.observe(target, {childList: true});
    return observer;
}