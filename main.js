class Node {
  constructor(i, j, status, parent, g, h) {
    this.i = i;
    this.j = j;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = parent;
    this.neighbours = [];
    this.colorNode = status => {
      this.status = status;
      fillNode(this.i, this.j, status);
    };
  }
}
var canvas = document.getElementById("pathAnimation");
canvas.width = window.innerWidth * 0.9812;
canvas.height = window.innerHeight * 0.9;
var sqaureW = 50;
var ctx;
var openL = [];
var closedL = [];
var tSize = 30;
if (canvas.getContext) {
  ctx = canvas.getContext("2d");
}
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";
//////////////////////////////////////////////////////////////
// var maxWi = canvas.width > canvas.height ? canvas.height / 4 : canvas.width / 4;
// var minWi = 10;
// var slider = document.getElementById("boxWidth");
// slider.max = maxWi;
// slider.value = minWi;
// boxWidths.innerHTML = slider.value;

// slider.oninput = function() {
//   boxWidths.innerHTML = this.value;
//   sqaureW = this.value;
// };
//////////////////////////////////////////////////////////////
let r = Math.floor(canvas.width / sqaureW - 1);
let c = Math.floor(canvas.height / sqaureW - 1);

var arr = new Array(parseInt(r, 10));
for (let i = 0; i < r; i++) {
  arr[i] = new Array(parseInt(c, 10));
}
for (let i = 0; i < r; i++) {
  for (let j = 0; j < c; j++) {
    arr[i][j] = new Node(i, j, "blank", null, 0, 0);
  }
}
canvas.addEventListener("mousedown", doMouseDown, false);
function drawNodes(r, c) {
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      addNeighbours(arr, i, j, r, c);
      ctx.fillStyle = "black";
      ctx.strokeRect(i * sqaureW + 4, j * sqaureW + 7, sqaureW, sqaureW);
    }
  }
}

drawNodes(r, c);
// console.log(r + " r| " + c);

////////////////////////////////////////////////////////
//Initialising start and end node
var start = arr[0][0];
start.colorNode("start");
var end = arr[r - 1][c - 1];
end.colorNode("end");
var nChange = "start";
var currentAlgo = "astar";
/////////////////////////////////////////////////////////A star
function northstar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNodes(r, c);

  AStarPath(start, end);
  end.colorNode("end");
  //Re intialising for next path
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      arr[i][j] = new Node(i, j, "blank", null, 0, 0);
    }
  }
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      addNeighbours(arr, i, j, r, c);
    }
  }
  openL = [];
  closedL = [];
}
function AStarPath(start) {
  openL.push(start);
  let count = 0;
  while (openL.length > 0) {
    var min = 0;
    for (let i = 0; i < openL.length; i++) {
      if (openL[min].f > openL[i].f) {
        min = i;
      }
    }
    var current = openL[min];

    if (current.i === end.i && current.j === end.j) {
      cnnn = current;
      while (cnnn != null) {
        cnnn.colorNode("open");
        if (cnnn == start) {
          cnnn.colorNode("start");
        } else if (cnnn == end) {
          cnnn.colorNode("end");
        }
        cnnn = cnnn.parent;
      }
      console.log("Done");
      return;
    }
    // console.log(openL);
    openL.splice(openL.indexOf(current), 1);
    // console.log(openL);
    closedL.push(current);
    current.colorNode("closed");
    var neigh = current.neighbours;

    for (let i = 0; i < neigh.length; i++) {
      let ne = neigh[i];

      if (closedL.includes(ne)) {
        continue;
      }
      let tg = current.g + 1;
      if (openL.includes(ne)) {
        if (tg < ne.g) {
          ne.colorNode("cons");
          console.log("Hello");

          ne.g = tg;
        }
      } else {
        ne.g = tg;
        ne.colorNode("cons");
        openL.push(ne);
      }
      ne.h = hDist(ne, end);
      ne.f = ne.g + ne.h;
      ne.parent = current;
    }
  }
}
////////////////////////////////////////////////////////heuristic
function hDist(nNode, end) {
  if (currentAlgo === "astar") {
    return Math.abs(end.i - nNode.i + end.j - nNode.j);
    // return Math.sqrt(Math.pow(end.i - nNode.i, 2) + Math.pow(end.j - nNode.j, 2));
  }
  return 0;
}
////////////////////////////////////////////////////////adding neighbours
function addNeighbours(narr, i, j, r, c) {
  if (i > 0) {
    narr[i][j].neighbours.push(narr[i - 1][j]);
  }
  if (j > 0) {
    narr[i][j].neighbours.push(narr[i][j - 1]);
  }
  if (i < r - 1) {
    narr[i][j].neighbours.push(narr[i + 1][j]);
  }
  if (j < c - 1) {
    narr[i][j].neighbours.push(narr[i][j + 1]);
  }
}

////////////////////////////////drawing functions
function fillNode(i, j, status) {
  if (!(status === "blank")) {
    if (status === "start") {
      ctx.fillStyle = "chartreuse";
    } else if (status === "end") {
      ctx.fillStyle = "blue";
    } else if (status === "open") {
      ctx.fillStyle = "aquamarine";
    } else if (status === "cons") {
      ctx.fillStyle = "red";
    } else if (status === "closed") {
      ctx.fillStyle = "yellow";
    } else if (status === "tmouse") {
      ctx.fillStyle = "aqua";
    }

    ctx.fillRect(i * sqaureW + 4, j * sqaureW + 7, sqaureW, sqaureW);
    ////////////////below code adds a border to sqaure as the above code overwrites the boxes
    ctx.fillStyle = "black";
    ctx.strokeRect(i * sqaureW + 4, j * sqaureW + 7, sqaureW, sqaureW);
    // ctx.beginPath();
    // ctx.rect(i * sqaureW + 4, j * sqaureW + 7, sqaureW, sqaureW);
    // ctx.stroke();
    // ctx.fillStyle = "red";
    // fillText(i, j, status[0].toUpperCase());
  }
}
// function fillText(i, j, wordS) {
//   ctx.font = `${tSize}pt sans-serif`;
//   // ctx.fillText("Canvas Rocks!", 5, 100);
//   ctx.strokeText(
//     wordS,
//     i * sqaureW + 4 + (sqaureW - tSize) / 2,
//     j * sqaureW + 7 + (sqaureW - tSize) / 2 + tSize * (1 - tSize / sqaureW)
//   );
// }
// function doMouseDown2(evt) {
//   let bx = evt.pageX;
//   let by = evt.pageY;
//   console.log(
//     Math.floor((bx - 12) / sqaureW) + " | " + Math.floor((by - 78) / sqaureW)
//   );
//   start = arr[Math.floor((bx - 12) / sqaureW)][Math.floor((by - 78) / sqaureW)];

//   if (bx > 0 && by > 0)
//     fillNode(
//       Math.floor((bx - 12) / sqaureW),
//       Math.floor((by - 78) / sqaureW),
//       "tmouse"
//     );
// }
function doMouseDown(evt) {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // drawNodes(r, c);
  // start.colorNode("start");
  // end.colorNode("end");
  let bx = Math.floor((evt.pageX - 12) / sqaureW);
  let by = Math.floor((evt.pageY - 78) / sqaureW);
  console.log(bx + " | " + by);

  if (bx >= 0 && by >= 0 && bx < r && by < c) {
    if (nChange === "start") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNodes(r, c);
      end.colorNode("end");
      start = arr[bx][by];
      fillNode(bx, by, "start");
    }
    if (nChange === "end") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNodes(r, c);
      start.colorNode("start");
      end = arr[bx][by];
      fillNode(bx, by, "end");
    }
  }
}
function changeNodePoint(wNode) {
  nChange = wNode;
}
function changeAlgorithm(algos) {
  currentAlgo = algos;
  northstar();
}
