// Load dashboard on window load
window.addEventListener('load', dshbrd);

function dshbrd() {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardPath = urlParams.get("path");

    const dashboardData = JSON.parse(localStorage.getItem(`dashboard_${dashboardPath}`)) || { widgets: [] };

    if (dashboardData) {
        document.querySelector("h2").textContent = `${dashboardData.name}`;
        
        if (dashboardData.widgets.length > 0) {
            dashboardData.widgets.forEach(widget => {
                if (widget.type === 'table') {
                    createTable(widget.x, widget.y, widget.width, widget.height);
                } else if (widget.type === 'chart') {
                    createChart(
                        widget.x, 
                        widget.y, 
                        widget.chartType, 
                        widget.width, 
                        widget.height, 
                        widget.startdate, 
                        widget.enddate, 
                        widget.chartData,
                        widget.chartcounter
                    );
                }
            });
        }
    } else {
        console.log("No dashboard data found for this path.");
    }
}

// Publish button click event handler
publishButton.onclick = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardPath = urlParams.get("path");

    const widgets = [];
    document.querySelectorAll('#dashboard > div').forEach(widget => {
        const widgetType = widget.id.includes('tableContainer') ? 'table' : 'chart';
        const x = parseInt(widget.style.left, 10);
        const y = parseInt(widget.style.top, 10);
        const width = widget.style.width;
        const height = widget.style.height;

        if (widgetType === 'table') {
            widgets.push({ type: widgetType, x, y, width, height });
        } else {
            const id  = widget.id;
            const chartType = document.getElementById(`${id}-chartTypeSelect`).value;
            const startdate = document.getElementById(`${id}-startdate`).value;
            const enddate = document.getElementById(`${id}-enddate`).value;
            const chartCanvas = document.getElementById(`${id}-canvas`);
            const chartInstance = Chart.getChart(chartCanvas);

            let chartData = { labels: [], datasets: [] };
            
            if (chartInstance) {
                chartData.labels = chartInstance.data.labels;
                chartData.datasets = chartInstance.data.datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                }));
            }

            widgets.push({ 
                type: widgetType, 
                x, 
                y, 
                chartType, 
                width, 
                height, 
                startdate, 
                enddate, 
                chartData 
            });
        }
    });
    const storedObjectString = localStorage.getItem(`dashboard_${dashboardPath}`);
    const storedObject = JSON.parse(storedObjectString);
    const name = storedObject.name;
    const updatedDashboardData = {
        name: name,
        path: dashboardPath,
        widgets: widgets,
    };

    localStorage.setItem(`dashboard_${dashboardPath}`, JSON.stringify(updatedDashboardData));

    alert("Dashboard Published!");
    window.location.href = "/Main/mainScreen.html";
};
