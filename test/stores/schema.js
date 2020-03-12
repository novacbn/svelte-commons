const {schema} = require("../../lib/stores/shared/schema");

// TODO: Switch to testing framework

const person_schema = {
    $id: "https://example.com/person.schema.json",
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Person",
    type: "object",
    properties: {
        firstName: {
            type: "string",
            description: "The person's first name."
        },

        lastName: {
            type: "string",
            description: "The person's last name."
        },

        age: {
            description: "Age in years which must be equal to or greater than zero.",
            type: "integer",
            minimum: 0
        }
    }
};

const initial_person = {
    firstName: "John",
    lastName: "Smith",
    age: 32
};

const store = schema(initial_person, person_schema);

store.subscribe(console.log); // logs: `{firstName: "John", lastName: "Smith", age: 32}`

store.set({...initial_person, age: 21}); // logs: `{firstName: "John", lastName: "Smith", age: 21}`

store.set({...initial_person, age: -60}); // throws exception: `Uncaught TypeError: bad change 'Person/age' to Schema Store (Value -60 is less than minimum 0)`
