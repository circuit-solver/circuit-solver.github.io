example.Toolbar = Class.extend({
  init: function (elementId, view) {
    this.html = $("#" + elementId);
    this.view = view;

    // register this class as event listener for the canvas
    // CommandStack. This is required to update the state of
    // the Undo/Redo Buttons.
    //
    view.getCommandStack().addEventListener(this);

    // Register a Selection listener for the state hnadling
    // of the Delete Button
    //
    view.on("select", $.proxy(this.onSelectionChanged, this));

    // Inject the UNDO Button and the callbacks
    //
    this.div = $(
      "<div class='tool' style='display:flex; justify-content:space-evenly; margin: auto; width: 1000px; max-width: 90% '></div>"
    );
    this.html.append(this.div);
    this.docsButton = $(
      "<button type='button' style='margin-left:15px' class='show-docs btn-info btn-lg px-3 mx-6'  aria-haspopup='true' >Instructions</button>"
    );
    $(".tool").append(this.docsButton);
    this.undoButton = $(
      "<button class='btn btn-light' style='border-width: 4px; border-color:black; border-style:solid'><img src='.././css/icons/undo.png' alt='undo' /> Undo</button>"
    );
    $(".tool").append(this.undoButton);
    this.undoButton
      .button()
      .click(
        $.proxy(function () {
          this.view.getCommandStack().undo();
        }, this)
      )
      .button("option", "disabled", true);

    // Inject the REDO Button and the callback
    //
    this.redoButton = $(
      "<button class='btn btn-light' style='border-width: 4px; border-color:black; border-style:solid'><img src='.././css/icons/redo.png' alt='redo' /> Redo</button>"
    );
    $(".tool").append(this.redoButton);
    this.redoButton
      .button()
      .click(
        $.proxy(function () {
          this.view.getCommandStack().redo();
        }, this)
      )
      .button("option", "disabled", true);

    // Inject the DELETE Button
    //
    this.deleteButton = $(
      "<button class='btn btn-light' style='border-width: 4px; border-color:black; border-style:solid'><img src='.././css/icons/delete.png' alt='delete' /> Delete</button>"
    );
    $(".tool").append(this.deleteButton);
    this.deleteButton
      .button()
      .click(
        $.proxy(function () {
          var node = this.view.getPrimarySelection();
          var command = new draw2d.command.CommandDelete(node);
          this.view.getCommandStack().execute(command);
        }, this)
      )
      .button("option", "disabled", true);
    this.nodeGenerate = $(
      "<button type='button' class='show btn-primary btn-lg px-3 '  aria-haspopup='true' onClick='nodeGenerate()' >Generate Node No.</button>"
    );
    $(".tool").append(this.nodeGenerate);
    this.submitButton = $(
      "<button type='button' class='show btn-primary btn-lg px-3'  aria-haspopup='true' onClick='simulate()' ><img src='.././css/icons/play.png' alt='play' /> Simulate</button>"
    );
    $(".tool").append(this.submitButton);
  },

  /**
   * @metho
   * Called if the selection in the cnavas has been changed. You must register this
   * class on the canvas to receive this event.
   *
   * @param {draw2d.Canvas} emitter
   * @param {Object} event
   * @param {draw2d.Figure} event.figure
   */
  onSelectionChanged: function (emitter, event) {
    this.deleteButton.button("option", "disabled", event.figure === null);
  },

  /**
   * @method
   * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail()
   * can be used to identify the type of event which has occurred.
   *
   * @template
   *
   * @param {draw2d.command.CommandStackEvent} event
   **/
  stackChanged: function (event) {
    this.undoButton.button("option", "disabled", !event.getStack().canUndo());
    this.redoButton.button("option", "disabled", !event.getStack().canRedo());
  },
});
