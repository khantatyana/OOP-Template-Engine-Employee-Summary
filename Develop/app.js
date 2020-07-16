const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const writeFileAsync = util.promisify(fs.writeFile);

const employees = [];


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

async function userPrompts() {
    try {
    
        async function checkingName() {
            const userInput = await inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter the Employee's first and last name",
                    name: "name"
                }
                  
            ]);
            if (!userInput.name.includes(" ") || (userInput.name.split("")[0] !== userInput.name.split("")[0].toUpperCase())){
                return await checkingName();
            }
            return userInput.name;
        } 
        const name = await checkingName();

        async function checkingId(){
            const userInput = await inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter the Employee's id",
                    name: "id"
                }])
            if (isNaN(userInput.id)) {
                
                return await checkingId();
            } else {
                return userInput.id;
            }
        }
        const id = await checkingId();
        async function checkingEmail() {
            const userInput = await inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter Employee's email",
                    name: "email"
                }
            ]);
            if (!userInput.email.includes("@")) {
                return await checkingEmail();
            }
            return userInput.email;
        }
        const email = await checkingEmail();

        const roleInput = await inquirer.prompt([
            {
                type: "list",
                message: "Please choose Employee's role",
                name: "role",
                choices: [
                    "Manager",
                    "Engineer",
                    "Intern"
                ]
            }              
        ]);

        switch(roleInput.role) {
            case "Manager":
                const managerInput = await inquirer
                    .prompt({
                    type: "input",
                    name: "officeNumber",
                    message: "Please enter Employee's Office Number"
                    })
                employees.push(new Manager(name, id, email, managerInput.officeNumber));
              break;
            case "Engineer":
                const engineerInput = await inquirer
                .prompt({
                type: "input",
                name: "github",
                message: "Please enter Employee's GitHub"
                })
                employees.push(new Engineer(name, id, email, engineerInput.github));
              break;
            case "Intern":
                const internInput = await inquirer
                .prompt({
                type: "input",
                name: "school",
                message: "Please enter Employee's School"
                })
                employees.push(new Intern(name, id, email, internInput.school));
                break
            default:
              throw new Error("Try again");
        }
        
        const againInput = await inquirer.prompt({
            type: "confirm",
            message: "Do you want to add another Employee?",
            name: "again"
        })
        if (againInput.again === true) {
            return await userPrompts();
        } 
        
        writeFileAsync(outputPath, render(employees));
            console.log("Success!")
    } 
    catch (err) {
        console.log(err);
        }
        
}
userPrompts();



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
