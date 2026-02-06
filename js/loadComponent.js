async function loadSnippet(id, file, callback) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);

  if (!container) return;
  container.innerHTML = html;

  if (typeof callback === "function") callback();


  // toggle nav menu
  // const hamburgerBtn = document.querySelector(".hamburger-menu");
  // const navLinkElem = document.querySelector(".nav-link");

  // if (hamburgerBtn && navLinkElem) {
  //   hamburgerBtn.addEventListener("click", function () {
  //     navLinkElem.classList.toggle("hidden");
  //     console.log(navLinkElem);
  //   });
  // }
  // document.addEventListener("click", (e) => {
  // if (e.target.classList.contains("hamburger-menu")) {
  //   console.log('ok')
  //   const navLinkElem = document.querySelector(".nav-link");
  //   if (navLinkElem) {
  //     navLinkElem.classList.toggle("hidden");
  //   }
  // }
  //});
}

// load header and footer
// document.addEventListener("DOMContentLoaded", () => {
//   loadSnippet("header", "components/header.html");
//   loadSnippet("footer", "components/footer.html");
// });

loadSnippet("header", "components/header.html", initHeaderEvents);
loadSnippet("footer", "components/footer.html");

function initHeaderEvents() {
  const hamburgerBtn = document.querySelector(".hamburger-menu");
  const navLinkElem = document.querySelector(".nav-link");

  if (hamburgerBtn && navLinkElem) {
    hamburgerBtn.addEventListener("click", () => {
      navLinkElem.classList.toggle("hidden");
    });
  }
}
