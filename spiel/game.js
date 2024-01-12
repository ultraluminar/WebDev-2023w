async function fetchAndParseCSV() {
    const csvResponse = await fetch('animals.csv');
    const csvText = await csvResponse.text();

    return csvText
        .split(/\r?\n/)
        .slice(1)
        .map(row => row.split(',').map(value => value.trim()))
        .filter(row => row.length > 1);
}

function extractFirstColumn(csvData) {
    return csvData.map(row => row[0]);
}

function flattenArray(arrayOfArrays) {
    return [].concat(...arrayOfArrays);
}

document.addEventListener('DOMContentLoaded', async function () {
    const datalist = document.getElementById('animalList');
    const searchInput = document.getElementById('searchInput');
    const logSelectionBtn = document.getElementById('logSelectionBtn');
    const selectedAnimalDisplay = document.getElementById('selectedAnimalDisplay');

    await updateOptions();

    searchInput.addEventListener('input', updateOptions);

    logSelectionBtn.addEventListener('click', logSelection);

    async function updateOptions() {
        const searchTerm = searchInput.value.toLowerCase();
        const csvData = await fetchAndParseCSV();
        const firstColumn = extractFirstColumn(csvData);
        const filteredOptions = firstColumn
            .filter(value => value.toLowerCase().includes(searchTerm))
            .slice(0, 5);

        datalist.innerHTML = "";
        filteredOptions.forEach(value => datalist.appendChild(new Option(value)));
    }

    async function logSelection() {
        const selectedValue = searchInput.value.toLowerCase();
        const csvData = await fetchAndParseCSV();

        const matchingRow = csvData.find(row => row[0].toLowerCase() === selectedValue);

        if (matchingRow) {
            selectedAnimalDisplay.textContent = 'Selected animal: ' + matchingRow.join(', ');
        } else {
            selectedAnimalDisplay.textContent = 'Invalid selection. Please choose from the provided options.';
        }
    }

});
