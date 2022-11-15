var $form = document.querySelector('form');
var $profile = document.querySelector('.profile');
var $homeView = document.querySelector('.home-view');
var $profileView = document.querySelector('.profile-view');
var $dotaData = document.querySelector('.dota-data');

$dotaData.addEventListener('click', swapHomeView);
$profile.addEventListener('click', swapProfileView);
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

    var $profileLink = document.querySelector('.profile-link');
    $profileLink.setAttribute('href', xhr.response.profile.profileurl);
    $profileLink.textContent = 'Link to Steam Profile';

  });

  xhr.send();
}

function getWinLosses(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opendota.com/api/players/' + id + '/wl');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    var $winsRow = document.querySelector('.wins-row');
    $winsRow.textContent = 'All Time Wins: ' + xhr.response.win;

    var $lossesRow = document.querySelector('.losses-row');
    $lossesRow.textContent = 'All Time Losses: ' + xhr.response.lose;

    var wins = parseInt(xhr.response.win);
    var losses = parseInt(xhr.response.lose);
    var totalGames = (wins + losses);
    var winPercent = wins / totalGames;

    var $winPercentRow = document.querySelector('.win-percentage-row');
    $winPercentRow.textContent = 'Win Percentage: ' + winPercent.toFixed(2) * 100 + '%';

  });
  xhr.send();
}

function idSubmit(event) {
  event.preventDefault();
  data.id = $form.elements.steamid.value;
  getSteamProfile(data.id);
  getWinLosses(data.id);
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view';
  data.view = 'profile';

}

function swapHomeView(event) {
  $homeView.className = 'home-view';
  $profileView.className = 'profile-view hidden';
  data.view = 'home';
}

function swapProfileView(event) {
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view';
  data.view = 'profile';
}
