export class DataTable {
    constructor(tableElement, ) {
        this.table = tableElement;

        this.dataTable = document.getElementById('animalTable');
        this.comboboxNode = document.getElementById("cb1-input");
        this.buttonNode = document.getElementById("cb1-button");



        // create header row
        const tableHeader = this.dataTable.insertRow(0);
        this.csv.header.forEach(header => {
            // make cell a header cell
            tableHeader.insertCell(-1).outerHTML = "<th>" + header + "</th>";
        });

    }


    createContentRow(animal) {

        const tableRow = this.dataTable.insertRow(1);
        const animalRow = this.animalRowWithSoftHyphens(animal);
        animalRow.forEach((value, index) => {
            const td = tableRow.insertCell(-1);
            td.classList.add(value === this.randomAnimalRow[index] ? 'correct' : 'incorrect');
            td.textContent = value;
        });

    }
    alreadyGuessed(guess) {
        return this.guessList.includes(guess);
    }

    validateGuess(guess) {
        return this.csv.column0.includes(guess) && !this.alreadyGuessed(guess);
    }

    makeGuess(guess) {
        this.guessList.push(guess);
        this.createContentRow(guess);
        if (this.randomAnimalRow[0] === this.animalRowWithSoftHyphens(guess)[0]) {
            this.dataTable.classList.add('correct');

            this.comboboxNode.placeholder = "Gewonnen!";
            this.comboboxNode.disabled = true;
            this.buttonNode.disabled = true;

            this.dataTable.tBodies[0].childNodes.forEach(tr => {
                const animalNode = tr.firstChild;
                const link = this.links[animalNode.textContent.replace(/\u00AD/g,'')];
                if (link !== undefined) {
                    animalNode.innerHTML = "<a href='../lexikon/" + link + "'>" + animalNode.textContent + "</a>";
                }
            });
        }
    }
}