"use strict";

class AnimalTable {
    constructor(csv) {
        this.csv = csv;
        this.guessList = [];

        this.dataTable = document.getElementById('animalTable');
        this.randomAnimalRow = csv.data[Math.floor(Math.random() * csv.data.length)];


        // create header row
        const tableHeader = this.dataTable.insertRow(0);
        this.csv.header.forEach(header => {
            const th = tableHeader.insertCell(-1)
            th.outerHTML = "<th>" + header + "</th>";
        });

    }

    createContentRow(animal) {
        const tableRow = this.dataTable.insertRow(1);
        const animalRow = this.csv.data.find(row => row[0] === animal);
        animalRow.forEach((value, index) => {
            const td = tableRow.insertCell(-1);
            td.classList.add(value === this.randomAnimalRow[index] ? 'correct' : 'incorrect');
            td.textContent = value;
        });

    }
    validateGuess(guess) {
        return this.csv.column0.includes(guess) && !this.guessList.includes(guess);
    }

    makeGuess(guess) {
        this.guessList.push(guess);
        this.createContentRow(guess);
    }
}

class Combobox{
    constructor(nodesContent, animalTable) {
        this.animalTable = animalTable;

        this.allOptions = [];
        this.option = null;

        this.filteredOptions = [];

        this.comboboxNode = document.getElementById("cb1-input");
        this.buttonNode = document.getElementById("cb1-button");
        this.listboxNode = document.getElementById("cb1-listbox");

        this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));
        this.comboboxNode.addEventListener('click', this.onInputClick.bind(this));
        this.comboboxNode.addEventListener('input', this.filterOptions.bind(this));
        this.comboboxNode.addEventListener('keydown', this.onInputKeyDown.bind(this));

        //TODO: close listbox on focusout

        nodesContent.forEach(nodeContent => {
            const li = Object.assign(
                document.createElement('li'),
                {textContent: nodeContent, role: 'option', tabindex: '-1' });

            li.addEventListener('click',  this.onOptionClick.bind(this));
            this.allOptions.push(li);

        });
        this.filterOptions();

    }

    onInputKeyDown(event) {
        if (event.key === "Enter" && this.isOpen() && this.filteredOptions.length > 0) {
            const guess = this.filteredOptions[0].textContent;
            if (this.animalTable.validateGuess(guess)) {
                this.toggleOpen();
                this.comboboxNode.blur();
                this.comboboxNode.value = "";
                this.filterOptions();
                this.animalTable.makeGuess(guess);
            }
        }
    }

    onOptionClick(event) {
        console.log(event)
        this.toggleOpen();
        this.comboboxNode.value = "";
        this.filterOptions();
        this.animalTable.makeGuess(event.target.textContent);
    }

    isOpen() {
        return this.listboxNode.classList.contains('open');
    }

    onInputClick() {
        if (!this.isOpen()) {
            this.toggleOpen();
        }
    }

    onButtonClick() {
        this.toggleOpen();
        (this.isOpen()) ? this.comboboxNode.focus() : this.comboboxNode.blur();
    }

    toggleOpen() {
        this.listboxNode.classList.toggle('open');
        this.toggleAttributeValue(this.comboboxNode, 'aria-expanded');
        this.toggleAttributeValue(this.buttonNode, 'aria-expanded');
    }

    toggleAttributeValue(node, attr) {
        node.setAttribute(attr, !node.getAttribute(attr).toString());
    }

    filterOptions(event) {
        let filter = event? event.target.value.toLowerCase() : '';

        this.listboxNode.innerHTML = '';

        const pattern = new RegExp(`(${filter})`, 'ig');
        const replaceMask = '<b>$1</b>';

        this.filteredOptions = (filter.length === 0) ? this.allOptions : this.allOptions.filter(
            option => option.textContent.match(pattern) !== null && !this.animalTable.guessList.includes(option.textContent));

        this.filteredOptions.forEach(option => {
            option.innerHTML = option.textContent.replace(pattern, replaceMask);
            this.listboxNode.appendChild(option);
        });

        if (this.filteredOptions.length > 0) {
            this.filteredOptions[0].setAttribute('aria-selected', 'true');
        }
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const csv = await loadAndParseCSV();

    const animalTable = new AnimalTable(csv)
    new Combobox(csv.column0.sort(), animalTable);
});

// Load CSV data from local file and parse it
async function loadAndParseCSV() {
    const csvResponse = await fetch('animals.csv'); 
    const csvText = await csvResponse.text();

    let data = csvText
        .split(/\r?\n/)
        .map(row => row.split(',')
            .map(value => value.trim())
            .filter(value => value !== ''))
        .filter(row => row.length > 1);

    return {
        header: data.shift(),
        column0: data.map(row => row[0]),
        data: data
    };
}