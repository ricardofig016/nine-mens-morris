import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";

const sections = {
  about: About,
  login: Login,
  home: Home,
};

// show this section on page load
const defaultSection = new Home();

document.addEventListener("DOMContentLoaded", () => {
  // add listeners for the header buttons
  Object.keys(sections).forEach((key) => {
    document.getElementById(`to-${key}-button`).addEventListener("click", () => {
      new sections[key]().load();
    });
  });

  defaultSection.load();
});
