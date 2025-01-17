class ObjectArraySet {
    constructor(list) {
        this.items = list? list: []; // We'll use an array to store the objects
    }

    // Method to add or update an object by its _id
    add(object) {
        if (!object || !object._id) {
            console.error('Object must have an _id');
            return;
        }

        // Check if the object with this _id already exists
        const index = this.items.findIndex(item => item._id === object._id);

        if (index === -1) {
            // If not found, add the new object
            this.items.push(object);
        } else {
            // If found, update the existing object
            this.items[index] = object;
        }
    }

    // New method to add an array of objects (bulk data)
    addBulk(objects) {
        if (!Array.isArray(objects)) {
            console.error('Input must be an array of objects');
            return;
        }

        // Loop through each object and call the add method
        objects.forEach(object => this.add(object));
    }

    // Method to get an object by its _id
    get(_id) {
        return this.items.find(item => item._id === _id) || null;
    }

    // Method to check if the object with a certain _id exists
    has(_id) {
        return this.items.some(item => item._id === _id);
    }

    // Method to remove an object by its _id
    delete(_id) {
        this.items = this.items.filter(item => item._id !== _id);
    }

    // Get all values (objects) in the set
    values() {
        return this.items;
    }

    // Get the size of the set
    size() {
        return this.items.length;
    }

    // Clear the set
    clear() {
        this.items = [];
    }
}

export function deleteFromObjectArraySet(list, id) {
    const objectArraySet = new ObjectArraySet(list);
    objectArraySet.delete(id);

    return objectArraySet.items;
}

export function AddOrUpdateObjectArraySet(list, object) {
    const objectArraySet = new ObjectArraySet(list);
    objectArraySet.add(object);

    return objectArraySet.items;
}

export function GetFromObjectArraySet(list, id) {
    const objectArraySet = new ObjectArraySet(list);
    return objectArraySet.get(id);
}

export default ObjectArraySet;
