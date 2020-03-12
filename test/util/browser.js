const {make_memory_storage} = require("../../lib/util/shared");

const storage = make_memory_storage();

// Save data to Storage
storage.setItem("key", "value");

// Get saved data from Storage
let data = storage.getItem("key");

// Remove saved data from Storage
storage.removeItem("key");

// Remove all saved data from Storage
storage.clear();

console.log(data, storage.getItem("key")); // logs: `value null`
