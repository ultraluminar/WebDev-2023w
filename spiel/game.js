async function fetchAndProcessCSV() {
    const response = await fetch('animals.csv');
    const csvData = await response.text();

    // Split the CSV data into rows, skip the first row (header), and then extract the first column
    return csvData
        .split('\n')
        .slice(1) // Skip the first row
        .map(row => row.split(',')[0].trim())
        .filter(value => value !== "");
}

async function updateOptions() {
    const datalist = document.getElementById('animalList');
    const searchInput = document.getElementById('searchInput');

    const searchValue = searchInput.value.toLowerCase();
    const allOptions = await fetchAndProcessCSV();
    const filteredOptions = allOptions.filter(value => value.toLowerCase().includes(searchValue));

    // Clear existing options
    datalist.innerHTML = "";

    // Add new filtered options
    filteredOptions.slice(0, 5).forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        datalist.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    updateOptions();

    // Add event listener for the search input
    document.getElementById('searchInput').addEventListener('input', updateOptions);
});
