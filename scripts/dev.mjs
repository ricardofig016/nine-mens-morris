import Section from "./section.mjs";
import Auth from "./auth.mjs";

class Dev extends Section {
  constructor() {
    if (Dev.instance) {
      return Dev.instance;
    }
    super("dev");
    Dev.instance = this;
  }

  addListeners() {
    document.getElementById("to-auth-button").addEventListener("click", () => {
      document.getElementById('to-dev-button').classList.remove('active');
      document.getElementById('to-auth-button').classList.add('active');
      new Auth().load();
    });
  }
}

export default Dev;
