//Detect chrome
const browserRuntime = !!chrome ? chrome : browser;

/**
 * Gets theme from storage
 * @returns Theme number
 */
export const themeGetter = async () => {
    return await browserRuntime.storage.sync.get({"theme": 1});
}

/**
 * @callback StorageChangeCallback
 * @param {any} newValue The new value of the provided key
 */
/**
 * Adds a storage listener
 * 
 * @param {StorageChangeCallback} callback Gets called with whatever changes.key is
 * @param {string} key
 */
export const storageListener = async (callback, key) => {
    browserRuntime.storage.onChanged.addListener(
        async (changes) => {
            if(Object.keys(changes).includes(key)){
                callback(changes[key].newValue);
            }
        }
    );
}

/**
 * Generates an extension URL for path
 * 
 * @param {string} path 
 * @returns 
 */
export const url = (path) => {
    return browserRuntime.runtime.getURL(path);
}
