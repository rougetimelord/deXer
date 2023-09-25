/**
 * Creates a mutation listener that waits for all elements in the selector list to exist, callsback and dies
 * 
 * @param {string} selectorList Selectors to look for
 * @param {Function} callback 
 * @param {HTMLElement=document.body} target
 * @param {boolean=true} once Whether to run once
 * @param {boolean=false} useMutations
 */
export const waitForElement = async (
    selectorList, callback, target=document.body, once=true
) => {
    let observer = new MutationObserver(
        async (mutations, observer) => {
            if(
                document.body.querySelectorAll(selectorList).length == selectorList.split(/,\s*/).length
            ) {
                callback();
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
 * @param {Function} callback 
 */
export const watchElement = async (target, callback) =>{
    let observer = new MutationObserver(callback);
    observer.observe(target, {childList: true});
}