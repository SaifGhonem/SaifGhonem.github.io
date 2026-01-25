const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const CERTS = [
  {
    title: "DataCamp Certificate 1",
    issuer: "DataCamp",
    file: "assets/datacamp-1.png"
  },
  {
    title: "DataCamp Certificate 2",
    issuer: "DataCamp",
    file: "assets/datacamp-2.png"
  },
  {
    title: "DataCamp Certificate 3",
    issuer: "DataCamp",
    file: "assets/datacamp-3.png"
  }
];

const grid = document.getElementById("certGrid");

function card(cert) {
  const el = document.createElement("article");
  el.className = "card tilt";

  el.innerHTML = `
    <img class="card-img" src="${cert.file}" alt="${cert.title}">
    <div class="card-top">
      <div class="card-title">${cert.title}</div>
      <div class="tag">${cert.issuer}</div>
    </div>
    <div class="card-actions">
      <a class="link" href="${cert.file}" target="_blank" rel="noreferrer">Open</a>
    </div>
  `;

  return el;
}

if (grid) {
  CERTS.forEach(c => grid.appendChild(card(c)));
}
