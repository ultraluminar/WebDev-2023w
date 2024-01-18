// await whole document is loaded
document.addEventListener('DOMContentLoaded', () => {
    function main() {
        // get HTML elements
        const html = {
            combobox1 : {
                input : document.getElementById('combobox1-input'),
                button : document.getElementById('combobox1-button'),
                listbox : document.getElementById('combobox1-listbox')},
            datatable : document.getElementById('datatable1')}

        new DataTable1(html);

        // TODO: do more stuff here
    }

    async function csvTo2dArray(link) {
        const csvResponse = await fetch(link);
        const csvText = await csvResponse.text();

        return csvText
            .split(/\r?\n/)
            .map(row => row.split(',')
                .map(value => value.trim())
                .filter(value => value !== ''))
            .filter(row => row.length > 1);
    }

    class ComboBox{
        constructor(htmlElements) {
            this.html = htmlElements;
            // TODO: ComboBox
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
            console.log(this.html);
        }
    }

    main();
});

