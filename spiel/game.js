async function fetchAndProcessCSV() {
    const response = await fetch('animals.csv');
    const csvData = await response.text();

    return csvData
        .split(/\r?\n/)
        .slice(1)
        .map(row => row.split(',')[0].trim())
        .filter(value => value !== "");
}

document.addEventListener('DOMContentLoaded', async function () {
    const datalist = document.getElementById('animalList');
    const searchInput = document.getElementById('searchInput');

    await updateOptions();

    searchInput.addEventListener('input', updateOptions);

    async function updateOptions() {
        const searchValue = searchInput.value.toLowerCase();
        const allOptions = await fetchAndProcessCSV();
        const filteredOptions = allOptions
            .filter(value => value.toLowerCase().includes(searchValue))
            .slice(0, 5);

        datalist.innerHTML = "";
        filteredOptions.forEach(value => datalist.appendChild(new Option(value)));
    }
});
