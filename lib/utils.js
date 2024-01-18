export async function csvTo2dArray(link) {
    // load csv file anf get text
    const csvResponse = await fetch(link);
    const csvText = await csvResponse.text();

    // split text into rows and columns and remove empty cells
    return csvText
        .split(/\r?\n/)
        .map(row => row.split(',')
            .map(value => value.trim())
            .filter(value => value !== ''))
        .filter(row => row.length > 1);
}