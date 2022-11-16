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

data.id = null;

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

  if (data.id !== null) {
    var $oldMatches = document.querySelectorAll('.matches-row');
    for (var i = 0; i < $oldMatches.length; i++) {
      $oldMatches[i].remove();

    }
  }
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

    for (var i = 0; i < xhr.response.length; i++) {
      newMatchRow(xhr.response[i]);
    }
  });

  xhr.send();
}

function newMatchRow(matchObject) {

  var $table = document.querySelector('.table-matches');

  var $tableRow = document.createElement('tr');
  $tableRow.className = 'matches-row';
  $table.appendChild($tableRow);

  var $heroImgCol = document.createElement('td');
  $tableRow.appendChild($heroImgCol);

  var $heroImg = document.createElement('img');

  var $heroCol = document.createElement('td');

  for (var x = 0; x < heroData.length; x++) {
    if (heroData[x].id === matchObject.hero_id) {
      $heroImg.setAttribute('src', heroData[x].image);
      $heroCol.textContent = heroData[x].name_loc;
      break;
    }
  }
  $heroImgCol.appendChild($heroImg);

  $tableRow.appendChild($heroCol);

  var $resultCol = document.createElement('td');
  if (matchObject.radiant_win === true) {
    $resultCol.textContent = 'Radiant Victory';
  } else {
    $resultCol.textContent = 'Dire Victory';
  }
  $tableRow.appendChild($resultCol);

  var $typeCol = document.createElement('td');
  if (matchObject.game_mode === 22) {
    $typeCol.textContent = 'All Pick';
  } else {
    $typeCol.textContent = 'Custom Game';
  }
  $tableRow.appendChild($typeCol);

  var $durationCol = document.createElement('td');
  var duration = matchObject.duration / 60;
  var difference = duration - Math.floor(duration);
  var seconds = 60 * difference;
  var secondsFixed = seconds.toFixed(0);
  if (secondsFixed.toString().length === 1) {
    $durationCol.textContent = Math.floor(duration) + ':0' + secondsFixed;

  } else {
    $durationCol.textContent = Math.floor(duration) + ':' + secondsFixed;
  }
  $tableRow.appendChild($durationCol);

  var $kdaCol = document.createElement('td');
  $kdaCol.textContent = matchObject.kills + '/' + matchObject.deaths + '/' + matchObject.assists;
  $tableRow.appendChild($kdaCol);

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

var heroData = [
  {
    id: 1,
    name_loc: 'Anti-Mage',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png'
  },
  {
    id: 2,
    name_loc: 'Axe',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png'
  },
  {
    id: 3,
    name_loc: 'Bane',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bane.png'
  },
  {
    id: 4,
    name_loc: 'Bloodseeker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bloodseeker.png'
  },
  {
    id: 5,
    name_loc: 'Crystal Maiden',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden.png'
  },
  {
    id: 6,
    name_loc: 'Drow Ranger',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/drow_ranger.png'
  },
  {
    id: 7,
    name_loc: 'Earthshaker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/earthshaker.png'
  },
  {
    id: 8,
    name_loc: 'Juggernaut',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/juggernaut.png'
  },
  {
    id: 9,
    name_loc: 'Mirana',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/mirana.png'
  },
  {
    id: 11,
    name_loc: 'Shadow Fiend',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/nevermore.png'
  },
  {
    id: 10,
    name_loc: 'Morphling',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/morphling.png'
  },
  {
    id: 12,
    name_loc: 'Phantom Lancer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_lancer.png'
  },
  {
    id: 13,
    name_loc: 'Puck',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/puck.png'
  },
  {
    id: 14,
    name_loc: 'Pudge',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png'
  },
  {
    id: 15,
    name_loc: 'Razor',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/razor.png'
  },
  {
    id: 16,
    name_loc: 'Sand King',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/sand_king.png'
  },
  {
    id: 17,
    name_loc: 'Storm Spirit',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/storm_spirit.png'
  },
  {
    id: 18,
    name_loc: 'Sven',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/sven.png'
  },
  {
    id: 19,
    name_loc: 'Tiny',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/tiny.png'
  },
  {
    id: 20,
    name_loc: 'Vengeful Spirit',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/vengeful spirit.png'
  },
  {
    id: 21,
    name_loc: 'Windranger',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/windranger.png'
  },
  {
    id: 22,
    name_loc: 'Zeus',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/zeus.png'
  },
  {
    id: 23,
    name_loc: 'Kunkka',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/kunkka.png'
  },
  {
    id: 25,
    name_loc: 'Lina',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lina.png'
  },
  {
    id: 31,
    name_loc: 'Lich',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lich.png'
  },
  {
    id: 26,
    name_loc: 'Lion',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lion.png'
  },
  {
    id: 27,
    name_loc: 'Shadow Shaman',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/shadow_shaman.png'
  },
  {
    id: 28,
    name_loc: 'Slardar',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/slardar.png'
  },
  {
    id: 29,
    name_loc: 'Tidehunter',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/tidehunter.png'
  },
  {
    id: 30,
    name_loc: 'Witch Doctor',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/witch_doctor.png'
  },
  {
    id: 32,
    name_loc: 'Riki',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/riki.png'
  },
  {
    id: 33,
    name_loc: 'Enigma',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/enigma.png'
  },
  {
    id: 34,
    name_loc: 'Tinker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/tinker.png'
  },
  {
    id: 35,
    name_loc: 'Sniper',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/sniper.png'
  },
  {
    id: 36,
    name_loc: 'Necrophos',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/necrophos.png'
  },
  {
    id: 37,
    name_loc: 'Warlock',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/warlock.png'
  },
  {
    id: 38,
    name_loc: 'Beastmaster',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/beastmaster.png'
  },
  {
    id: 39,
    name_loc: 'Queen of Pain',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/queenofpain.png'
  },
  {
    id: 40,
    name_loc: 'Venomancer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/venomancer.png'
  },
  {
    id: 41,
    name_loc: 'Faceless Void',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/faceless_void.png'
  },
  {
    id: 42,
    name_loc: 'Wraith King',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/wraith_king.png'
  },
  {
    id: 43,
    name_loc: 'Death Prophet',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/death_prophet.png'
  },
  {
    id: 44,
    name_loc: 'Phantom Assassin',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phantom_assassin.png'
  },
  {
    id: 45,
    name_loc: 'Pugna',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pugna.png'
  },
  {
    id: 46,
    name_loc: 'Templar Assassin',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/templar_assassin.png'
  },
  {
    id: 47,
    name_loc: 'Viper',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/viper.png'
  },
  {
    id: 48,
    name_loc: 'Luna',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/luna.png'
  },
  {
    id: 49,
    name_loc: 'Dragon Knight',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dragon_knight.png'
  },
  {
    id: 50,
    name_loc: 'Dazzle',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dazzle.png'
  },
  {
    id: 51,
    name_loc: 'Clockwerk',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/clockwerk.png'
  },
  {
    id: 52,
    name_loc: 'Leshrac',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/leshrac.png'
  },
  {
    id: 53,
    name_loc: "Nature's Prophet",
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/natures_prophet.png'
  },
  {
    id: 54,
    name_loc: 'Lifestealer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lifestealer.png'
  },
  {
    id: 55,
    name_loc: 'Dark Seer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dark_seer.png'
  },
  {
    id: 56,
    name_loc: 'Clinkz',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/clinkz.png'
  },
  {
    id: 57,
    name_loc: 'Omniknight',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/omniknight.png'
  },
  {
    id: 58,
    name_loc: 'Enchantress',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/enchantress.png'
  },
  {
    id: 59,
    name_loc: 'Huskar',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/huskar.png'
  },
  {
    id: 60,
    name_loc: 'Night Stalker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/night_stalker.png'
  },
  {
    id: 61,
    name_loc: 'Broodmother',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/broodmother.png'
  },
  {
    id: 62,
    name_loc: 'Bounty Hunter',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bounty_hunter.png'
  },
  {
    id: 63,
    name_loc: 'Weaver',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/weaver.png'
  },
  {
    id: 64,
    name_loc: 'Jakiro',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/jakiro.png'
  },
  {
    id: 65,
    name_loc: 'Batrider',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/batrider.png'
  },
  {
    id: 66,
    name_loc: 'Chen',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/chen.png'
  },
  {
    id: 67,
    name_loc: 'Spectre',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/spectre.png'
  },
  {
    id: 69,
    name_loc: 'Doom',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/doom.png'
  },
  {
    id: 68,
    name_loc: 'Ancient Apparition',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/ancient_apparition.png'
  },
  {
    id: 70,
    name_loc: 'Ursa',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/ursa.png'
  },
  {
    id: 71,
    name_loc: 'Spirit Breaker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/spirit_breaker.png'
  },
  {
    id: 72,
    name_loc: 'Gyrocopter',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/gyrocopter.png'
  },
  {
    id: 73,
    name_loc: 'Alchemist',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/alchemist.png'
  },
  {
    id: 74,
    name_loc: 'Invoker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png'
  },
  {
    id: 75,
    name_loc: 'Silencer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/silencer.png'
  },
  {
    id: 76,
    name_loc: 'Outworld Destroyer',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/outworld_destroyer.png'
  },
  {
    id: 77,
    name_loc: 'Lycan',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lycan.png'
  },
  {
    id: 78,
    name_loc: 'Brewmaster',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/brewmaster.png'
  },
  {
    id: 79,
    name_loc: 'Shadow Demon',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/shadow_demon.png'
  },
  {
    id: 80,
    name_loc: 'Lone Druid',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/lone_druid.png'
  },
  {
    id: 81,
    name_loc: 'Chaos Knight',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/chaos_knight.png'
  },
  {
    id: 82,
    name_loc: 'Meepo',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/meepo.png'
  },
  {
    id: 83,
    name_loc: 'Treant Protector',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/treant_protector.png'
  },
  {
    id: 84,
    name_loc: 'Ogre Magi',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/ogre_magi.png'
  },
  {
    id: 85,
    name_loc: 'Undying',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/undying.png'
  },
  {
    id: 86,
    name_loc: 'Rubick',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/rubick.png'
  },
  {
    id: 87,
    name_loc: 'Disruptor',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/disruptor.png'
  },
  {
    id: 88,
    name_loc: 'Nyx Assassin',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/nyx_assassin.png'
  },
  {
    id: 89,
    name_loc: 'Naga Siren',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/naga_siren.png'
  },
  {
    id: 90,
    name_loc: 'Keeper of the Light',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/keeper_of_the_light.png'
  },
  {
    id: 91,
    name_loc: 'Io',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/io.png'
  },
  {
    id: 92,
    name_loc: 'Visage',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/visage.png'
  },
  {
    id: 93,
    name_loc: 'Slark',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/slark.png'
  },
  {
    id: 94,
    name_loc: 'Medusa',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/medusa.png'
  },
  {
    id: 95,
    name_loc: 'Troll Warlord',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/troll_warlord.png'
  },
  {
    id: 96,
    name_loc: 'Centaur Warrunner',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/centaur_warrunner.png'
  },
  {
    id: 97,
    name_loc: 'Magnus',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/magnus.png'
  },
  {
    id: 98,
    name_loc: 'Timbersaw',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/timbersaw.png'
  },
  {
    id: 99,
    name_loc: 'Bristleback',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/bristleback.png'
  },
  {
    id: 100,
    name_loc: 'Tusk',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/tusk.png'
  },
  {
    id: 101,
    name_loc: 'Skywrath Mage',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/skywrath_mage.png'
  },
  {
    id: 102,
    name_loc: 'Abaddon',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/abaddon.png'
  },
  {
    id: 103,
    name_loc: 'Elder Titan',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/elder_titan.png'
  },
  {
    id: 104,
    name_loc: 'Legion Commander',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/legion_commander.png'
  },
  {
    id: 106,
    name_loc: 'Ember Spirit',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/ember_spirit.png'
  },
  {
    id: 107,
    name_loc: 'Earth Spirit',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/earth_spirit.png'
  },
  {
    id: 109,
    name_loc: 'Terrorblade',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/terrorblade.png'
  },
  {
    id: 110,
    name_loc: 'Phoenix',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/phoenix.png'
  },
  {
    id: 111,
    name_loc: 'Oracle',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/oracle.png'
  },
  {
    id: 105,
    name_loc: 'Techies',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/techies.png'
  },
  {
    id: 112,
    name_loc: 'Winter Wyvern',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/winter_wyvern.png'
  },
  {
    id: 113,
    name_loc: 'Arc Warden',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/arc_warden.png'
  },
  {
    id: 108,
    name_loc: 'Underlord',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/underlord.png'
  },
  {
    id: 114,
    name_loc: 'Monkey King',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/monkey_king.png'
  },
  {
    id: 120,
    name_loc: 'Pangolier',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pangolier.png'
  },
  {
    id: 119,
    name_loc: 'Dark Willow',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dark_willow.png'
  },
  {
    id: 121,
    name_loc: 'Grimstroke',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/grimstroke.png'
  },
  {
    id: 129,
    name_loc: 'Mars',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/mars.png'
  },
  {
    id: 126,
    name_loc: 'Void Spirit',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/void_spirit.png'
  },
  {
    id: 128,
    name_loc: 'Snapfire',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/snapfire.png'
  },
  {
    id: 123,
    name_loc: 'Hoodwink',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/hoodwink.png'
  },
  {
    id: 135,
    name_loc: 'Dawnbreaker',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/dawnbreaker.png'
  },
  {
    id: 136,
    name_loc: 'Marci',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/marci.png'
  },
  {
    id: 137,
    name_loc: 'Primal Beast',
    image: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/primal_beast.png'
  }
];
