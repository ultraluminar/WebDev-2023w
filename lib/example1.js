// await whole document is loaded
document.addEventListener('DOMContentLoaded',  async () => {
    async function main() {
        const html = {
            combobox1: {
                input: document.getElementById('combobox1-input'),
                button: document.getElementById('combobox1-button'),
                listbox: document.getElementById('combobox1-listbox')
            },
            datatable: document.getElementById('datatable1')
        }

        // TODO: main
        const csv = await parseExample1CSV();
        new ComboBox1(html, csv.column0);
        new DataTable1(html);
    }

    async function csvTo2dArray(link) {

        const csvResponse = await fetch(link);
        const csvText = await csvResponse.text();

        if (csvResponse.status === 404) { throw new Error('ERROR CSV-File not found: "' + link + '"'); }
        if (csvText === '') { throw new Error('ERROR CSV-File is empty: "' + link + '"'); }

        return csvText
            .split(/\r?\n/)
            .map(row => row.split(',')
                .map(value => value.trim())
                .filter(value => value !== ''))
            .filter(row => row.length > 1);
    }

    async function parseExample1CSV() {
        const csv = await csvTo2dArray('./example1.csv');

        // TODO: parseExampleCSV
        return {
            header: csv.shift(),
            body: csv.sort(),
            column0: csv.map(row => row[0])
        };
    }

    class ComboBox {
        constructor(htmlElements, allOptionsTexts) {
            this.html = htmlElements;

            this.allOptions = allOptionsTexts.map(optionText => {
                const li = document.createElement('li');
                return Object.assign(li, {textContent: optionText, role: 'option', tabindex: '-1'});
            });

            // TODO: ComboBox
            this.filterOptions();
        }

        filterOptions() {
            // TODO: filterOptions
            this.html.combobox1.listbox.innerHTML = '';

            this.allOptions.forEach(option => {
                this.html.combobox1.listbox.appendChild(option);
            });
        }
    }

    class ComboBox1 extends ComboBox {
        constructor(htmlElements, allOptionsTexts) {
            super(htmlElements, allOptionsTexts);
            //TODO: ComboBox1
        }
    }

    class DataTable {
        constructor(htmlElements) {
            this.html = htmlElements;
            // TODO: DataTable
        }
    }


    class DataTable1 extends DataTable {
        constructor(htmlElements) {
            super(htmlElements);
            //TODO: DataTable1
        }
    }

    await main();
});

