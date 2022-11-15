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

    var $rowUserName = document.querySelector('.username-row');
    $rowUserName.textContent = xhr.response.profile.personaname;

    var $rowMmr = document.querySelector('.mmr-row');
    $rowMmr.textContent = 'Estimated MMR: ' + xhr.response.mmr_estimate.estimate;

    var $rowRank = document.querySelector('.rank-row');
    $rowRank.textContent = 'Rank: ' + xhr.response.rank_tier;

    var $rowProfileLink = document.querySelector('.profile-link-row');

    var $a = document.createElement('a');
    $a.setAttribute('href', xhr.response.profile.profileurl);
    $a.textContent = 'Link to Steam Profile';
    $rowProfileLink.appendChild($a);

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
