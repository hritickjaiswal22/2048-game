let number, grid;

number = {
  numbers: [],
  getElements: function () {
    const numberElements = document.getElementsByClassName("number");

    for (const numberElement of numberElements) {
      this.numbers.push(numberElement);
    }
  },
  spawn: function () {
    const emptyCellIndex = grid.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    const numberElement = document.createElement("div");
    const numberValue = 2;

    numberElement.innerText = numberValue;
    numberElement.dataset.value = numberValue;
    numberElement.classList.add("number");

    numberElement.style.top = `${grid.cells[emptyCellIndex].top}px`;
    numberElement.style.left = `${grid.cells[emptyCellIndex].left}px`;

    grid.cells[emptyCellIndex].number = numberElement;

    grid.gridElement.append(numberElement);

    return true;
  },
  moveTo: function (fromCell, toCell) {
    const number = fromCell.number;

    if (toCell.number === null) {
      // target cell is empty fill with number
      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;

      toCell.number = number;
      fromCell.number = null;
    } else if (number.dataset.value === toCell.number.dataset.value) {
      // target cell has same number
      // merge both cell

      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;
      number.style.opacity = "0";

      // remove number DOM element after transition
      setTimeout(() => {
        grid.gridElement.removeChild(number);
      }, 500);

      // double target cell's number
      const newNumberValue = toCell.number.dataset.value * 2;
      toCell.number.dataset.value = newNumberValue;
      toCell.number.innerText = newNumberValue;

      fromCell.number = null;
    }
  },
};

grid = {
  gridElement: document.querySelector(".grid"),
  cells: [],
  playabale: false,
  directionRoots: {
    UP: [1, 2, 3, 4],
    RIGHT: [4, 8, 12, 16],
    DOWN: [13, 14, 15, 16],
    LEFT: [1, 5, 9, 3],
  },
  init: function () {
    const cellElements = document.querySelectorAll(".box");
    let cellIndex = 1;

    for (const cellElement of cellElements) {
      grid.cells[cellIndex] = {
        element: cellElement,
        top: cellElement.offsetTop,
        left: cellElement.offsetLeft,
        number: null,
      };

      cellIndex++;
    }

    number.spawn();
    this.playabale = true;
  },
  slide: function (direction) {
    console.log(this.playabale);
    if (!this.playabale) {
      return false;
    }

    const roots = this.directionRoots[direction];

    let increment = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

    increment *= direction === "UP" || direction === "DOWN" ? 4 : 1;

    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];

      // increment or decrement through grid from root
      // j starts from 1 bc no need to check root cell
      for (let j = 1; j < 4; j++) {
        const cellIndex = root + j * increment;
        const cell = this.cells[cellIndex];

        if (cell.number !== null) {
          let moveToCell = null;

          // check if cells below(to root) this cell empty or has same number
          // to decide to move or stay
          // k starts from j-1 first cell below j
          // k ends by 0 which is root cell
          for (let k = j - 1; k >= 0; k--) {
            const foreCellIndex = root + k * increment;
            const foreCell = this.cells[foreCellIndex];

            if (foreCell.number === null) {
              // the cell is empty, move to and check next cell
              moveToCell = foreCell;
            } else if (
              cell.number.dataset.value === foreCell.number.dataset.value
            ) {
              // the cell has same number, move, merge and stop
              moveToCell = foreCell;
              break;
            } else {
              // next cell is not empty and not same with moving number(number is moving cell is not)
              // number can't go further
              break;
            }
          }

          if (moveToCell !== null) {
            number.moveTo(cell, moveToCell);
          }
        }
      }
    }

    // spawn a new number and make game playable
    setTimeout(function () {
      if (number.spawn()) {
        grid.playable = true;
      } else {
        alert("GAME OVER!");
      }
    }, 500);
  },
  randomEmptyCellIndex: function () {
    let emptyCells = [];

    for (let i = 1; i < this.cells.length; i++) {
      if (this.cells[i].number === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  },
};

grid.init();

document.addEventListener("keyup", function (e) {
  let direction = null;

  if (e.code === "ArrowUp") direction = "UP";
  if (e.code === "ArrowDown") direction = "DOWN";
  if (e.code === "ArrowLeft") direction = "LEFT";
  if (e.code === "ArrowRight") direction = "RIGHT";

  if (direction !== null) {
    grid.slide(direction);
  }

  return false;
});
