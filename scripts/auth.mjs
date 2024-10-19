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

  addListeners() {}
}

export default Auth;
