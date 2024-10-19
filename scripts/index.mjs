import Home from "./home.mjs";
import Auth from "./auth.mjs";

const sections = {
  home: Home,
  auth: Auth,
};

const defaultSection = new Home(); // show this section on page load

document.addEventListener("DOMContentLoaded", () => {
  // add listeners for the header buttons
  Object.keys(sections).forEach((key) => {
    document.getElementById(`to-${key}-button`).addEventListener("click", () => {
      new sections[key]().load();
    });
  });

  defaultSection.load();
});
