let newlabels = [];
let datapoints = [];
let chartCounter = 0;

window.onload = () => {
    // Select table button and dashboard area
    const chrtButton = document.getElementById('chrtbtn');
    const dashboard = document.getElementById('dashboard');

    chrtButton.setAttribute('draggable', true);

    chrtButton.addEventListener('dragstart', (event) => {
        console.log("Dragging Started");
        event.dataTransfer.setData('widgetType', 'chart');
    });

    dashboard.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    dashboard.addEventListener('drop', (event) => {
        event.preventDefault();
        const widgetType = event.dataTransfer.getData('widgetType');
        if (widgetType === 'chart') {
            createChart(event.clientX, event.clientY, 'bar', '500px', '300px', '2024-02-18', '2025-03-25', null, chartCounter);
        }
        console.log("Dropped on Dashboard");
    });
};

function createChart(initialX = 340, initialY = 60, chartType = 'bar', width = '500px', height = '300px', startDate = '2024-02-18', endDate = '2025-03-25', chartData = null, chartId = chartCounter++) {
    newlabels = [];
    datapoints = [];

    fetch('/Data/ChartData.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(item => {
                const date = new Date(item.SellingTime * 1000);
                return date >= new Date(startDate) && date <= new Date(endDate);
            });

            filteredData.forEach(item => {
                const date = new Date(item.SellingTime * 1000);
                const formattedDate = date.toISOString().split('T')[0];
                newlabels.push(formattedDate);
                datapoints.push(item.PartsSold);
            });

            if (chartData && chartData.labels && chartData.datasets && chartData.datasets[0] && chartData.datasets[0].data) {
                newlabels = chartData.labels;
                datapoints = chartData.datasets[0].data;
            }

            myChart.update();
        });

    const data = {
        labels: newlabels,
        datasets: [{
            label: 'No. of parts sold',
            data: datapoints,
            backgroundColor: ['#D0DBF8'],
            borderColor: ['#062F6F'],
            borderWidth: 1
        }]
    };

    const config = {
        type: chartType,
        data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Total no. of Parts',
                    color: '#062F6F',
                    position: 'left',
                    align: 'center',
                    font: { weight: 'bold' },
                    padding: 8,
                    fullSize: true,
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    };

    const chartContainer = document.getElementById('dashboard');
    const chartCard = document.createElement('div');
    chartContainer.appendChild(chartCard);
    chartCard.id = chartId;
    chartCard.classList = "chartCard"

    chartCard.style.left = `${initialX}px`;
    chartCard.style.top = `${initialY}px`;
    chartCard.style.width = width;
    chartCard.style.height = height;
    
    chartCard.setAttribute('draggable', true);
    chartCard.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', 'dragging');
        offsetX = event.offsetX;
        offsetY = event.offsetY;
    });

    chartCard.addEventListener('dragend', (event) => {
        chartCard.style.left = `${event.clientX - offsetX}px`;
        chartCard.style.top = `${event.clientY - offsetY}px`;
    });

    const canvas = document.createElement('canvas');
    canvas.id = `${chartId}-canvas`;
    const filterbar = document.createElement('div');
    filterbar.id = "filterbar";
    const selectfilter = document.createElement('div')
    selectfilter.id = "selectFilter"
    const chartTypeSelect = document.createElement('select');
    chartTypeSelect.id = `${chartId}-chartTypeSelect`;
    

    ['bar', 'line', 'pie'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.slice(0);
        chartTypeSelect.appendChild(option);
    });

    chartTypeSelect.value = chartType;
    chartTypeSelect.classList = "chartTypeSelect";

    chartTypeSelect.addEventListener('change', (event) => {
        chartType = event.target.value;
        myChart.destroy();
        config.type = chartType;
        myChart = new Chart(canvas, config);
    });
    

    const indate = document.createElement('input');
    indate.type = 'date';
    indate.id = `${chartId}-startdate`;
    indate.classList = "startdate"
    indate.value = startDate;
    
    const outdate = document.createElement('input');
    outdate.type = 'date';
    outdate.id = `${chartId}-enddate`;
    outdate.classList ="enddate"
    outdate.value = endDate;

    indate.addEventListener('change', () => filterdate(chartId)(indate.value, outdate.value));
    outdate.addEventListener('change', () => filterdate(chartId)(indate.value, outdate.value));

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times';
    deleteButton.id = `${chartId}-deleteButton`;
    deleteButton.classList = "chartDelete";
    deleteButton.addEventListener('click', () => {
        chartCard.remove();
    });

    selectfilter.appendChild(indate);
    selectfilter.appendChild(outdate);
    selectfilter.appendChild(chartTypeSelect);
    filterbar.appendChild(selectfilter);
    filterbar.appendChild(deleteButton);
    chartCard.appendChild(filterbar);
    chartCard.appendChild(canvas);

    let myChart = new Chart(canvas, config);

    const filterdate = chartId => (startDate, endDate) => {
        const dates2 = [...newlabels];

        const startdate = new Date(startDate);
        const enddate = new Date(endDate);

        console.log("New Start date is :", startDate);
        console.log("New End date is :", endDate);
        let currentDate = new Date(startdate);
        const allDates = [];

        while (currentDate <= enddate) {
            allDates.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const datefilter = allDates.filter(date => dates2.includes(date));
        console.log('Filtered dates:', datefilter);

        myChart.config.data.labels = datefilter;
        myChart.update();
    }
}
