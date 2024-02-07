const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "countries.csv";

const csvData = fs.readFileSync(csvFilePath, "utf8");

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


const correctCountryDict = parsedData[Math.floor(Math.random() * parsedData.length)];
console.log(correctCountryDict['official_country_name']);
let clues = {};

for (let i = 0; i < 10; i++) {
  var keys = Object.keys(correctCountryDict);
  var currentClue = keys[Math.floor(Math.random() * keys.length)];
  while (correctCountryDict[currentClue] === "null" || correctCountryDict[currentClue] === undefined) {
    delete correctCountryDict[currentClue];
    currentClue = keys[Math.floor(Math.random() * keys.length)];
  }

  clues[currentClue] = correctCountryDict[currentClue];
  console.log(`${i+1}: ${currentClue}, ${clues[currentClue]}`);
  delete correctCountryDict[currentClue];
}

const gameData = {
  correctCountryDict,
  clues,
};

module.exports = {
  gameData
};

export default gameData;