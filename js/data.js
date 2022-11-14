/* exported data */
window.addEventListener('beforeunload', saveToLocalStorage);
var data = {
  view: 'home',
  id: null
};

var previousDataJSON = localStorage.getItem('steam-ids');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function saveToLocalStorage(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('steam-ids', dataJSON);
}
