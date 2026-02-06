async function loadSnippet(id, file, callback) {
  const response = await fetch(file);
  const html = await response.text();
  const container = document.getElementById(id);

  if (!container) return;
  container.innerHTML = html;

  if (typeof callback === "function") callback();

}



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
