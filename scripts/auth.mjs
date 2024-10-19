import Section from "./section.mjs";
import Dev from "./dev.mjs";

class Auth extends Section {
  constructor() {
    if (Auth.instance) {
      return Auth.instance;
    }
    super("auth");
    Auth.instance = this;
  }

  addListeners() {
    document.getElementById("to-dev-button").addEventListener("click", () => {
      document.getElementById('to-dev-button').classList.add('active');
      document.getElementById('to-auth-button').classList.remove('active');
      new Dev().load();
    });
  }
}

export default Auth;
