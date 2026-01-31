const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const CERTS = [
  { title: "Data Analyst Track: Excel, SQL, and Power BI", issuer: "DataCamp", pdf: "assets/Data_Analyst _Track-Excel_SQL_and _Power_BI.pdf", img: "assets/datacamp-Data_Analyst _Track-Excel_SQL_and _Power_BI.png" },
  { title: "Introduction to Python", issuer: "DataCamp", pdf: "assets/Introduction_to_Python.pdf", img: "assets/datacamp-intro-python.png" },
  { title: "Intermediate Python", issuer: "DataCamp", pdf: "assets/Intermediate_Python.pdf", img: "assets/datacamp-intermediate-python.png" },
  { title: "Introduction to SQL", issuer: "DataCamp", pdf: "assets/introduction_to_SQL.pdf", img: "assets/datacamp-intro-sql.png" }
];


const grid = document.getElementById("certGrid");

function card(cert) {
  const el = document.createElement("article");
  el.className = "card tilt";

  el.innerHTML = `
    <img class="card-img" src="${cert.img}" alt="${cert.title}">
    <div class="card-top">
      <div class="card-title">${cert.title}</div>
      <div class="tag">${cert.issuer}</div>
    </div>
    <div class="card-actions">
      <a class="link" href="pdf-viewer.html?file=${encodeURIComponent(cert.pdf)}&title=${encodeURIComponent(cert.title)}" target="_blank" rel="noreferrer">View Full</a>
    </div>
  `;

  return el;
}


if (grid) {
  CERTS.forEach(c => grid.appendChild(card(c)));
}
