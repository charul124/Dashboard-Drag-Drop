let tableCounter = 0;
window.addEventListener('load', dragTable);

function dragTable(){
    const tblButton = document.getElementById('tblbtn');
    const dashboard = document.getElementById('dashboard');

    tblButton.setAttribute('draggable', true);

    tblButton.addEventListener('dragstart', (event) => {
        console.log("Dragging Started");
        event.dataTransfer.setData('widgetType', 'table');
    });

    dashboard.addEventListener('dragover', (event) => {
        console.log("Dragging Over");
        event.preventDefault();
    });

    dashboard.addEventListener('drop', (event) => {
        event.preventDefault();
        const widgetType = event.dataTransfer.getData('widgetType');
        if (widgetType === 'table') {
            createTable(event.offsetX, event.offsetY, '500px', '300px');
        }
        console.log("I have been Dropped");
    });
};

function createTable(initialX = 940, initialY = 60, width = '500px', height = '300px') {
    fetch('/Data/TableData.json')
        .then(response => response.json())
        .then(tableData => {
            tableCounter++;

            const tableCard = document.getElementById('dashboard');
            const tableContainer = document.createElement('div');
            tableContainer.id = `tableContainer-${tableCounter}`;
            tableContainer.classList = 'tablecontainer'
            tableCard.appendChild(tableContainer);

            const tablefilter = document.createElement('div')
            tablefilter.classList ="tablefilter"
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times';
            deleteButton.id = 'tbldelete';
            deleteButton.addEventListener('click', () => {
                tableContainer.remove();
            });

            const table = document.createElement('table');
            table.id = `myTable-${tableCounter}`;

            const searching = document.createElement("input");
            searching.classList = 'search';
            searching.type = "search";
            searching.placeholder = "Search here...";
            searching.addEventListener('input', () => searchTable(tableContainer.id));
            tablefilter.appendChild(searching)
            tablefilter.appendChild(deleteButton);
            tableContainer.appendChild(tablefilter);
            tableContainer.appendChild(table);
            tableContainer.setAttribute('draggable', true);

            tableContainer.style.left = `${initialX}px`;
            tableContainer.style.top = `${initialY}px`;
            tableContainer.style.height = height;
            tableContainer.style.width = width;

            tableContainer.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', 'dragging');
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            });

            tableContainer.addEventListener('dragend', (event) => {
                tableContainer.style.left = `${event.clientX - offsetX}px`;
                tableContainer.style.top = `${event.clientY - offsetY}px`;
            });

            const headers = Object.keys(tableData[0]);
            headers.forEach(header => {
                const th = document.createElement('th');
                th.innerHTML = header;
                th.setAttribute('data-column-index', headers.indexOf(header));
                th.addEventListener('click', () => sortTable(table.id, headers.indexOf(header)));
                table.appendChild(th);
                
            });

            tableData.forEach(rowData => {
                const row = document.createElement('tr');
                row.setAttribute('name', `table-rows-${tableCounter}`);
                headers.forEach(column => {
                    const cell = document.createElement('td');
                    cell.innerHTML = rowData[column];
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });
        });
}


function searchTable(containerId) {
    const tableContainer = document.getElementById(containerId);
    if (!tableContainer) {
        console.error('Table container not found with ID:', containerId);
        return;
    }
    const input = tableContainer.querySelector('.search');
    const table = tableContainer.querySelector('table');
    if (!table) {
        console.error('Table not found in container with ID:', containerId);
        return;
    }
    const filter = input.value.toLowerCase();
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let showRow = false;
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    showRow = true;
                    break;
                }
            } 
        }
        tr[i].style.display = showRow ? '' : 'none';
    }
    
}

let sortOrder = true;

function sortTable(tableId, column) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll(`tr[name^="table-rows"]`));
    const sortedRows = rows.sort((a, b) => {
        let firstRow = a.querySelectorAll('td')[column].textContent;
        let secondRow = b.querySelectorAll('td')[column].textContent;
        if (firstRow < secondRow) return sortOrder ? -1 : 1;
        if (firstRow > secondRow) return sortOrder ? 1 : -1;
        return 0;
    });

    sortedRows.forEach(sortedRow => table.appendChild(sortedRow));
    sortOrder = !sortOrder;
}
