const getParam = (k) => new URLSearchParams(location.search).get(k) || "";

const DATA = {
  cottonil: {
    name: "Cottonil Retail Analysis",
    live: "https://app.powerbi.com/view?r=eyJrIjoiYjM4ZmE2ZWItMTgzMC00MDcwLWE5YjAtNGRlMWRhOWM5ODg3IiwidCI6IjJiYjZlNWJjLWMxMDktNDdmYi05NDMzLWMxYzZmNGZhMzNmZiIsImMiOjl9",
    images: [
      { label: "Main", src: "assets/cottonil-main.png" },
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
      { label: "Executive", src: "assets/fleet-Executive-Dashboard.png" },
      { label: "Fuel", src: "assets/fleet-Fuel-Analysis.png" },
      { label: "Repair", src: "assets/fleet-repair.png" },
      { label: "Vehicle Details", src: "assets/fleet-vehicle-details.png" }
    ]
  }
};

const key = (getParam("p") || "cottonil").toLowerCase();
const view = (getParam("view") || "shots").toLowerCase();
const project = DATA[key];

const pageTitle = document.getElementById("pageTitle");
const pageSub = document.getElementById("pageSub");
const msg = document.getElementById("msg");

const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openFull = document.getElementById("openFull");

const shotsView = document.getElementById("shotsView");
const liveView = document.getElementById("liveView");
const showShots = document.getElementById("showShots");
const showLive = document.getElementById("showLive");
const liveFrame = document.getElementById("liveFrame");
const liveTitle = document.getElementById("liveTitle");
const liveMsg = document.getElementById("liveMsg");

let idx = 0;

function setText(el, text){ if (el) el.textContent = text; }

function openShots(){
  if (shotsView) shotsView.style.display = "block";
  if (liveView) liveView.style.display = "none";
}

function openLive(){
  if (!project || !project.live){
    if (liveMsg) liveMsg.textContent = "No live link added for this project yet.";
    return;
  }
  if (shotsView) shotsView.style.display = "none";
  if (liveView) liveView.style.display = "block";
  if (liveFrame) liveFrame.src = project.live;
  if (liveTitle) liveTitle.textContent = `${project.name} Live Dashboard`;
  if (liveMsg) liveMsg.textContent = "";
}

function renderThumbs(){
  if (!project || !thumbs) return;
  thumbs.innerHTML = "";
  project.images.forEach((img, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thumb";
    b.textContent = img.label;
    b.addEventListener("click", () => setImage(i));
    thumbs.appendChild(b);
  });
}

function setImage(i){
  if (!project) return;
  idx = (i + project.images.length) % project.images.length;
  const item = project.images[idx];

  if (mainImg){
    mainImg.src = item.src;
    mainImg.alt = item.label;
  }
  if (openFull) openFull.href = item.src;

  if (thumbs){
    Array.from(thumbs.children).forEach((b, j) => {
      b.classList.toggle("is-active", j === idx);
    });
  }
}

function init(){
  if (!project){
    setText(pageTitle, "Project");
    setText(pageSub, "");
    if (msg) msg.textContent = "Project not found.";
    if (shotsView) shotsView.style.display = "none";
    if (liveView) liveView.style.display = "none";
    return;
  }

  setText(pageTitle, project.name);
  setText(pageSub, "Screenshots and live dashboard");

  renderThumbs();
  setImage(0);

  if (view === "live") openLive();
  else openShots();
}

init();

showShots?.addEventListener("click", openShots);
showLive?.addEventListener("click", openLive);

prevBtn?.addEventListener("click", () => setImage(idx - 1));
nextBtn?.addEventListener("click", () => setImage(idx + 1));

window.addEventListener("keydown", (e) => {
  if (!project) return;
  if (shotsView && shotsView.style.display !== "none"){
    if (e.key === "ArrowLeft") setImage(idx - 1);
    if (e.key === "ArrowRight") setImage(idx + 1);
  }
});
