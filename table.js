// create a row for each 
const table = document.getElementById('calendarTable');
const oneHourNode = document.createElement('tr');
const numToWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// get table of number elements
const numElements = Array(7);
for (let i = 0; i < numElements.length; i++) {
    numElements[i] = document.getElementById(numToWeek[i] + 'num');
}

for (let i = 0; i < 24; i++) {
    const currRow = oneHourNode.cloneNode(false);
    currRow.setAttribute('id', `${i}`);
    table.appendChild(currRow);

    // append 7 cells to the row
    const cellNode = document.createElement('td');
    for (let j = 0; j < 7; j++) {
        const currCell = cellNode.cloneNode(false);
        currCell.setAttribute('headers', numToWeek[j]);
        currRow.appendChild(currCell);
    }
}