const LocalStorageUtil = {
  /**
   * Save data to localStorage.
   * @param {string} key - The key under which to store the value.
   * @param {*} value - The value to store.
   */
  setItem: (key, value) => {
    if (!key) {
      console.warn("Key is required for setItem");
      return;
    }
    try {
      const item = { value };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  },

  /**
   * Retrieve data from localStorage.
   * @param {string} key - The key to retrieve.
   * @returns {*} The stored value, or null if not found or expired.
   */
  getItem: (key) => {
    if (!key) {
      console.warn("Key is required for getItem");
      return null;
    }
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      return item.value;
    } catch (error) {
      console.error("Error retrieving from localStorage", error);
      return null;
    }
  },

  /**
   * Update data in localStorage.
   * @param {string} key - The key to update.
   * @param {Object|Array} newValue - The new values to merge into the existing data.
   */
  updateItem: (key, newValue) => {
    if (!key) {
      console.warn("Key is required for updateItem");
      return;
    }
    try {
      const existingValue = LocalStorageUtil.getItem(key);
      if (existingValue && typeof existingValue === "object") {
        const updatedValue =
          Array.isArray(existingValue) && Array.isArray(newValue)
            ? [...existingValue, ...newValue] // Merge arrays
            : { ...existingValue, ...newValue }; // Merge objects
        LocalStorageUtil.setItem(key, updatedValue);
      } else {
        console.warn(`No existing object/array data found for key: ${key}`);
      }
    } catch (error) {
      console.error("Error updating localStorage", error);
    }
  },

  /**
   * Delete data from localStorage.
   * @param {string} key - The key to remove.
   */
  removeItem: (key) => {
    if (!key) {
      console.warn("Key is required for removeItem");
      return;
    }
    try {
      localStorage /* The `removeItem` method in the `LocalStorageUtil` object is used to delete data
      from the localStorage based on the provided key. It takes a single parameter
      `key`, which is the key of the data that needs to be removed from the
      localStorage. */
        .removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  },

  /**
   * Check if a key exists in localStorage.
   * @param {string} key - The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   */
  exists: (key) => {
    if (!key) {
      console.warn("Key is required for exists");
      return false;
    }
    return localStorage.getItem(key) !== null;
  },

  /**
   * Clear all localStorage data and remove expired keys.
   */
  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },
};

export default LocalStorageUtil;
