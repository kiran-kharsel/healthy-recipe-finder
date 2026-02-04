async function loadSnippet(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;

  // toggle nav menu
  const hamburgerBtn = document.querySelector(".hamburger-menu");
  const navLinkElem = document.querySelector(".nav-link");

  hamburgerBtn.addEventListener("click", function () {
    navLinkElem.classList.toggle("hidden");
  });
}

// load header and footer
loadSnippet("header", "components/header.html");
