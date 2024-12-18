// Utility functions to set and get data in localStorage

const localStorageUtil = {
    // Set data in localStorage
    setData(key, object) {
        if (!key || typeof key !== 'string') {
            console.error('Invalid key provided');
            return;
        }

        // Convert object to a JSON string and save it in localStorage
        localStorage.setItem(key, JSON.stringify(object));
    },

    // Get data from localStorage
    getData(key) {
        if (!key || typeof key !== 'string') {
            console.error('Invalid key provided');
            return null;
        }

        // Retrieve item from localStorage
        const storedData = localStorage.getItem(key);

        // If data exists, parse it and return the object, otherwise return null
        return storedData ? JSON.parse(storedData) : null;
    },
    
    // Remove data from localStorage
    removeData(key) {
        if (!key || typeof key !== 'string') {
            console.error('Invalid key provided');
            return;
        }

        // Remove item from localStorage
        localStorage.removeItem(key);
    }
};

export default localStorageUtil