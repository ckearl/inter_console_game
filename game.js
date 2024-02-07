const readline = require("readline");
const fs = require("fs");
const Papa = require("papaparse");
const { parse } = require("path");

const csvFilePath = "countries.csv";
const csvData = fs.readFileSync(csvFilePath, "utf8");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let parsedData = parseData();
const correctCountryDict =
  parsedData[Math.floor(Math.random() * parsedData.length)];
let clues = parseClues(correctCountryDict);
let gameOver = false;

function parseData() {
  let parsedData;
  Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      // Save the parsed data to the variable
      parsedData = results.data;
      // console.log("Data saved to parsedData");
    },
    error: function (error) {
      console.error("Error parsing CSV:", error.message);
    },
  });
  return parsedData;
}

function parseClues(correctCountryDict) {
  let clues = {};

  for (let i = 0; i < 10; i++) {
    var keys = Object.keys(correctCountryDict);
    var currentClue = keys[Math.floor(Math.random() * keys.length)];
    while (
      correctCountryDict[currentClue] === "null" ||
      correctCountryDict[currentClue] === undefined ||
      correctCountryDict[currentClue] === ""
    ) {
      delete correctCountryDict[currentClue];
      currentClue = keys[Math.floor(Math.random() * keys.length)];
    }

    clues[currentClue] = correctCountryDict[currentClue];
    // console.log(`${i + 1}: ${currentClue}, ${clues[currentClue]}`);
    delete correctCountryDict[currentClue];
  }
  return clues;
}

function introMessage() {
  console.log("*****************************");
  console.log("Welcome to Intercontinentle!");
  console.log("*****************************");
  console.log(
    "You will be given up to 10 fact about a random country, and you must guess the correct country."
  );
  console.log(" - Guess any country by entering just the country name.");
  console.log(
    " - You may see the list of all possible countries by enteries 'countries'."
  );
  console.log(" - You may see the list of clues again by entering 'clues'.");
  console.log(" - If at any point you would like to quit, enter 'exit'.");
  console.log(
    "Please note that using 'countries' or 'clues' WILL count as a guess."
  );
  console.log("*****************************");
  console.log("Good Luck!");
  console.log("*****************************");
}

function askQuestion(clueNumber, clues, correctCountryDict) {
  let allCountries = [];
  for (let i = 0; i < parsedData.length; i++) {
    allCountries.push(parsedData[i]["official_country_name"]);
  }
  // console.log(correctCountryDict["official_country_name"]);

  return new Promise((resolve) => {
    const clueTitles = Object.keys(clues);
    const currentClue = clueTitles[clueNumber];
    console.log(
      `Clue ${clueNumber + 1}, ${currentClue}: ${clues[currentClue]}`
    );
    rl.question("Enter your guess for the country: ", (userInput) => {
      // console.log("You entered: ", userInput);
      // check if correct
      if (
        userInput.toLowerCase() ===
        correctCountryDict["official_country_name"].toLowerCase()
      ) {
        console.log("Congratulations! You guessed the correct country!");
        rl.close();
        resolve(true);
      } else if (userInput.toLowerCase() === "exit") {
        console.log(
          "The correct country was: ",
          correctCountryDict["official_country_name"]
        );
        console.log("Goodbye!");
        rl.close();
        resolve(true);
      } else if (userInput.toLowerCase() === "clues") {
        console.log("Here are the clues again:");
        for (let i = 0; i <= clueNumber; i++) {
          const currentClue = clueTitles[i];
          console.log(`Clue ${i + 1}, ${currentClue}: ${clues[currentClue]}`);
        }
        resolve(false);
      } else if (userInput.toLowerCase() === "countries") {
        console.log("Here are all the possible countries:");
        for (let i = 0; i < parsedData.length; i++) {
          console.log(parsedData[i]["official_country_name"]);
        }
        resolve(false);
      } else if (
        !(
          userInput.toLowerCase() in ["countries", "exit", "clues"] ||
          !(userInput.toLowerCase() in allCountries)
        )
      ) {
        console.log(
          "Entered input not one of the valid options. Please try again."
        );
        resolve(false);
      } else {
        if (clueNumber == 10) {
          console.log(
            "You have run out of clues. The correct country was: ",
            correctCountryDict["official_country_name"]
          );
          console.log("Goodbye!");
          rl.close();
          resolve(true);
        }
        console.log("Incorrect. Try again!");
        resolve(false);
      }
    });
  });
}

async function runGame(correctCountryDict, clues, clueNumber = 0) {
  introMessage();

  while (clueNumber < Object.keys(clues).length) {
    const gameOver = await askQuestion(clueNumber, clues, correctCountryDict);
    if (gameOver) {
      break;
    }
    clueNumber++;
    console.log(`You have ${10 - clueNumber}, clues left.`);
  }
}

runGame(correctCountryDict, clues);
