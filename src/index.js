// Draw2d canvas implementation and policies like drag/drop
document.addEventListener("DOMContentLoaded", function () {
  // This function loads first

  app = new example.Application();

  app.view.installEditPolicy(
    new draw2d.policy.canvas.FadeoutDecorationPolicy()
  );

  app.view.installEditPolicy(
    new draw2d.policy.connection.ComposedConnectionCreatePolicy([
      new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: createConnection,
      }),

      new draw2d.policy.connection.OrthogonalConnectionCreatePolicy({
        createConnection: createConnection,
      }),
    ])
  );

  $(".show-docs").on("click", function () {
    $(".mask-docs").addClass("active");
  });

  // Function for close the Modal(Popupview-for showing the output )

  function closeModal(e) {
    $(e).removeClass("active");
  }

  // Call the closeModal function on the clicks/keyboard

  $(".close").on("click", function () {
    closeModal(".mask");
  });
  $(".close-docs").on("click", function () {
    closeModal(".mask-docs");
  });
  $(".again").on("click", function () {
    closeModal(".mask");
  });

  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      closeModal();
    }
  });

  displayJSON(app.view);

  app.view.getCommandStack().addEventListener(function (e) {
    if (e.isPostChangeEvent()) {
      displayJSON(app.view);
      updatePreview(app.view);
    }
  });
});
var router = new draw2d.layout.connection.CircuitConnectionRouter();
router.abortRoutingOnFirstVertexNode = false;
var createConnection = function (sourcePort, targetPort) {
  var c = new draw2d.Connection({
    outlineColor: "#ffffff",
    outlineStroke: 1,
    color: "#000000",
    router: router,
    stroke: 1,
    radius: 2,
  });
  if (sourcePort) {
    c.setSource(sourcePort);
    c.setTarget(targetPort);
  }
  return c;
};

document.getElementById("json").style.display = "none";

function displayJSON(canvas) {
  var writer = new draw2d.io.json.Writer();
  writer.marshal(canvas, function (json) {
    $("#json").text(JSON.stringify(json, null, 2));
  });
}
function updatePreview(canvas) {
  // convert the canvas into a PNG image source string

  var xCoords = [];
  var yCoords = [];
  canvas.getFigures().each(function (i, f) {
    var b = f.getBoundingBox();
    xCoords.push(b.x, b.x + b.w);
    yCoords.push(b.y, b.y + b.h);
  });
  var minX = Math.min.apply(Math, xCoords) - 40;
  var minY = Math.min.apply(Math, yCoords) - 40;
  var width = Math.max.apply(Math, xCoords) - minX + 40;
  var height = Math.max.apply(Math, yCoords) - minY + 40;

  var writer = new draw2d.io.png.Writer();
  writer.marshal(
    canvas,
    function (png) {
      $("#preview").attr("src", png);
    },
    new draw2d.geo.Rectangle(minX, minY, width, height)
  );
}

// Classes for all elements and connections
class connection {
  constructor(conn_id, label_id, label_text, src_node, tar_node) {
    this.conn_id = conn_id;
    this.label_id = label_id;
    this.label_text = label_text;
    this.src_node = src_node;
    this.tar_node = tar_node;
  }
}
class resistor {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    this.out_port_id = out_port_id;
    this.label = label;
    this.node_k = node_k;
    this.node_l = node_l;
    this.ele_code = 1;
  }
}
class curr_src {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.ele_code = 2;
  }
}

class volt_src {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.ele_code = 3;
  }
}

class volt_cont_curr_src {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 4;
  }
}

class volt_cont_volt_src {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 5;
  }
}

class curr_cont_curr_src_gen {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 6;
  }
}

class curr_cont_curr_src_vs {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 7;
  }
}

class curr_cont_volt_src_gen {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 8;
  }
}

class curr_cont_volt_src_vs {
  constructor(
    id,
    label_id,
    inp_port_id,
    out_port_id,
    label,
    node_k,
    node_l,
    cont_high_node,
    cont_low_node,
    node_m,
    node_n,

    ele_code
  ) {
    this.id = id;
    this.label_id = label_id;
    this.inp_port_id = inp_port_id;
    // ## Here inp_port is the low
    this.out_port_id = out_port_id;
    // ## Here out_port is the high
    this.label = label;
    this.node_k = node_k;
    // ## The final node numbers to be used directly in our version 1 algo
    this.node_l = node_l;
    // ## The final node numbers to be used directly in our version 1 algo
    this.cont_high_node = cont_high_node;
    this.cont_low_node = cont_low_node;
    this.node_m = node_m;
    this.node_n = node_n;
    this.m_changed = 0;
    this.n_changed = 0;
    this.ele_code = 9;
  }
}

// Function for return element type from id
function ret_type_from_id(id) {
  return element_type_list[element_id_list.indexOf(id)];
}

// Function that returns the source and target nodes given id
function ret_source_target_nodes_from_id(id, port_type) {
  var ele_type = ret_type_from_id(id);
  if (ele_type == "Resistor") {
    for (var i = 0; i < resistor_list.length; i++) {
      if (resistor_list[i].id == id) {
        if (port_type == "hybrid0") {
          return resistor_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return resistor_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "CurrentSource") {
    for (var i = 0; i < curr_src_list.length; i++) {
      if (curr_src_list[i].id == id) {
        if (port_type == "hybrid0") {
          return curr_src_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return curr_src_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "VoltageSource") {
    for (var i = 0; i < volt_src_list.length; i++) {
      if (volt_src_list[i].id == id) {
        if (port_type == "hybrid0") {
          return volt_src_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return volt_src_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "VCCS") {
    for (var i = 0; i < vccs_list.length; i++) {
      if (vccs_list[i].id == id) {
        if (port_type == "hybrid0") {
          return vccs_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return vccs_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "VCVS") {
    for (var i = 0; i < vcvs_list.length; i++) {
      if (vcvs_list[i].id == id) {
        if (port_type == "hybrid0") {
          return vcvs_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return vcvs_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "CCCS_Gen") {
    for (var i = 0; i < cccs_gen_list.length; i++) {
      if (cccs_gen_list[i].id == id) {
        if (port_type == "hybrid0") {
          return cccs_gen_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return cccs_gen_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "CCCS_Vs") {
    for (var i = 0; i < cccs_vs_list.length; i++) {
      if (cccs_vs_list[i].id == id) {
        if (port_type == "hybrid0") {
          return cccs_vs_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return cccs_vs_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "CCVS_Gen") {
    for (var i = 0; i < ccvs_gen_list.length; i++) {
      if (ccvs_gen_list[i].id == id) {
        if (port_type == "hybrid0") {
          return ccvs_gen_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return ccvs_gen_list[i].out_port_id;
        }
      }
    }
  } else if (ele_type == "CCVS_Vs") {
    for (var i = 0; i < ccvs_vs_list.length; i++) {
      if (ccvs_vs_list[i].id == id) {
        if (port_type == "hybrid0") {
          return ccvs_vs_list[i].inp_port_id;
        } else if (port_type == "hybrid1") {
          return ccvs_vs_list[i].out_port_id;
        }
      }
    }
  }
}
function return_node_num_from_port_id(port_id) {
  for (var i = 0; i < nodes_list.length; i++) {
    if (nodes_list[i][1].includes(port_id)) {
      return nodes_list[i][0];
    }
  }
}
function ret_src_tar_node_from_conn_label(text) {
  for (var i = 0; i < connection_list.length; i++) {
    if (connection_list[i].label_text == text) {
      return [connection_list[i].src_node, connection_list[i].tar_node];
    }
  }
}
function ret_node_m_or_n(text) {
  var res = ret_src_tar_node_from_conn_label(text);
  var p1 = return_node_num_from_port_id(res[0]);
  var p2 = return_node_num_from_port_id(res[1]);
  if (p1 == p2) {
    return p1;
  }
}

function nodeGenerate() {
  // variable declaration
  resistor_list = [];
  curr_src_list = [];
  volt_src_list = [];
  vccs_list = [];
  vcvs_list = [];
  cccs_gen_list = [];
  cccs_vs_list = [];
  ccvs_gen_list = [];
  ccvs_vs_list = [];

  connection_list = [];
  element_id_list = [];
  element_type_list = [];
  connection_id_list = [];
  raw_nodes_list = [];
  circuit = document.getElementById("json").innerHTML;
  circuit = JSON.parse(circuit);
  // Pushing each elements to the list as a class
  circuit.forEach((ele) => {
    if (ele["type"] == "Resistor") {
      resistor_list.push(
        new resistor(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          1
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "CurrentSource") {
      curr_src_list.push(
        new curr_src(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          2
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "VoltageSource") {
      volt_src_list.push(
        new volt_src(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          3
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "VCCS") {
      vccs_list.push(
        new volt_cont_curr_src(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          4
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "VCVS") {
      // high_initial declare i think before this function
      // low_initial
      // get high initaial, low initial connections id maybe
      // update node
      // id obtained above should be mapped correspondingly change values
      vcvs_list.push(
        new volt_cont_volt_src(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          5
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "CCCS_Gen") {
      cccs_gen_list.push(
        new curr_cont_curr_src_gen(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          6
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "CCCS_Vs") {
      cccs_vs_list.push(
        new curr_cont_curr_src_vs(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          7
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "CCVS_Gen") {
      ccvs_gen_list.push(
        new curr_cont_volt_src_gen(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          8
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    } else if (ele["type"] == "CCVS_Vs") {
      ccvs_vs_list.push(
        new curr_cont_volt_src_vs(
          ele["id"],
          ele["labels"][0]["id"],
          ele["ports"][0]["id"],
          ele["ports"][1]["id"],
          ele["labels"][0]["text"],
          -1,
          -1,
          ele["labels"][1]["text"],
          ele["labels"][2]["text"],
          -1,
          -1,
          9
        )
      );
      element_id_list.push(ele["id"]);
      element_type_list.push(ele["type"]);
      if (raw_nodes_list.includes(ele["ports"][0]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][0]["id"]);
      }
      if (raw_nodes_list.includes(ele["ports"][1]["id"] == false)) {
        raw_nodes_list.push(ele["ports"][1]["id"]);
      }
    }
  });

  circuit.forEach((ele) => {
    if (ele["type"] == "draw2d.Connection") {
      connection_list.push(
        new connection(
          ele["id"],
          ele["labels"][0]["id"],
          ele["labels"][0]["text"],
          ret_source_target_nodes_from_id(
            ele["source"]["node"],
            ele["source"]["port"]
          ),
          ret_source_target_nodes_from_id(
            ele["target"]["node"],
            ele["target"]["port"]
          )
        )
      );
      connection_id_list.push(ele["id"]);
    }
  });

  function generate_node_list() {
    nodes_list = [];
    connection_list.forEach((conn) => {
      nodes_list.push([conn.src_node, conn.tar_node]);
    });
    var rem_list = [];
    var iter = 1;

    while (rem_list != [] || iter == 1) {
      for (var i = 0; i < nodes_list.length; i++) {
        for (var j = i + 1; j < nodes_list.length; j++) {
          if (i != j && !rem_list.includes(j)) {
            if (
              nodes_list[i].includes(nodes_list[j][0]) ||
              nodes_list[i].includes(nodes_list[j][1])
            ) {
              nodes_list[i] = nodes_list[i].concat(nodes_list[j]);
              rem_list.push(j);
            }
          }
        }
      }

      if (rem_list.length === 0) {
        iter = 0;
        break;
      } else {
        var new_nodes_list = [];
        for (var idx = 0; idx < nodes_list.length; idx++) {
          if (!rem_list.includes(idx)) {
            new_nodes_list.push(nodes_list[idx]);
          }
        }
        rem_list = [];
        nodes_list = new_nodes_list;
      }
    }
    for (var i = 0; i < nodes_list.length; i++) {
      var l = [];
      l.push(nodes_list[i].length);
      l.push(nodes_list[i]);
      nodes_list[i] = l;
    }

    for (var i = 0; i < nodes_list.length; i++) {
      for (var j = 0; j < nodes_list.length - i - 1; j++) {
        if (nodes_list[j][1].length > nodes_list[j + 1][1].length) {
          var temp = nodes_list[j];
          nodes_list[j] = nodes_list[j + 1];
          nodes_list[j + 1] = temp;
        }
      }
    }
    nodes_list.reverse();
    for (var i = 0; i < nodes_list.length; i++) {
      nodes_list[i][0] = i;
    }
    return nodes_list;
  }
  nodes_list = generate_node_list();

  resistor_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_l = return_node_num_from_port_id(ele.out_port_id);
  });

  curr_src_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.out_port_id);
    ele.node_l = return_node_num_from_port_id(ele.inp_port_id);
  });

  volt_src_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.out_port_id);
    ele.node_l = return_node_num_from_port_id(ele.inp_port_id);
  });

  vccs_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_l = return_node_num_from_port_id(ele.out_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });

  vcvs_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.out_port_id);
    ele.node_l = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });

  cccs_gen_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_l = return_node_num_from_port_id(ele.out_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });

  cccs_vs_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_l = return_node_num_from_port_id(ele.out_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });

  ccvs_gen_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.out_port_id);
    ele.node_l = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });

  ccvs_vs_list.forEach((ele) => {
    ele.node_k = return_node_num_from_port_id(ele.out_port_id);
    ele.node_l = return_node_num_from_port_id(ele.inp_port_id);
    ele.node_m = parseInt(ele.cont_high_node);
    ele.node_n = parseInt(ele.cont_low_node);
  });
  // Input validation
  var nodes = nodes_list.length - 1;

  if (
    element_id_list.length == 0 ||
    nodes_list.length == 0 ||
    nodes_list.length == 1
  ) {
    return alert("Please give a valid input and try again");
  } else {
    for (var i = 0; i < resistor_list.length; i++) {
      if (parseFloat(resistor_list[i].label) != resistor_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the resistor"
        );
      }
      if (resistor_list[i].node_k > nodes) {
        return alert(
          "The " +
            resistor_list[i].label +
            " ohms resistor's node_high is not valid"
        );
      }
      if (resistor_list[i].node_l > nodes) {
        return alert(
          "The " +
            resistor_list[i].label +
            " ohms resistor's node_low is not valid"
        );
      }
    }

    for (var i = 0; i < curr_src_list.length; i++) {
      if (parseFloat(curr_src_list[i].label) != curr_src_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the current source"
        );
      }
      if (curr_src_list[i].node_k > nodes) {
        return alert(
          "The " +
            curr_src_list[i].label +
            " ampere resistor's node_high is not valid"
        );
      }
      if (curr_src_list[i].node_l > nodes) {
        return alert(
          "The " +
            curr_src_list[i].label +
            " ampere resistor's node_low is not valid"
        );
      }
    }
    for (var i = 0; i < volt_src_list.length; i++) {
      if (parseFloat(volt_src_list[i].label) != volt_src_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the voltage source"
        );
      }
      if (volt_src_list[i].node_k > nodes) {
        return alert(
          "The " +
            volt_src_list[i].label +
            " volts resistor's node_high is not valid"
        );
      }
      if (volt_src_list[i].node_l > nodes) {
        return alert(
          "The " +
            volt_src_list[i].label +
            " volts resistor's node_low is not valid"
        );
      }
    }
    for (var i = 0; i < vccs_list.length; i++) {
      if (parseFloat(vccs_list[i].label) != vccs_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the Voltage controlled current source"
        );
      }
      if (vccs_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the VCCS");
      }
      if (vccs_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the VCCS");
      }
      if (vccs_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the VCCS"
        );
      }
      if (vccs_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the VCCS"
        );
      }
    }
    for (var i = 0; i < vcvs_list.length; i++) {
      if (parseFloat(vcvs_list[i].label) != vcvs_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the Voltage controlled voltage source"
        );
      }
      if (vcvs_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the VCVS");
      }
      if (vcvs_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the VCVS");
      }
      if (vcvs_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the VCVS"
        );
      }
      if (vcvs_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the VCVS"
        );
      }
    }

    for (var i = 0; i < cccs_gen_list.length; i++) {
      if (parseFloat(cccs_gen_list[i].label) != cccs_gen_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the current controlled current source"
        );
      }
      if (cccs_gen_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the CCCS");
      }
      if (cccs_gen_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the CCCS");
      }
      if (cccs_gen_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the CCCS"
        );
      }
      if (cccs_gen_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the CCCS"
        );
      }
    }
    for (var i = 0; i < cccs_vs_list.length; i++) {
      if (parseFloat(cccs_vs_list[i].label) != cccs_vs_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the current controlled current source"
        );
      }
      if (cccs_vs_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the CCCS");
      }
      if (cccs_vs_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the CCCS");
      }
      if (cccs_vs_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the CCCS"
        );
      }
      if (cccs_vs_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the CCCS"
        );
      }
    }
    for (var i = 0; i < ccvs_gen_list.length; i++) {
      if (parseFloat(ccvs_gen_list[i].label) != ccvs_gen_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the current controlled voltage source"
        );
      }
      if (ccvs_gen_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the CCVS");
      }
      if (ccvs_gen_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the CCVS");
      }
      if (ccvs_gen_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the CCVS"
        );
      }
      if (ccvs_gen_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the CCVS"
        );
      }
    }
    for (var i = 0; i < ccvs_vs_list.length; i++) {
      if (parseFloat(ccvs_vs_list[i].label) != ccvs_vs_list[i].label) {
        return alert(
          "You haven't entered correct information for one of the current controlled voltage source"
        );
      }
      if (ccvs_vs_list[i].node_k > nodes) {
        return alert("The node_high is not valid for one of the CCVS");
      }
      if (ccvs_vs_list[i].node_l > nodes) {
        return alert("The node_low is not valid for one of the CCVS");
      }
      if (ccvs_vs_list[i].node_m > nodes) {
        return alert(
          "The controlled voltage node_high is not valid for one of the CCVS"
        );
      }
      if (ccvs_vs_list[i].node_n > nodes) {
        return alert(
          "The controlled voltage node_low is not valid for one of the CCVS"
        );
      }
    }
  }

  function update_conn_label() {
    for (var i = 0; i < connection_list.length; i++) {
      connection_list[i].label_text = return_node_num_from_port_id(
        connection_list[i].src_node
      );
    }
    app.view.lines.data.forEach((ele) => {
      connection_list.forEach((conn) => {
        if (conn.conn_id == ele.id) {
          ele.label.setText(conn.label_text);
        }
      });
    });
  }

  update_conn_label();
  updatePreview(app.view);
  displayJSON(app.view);
}

function simulate() {
  // functionining the classes for the connection, resistor, current source, voltage source, controlled voltage and controlled current source

  //  It is the one that contains the final mapping of the number of nodes
  nodeGenerate();
  var to_change_list = [];
  for (var i = 0; i < connection_list.length; i++) {
    try {
      to_change_list.push([
        parseInt(connection_list[i].label_text),
        connection_list[i].tar_node,
      ]);
    } catch (error) {
      console.log(error);
    }
  }
  for (var i = 0; i < to_change_list.length; i++) {
    for (var j = 0; j < vccs_list.length; j++) {
      if (
        parseInt(vccs_list[j].node_m) == to_change_list[i][0] &&
        vccs_list[j].m_changed == 0
      ) {
        vccs_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        vccs_list[j].m_changed = 1;
      }
      if (
        parseInt(vccs_list[j].node_n) == to_change_list[i][0] &&
        vccs_list[j].n_changed == 0
      ) {
        vccs_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        vccs_list[j].n_changed = 1;
      }
    }
    for (var j = 0; j < vcvs_list.length; j++) {
      if (
        parseInt(vcvs_list[j].node_m) == to_change_list[i][0] &&
        vcvs_list[j].m_changed == 0
      ) {
        vcvs_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        vcvs_list[j].m_changed = 1;
      }
      if (
        parseInt(vcvs_list[j].node_n) == to_change_list[i][0] &&
        vcvs_list[j].n_changed == 0
      ) {
        vcvs_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        vcvs_list[j].n_changed = 1;
      }
    }
    for (var j = 0; j < cccs_gen_list.length; j++) {
      if (
        parseInt(cccs_gen_list[j].node_m) == to_change_list[i][0] &&
        cccs_gen_list[j].m_changed == 0
      ) {
        cccs_gen_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        cccs_gen_list[j].m_changed = 1;
      }
      if (
        parseInt(cccs_gen_list[j].node_n) == to_change_list[i][0] &&
        cccs_gen_list[j].n_changed == 0
      ) {
        cccs_gen_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        cccs_gen_list[j].n_changed = 1;
      }
    }
    for (var j = 0; j < cccs_vs_list.length; j++) {
      if (
        parseInt(cccs_vs_list[j].node_m) == to_change_list[i][0] &&
        cccs_vs_list[j].m_changed == 0
      ) {
        cccs_vs_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        cccs_vs_list[j].m_changed = 1;
      }
      if (
        parseInt(cccs_vs_list[j].node_n) == to_change_list[i][0] &&
        cccs_vs_list[j].n_changed == 0
      ) {
        cccs_vs_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        cccs_vs_list[j].n_changed = 1;
      }
    }
    for (var j = 0; j < ccvs_gen_list.length; j++) {
      if (
        parseInt(ccvs_gen_list[j].node_m) == to_change_list[i][0] &&
        ccvs_gen_list[j].m_changed == 0
      ) {
        ccvs_gen_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        ccvs_gen_list[j].m_changed = 1;
      }
      if (
        parseInt(ccvs_gen_list[j].node_n) == to_change_list[i][0] &&
        ccvs_gen_list[j].n_changed == 0
      ) {
        ccvs_gen_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        ccvs_gen_list[j].n_changed = 1;
      }
    }
    for (var j = 0; j < ccvs_vs_list.length; j++) {
      if (
        parseInt(ccvs_vs_list[j].node_m) == to_change_list[i][0] &&
        ccvs_vs_list[j].m_changed == 0
      ) {
        ccvs_vs_list[j].node_m = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        ccvs_vs_list[j].m_changed = 1;
      }
      if (
        parseInt(ccvs_vs_list[j].node_n) == to_change_list[i][0] &&
        ccvs_vs_list[j].n_changed == 0
      ) {
        ccvs_vs_list[j].node_n = return_node_num_from_port_id(
          to_change_list[i][1]
        );
        ccvs_vs_list[j].n_changed = 1;
      }
    }
  }

  var nodes = nodes_list.length - 1;

  // Create variables for the matrix and process for each element.
  var size = parseInt(nodes + volt_src_list.length + vcvs_list.length);
  var cond_matrix = Array(size)
    .fill()
    .map(() => Array(size).fill(0));

  var curr_matrix = Array(size)
    .fill()
    .map(() => Array(1).fill(0));

  var var_matrix = Array(size)
    .fill()
    .map(() => Array(1).fill(0));

  var var_list = [];
  for (var i = 0; i < nodes; i++) {
    var_list.push("V_" + String(i + 1));
  }

  var obj_volt_src_cnt = 0;
  var obj_vccs_cnt = 0; // Variable for selecting the apt column if the element is a vccs
  var obj_vcvs_cnt = 0;
  var obj_cccs_gen_cnt = 0;
  var obj_cccs_vs_cnt = 0;
  var obj_ccvs_gen_cnt = 0;
  var obj_ccvs_vs_cnt = 0;

  for (var obj = 0; obj < curr_src_list.length; obj++) {
    // Contributes only to cuurent matrix
    var n_k = parseInt(curr_src_list[obj].node_k) - 1;
    var n_l = parseInt(curr_src_list[obj].node_l) - 1;
    var current = parseFloat(curr_src_list[obj].label);

    if (n_k != -1 && n_l != -1) {
      curr_matrix[n_k][0] += current;
      curr_matrix[n_l][0] -= current;
    } else if (n_k == -1 && n_l != -1) {
      curr_matrix[n_l][0] -= current;
    } else if (n_k != -1 && n_l == -1) {
      curr_matrix[n_k][0] += current;
    }
  }
  for (var obj = 0; obj < volt_src_list.length; obj++) {
    //  The following code is only when there is one voltage source in the circuit
    // Contributes to both current and conductance matrix
    var n_k = parseInt(volt_src_list[obj].node_k) - 1;
    var n_l = parseInt(volt_src_list[obj].node_l) - 1;

    var voltage = parseFloat(volt_src_list[obj].label);
    var count = 0;
    var new_var = "I_" + String(n_k + 1) + "_" + String(n_l + 1);
    for (var i = 0; i < var_list.length; i++) {
      if (var_list[i] == new_var) {
        count = count + 1;
      }
    }
    if (count == 0) {
      var_list.push(new_var);
    }
    var idx = var_list.indexOf(new_var);
    if (n_k != -1 && n_l != -1) {
      cond_matrix[n_k][idx] += 1;
      cond_matrix[n_l][idx] -= 1;
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][n_l] -= 1;

      curr_matrix[idx][0] += voltage;
      obj_volt_src_cnt += 1;
    } else if (n_k == -1 && n_l != -1) {
      cond_matrix[n_l][idx] -= 1;
      cond_matrix[idx][n_l] -= 1;

      curr_matrix[idx][0] += voltage;

      obj_volt_src_cnt += 1;
    } else if (n_l == -1 && n_k != -1) {
      cond_matrix[n_k][idx] += 1;
      cond_matrix[idx][n_k] += 1;

      curr_matrix[idx][0] += voltage;

      obj_volt_src_cnt += 1;
    }
  }

  for (var obj = 0; obj < vccs_list.length; obj++) {
    var n_k = parseInt(vccs_list[obj].node_k) - 1;
    var n_l = parseInt(vccs_list[obj].node_l) - 1;

    var ctrl_n_m = parseInt(vccs_list[obj].node_m) - 1;
    var ctrl_n_n = parseInt(vccs_list[obj].node_n) - 1;

    var transconductance = parseFloat(vccs_list[obj].label);
    if (n_k != -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[n_k][ctrl_n_m] += transconductance;
      cond_matrix[n_k][ctrl_n_n] -= transconductance;
      cond_matrix[n_l][ctrl_n_m] -= transconductance;
      cond_matrix[n_l][ctrl_n_n] += transconductance;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[n_l][ctrl_n_m] -= transconductance;
      cond_matrix[n_l][ctrl_n_n] += transconductance;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[n_k][ctrl_n_m] += transconductance;
      cond_matrix[n_k][ctrl_n_n] -= transconductance;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[n_k][ctrl_n_n] -= transconductance;
      cond_matrix[n_l][ctrl_n_n] += transconductance;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[n_k][ctrl_n_m] += transconductance;
      cond_matrix[n_l][ctrl_n_m] -= transconductance;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[n_l][ctrl_n_n] += transconductance;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[n_l][ctrl_n_m] -= transconductance;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[n_k][ctrl_n_n] -= transconductance;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[n_k][ctrl_n_m] += transconductance;
    }
  }
  for (var obj = 0; obj < vcvs_list.length; obj++) {
    var n_k = parseInt(vcvs_list[obj].node_k) - 1;
    var n_l = parseInt(vcvs_list[obj].node_l) - 1;

    var ctrl_n_m = parseInt(vcvs_list[obj].node_m) - 1;
    var ctrl_n_n = parseInt(vcvs_list[obj].node_n) - 1;

    var ctrl_ftr = parseFloat(vcvs_list[obj].label);
    var new_var = "I_" + String(n_k + 1) + "_" + String(n_l + 1);
    var count = 0;
    for (var i = 0; i < var_list.length; i++) {
      if (var_list[i] == new_var) {
        count = count + 1;
      }
    }
    if (count == 0) {
      var_list.push(new_var);
    }

    var idx = var_list.indexOf(new_var);

    if (n_k != -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_k][idx] += 1;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_k][idx] += 1;

      obj_vcvs_cnt += 1;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_k][idx] += 1;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[n_k][idx] += 1;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[idx][n_l] -= 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[n_l][idx] -= 1;

      obj_vcvs_cnt += 1;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m == -1 && ctrl_n_n != -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][ctrl_n_n] += ctrl_ftr;
      cond_matrix[n_k][idx] += 1;

      obj_vcvs_cnt += 1;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1 && ctrl_n_n == -1) {
      cond_matrix[idx][n_k] += 1;
      cond_matrix[idx][ctrl_n_m] -= ctrl_ftr;
      cond_matrix[n_k][idx] += 1;

      obj_vcvs_cnt += 1;
    }
  }

  for (var obj = 0; obj < cccs_gen_list.length; obj++) {
    var n_k = parseInt(cccs_gen_list[obj].node_k) - 1;
    var n_l = parseInt(cccs_gen_list[obj].node_l) - 1;
    var ctrl_n_m = parseInt(cccs_gen_list[obj].node_m) - 1;
    var ctrl_n_n = parseInt(cccs_gen_list[obj].node_n) - 1;
    var ctrl_ftr = parseFloat(cccs_gen_list[obj].label);

    var new_var_V = "V_" + String(ctrl_n_m + 1) + "_";

    var var_list1 = var_list.slice(0, ctrl_n_m + 1);
    var_list1.push(new_var_V);
    var_list2 = var_list1.concat(var_list.slice(ctrl_n_m + 1));
    var_list = var_list2;

    var cond_matrix1 = cond_matrix.slice(0, ctrl_n_m + 1);
    cond_matrix1.push(Array(size).fill(0));
    cond_matrix1 = cond_matrix1.concat(cond_matrix.slice(ctrl_n_m + 1));
    cond_matrix = cond_matrix1;

    var cond_matrix2 = cond_matrix
      .slice(0)
      .map((i) => i.slice(0, ctrl_n_m + 1));
    var cond_matrix_two = cond_matrix2;

    var cond_matrix3 = cond_matrix.slice(0).map((i) => i.slice(ctrl_n_m + 1));
    for (var j = 0; j < cond_matrix2.length; j++) {
      cond_matrix2[j][cond_matrix2[j].length] = 0;
    }

    var cond_matrix4 = [];
    for (var i = 0; i < cond_matrix2.length; i++) {
      cond_matrix4[i] = cond_matrix2[i].concat(cond_matrix3[i]);
    }
    cond_matrix = cond_matrix4;
    curr_matrix1 = curr_matrix.slice(0, ctrl_n_m + 1);
    curr_matrix1.push(Array(1).fill(0));
    curr_matrix1 = curr_matrix1.concat(curr_matrix.slice(ctrl_n_m + 1));
    curr_matrix = curr_matrix1;

    var new_var_I = "I_" + String(ctrl_n_m + 1) + "_" + String(ctrl_n_n + 1);
    var_list.push(new_var_I);
    cond_matrix.push(Array(cond_matrix[0].length).fill(0));
    var cond_matrix_check = cond_matrix;
    var length = cond_matrix.length;
    for (var k = 0; k < length; k++) {
      cond_matrix[k] = cond_matrix[k].concat(0);
    }
    curr_matrix.push(Array(1).fill(0));

    var i_mn = var_list.indexOf(
      "I_" + String(ctrl_n_m + 1) + "_" + String(ctrl_n_n + 1)
    );
    if (n_k != -1) {
      n_k = var_list.indexOf("V_" + String(n_k + 1));
    }
    if (n_l != -1) {
      n_l = var_list.indexOf("V_" + String(n_l + 1));
    }
    if (ctrl_n_m != -1) {
      ctrl_n_m = var_list.indexOf("V_" + String(ctrl_n_m + 1));
      ctrl_n_n = var_list.indexOf("V_" + String(ctrl_n_m + 1));
    }

    if (n_k != -1 && n_l != -1 && ctrl_n_m != -1) {
      cond_matrix[n_k][i_mn] += ctrl_ftr;
      cond_matrix[n_l][i_mn] -= ctrl_ftr;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1) {
      cond_matrix[n_l][i_mn] -= ctrl_ftr;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1) {
      cond_matrix[n_k][i_mn] += ctrl_ftr;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m == -1) {
      cond_matrix[n_k][i_mn] += ctrl_ftr;
      cond_matrix[n_l][i_mn] -= ctrl_ftr;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m == -1) {
      cond_matrix[n_l][i_mn] -= ctrl_ftr;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m == -1) {
      cond_matrix[n_k][i_mn] += ctrl_ftr;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
    }
  }

  for (var obj = 0; obj < ccvs_gen_list.length; obj++) {
    var n_k = parseInt(ccvs_gen_list[obj].node_k) - 1;
    var n_l = parseInt(ccvs_gen_list[obj].node_l) - 1;
    var ctrl_n_m = parseInt(ccvs_gen_list[obj].node_m) - 1;
    var ctrl_n_n = parseInt(ccvs_gen_list[obj].node_n) - 1;
    var transresistance = parseFloat(ccvs_gen_list[obj].label);

    var new_var_V = "V_" + String(ctrl_n_m + 1) + "_";
    var var_list1 = var_list.slice(0, ctrl_n_m + 1);
    var_list1.push(new_var_V);
    var_list2 = var_list1.concat(var_list.slice(ctrl_n_m + 1));
    var_list = var_list2;

    var cond_matrix1 = cond_matrix.slice(0, ctrl_n_m + 1);

    cond_matrix1.push(Array(size).fill(0));
    cond_matrix1 = cond_matrix1.concat(cond_matrix.slice(ctrl_n_m + 1));
    cond_matrix = cond_matrix1;
    var cond_matrix2 = cond_matrix
      .slice(0)
      .map((i) => i.slice(0, ctrl_n_m + 1));
    var cond_matrix3 = cond_matrix.slice(0).map((i) => i.slice(ctrl_n_m + 1));
    for (var j = 0; j < cond_matrix2.length; j++) {
      cond_matrix2[j][cond_matrix2[j].length] = 0;
    }

    var cond_matrix4 = [];
    for (var i = 0; i < cond_matrix2.length; i++) {
      cond_matrix4[i] = cond_matrix2[i].concat(cond_matrix3[i]);
    }
    cond_matrix = cond_matrix4;

    curr_matrix1 = curr_matrix.slice(0, ctrl_n_m + 1);
    curr_matrix1.push(Array(1).fill(0));
    curr_matrix1 = curr_matrix1.concat(curr_matrix.slice(ctrl_n_m + 1));
    curr_matrix = curr_matrix1;

    var new_var_I = "I_" + String(ctrl_n_m + 1) + "_" + String(ctrl_n_n + 1);
    var_list.push(new_var_I);
    cond_matrix.push(Array(cond_matrix[0].length).fill(0));
    var length = cond_matrix[0].length;
    for (var j = 0; j < cond_matrix.length; j++) {
      cond_matrix[j][length] = 0;
    }
    curr_matrix.push(Array(1).fill(0));

    var new_var_I = "I_" + String(n_k + 1) + "_" + String(n_l + 1);
    var_list.push(new_var_I);
    cond_matrix.push(Array(cond_matrix[0].length).fill(0));
    length = cond_matrix[0].length;
    for (var j = 0; j < cond_matrix.length; j++) {
      cond_matrix[j][length] = 0;
    }
    curr_matrix.push(Array(1).fill(0));

    var i_mn = var_list.indexOf(
      "I_" + String(ctrl_n_m + 1) + "_" + String(ctrl_n_n + 1)
    );
    var i_kl = var_list.indexOf("I_" + String(n_k + 1) + "_" + String(n_l + 1));
    if (n_k != -1) {
      n_k = var_list.indexOf("V_" + String(n_k + 1));
    }
    if (n_l != -1) {
      n_l = var_list.indexOf("V_" + String(n_l + 1));
    }
    if (ctrl_n_m != -1) {
      ctrl_n_m = var_list.indexOf("V_" + String(ctrl_n_m + 1));
    }
    if (ctrl_n_n != -1) {
      ctrl_n_n = var_list.indexOf("V_" + String(ctrl_n_n + 1));
    }
    if (n_k != -1 && n_l != -1 && ctrl_n_m != -1) {
      cond_matrix[n_k][i_kl] += 1;
      cond_matrix[n_l][i_kl] -= 1;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_k] += 1;
      cond_matrix[i_kl][n_l] -= 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m != -1) {
      cond_matrix[n_l][i_kl] -= 1;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_l] += 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m != -1) {
      cond_matrix[n_k][i_kl] += 1;
      cond_matrix[ctrl_n_m][i_mn] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m] += 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_k] += 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    } else if (n_k != -1 && n_l != -1 && ctrl_n_m == -1) {
      cond_matrix[n_k][i_kl] += 1;
      cond_matrix[n_l][i_kl] -= 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_k] += 1;
      cond_matrix[i_kl][n_l] += 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    } else if (n_k == -1 && n_l != -1 && ctrl_n_m == -1) {
      cond_matrix[n_l][i_kl] -= 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_l] += 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    } else if (n_k != -1 && n_l == -1 && ctrl_n_m == -1) {
      cond_matrix[n_k][i_kl] += 1;
      cond_matrix[ctrl_n_m + 1][i_mn] -= 1;
      cond_matrix[i_mn][ctrl_n_m + 1] -= 1;
      cond_matrix[i_kl][n_k] += 1;
      cond_matrix[i_kl][i_mn] -= transresistance;
    }
  }

  for (var obj = 0; obj < resistor_list.length; obj++) {
    var n_k = parseInt(resistor_list[obj].node_k);

    var n_l = parseInt(resistor_list[obj].node_l);

    if (ccvs_gen_list.length > 0) {
      var ccvs_high = parseInt(ccvs_gen_list[0].node_m);
      var ccvs_low = parseInt(ccvs_gen_list[0].node_n);

      if (n_l == ccvs_high && n_k == ccvs_low) {
        var temp = n_l;
        n_l = n_k;
        n_k = temp;
        if (n_l <= ccvs_high) {
          n_l = n_l - 1;
        }
      } else if (n_k == ccvs_high && n_l == ccvs_low) {
        n_k = n_k;
        if (n_l <= ccvs_high) {
          n_l = n_l - 1;
        }
      } else if (n_l <= ccvs_high && n_k <= ccvs_high) {
        n_l = n_l - 1;
        n_k = n_k - 1;
      } else if (n_k <= ccvs_high && n_l > ccvs_high) {
        n_k = n_k - 1;
      } else if (n_l <= ccvs_high && n_k > ccvs_high) {
        n_l = n_l - 1;
      }
    } else if (cccs_gen_list.length > 0) {
      var cccs_high = parseInt(cccs_gen_list[0].node_m);
      var cccs_low = parseInt(cccs_gen_list[0].node_n);

      if (n_l == cccs_high && n_k == cccs_low) {
        var temp = n_l;
        n_l = n_k;
        n_k = temp;
        if (n_l <= cccs_high) {
          n_l = n_l - 1;
        }
      } else if (n_k == cccs_high && n_l == cccs_low) {
        n_k = n_k;
        if (n_l <= cccs_high) {
          n_l = n_l - 1;
        }
      } else if (n_l <= cccs_high && n_k <= cccs_high) {
        n_l = n_l - 1;
        n_k = n_k - 1;
      } else if (n_k <= cccs_high && n_l > cccs_high) {
        n_k = n_k - 1;
      } else if (n_l <= cccs_high && n_k > cccs_high) {
        n_l = n_l - 1;
      }
    } else {
      n_k = n_k - 1;
      n_l = n_l - 1;
    }

    var conductance = 1.0 / parseFloat(resistor_list[obj].label);

    if (n_k != -1 && n_l != -1) {
      cond_matrix[n_k][n_k] += conductance;
      cond_matrix[n_k][n_l] -= conductance;
      cond_matrix[n_l][n_k] -= conductance;
      cond_matrix[n_l][n_l] += conductance;
    } else if (n_k == -1 && n_l != -1) {
      cond_matrix[n_l][n_l] += conductance;
    } else if (n_l == -1 && n_k != -1) {
      cond_matrix[n_k][n_k] += conductance;
    }
  }
  cond_matrix_inv = math.inv(cond_matrix);
  var output_matrix = math.multiply(cond_matrix_inv, curr_matrix);

  // Display in popup
  var output = document.getElementById("output");
  output.innerHTML = "";
  var h2 = document.createElement("h2");
  h2.setAttribute("style", "padding-bottom: 30px");
  h2.innerHTML = "Output: ";
  output.appendChild(h2);
  for (var i = 0; i < var_list.length; i++) {
    if (var_list[i][0] == "V") {
      var h3 = document.createElement("h3");
      h3.innerHTML =
        var_list[i] + " = " + output_matrix[i][0].toFixed(2) + " V ";
      output.appendChild(h3);
    }

    if (var_list[i][0] == "I") {
      var h3 = document.createElement("h3");
      h3.innerHTML =
        var_list[i] + " = " + output_matrix[i][0].toFixed(2) + " A ";
      output.appendChild(h3);
    }
  }

  var img = document.getElementById("preview");
  var button2 = document.createElement("a");
  button2.setAttribute("class", "btn btn-primary btn-modal btn-lg");
  button2.setAttribute("style", "left: 60%");
  button2.setAttribute("href", img.src);
  button2.setAttribute("download", "diagram.png");
  button2.innerHTML = "Save image as PNG";
  output.appendChild(button2);
  $(".mask").addClass("active");

  function update_cont_srcs() {
    console.log("Goes");
    console.log("app.view.figures.data", app.view.figures.data);
    app.view.figures.data.forEach((ele) => {
      console.log("ele", ele);
      console.log("ele_label", ele.label.getText());
      if (ele.cssClass == "VCCS") {
        vccs_list.forEach((e) => {
          if (e.id == ele.id) {
            ele.label1.setText(e.node_m);
            ele.label2.setText(e.node_n);
          }
        });
      } else if (ele.cssClass == "VCVS") {
        vcvs_list.forEach((e) => {
          if (e.id == ele.id) {
            ele.label1.setText(e.node_m);
            ele.label2.setText(e.node_n);
          }
        });
      } else if (ele.cssClass == "CCCS_Gen") {
        cccs_gen_list.forEach((e) => {
          if (e.id == ele.id) {
            ele.label1.setText(e.node_m);
            ele.label2.setText(e.node_n);
          }
        });
      } else if (ele.cssClass == "CCVS_Gen") {
        ccvs_gen_list.forEach((e) => {
          if (e.id == ele.id) {
            ele.label1.setText(e.node_m);
            ele.label2.setText(e.node_n);
          }
        });
      }
    });
  }
  update_cont_srcs();
  updatePreview(app.view);
}
