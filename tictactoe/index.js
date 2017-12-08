field.addEventListener("click", addClassToCell);
const values = ["ch", "r"];
let currentClass = "ch";

function ListOfMoves() {
  this.length = 0;
  this.head = null;
}

ListOfMoves.prototype = {
  add: function(value) {
    var node = {
      value: value,
      dataset: value.dataset,
      next: null,
      prev: null
    };

    if (this.length == 0) {
      this.head = node;
    } else {
      this.head.next = node;
      node.prev = this.head;
      this.head = node;
    }
    this.length++;
  },

  getByValue: function(value) {
    var node = this.head;
    var i = 0;

    while (i++ < this.length) {
      if (node.value === value) {
        return node;
      }
      node = node.prev;
    }

    return null;
  },

  displayNode: function(node) {
    if (node != null) {
      console.log("value = " + node.value);
      console.log("prev = " + (node.prev != null ? node.prev.value : "null"));
      console.log("next = " + (node.next != null ? node.next.value : "null"));
      console.log("--------------");
      return;
    }
  },

  removeByValue: function(value) {
    var node = this.getByValue(value);
    var i = 0;

    if (node.value === value) {
      if (node.prev !== null && node.next !== null) {
        node.next.prev = node.prev;
        node.prev.next = node.next;
        delete node;
      } else if (node.prev === null && node.next !== null) {
        node.next.prev = null;
        delete node;
      } else if (node.next === null && node.prev !== null) {
        node.prev.next = null;
        this.head = node.prev;
        node.prev = null;
        delete node;
      } else {
        this.head = null;
      }
    }
    this.length--;
    return;
  }
};

// doublyLinkedList.add(addClassToCell);
var listOfMoves = new ListOfMoves();
// doublyLinkedList.add(6);

function addClassToCell(event) {
  if (event.target.classList.contains("cell")) {
    event.target.classList.add(currentClass);
    currentClass = values.filter(function(item) {
      return item !== currentClass;
    })[0];

    listOfMoves.add(event.target);
    // console.log(listOfMoves);
    checkUndoAvailable();
  }
  // return event.target;
}

function checkUndoAvailable() {
  const undoBtn = document.querySelector('.undo-btn');
  if(listOfMoves.length != 0) {
    undoBtn.removeAttribute('disabled');
    undoBtn.addEventListener('click', undoMove);
  }
  // } else if(listOfMoves.head.prev == null) {
  //   undoBtn.setAttribute('disabled', true);
  // }
}

function checkRedoAvailable() {
  const redoBtn = document.querySelector('.redo-btn');

}

function undoMove() {
  let currentMove = listOfMoves.head.value;
  // let currentCell = document.querySelector(listOfMoves.head.value);
  if(currentMove.classList.contains('ch')) {
  // const currentMove = 
    currentMove.classList.remove('ch');
  } else if (currentMove.classList.contains('r')) {
    currentMove.classList.remove('r');
  }

  if (listOfMoves.head.prev !== null) {
    listOfMoves.head = listOfMoves.head.prev;
  } else {
    const undoBtn = document.querySelector('.undo-btn');
    undoBtn.setAttribute('disabled', true);
  }
  // listOfMoves.prev;
  console.log((listOfMoves.head.value));
  console.log(listOfMoves.head.dataset);
  console.log(document.querySelector('#c-' + listOfMoves.head.dataset.id));
}
