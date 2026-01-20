const qs = (k) => new URLSearchParams(window.location.search).get(k) || "";

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

const projectKey = qs("p") || "cottonil";
const project = DATA[projectKey];

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const titleEl = document.getElementById("title");
const projectNameEl = document.getElementById("projectName");
const hintNote = document.getElementById("hintNote");
const mainImg = document.getElementById("mainImg");
const thumbs = document.getElementById("thumbs");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openFull = document.getElementById("openFull");

if (!project) {
  titleEl.textContent = "Screenshots";
  projectNameEl.textContent = "Project not found";
  hintNote.textContent = "Check the project link from the main page.";
} else {
  titleEl.textContent = `${project.name} Screenshots`;
  projectNameEl.textContent = project.name;
  hintNote.textContent = "Use Prev and Next or click a thumbnail.";
}

let idx = 0;

function setImage(i) {
  if (!project) return;
  idx = (i + project.images.length) % project.images.length;

  const item = project.images[idx];
  mainImg.src = item.src;
  mainImg.alt = item.label;
  openFull.href = item.src;

  Array.from(thumbs.children).forEach((c, j) => {
    c.classList.toggle("is-active", j === idx);
  });
}

function renderThumbs() {
  if (!project) return;
  thumbs.innerHTML = "";
  project.images.forEach((img, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thumb";
    b.title = img.label;

    const t = document.createElement("div");
    t.className = "thumb-label";
    t.textContent = img.label;

    b.appendChild(t);
    b.addEventListener("click", () => setImage(i));
    thumbs.appendChild(b);
  });
}

if (project) {
  renderThumbs();
  setImage(0);
}

prevBtn?.addEventListener("click", () => setImage(idx - 1));
nextBtn?.addEventListener("click", () => setImage(idx + 1));

window.addEventListener("keydown", (e) => {
  if (!project) return;
  if (e.key === "ArrowLeft") setImage(idx - 1);
  if (e.key === "ArrowRight") setImage(idx + 1);
});
