var $form = document.querySelector('form');
var $profile = document.querySelector('.profile');
var $homeView = document.querySelector('.home-view');
var $profileView = document.querySelector('.profile-view');
var $dotaData = document.querySelector('.dota-data');
var $matchView = document.querySelector('.match-view');
var $matches = document.querySelector('.matches');

$dotaData.addEventListener('click', swapHomeView);
$profile.addEventListener('click', swapProfileView);
$form.addEventListener('submit', idSubmit);
$matches.addEventListener('click', swapMatchView);

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
  getMatches(data.id);
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view';
  data.view = 'profile';

}

function getMatches(id) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.opendota.com/api/players/' + id + '/recentMatches');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    var $table = document.querySelector('.table-matches');

    for (var i = 0; i < xhr.response.length; i++) {
      var $tableRow = document.createElement('tr');
      $tableRow.setAttribute('data-id', xhr.response[i].hero_id);
      $table.appendChild($tableRow);

      var $heroImgCol = document.createElement('td');
      $tableRow.appendChild($heroImgCol);

      var $heroImg = document.createElement('img');
      $heroImgCol.appendChild($heroImg);

      var $heroCol = document.createElement('td');
      $heroCol.textContent = xhr.response[i].hero_id;
      $tableRow.appendChild($heroCol);

      var $resultCol = document.createElement('td');
      if (xhr.response[i].radiant_win === true) {
        $resultCol.textContent = 'Radiant Win';
      } else {
        $resultCol.textContent = 'Dire Win';
      }
      $tableRow.appendChild($resultCol);

      var $typeCol = document.createElement('td');
      if (xhr.response[i].game_mode === 22) {
        $typeCol.textContent = 'All Pick';
      } else {
        $typeCol.textContent = 'Custom Game';
      }
      $tableRow.appendChild($typeCol);

      var $durationCol = document.createElement('td');
      var duration = xhr.response[i].duration / 60;
      var difference = duration - Math.floor(duration);
      var seconds = 60 * difference;

      $durationCol.textContent = Math.floor(duration) + ':' + seconds.toFixed(0);
      $tableRow.appendChild($durationCol);

      var $kdaCol = document.createElement('td');
      $kdaCol.textContent = xhr.response[i].kills + '/' + xhr.response[i].deaths + '/' + xhr.response[i].assists;
      $tableRow.appendChild($kdaCol);
    }
  });
  xhr.send();
}

function swapHomeView(event) {
  $homeView.className = 'home-view';
  $profileView.className = 'profile-view hidden';
  $matchView.className = 'match-view hidden';
  data.view = 'home';
}

function swapProfileView(event) {
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view';
  $matchView.className = 'match-view hidden';
  data.view = 'profile';
}

function swapMatchView(event) {
  $homeView.className = 'home-view hidden';
  $profileView.className = 'profile-view hidden';
  $matchView.className = 'match-view';
  data.view = 'match';
}
