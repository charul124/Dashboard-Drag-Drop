var modal = document.getElementById("create-dashboard-modal");
var modalbg = document.getElementById('modalbg');
var createbtn = document.getElementById("create-dashboard");
var closebtn = document.getElementById("closebtn");
var form = document.getElementById("dashboard-form");
var dashboardList = document.getElementById("dashboard-list");

// Close modal
closebtn.onclick = function () {
    modal.style.display = "none";
    modalbg.style.backgroundColor = "white"

};

// Open modal
createbtn.onclick = function () {
    modal.style.display = "block";
    modalbg.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
};

// Handle form submission
submitbtn.onclick = function (event) {
    event.preventDefault();

    const dashboardName = document.getElementById("dashboard-name").value;
    const dashboardDescription = document.getElementById("dashboard-description").value;
    const dashboardPath = document.getElementById("dashboard-path").value;

    const dashboardData = {
        name: "Your Dashboard : " + dashboardName,
        description: dashboardDescription,
        path: dashboardPath,
        widgets: [],
    };

    localStorage.setItem(`dashboard_${dashboardPath}`, JSON.stringify(dashboardData));

    
    const dashboards = JSON.parse(localStorage.getItem("dashboards")) || [];
    dashboards.push({ name: dashboardName, description: dashboardDescription, path: dashboardPath });
    localStorage.setItem("dashboards", JSON.stringify(dashboards));

    window.location.href = `/Dashboard/dashboardBuilder.html?path=${dashboardPath}`;
};

const availabledashboard = document.getElementById('availabledash');

// Render available dashboards
function renderDashboards() {
    dashboardList.innerHTML = "";
    let dashboards = JSON.parse(localStorage.getItem("dashboards")) || [];
    if(dashboards.length == 0){
        dash = document.createElement('h2');
        dash.innerHTML ="No Dashboards Available";
        availabledashboard.appendChild(dash);
    }else{
        dash = document.createElement('h2');
        dash.innerHTML ="Available Dashboards"
        availabledashboard.appendChild(dash);
    }

    dashboards.forEach(function (dashboard) {
        var dashboardItem = document.createElement("div");
        dashboardItem.id = "dashboard"
        dashboardItem.innerHTML = `<img id="dashboardimg" src="/Dashboard/Images/Dashboardimg.png" alt="dashimage">
            <h3>${dashboard.name}</h3>
            <p>${dashboard.description}</p>
            <a href="/Dashboard/dashboardBuilder.html?path=${dashboard.path}">Open Dashboard</a>`;

        dashboardList.appendChild(dashboardItem);
    });
}

renderDashboards();