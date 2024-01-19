// await whole document is loaded
document.addEventListener('DOMContentLoaded',  async () => {
    async function main() {
        const nodes = {
            input: document.getElementById('cb1-input'),
            button: document.getElementById('cb1-button'),
            listbox: document.getElementById('cb1-listbox'),
            datatable: document.getElementById('animalTable'),
            group_: document.getElementsByClassName('group')[0]
        }

        const csv = await parseAnimalsCSV();
        const links = await parseLinksCSV();
        new ComboBoxAnimals(nodes, csv.column0, new DataTableAnimals(nodes, csv, links));
    }

    async function csvTo2dArray(link) {

        const csvResponse = await fetch(link);
        const csvText = await csvResponse.text();

        if (csvResponse.status === 404) { throw new Error('ERROR CSV-File not found: "' + link + '"'); }
        if (csvText === '') { throw new Error('ERROR CSV-File is empty: "' + link + '"'); }

        return csvText
            .split(/\r?\n/)
            .map(rows => rows.split(',')
                .map(value => value.trim())
                .filter(value => value !== ''))
            .filter(value => value.length > 0);
    }

    async function parseAnimalsCSV() {
        const csv = await csvTo2dArray('./animals.csv');

        return {
            header: csv.shift(),
            body: csv.sort(),
            column0: csv.map(row => row[0])
        };
    }

    async function parseLinksCSV() {
        const data = await csvTo2dArray('../lexikon/links.csv');

        // remove header
        data.shift();
        return data.reduce((acc, row) => {
            acc[row[0]] = row[1];
            return acc;
        }, {});
    }

    class ComboBox {
        constructor(htmlElements, allOptionsTexts, dataTable) {
            this.nodes = htmlElements;
            this.dataTable = dataTable;
            this.options = { all: [], filtered: [] }

            this.options.all = allOptionsTexts.map(optionText => {
                const li = document.createElement('li');
                li.addEventListener('mousedown', this.onOptionMouseDown.bind(this));
                return Object.assign(li, {textContent: optionText, role: 'option', tabindex: '-1'});
            });

            this.nodes.button.addEventListener('mousedown', this.onButtonMouseDown.bind(this));
            this.nodes.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
            this.nodes.input.addEventListener('input', this.filterOptions.bind(this));

            this.nodes.input.addEventListener('mousedown', this.openDropdown.bind(this));
            this.nodes.input.addEventListener('blur', this.closeDropdown.bind(this));

        }

        submitOption(optionText) {
            this.closeDropdown();
            this.nodes.input.value = '';
            this.dataTable.submitOption(optionText);
        }

        onOptionMouseDown(event) {
            this.submitOption(event.target.textContent);
            event.preventDefault();

        }

        onButtonMouseDown(event) {
            this.isDropdownOpen() ? this.closeDropdown() : this.openDropdown();
            event.preventDefault();
        }

        onInputKeyDown(event) {
            if (!this.isDropdownOpen()) {
                this.openDropdown();
                return;
            }
            if (this.options.filtered.length !== 0) {
                const optionText = this.options.filtered[0].textContent;
                if (event.key === "Enter" && this.dataTable.isSubmitable(optionText)) {
                    this.submitOption(optionText);
                }
            }
        }

        isDropdownOpen() {
            return this.nodes.listbox.classList.contains('open');
        }

        closeDropdown() {
            if (this.isDropdownOpen()) {
                this.nodes.listbox.classList.remove('open');
                this.nodes.group_.classList.remove('open');
                this.nodes.input.ariaExpanded = 'false';
                this.nodes.button.ariaExpanded = 'false';
            }
        }

        openDropdown() {
            if (!this.isDropdownOpen()) {
                this.filterOptions();
                this.nodes.listbox.classList.add('open');
                this.nodes.group_.classList.add('open');
                this.nodes.input.ariaExpanded = 'true';
                this.nodes.button.ariaExpanded = 'true';
            }
        }

        filterOptions() {
            const filterText = this.nodes.input.value;
            this.nodes.listbox.innerHTML = '';

            const pattern = new RegExp(filterText, 'i');
            const replace_mask = '<b>$&</b>';

            this.options.filtered = (filterText === '') ? this.options.all : this.options.all.filter(
                option => option.textContent.match(pattern) !== null);


            this.options.filtered = this.options.filtered.filter(
                option => !this.dataTable.alreadySubmitted(option.textContent)
            );


            this.options.filtered.sort((a, b) => {
                return a.textContent.match(pattern).index - b.textContent.match(pattern).index;
            });

            this.nodes.listbox.innerHTML = '';
            this.options.filtered.forEach(option => {
                option.innerHTML = option.textContent.replace(pattern, replace_mask);
                this.nodes.listbox.appendChild(option);
            });
        }
    }

    class ComboBoxAnimals extends ComboBox {
        constructor(htmlElements, allOptionsTexts, dataTable) {
            super(htmlElements, allOptionsTexts, dataTable);
        }
    }

    class DataTable {
        constructor(htmlElements, csv, targetRow) {
            this.nodes = htmlElements;
            this.csv = csv;
            this.submits = [];
            this.targetRow = targetRow;

            const header_row = this.nodes.datatable.insertRow();
            this.csv.header.forEach(header => {
                header_row.insertCell(-1).outerHTML = '<th>' + header + '</th>';
            });
        }
        alreadySubmitted(optionText) {
            return this.submits.includes(optionText);
        }
        isSubmitable(optionText) {
            return !this.alreadySubmitted(optionText) && this.csv.column0.includes(optionText);
        }

        submitOption(optionText) {
            this.submits.push(optionText);

            const rowContents = this.bodyRowByColumn0(optionText);
            this.createTableRow(rowContents, this.targetRow);

            if (optionText === this.targetRow[0]) {
                this.onMatch();
            }
        }
        onMatch() {
            this.nodes.datatable.classList.add('correct');
            this.nodes.input.placeholder = "Gewonnen!";
            this.nodes.input.disabled = true;
            this.nodes.button.disabled = true;
        }

        bodyRowByColumn0(optionText) {
            return this.csv.body[this.csv.column0.indexOf(optionText)];
        }

        createTableRow(rowContents, targetRow) {
            const row = this.nodes.datatable.insertRow(1);
            rowContents.forEach((value, index) => {
                const td = row.insertCell(-1);
                td.classList.add(value === targetRow[index] ? 'correct' : 'incorrect');
                td.textContent = value;
            });

        }
    }


    class DataTableAnimals extends DataTable {
        constructor(htmlElements, csv, links) {
            const targetRow = csv.body[Math.floor(Math.random() * csv.body.length)];
            console.log(targetRow[0]);
            const sup = super(htmlElements, csv, targetRow);
            sup.links = links;
        }

        onMatch() {
            super.onMatch();
            this.linkUpColumn0();
        }

        linkUpColumn0() {
            this.nodes.datatable.tBodies[0].childNodes.forEach(tr => {
                const animalNode = tr.firstChild;
                const link = this.links[animalNode.textContent.replace(/\u00AD/g,'')];
                if (link !== undefined) {
                    animalNode.innerHTML = "<a href='../lexikon/" + link + "'>" + animalNode.textContent + "</a>";
                }
            });
        }
    }
    await main();
});

