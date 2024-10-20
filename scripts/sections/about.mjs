import Section from "./section.mjs";

class About extends Section {
  constructor() {
    if (About.instance) {
      return About.instance;
    }
    super("about");
    About.instance = this;
  }

  addListeners() {}
}

export default About;
