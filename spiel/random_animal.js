const csvFilePath = 'animals.csv';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function fetchCSV(csvFilePath) {
    return fetch(csvFilePath)
        .then(response => response.text())
        .then(csvData => {
            return csvData.split('\n')
                .map(line => line.trim())
                .filter(line => line !== '');
        });
}

fetchCSV(csvFilePath)
    .then(lines => {
        const randomAnimal = lines[getRandomInt(lines.length)];

        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = randomAnimal;
        document.body.appendChild(paragraphElement);
    })
    .catch(error => console.error('Error fetching CSV:', error));
