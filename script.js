"use strict";

// Initialization
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const btnClear = document.querySelector(".btn");
const canvasOffset = canvas.getBoundingClientRect();
const offsetX = canvasOffset.left;
const offsetY = canvasOffset.top;
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;

// console.log(canvasOffset);

// these variables will hold the starting mouse position
let mmx, mmy;
let startX, startY;
let mouseX, mouseY;
let dbx, dby;

// To store the Rectangles in an array and use their properties to check if mouse is clicked within the shape or outside of it
const shapesArr = [];

// Flag to drag the triangle
let isOnlyDrag = false;

// Flag to make a triangle
let inShapeDrag = false;

// Selects the current shape in which mouse is clicked
let shapeIndex = 0;
let colorIndex = 0;

const colorArr = [
  "rgb(149, 161, 195)",
  "rgb(116, 161, 142)",
  "rgb(129, 173, 181)",
  "rgb(178, 200, 145)",
  "rgb(185, 156, 107)",
  "rgb(228, 153, 105)",
  "rgb(201, 194, 127)",
  "rgb(148, 148, 148)",
  "rgb(178, 178, 178)",
  "rgb(214, 214, 214)",
];

const handleMouseOut = function (e) {
  e.stopPropagation();
  e.preventDefault();

  // console.log(`Mouse Out event`);
  isOnlyDrag = false;
  inShapeDrag = false;
};

const handleMouseUp = function (e) {
  e.stopPropagation();
  e.preventDefault();

  inShapeDrag = false;
  if (isOnlyDrag === true) {
    colorIndex = Math.floor(Math.random() * 10);
    ctx.fillStyle = colorArr[colorIndex];
    ctx.fill();
    // ignore-prettier
    shapesArr.push({
      X: 0,
      Y: 0,
      x0: mouseX,
      y0: mouseY,
      x1: mmx,
      y1: mmy,
      x2: mouseX + (mouseX - mmx),
      y2: mmy,
      color: colorIndex,
    });
    isOnlyDrag = false;
  }
};

const handleMouseDown = function (e) {
  e.stopPropagation();
  e.preventDefault();

  // console.log("Mouse Down Event");

  let pos = getMousePos(e);
  mouseX = pos.x;
  mouseY = pos.y;

  // console.log(mouseX, mouseY);

  if (shapesArr.length !== 0) {
    for (let j = 0; j < shapesArr.length; j++) {
      redrawPrevTriangles(shapesArr[j]);
      if (ctx.isPointInPath(mouseX, mouseY)) {
        shapeIndex = j;
        inShapeDrag = true;
      } else {
        //  In case the click is outside of the Triangle
        isOnlyDrag = true;
      }
    }
  } else {
    //  To draw the first Triangle
    isOnlyDrag = true;
  }
};

const handleMouseMove = function (e) {
  e.stopPropagation();
  e.preventDefault();

  // console.log(`In mouseMove event`);

  let pos = getMousePos(e);
  mmx = pos.x;
  mmy = pos.y;
  // To drag the Triangle
  if (inShapeDrag === true) {
    let newX = mmx - mouseX;
    let newY = mmy - mouseY;
    mouseX = mmx;
    mouseY = mmy;

    // console.log(shapeIndex);
    shapesArr[shapeIndex].X += newX;
    shapesArr[shapeIndex].Y += newY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveTriangle();
  } else {
    /*To draw a new Triangle*/
    if (isOnlyDrag === false) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTriangle();
  }
};

function getMousePos(e) {
  return {
    x: e.clientX - offsetX,
    y: e.clientY - offsetY,
  };
}

function redrawPrevTriangles(shape) {
  ctx.beginPath();
  ctx.moveTo(shape.x0 + shape.X, shape.y0 + shape.Y);
  ctx.lineTo(shape.x1 + shape.X, shape.y1 + shape.Y);
  ctx.lineTo(shape.x2 + shape.X, shape.y2 + shape.Y);
  ctx.closePath();
  // console.log(colorArr[shape.color]);
  ctx.fillStyle = colorArr[shape.color];
  ctx.fill();
}

function drawTriangle() {
  if (shapesArr !== null) {
    for (let i = 0; i < shapesArr.length; i++) {
      redrawPrevTriangles(shapesArr[i]);
    }
  }
  ctx.beginPath();
  ctx.moveTo(mouseX, mouseY);
  ctx.lineTo(mmx, mmy);
  ctx.lineTo(mouseX + (mouseX - mmx), mmy);
  ctx.closePath();
  ctx.stroke();
}

function moveTriangle() {
  for (let i = 0; i < shapesArr.length; i++) {
    ctx.beginPath();
    ctx.moveTo(
      shapesArr[i].x0 + shapesArr[i].X,
      shapesArr[i].y0 + shapesArr[i].Y
    );
    ctx.lineTo(
      shapesArr[i].x1 + shapesArr[i].X,
      shapesArr[i].y1 + shapesArr[i].Y
    );
    ctx.lineTo(
      shapesArr[i].x2 + shapesArr[i].X,
      shapesArr[i].y2 + shapesArr[i].Y
    );
    ctx.closePath();
    // ctx.fillStyle = colorArr[triangle.color];
    ctx.fillStyle = colorArr[shapesArr[i].color];
    ctx.fill();
  }
  // console.log(`inShapeDrag ${inShapeDrag}, isOnlyDrag ${isOnlyDrag}`);
}

function handleDoubleClick(e) {
  e.preventDefault();
  e.stopPropagation();

  let pos = getMousePos(e);
  dbx = pos.x;
  dby = pos.y;

  if (shapesArr.length !== 0) {
    for (let i = 0; i < shapesArr.length; i++) {
      // intializePathForTheOldShape(shapesArr[i]);
      redrawPrevTriangles(shapesArr[i]);
      if (ctx.isPointInPath(dbx, dby)) {
        shapesArr.splice(i, 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTriangle();
      }
    }
  }
}

function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapesArr.length = 0;
  isOnlyDrag = inShapeDrag = false;
}

// Function calls
canvas.addEventListener("mousedown", function (e) {
  handleMouseDown(e);
});
canvas.addEventListener("mouseup", function (e) {
  handleMouseUp(e);
});
canvas.addEventListener("mousemove", function (e) {
  handleMouseMove(e);
});
canvas.addEventListener("mouseout", function (e) {
  handleMouseOut(e);
});
canvas.addEventListener("dblclick", function (e) {
  handleDoubleClick(e);
});
btnClear.addEventListener("click", function (e) {
  clearScreen(e);
});
