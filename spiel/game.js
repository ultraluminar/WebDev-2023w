let csvData, csvHeader;
let debounceTimeout;
let randomAnimalRow;

let tryList = [];
let maxVersuche = 10;

// Load CSV data from local file and parse it
async function loadAndParseCSV() {
    const csvResponse = await fetch('animals.csv'); 
    const csvText = await csvResponse.text();

    // split by newlines, split by commas, trim whitespace, remove empty rows and empty values
    csvData = csvText
        .split(/\r?\n/)
        .map(row => row.split(',')
            .map(value => value.trim())
            .filter(value => value !== ''))
        .filter(row => row.length > 1);

    csvHeader = csvData.shift(); // remove header row from data
}

// get header row from CSV data
function extractFirstColumn(data) {
    return data.map(row => row[0]);
}



// after page has loaded
document.addEventListener('DOMContentLoaded', async function () {
    // get html elements
    const datalist = document.getElementById('animalList');
    const dataTable = document.getElementById('animalTable');
    const searchInput = document.getElementById('searchInput');
    const logSelectionBtn = document.getElementById('logSelectionBtn');

    // load and parse CSV data, exit if failed
    try { await loadAndParseCSV(); } 
    catch (error) {
        console.error('Failed to fetch CSV data:', error);
        return;
    }

    // get random animal from CSV data
    randomAnimalRow = getRandomAnimalRow();
    
    // Add header row to animalTable
    createHeaderRow();

    // Debounce input event to avoid updating options too often
    searchInput.addEventListener('input', getDeboucer());

    // Log selection on button click or enter key press
    logSelectionBtn.addEventListener('click', tryGuess);
    searchInput.addEventListener('keydown', tryOnEnter);
        
    

    // Update options in datalist based on search input
    function updateOptions() { 
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOptions = extractFirstColumn(csvData)
            // get up to 5 options that match search term
            .filter(value => value.toLowerCase().includes(searchTerm))
            .slice(0, 5);

        // remove old options and add new options
        datalist.innerHTML = "";
        filteredOptions.forEach(value => datalist.appendChild(new Option(value)));
    }

    function tryGuess() {
        const guessedAnimal = searchInput.value.toLowerCase();
        const guessedAnimalRow = csvData.find(row => row[0].toLowerCase() === guessedAnimal);


        // if selected animal is valid
        if (guessedAnimalRow) {
            if (tryList.length === maxVersuche) {
                console.log("You have already tried 5 times!, Game Over!");
                return; }
            // if selected animal has already been tried
            if (tryList.includes(guessedAnimal)) {
                console.log("You have already tried this animal, try another one!");
                return; }

            createContentRow(guessedAnimalRow, randomAnimalRow);

            if (guessedAnimal === randomAnimalRow[0]) {
                console.log("You have guessed the animal, Congratulations!");
                return; }
        }
    }

    function createContentRow(playerGuessRow, randomAnimalRow) {
        const tableRow = dataTable.insertRow(1);

        playerGuessRow.forEach((value, index) => {
            const td = tableRow.insertCell(-1);
            td.textContent = value;
            td.classList.add(value === randomAnimalRow[index] ? 'correct' : 'incorrect');
        });
    }


    function createHeaderRow() {
        const tableHeader = dataTable.insertRow(0);
        csvHeader.forEach(header => {
            const th = tableHeader.insertCell(-1);
            th.textContent = header;
        });
    }


    function getRandomAnimalRow() {
        return csvData[Math.floor(Math.random() * csvData.length)];
    }

    function getDeboucer(){
        return () => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(updateOptions, 300);
        }
    }
    
    function tryOnEnter(event) {
        if (event.key === 'Enter') {
            tryGuess();
        }
    }
});

