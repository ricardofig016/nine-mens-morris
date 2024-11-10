import Section from "./section.js";
import Home from "./home.js";
import Login from "./login.js";

class Signup extends Section {
  constructor() {
    if (Signup.instance) {
      return Signup.instance;
    }
    super("signup");
    Signup.instance = this;
  }

  togglePasswordVis() {
    const input = document.getElementById("password-input-signup");
    const eyeIcon = document.getElementById("toggle-password-vis-eye-signup");
    const eyeSlashIcon = document.getElementById("toggle-password-vis-eye-slash-signup");
    if (input.type === "password") {
      input.type = "text";
      eyeIcon.classList.add("hidden");
      eyeSlashIcon.classList.remove("hidden");
    } else {
      input.type = "password";
      eyeIcon.classList.remove("hidden");
      eyeSlashIcon.classList.add("hidden");
    }
  }

  addListeners() {
    // toggle password visibility
    document.getElementById("toggle-password-vis-signup").addEventListener("click", this.togglePasswordVis);
    // submit form
    document.getElementById("signup-form").addEventListener("submit", (event) => {
      event.preventDefault();
      // TODO: validate form
      new Home().load();
    });
    // go to login
    document.getElementById("go-to-login-anchor").addEventListener("click", () => new Login().load());
  }
}

export default Signup;
