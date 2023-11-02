//Detect chrome
const browserRuntime = !!chrome ? chrome : browser;

/**
 * Gets an i18n message
 * @param {string} name
 * @returns {string}
 */
export const i18nGetter = (name) => {
  return browserRuntime.i18n.getMessage(name);
};

/**
 * Gets theme from storage
 * @param {Object<String, any>} search KVP of keys and default values
 * @returns {any} The value stored by the key
 */
export const storageGetter = async (search={theme: 1}) => {
  return browserRuntime.storage.sync.get(search);
};

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
export const storageListener = async (callback, key="theme") => {
  browserRuntime.storage.sync.onChanged.addListener(async (changes) => {
    if (Object.keys(changes).includes(key)) {
      callback(changes[key].newValue);
    }
  });
};

/**
 * Generates an extension URL for path
 *
 * @param {string} path
 * @returns {string}
 */
export const url = (path) => {
  return browserRuntime.runtime.getURL(path);
};
