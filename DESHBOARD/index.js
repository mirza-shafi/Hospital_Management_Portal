// Basic JavaScript Example

// Print a message to the console
console.log("Hello, World!");

// Function to add two numbers
function addNumbers(a, b) {
    return a + b;
}

// Call the function and display the result
let result = addNumbers(5, 7);
console.log("The sum is: " + result);

// Create an object
let person = {
    name: "John Doe",
    age: 30,
    greet: function() {
        console.log("Hi, I'm " + this.name);
    }
};

// Access object properties and call a method
console.log("Name: " + person.name);
console.log("Age: " + person.age);
person.greet();

// Loop through an array
let fruits = ["Apple", "Banana", "Cherry"];
for (let fruit of fruits) {
    console.log("I like " + fruit);
}
