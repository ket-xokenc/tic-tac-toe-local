field.addEventListener("click", addClassToCell);
const values = ["ch", "r"];
let currentClass = "ch";

var listOfMoves = [];
let currentPosition;
function clearAll() {
  document.querySelectorAll('.row');
}

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.add(currentClass);
    // write current element to list
    listOfMoves.push({
      id: event.target.dataset.id,
      class: currentClass
    });
    currentPosition = listOfMoves.length - 1;
    currentClass = values.filter(function(item) {
      return item !== currentClass;
    })[0];

    checkUndoAvailable();
  }
}

function redoAvailable() {
  const undoBtn = document.querySelector('.undo-btn');
  // if(listOfMoves.length != 0) {
    undoBtn.removeAttribute('disabled');
  // }
}

function undoAvailable() {
  const redoBtn = document.querySelector('.redo-btn');
  redoBtn.removeAttribute('disabled');

}

document.querySelector('.undo-btn').addEventListener('click', undoAvailable);
document.querySelector('.redo-btn').addEventListener('click', redoAvailable);


function checkUndoAvailable() {
   if(listOfMoves.length != 0) {
  const undoBtn = document.querySelector('.undo-btn');
      undoBtn.removeAttribute('disabled');
   }
}

function undoRedo(event) {
  // let currentPosition = listOfMoves.length-1;
  // console.log(currentPosition);
  // console.log(currentElementMove);
  if(event.target.classList.contains('undo-btn')) {
    let currentElementMove = document.querySelector('#c-'+ listOfMoves[currentPosition].id);
    // code to undo moves
    currentElementMove.classList.remove(listOfMoves[currentPosition].class);
    if(currentPosition != 0) {
      currentPosition -= 1;
      // event.target.removeAttribute('disabled');
    } else {
      currentPosition = 0;
      event.target.setAttribute('disabled', true);
    }
    console.log(listOfMoves[currentPosition].class);
    console.log(currentPosition);
    console.log(listOfMoves);
  } else {
    // code to redo moves
    if (currentPosition == listOfMoves.length-1) {
      currentElementMove = document.querySelector('#c-'+ listOfMoves[currentPosition].id);
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
      document.querySelector('.redo-btn').setAttribute('disabled', true);
      currentPosition = listOfMoves.length-1;
      // currentPosition+=1;
    } else {
      currentElementMove = document.querySelector('#c-'+ listOfMoves[currentPosition].id);
      currentElementMove.classList.add(listOfMoves[currentPosition].class);
      currentPosition+=1; 
    }
  }
}

// console.log(buttons);
function addListenersToButtons() {
  const buttonsList = document.querySelectorAll('.btn');
  for (let i = 0; i < buttonsList.length; i++) {
    if(buttonsList[i].classList.contains('undo-btn') || buttonsList[i].classList.contains('redo-btn')) {
      buttonsList[i].addEventListener('click', undoRedo);
    } else if(buttonsList[i].classList.contains('restart-btn')) {
      // function to clear listOfMoves and field
    }

  }
}

addListenersToButtons();

// buttonsList.forEach(function(element){
//   element.addEventListener('click', undoRedo);
// });