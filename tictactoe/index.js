field.addEventListener('click', addClassToCell);
const values = ['ch', 'r'];
let currentClass = 'ch';

function addClassToCell(event) {
  if (event.target.classList.contains('cell')) {
    event.target.classList.add(currentClass);
    currentClass = values.filter(function (item) {
      return item !== currentClass;
    })[0];
  }
}