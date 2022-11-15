var $form = document.querySelector('form');
var $profile = document.querySelector('.profile');
var $homeView = document.querySelector('.home-view');
var $profileView = document.querySelector('.profile-view');

$profile.addEventListener('click', swapView);
$form.addEventListener('submit', idSubmit);

function getSteamProfile(id) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opendota.com/api/players/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    var $profileImg = document.querySelector('.profile-img');
    $profileImg.setAttribute('src', xhr.response.profile.avatarfull);

    var $row1 = document.querySelector('.profile-table-row1');
    $row1.textContent = xhr.response.profile.personaname;

    var $row2 = document.querySelector('.profile-table-row2');
    $row2.textContent = 'Estimated MMR: ' + xhr.response.mmr_estimate.estimate;

    var $row3 = document.querySelector('.profile-table-row3');
    $row3.textContent = 'Rank: ' + xhr.response.rank_tier;

    var $row7 = document.querySelector('.profile-table-row7');

    var $a = document.createElement('a');
    $a.setAttribute('href', xhr.response.profile.profileurl);
    $a.textContent = 'Link to Steam Profile';
    $row7.appendChild($a);

  });

  xhr.send();
}

function idSubmit(event) {
  event.preventDefault();
  data.id = $form.elements.steamid.value;
  getSteamProfile(data.id);
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view';
  data.view = 'profile';

}

function swapView(event) {

}
