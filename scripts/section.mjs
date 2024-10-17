class Section {
  constructor(name) {
    this.name = name;
    this.addListeners();
  }

  addListeners() {}

  /**
   * shows the section and hides all others
   */
  load() {
    // hide all sections
    document.querySelectorAll("section").forEach((section) => {
      section.hidden = true;
    });

    // show the specified section
    const section = document.querySelector(`#${this.name}-section`);
    if (section) {
      section.hidden = false;
    }
  }
}

export default Section;
