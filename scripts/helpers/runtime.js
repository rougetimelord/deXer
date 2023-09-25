//Detect chrome
const browserRuntime = !!chrome ? chrome : browser;

/**
 * Gets theme from storage
 * 
 * @param {Object} obj key: default pairing
 * @returns Theme number
 */
export const themeGetter = async (obj) => {
    let res = await browserRuntime.storage.sync.get(obj);
    return res;
}

/**
 * Adds a storage listener
 * 
 * @param {Function} callback Gets called with whatever changes.key is
 * @param {string} key
 */
export const storageListener = async (callback, key) => {
    browserRuntime.storage.onChanged.addListener(
        async (changes, area) => {
            if(Object.keys(changes).includes(key)){
                callback(changes[key].newValue);
            }
        }
    )
}

/**
 * Generates an extension URL for path
 * 
 * @param {string} path 
 * @returns 
 */
export const url = (path) => {
    return browserRuntime.runtime.getURL(path)
}
