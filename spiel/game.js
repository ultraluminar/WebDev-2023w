"use strict";

async function loadAndParseCSV() {
    // load csv file anf get text
    const csvResponse = await fetch('animals.csv');
    const csvText = await csvResponse.text();

    // split text into rows and columns and remove empty cells
    let data = csvText
        .split(/\r?\n/)
        .map(row => row.split(',')
            .map(value => value.trim())
            .filter(value => value !== ''))
        .filter(row => row.length > 1);

    // split data into header, sorted data and sorted column0
    return {
        header: data.shift(),
        data: data.sort(),
        column0: data.map((row) => row[0].replace(/\u00AD/g,''))
    };
}

class AnimalTable {
    constructor(csv) {
        this.csv = csv;
        this.guessList = [];

        // get table and random animal row
        this.dataTable = document.getElementById('animalTable');
        this.randomAnimalRow = csv.data[Math.floor(Math.random() * csv.data.length)];


        // create header row
        const tableHeader = this.dataTable.insertRow(0);
        this.csv.header.forEach(header => {
            // make cell a header cell
            tableHeader.insertCell(-1).outerHTML = "<th>" + header + "</th>";
        });

    }
    animalRowWithSoftHyphens (animal) {
        // get animal row that includes soft hyphens
        return this.csv.data[this.csv.column0.indexOf(animal)]; }

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

        this.buttonNode.addEventListener('mousedown', this.onButtonMouseDown.bind(this));
        this.comboboxNode.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.comboboxNode.addEventListener('mousedown', this.onInputMouseDown.bind(this));
        this.comboboxNode.addEventListener('input', this.filterOptions.bind(this));


        this.comboboxNode.addEventListener('blur', this.onBlur.bind(this));

        nodesContent.forEach(nodeContent => {
            const li = Object.assign(
                document.createElement('li'),
                {textContent: nodeContent, role: 'option', tabindex: '-1' });

            li.addEventListener('mousedown',  this.onOptionMouseDown.bind(this));
            this.allOptions.push(li);

        });

    }
    onBlur(event) {
        this.Close();
    }

    onInputKeyDown(event) {
        if (!this.isOpen() && event.key.match(/[A-Za-z]/)) {
            this.filterOptions();
            this.Open();
            return;
        }
        if (event.key === "Enter" && this.filteredOptions.length > 0) {
            const guess = this.filteredOptions[0].textContent;
            if (this.animalTable.validateGuess(guess)) {
                this.Close();
                this.comboboxNode.value = "";
                this.filterOptions();
                this.animalTable.makeGuess(guess);
            }
        }
    }

    onOptionMouseDown(event) {
        event.preventDefault();
        this.Close();
        this.comboboxNode.value = "";
        this.filterOptions();
        this.animalTable.makeGuess(event.target.textContent);
    }

    isOpen() {
        return this.listboxNode.classList.contains('open');
    }

    onInputMouseDown() {
        this.filterOptions();
        this.Open();
    }

    onButtonMouseDown(event) {
        this.toggleOpen();
        event.preventDefault();

    }
    Open() {
        if (!this.isOpen()) {
            this.toggleOpen();
        }
    }

    Close() {
        if (this.isOpen()) {
            this.toggleOpen();
        }
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

        // create regex pattern and replace mask for highlighting
        const pattern = new RegExp(`(${filter})`, 'i');
        const replaceMask = '<b>$1</b>';

        // all options that match the filter or all options if filter is empty
        this.filteredOptions = (filter.length === 0) ? this.allOptions : this.allOptions.filter(
            option => option.textContent.match(pattern) !== null);

        // remove already guessed options
        this.filteredOptions = this.filteredOptions.filter(
            option => !this.animalTable.alreadyGuessed(option.textContent)
        );

        // sort options by index of first match
        this.filteredOptions.sort((a, b) => {
            return a.textContent.match(pattern).index - b.textContent.match(pattern).index;
        });

        // add options to listbox and highlight matches
        this.filteredOptions.forEach(option => {
            option.innerHTML = option.textContent.replace(pattern, replaceMask);
            this.listboxNode.appendChild(option);
        });
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const csv = await loadAndParseCSV();
    new Combobox(csv.column0, new AnimalTable(csv));
});