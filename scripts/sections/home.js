import Section from "./section.js";

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
