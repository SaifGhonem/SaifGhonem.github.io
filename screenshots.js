const getParam = (k) => new URLSearchParams(location.search).get(k) || "";

const DATA = {
  cottonil: {
    name: "Cottonil Retail Analysis",
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
    images: [
      { label: "Executive", src: "assets/fleet-Executive%20Dashboard.png" },
      { label: "Fuel", src: "assets/fleet-Fuel%20Analysis.png" },
      { label: "Repair", src: "assets/fleet-repair.png" },
      { label: "Vehicle Details", src: "assets/fleet-vehicle%20details.png" }
    ]
  }
};

const key = (getParam("p") || "cottonil").toLowerCase();
const project = DATA[key];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const pageTitle = document.getElementById("pageTitle");
const pageSub = document.getElementById("pageSub");
const projectName = document.getElementById("projectName");
const msg = document.getElementById("msg");

const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openFull = document.getElementById("openFull");

let idx = 0;

function safeText(el, text) {
  if (el) el.textContent = text;
}

function setImage(i) {
  if (!project) return;

  idx = (i + project.images.length) % project.images.length;
  const item = project.images[idx];

  if (mainImg) {
    mainImg.src = item.src;
    mainImg.alt = item.label;
  }
  if (openFull) openFull.href = item.src;

  if (thumbs) {
    Array.from(thumbs.children).forEach((b, j) => {
      b.classList.toggle("is-active", j === idx);
    });
  }
}

function renderThumbs() {
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

function init() {
  if (!project) {
    safeText(pageTitle, "Screenshots");
    safeText(projectName, "Project not found");
    safeText(pageSub, "");
    safeText(msg, "No screenshots added for this project yet.");
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (openFull) openFull.style.display = "none";
    return;
  }

  safeText(pageTitle, `${project.name} Screenshots`);
  safeText(projectName, project.name);
  safeText(pageSub, "Use Prev Next or click a label");
  safeText(msg, "");

  renderThumbs();
  setImage(0);
}

init();

if (prevBtn) prevBtn.addEventListener("click", () => setImage(idx - 1));
if (nextBtn) nextBtn.addEventListener("click", () => setImage(idx + 1));

window.addEventListener("keydown", (e) => {
  if (!project) return;
  if (e.key === "ArrowLeft") setImage(idx - 1);
  if (e.key === "ArrowRight") setImage(idx + 1);
});
