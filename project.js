const getParam = (k) => new URLSearchParams(location.search).get(k) || "";

const DATA = {
  cottonil: {
    name: "Cottonil Retail Analysis",
    live: "https://app.powerbi.com/view?r=eyJrIjoiYjM4ZmE2ZWItMTgzMC00MDcwLWE5YjAtNGRlMWRhOWM5ODg3IiwidCI6IjJiYjZlNWJjLWMxMDktNDdmYi05NDMzLWMxYzZmNGZhMzNmZiIsImMiOjl9",
    images: [
      { label: "Main Dashboard", src: "assets/cottonil-main.png" },
      { label: "Sales & Discount", src: "assets/cottonil-sales%20%26%20discount.png" },
      { label: "Returns", src: "assets/cottonil-returns.png" },
      { label: "Suppliers", src: "assets/cottonil-suppliers.png" },
      { label: "Inventory", src: "assets/cottonil-inventory.png" }
    ]
  },
  fleet: {
    name: "Fleet Management Analysis",
    live: "https://app.powerbi.com/view?r=eyJrIjoiMjZhNWJkOGQtZDA0OS00YTRmLTlmNDYtNDg3MTJkOTAxNDgxIiwidCI6IjJiYjZlNWJjLWMxMDktNDdmYi05NDMzLWMxYzZmNGZhMzNmZiIsImMiOjl9",
    images: [
      { label: "Executive View", src: "assets/fleet-Executive-Dashboard.png" },
      { label: "Fuel Analysis", src: "assets/fleet-Fuel-Analysis.png" },
      { label: "Repair Details", src: "assets/fleet-repair.png" },
      { label: "Vehicle Status", src: "assets/fleet-vehicle-details.png" }
    ]
  }
};

const key = (getParam("p") || "cottonil").toLowerCase();
const project = DATA[key];

// Elements
const pageTitle = document.getElementById("pageTitle");
const pageSub = document.getElementById("pageSub");
const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const openFull = document.getElementById("openFull");
const shotsView = document.getElementById("shotsView");
const liveView = document.getElementById("liveView");
const showShots = document.getElementById("showShots");
const showLive = document.getElementById("showLive");
const liveFrame = document.getElementById("liveFrame");

let idx = 0;

function openShots() {
  shotsView.style.display = "block";
  liveView.style.display = "none";
  showShots.classList.add("primary");
  showLive.classList.remove("primary");
}

function openLive() {
  if (!project.live) return;
  shotsView.style.display = "none";
  liveView.style.display = "block";
  showLive.classList.add("primary");
  showShots.classList.remove("primary");
  if (!liveFrame.src) liveFrame.src = project.live;
}

function setImage(i) {
  if (!project) return;
  idx = (i + project.images.length) % project.images.length;
  const item = project.images[idx];

  mainImg.src = item.src;
  openFull.href = item.src;

  // Update Thumbnails Active State
  Array.from(thumbs.children).forEach((btn, j) => {
    btn.classList.toggle("is-active", j === idx);
  });
}

function init() {
  if (!project) {
    pageTitle.textContent = "Project Not Found";
    return;
  }

  pageTitle.textContent = project.name;
  
  // Hide Live button if no link exists
  if (!project.live) showLive.style.display = "none";

  // Render Thumbs
  thumbs.innerHTML = "";
  project.images.forEach((img, i) => {
    const b = document.createElement("button");
    b.className = "thumb";
    b.textContent = img.label;
    b.onclick = () => setImage(i);
    thumbs.appendChild(b);
  });

  setImage(0);
}

// Events
showShots.onclick = openShots;
showLive.onclick = openLive;
document.getElementById("prevBtn").onclick = () => setImage(idx - 1);
document.getElementById("nextBtn").onclick = () => setImage(idx + 1);

// Keyboard Navigation
window.onkeydown = (e) => {
  if (shotsView.style.display !== "none") {
    if (e.key === "ArrowLeft") setImage(idx - 1);
    if (e.key === "ArrowRight") setImage(idx + 1);
  }
};

init();
