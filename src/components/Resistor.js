Resistor = draw2d.SVGFigure.extend({
  NAME: "Resistor",

  init: function () {
    this._super();
    var inputLocator = new draw2d.layout.locator.InputPortLocator();
    var outputLocator = new draw2d.layout.locator.OutputPortLocator();

    this.createPort("hybrid", inputLocator);
    this.createPort("hybrid", outputLocator);
    this.label = new draw2d.shape.basic.Label({
      text: "Value",
      color: "#0d0d0d",
      fontColor: "#0d0d0d",
    });

    // add the new decoration to the connection with a position locator.
    //
    this.add(this.label, new draw2d.layout.locator.TopLocator(this));

    this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

    // labels are added via JSON document.
  },

  /**
   * @method
   * Return an objects with all important attributes for XML or JSON serialization
   *
   * @returns {Object}
   */
  getPersistentAttributes: function () {
    var memento = this._super();

    // add all decorations to the memento
    //
    memento.labels = [];
    this.children.each(function (i, e) {
      var labelJSON = e.figure.getPersistentAttributes();
      labelJSON.locator = e.locator.NAME;
      memento.labels.push(labelJSON);
    });

    return memento;
  },

  /**
   * @method
   * Read all attributes from the serialized properties and transfer them into the shape.
   *
   * @param {Object} memento
   * @returns
   */
  setPersistentAttributes: function (memento) {
    this._super(memento);

    // remove all decorations created in the constructor of this element
    //
    this.resetChildren();

    // and add all children of the JSON document.
    //
    $.each(
      memento.labels,
      $.proxy(function (i, json) {
        // create the figure stored in the JSON
        var figure = eval("new " + json.type + "()");

        // apply all attributes
        figure.attr(json);

        // instantiate the locator
        var locator = eval("new " + json.locator + "()");

        // add the new figure as child to this figure
        this.add(figure, locator);
      }, this)
    );
  },
  onDoubleClick: function () {
    this.setRotationAngle((this.getRotationAngle() + 90) % 360);
  },
  getSVG: function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1"> +
    '<line x1="0" y1="5" x2="20" y2="5" stroke="black"/>'+
    '<line x1="20" y1="5" x2="25" y2="0" stroke="black"/>'+
    '<line x1="25" y1="0" x2="30" y2="10" stroke="black"/>'+
    '<line x1="30" y1="10" x2="35" y2="0" stroke="black"/>'+
    '<line x1="35" y1="0" x2="40" y2="10" stroke="black"/>'+
    '<line x1="40" y1="10" x2="45" y2="0" stroke="black"/>'+
    '<line x1="45" y1="0" x2="50" y2="10" stroke="black"/>'+
    '<line x1="50" y1="10" x2="55" y2="0" stroke="black"/>'+
    '<line x1="55" y1="0" x2="60" y2="5" stroke="black"/>'+
    '<line x1="60" y1="5" x2="80" y2="5" stroke="black"/>'+
      </svg>`;
  },
});
