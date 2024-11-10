import Section from "./section.js";

class Settings extends Section {
  constructor() {
    if (Settings.instance) {
      return Settings.instance;
    }
    super("settings");
    Settings.instance = this;
  }

  addListeners() {}
}

export default Settings;
