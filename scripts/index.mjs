import Dev from "./dev.mjs";

const defaultSection = new Dev(); // show this section on page load

document.addEventListener("DOMContentLoaded", () => {
  defaultSection.load();
});
