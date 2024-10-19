import Section from "./section.mjs";
import Home from "./home.mjs";

class Auth extends Section {
  constructor() {
    if (Auth.instance) {
      return Auth.instance;
    }
    super("auth");
    Auth.instance = this;
  }

  addListeners() {
    document.getElementById("to-home-button").addEventListener("click", () => {
      document.getElementById("to-home-button").classList.add("active");
      document.getElementById("to-auth-button").classList.remove("active");
      new Home().load();
    });
  }
}

export default Auth;
