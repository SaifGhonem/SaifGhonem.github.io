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

const key = getParam("p") || "cottonil";
const project = DATA[key];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const pageTitle = document.getElementById("pageTitle");
const projectName = document.getElementById("projectName");
const pageSub = document.getElementById("pageSub");
const msg = document.getElementById("msg");

const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openFull = document.getElementById("openFull");

let idx = 0;

function setImage(i) {
  idx = (i + project.images.length) % project.images.length;
  const item = project.images[idx];

  mainImg.src = item.src;
  mainImg.alt = item.label;
  openFull.href = item.src;

  Array.from(thumbs.children).forEach((b, j) => {
    b.classList.toggle("is-active", j === idx);
  });
}

function renderThumbs() {
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
    pageTitle.textContent = "Screenshots";
    projectName.textContent = "Not found";
    pageSub.textContent = "";
    msg.textContent = "This project has no screenshots added yet.";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    openFull.style.display = "none";
    return;
  }

  pageTitle.textContent = `${project.name} Screenshots`;
  projectName.textContent = project.name;
  pageSub.textContent = "Use Prev Next or click a label";
  msg.textContent = "";

  renderThumbs();
  setImage(0);
}

init();

prevBtn?.addEventListener("click", () => setImage(idx - 1));
nextBtn?.addEventListener("click", () => setImage(idx + 1));
