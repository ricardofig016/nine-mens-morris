import Section from "./section.mjs";
import Auth from "./auth.mjs";

class Home extends Section {
  constructor() {
    if (Home.instance) {
      return Home.instance;
    }
    super("home");
    Home.instance = this;
  }

  addListeners() {}
}

export default Home;
