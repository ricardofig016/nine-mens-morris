import Home from "./home.mjs";

const defaultSection = new Home(); // show this section on page load

document.addEventListener("DOMContentLoaded", () => {
  defaultSection.load();
});
