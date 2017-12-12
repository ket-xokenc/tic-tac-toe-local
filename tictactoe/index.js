document.querySelector(".field").addEventListener("click", addClassToCell);
const values = ["ch", "r"];
let currentClass = "ch";

var listOfMoves = [];
let currentPosition = -1;

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.add(currentClass);
    // write current element to list
    listOfMoves[currentPosition + 1] = {
      id: event.target.dataset.id,
      class: currentClass
    };
    checkWinner(currentClass);
    currentPosition = listOfMoves.length - 1;
    currentClass = checkMoveClass();
    checkUndoAvailable();
    checkRedoAvailable();
    localStorage.setItem("listOfMoves", JSON.stringify(listOfMoves)); 
    // console.log(listOfMoves);
    // saveMovesToStorage();
  }
}

function checkMoveClass() {
  if (currentPosition != -1) {
    let lastMoveClass = listOfMoves[currentPosition].class;
    currentClass = values.filter(function(element) {
      return element != lastMoveClass;
    })[0];
  } else {
    currentClass = "ch";
  }
  return currentClass;
}

function redoAvailable() {
  const undoBtn = document.querySelector(".undo-btn");
  undoBtn.removeAttribute("disabled");
}

function undoAvailable() {
  const redoBtn = document.querySelector(".redo-btn");
  redoBtn.removeAttribute("disabled");
}

document.querySelector(".undo-btn").addEventListener("click", undoAvailable);
document.querySelector(".redo-btn").addEventListener("click", redoAvailable);

function checkUndoAvailable() {
  const undoBtn = document.querySelector(".undo-btn");
  switch (listOfMoves.length) {
    case 0:
      undoBtn.setAttribute("disabled", true);
      break;
    case 9:
      undoBtn.setAttribute("disabled", true);
      break;
    default:
      undoBtn.removeAttribute("disabled");
      break;
  }
}

function checkRedoAvailable() {
  if (currentPosition == listOfMoves.length - 1) {
    const redoBtn = document.querySelector(".redo-btn");
    redoBtn.setAttribute("disabled", true);
  }
}

function undoRedo(event) {
  if (event.target.classList.contains("undo-btn")) {
    // code to undo moves
    if (currentPosition != 0) {
      let currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.remove(listOfMoves[currentPosition].class);
      currentPosition -= 1;
    } else {
      let currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.remove(listOfMoves[currentPosition].class);
      currentPosition = -1;
      event.target.setAttribute("disabled", true);
    }
  } else {
    // code to redo moves
    if (currentPosition == listOfMoves.length - 1) {
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
      document.querySelector(".redo-btn").setAttribute("disabled", true);
      currentPosition = listOfMoves.length - 1;
    } else if (currentPosition == -1) {
      currentPosition = 0;
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
    } else {
      currentPosition += 1;
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove = document.querySelector(
        "#c-" + listOfMoves[currentPosition].id
      );
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
    }
    currentClass = checkMoveClass();

    checkRedoAvailable();
  }
  currentClass = checkMoveClass();
  // console.log(currentPosition);
  // localStorage.setItem("listOfMoves", JSON.stringify(listOfMoves));
  saveMovesToStorage();
}

function addListenersToButtons() {
  const buttonsList = document.querySelectorAll(".btn");
  for (let i = 0; i < buttonsList.length; i++) {
    if (
      buttonsList[i].classList.contains("undo-btn") ||
      buttonsList[i].classList.contains("redo-btn")
    ) {
      buttonsList[i].addEventListener("click", undoRedo);
    } else if (buttonsList[i].classList.contains("restart-btn")) {
      // function to clear listOfMoves and field
      buttonsList[i].addEventListener("click", restartGame);
    }
  }
}

function restartGame() {
  listOfMoves = [];
  currentPosition = -1;
  const cellsList = document.querySelectorAll(".cell");
  cellsList.forEach(element => element.className = 'cell');
  document.querySelector(".won-title").classList.add("hidden");
  checkMoveClass();
  checkUndoAvailable();
  localStorage.clear();
}

addListenersToButtons();

function checkWinner(currentClass) {
  const winObj = [
    { indexes: "012", direction: "horizontal" },
    { indexes: "345", direction: "horizontal" },
    { indexes: "678", direction: "horizontal" },
    { indexes: "036", direction: "vertical" },
    { indexes: "147", direction: "vertical" },
    { indexes: "258", direction: "vertical" },
    { indexes: "048", direction: "diagonal-right" },
    { indexes: "246", direction: "diagonal-left" }
  ];

  const winArray = ["012", "345", "678", "036", "147", "258", "048", "246"];
  const cellsList = document.querySelectorAll(".cell");
  
  // winObj.forEach(element => console.log(element.indexes));

  winObj.forEach(function(element) {
    let first = element.indexes.substr(0, 1);
    let second = element.indexes.substr(1, 1);
    let third = element.indexes.substr(2, 1)
    let firstEl, secondEl, thirdEl;
    // переделать. мне не нравится
    // переделать. мне не нравится
    // переделать. мне не нравится
    // переделать. мне не нравится
    listOfMoves.forEach(function(element) {
      if (element.id == +first && element.class == currentClass) {
        firstEl = element;
      }
    });
    listOfMoves.forEach(function(element) {
      if (element.id == +second && element.class == currentClass) {
        secondEl = element;
      }
    });
    listOfMoves.forEach(function(element) {
      if (element.id == +third && element.class == currentClass) {
        thirdEl = element;
      }

    });
    if (listOfMoves.length == cellsList.length) {
      if (firstEl && secondEl && thirdEl) {
        // maybe disable undo-redo and cells for moves
        showWonMessage(currentClass);
      } else {
        showWonMessage();
      }
    } else {
      if (firstEl && secondEl && thirdEl) {
        // maybe disable undo-redo and cells for moves
        showWonMessage(currentClass);
        checkCellsForWon(firstEl, secondEl, thirdEl, element.direction);
      }
    }
    // console.log(first);
  });
}

function showWonMessage(currentClass) {
  document.querySelector(".won-title").classList.remove("hidden");
  let wonMessage = document.querySelector(".won-message");
  switch (currentClass) {
    case "ch":
      wonMessage.innerHTML = "Crosses won!";
      break;
    case "r":
      wonMessage.innerHTML = "Toes won!";
      break;
    default:
      wonMessage.innerHTML = "It's a draw!";
      break;
  }
}

function checkCellsForWon(first, second, third, direction) {
  let cellsList = document.querySelectorAll(".cell");
  cellsList.forEach(function(element) {
    if (
      element.dataset.id == first.id ||
      element.dataset.id == second.id ||
      element.dataset.id == third.id
    ) {
      element.classList.add("win", direction);
    }
  });
}

function saveMovesToStorage() {
  let newListOfMoves = listOfMoves.slice(0, currentPosition+1);
  localStorage.setItem("listOfMoves", JSON.stringify(newListOfMoves)); 
  // console.log(newListOfMoves);
  // console.log(listOfMoves);
  //сериализуем его
  // var serialObj = JSON.stringify(listOfMoves); 
  //запишем его в хранилище по ключу "myKey"
  
  //спарсим его обратно объект
  // var returnObj = JSON.parse(localStorage.getItem("listOfMoves")) 
  // console.log(returnObj);
}

//очищаем все хранилище, когда игра закончилась
// localStorage.clear()

document.addEventListener("DOMContentLoaded", restoreGame);

function restoreGame() {
  listOfMoves = JSON.parse(localStorage.getItem("listOfMoves"));
  let cellsList = document.querySelectorAll('.cell');
  // cellsList.forEach(function(element) {
  //   if(element.dataset.id == )
  // });

  for(let i = 0; i < listOfMoves.length; i++) {
    cellsList.forEach(function(element) {
      if(element.dataset.id == listOfMoves[i].id) {
        element.classList.add(listOfMoves[i].class);
      }
    });
  }
  currentPosition = listOfMoves.length - 1;
  currentClass = checkMoveClass();
}