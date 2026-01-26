const CERTS = [
  {
    title: "Data Analysis Diploma",
    issuer: "Mazen",
    date: "2024",
    image: "assets/mazen-diploma.png"
  },
  {
    title: "SQL for Data Science",
    issuer: "Coursera",
    date: "2023",
    image: "assets/sql-cert.png" // تأكد من وجود الصورة بهذا الاسم في فولدر assets
  }
  // تقدر تضيف أي شهادة تانية هنا بنفس التنسيق
];

function renderCerts() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;

  grid.innerHTML = "";

  CERTS.forEach(cert => {
    const card = document.createElement("article");
    // أضفنا كلاس tilt وكلاس reveal عشان التأثيرات تشتغل
    card.className = "card tilt reveal is-visible"; 
    
    card.innerHTML = `
      <div class="cert-preview">
        <img class="card-img" src="${cert.image}" alt="${cert.title}" loading="lazy">
      </div>
      <div class="card-top" style="margin-top: 15px;">
        <div class="card-title">${cert.title}</div>
        <div class="tag">${cert.issuer}</div>
      </div>
      <div class="card-desc" style="font-size: 0.85rem; opacity: 0.8;">
        Issued: ${cert.date}
      </div>
      <div class="card-actions">
        <a class="link" href="pdf-viewer.html?file=${encodeURIComponent(cert.image)}&title=${encodeURIComponent(cert.title)}">
          View Full PDF
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

// تشغيل الدالة بمجرد تحميل الصفحة
document.addEventListener("DOMContentLoaded", renderCerts);
