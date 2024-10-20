import Section from "./section.mjs";
import Home from "./home.mjs";
import Signup from "./signup.mjs";

class Login extends Section {
  constructor() {
    if (Login.instance) {
      return Login.instance;
    }
    super("login");
    Login.instance = this;
  }

  togglePasswordVis() {
    const input = document.getElementById("password-input-login");
    const eyeIcon = document.getElementById("toggle-password-vis-eye-login");
    const eyeSlashIcon = document.getElementById("toggle-password-vis-eye-slash-login");
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
    document.getElementById("toggle-password-vis-login").addEventListener("click", this.togglePasswordVis);
    // submit form
    document.getElementById("login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      // TODO: validate form
      new Home().load();
    });
    // go to sign up
    document.getElementById("go-to-signup-anchor").addEventListener("click", () => new Signup().load());
  }
}

export default Login;
