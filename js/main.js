var $form = document.querySelector('form');

$form.addEventListener('submit', idSubmit);

function getSteamProfile(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opendota.com/api/players/' + id);
  xhr.responseType = 'json';
  // xhr.addEventListener('load', function () {
  //   console.log(xhr.response);

  // });
  xhr.send();
}

function idSubmit(event) {
  event.preventDefault();
  data.id = $form.elements.steamid.value;
  getSteamProfile(data.id);

}
