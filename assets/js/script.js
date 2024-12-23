const searchURL = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=';
const audio = document.getElementById('player');
const trackName = document.getElementById('trackName');
const artistName = document.getElementById('artistName');
const disk = document.getElementById('disk');
const seekBar = document.getElementById('seek-bar');
const currentTime = document.getElementById('currentTime');
const songDuration = document.getElementById('songDuration');
const btnPlay = document.getElementById('btnPlay');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSearch = document.getElementById('btnSearch');
const searchBar = document.getElementById('searchBar');
const alertPlaceholder = document.getElementById('searchAlert');
const mostPopular = document.getElementById('mostPopular');
const bestMood = document.getElementById('bestMood');
const pushLimits = document.getElementById('pushLimits');
const searchResult = document.getElementById('searchResult');
let currentAlbum;
let currentAlbumTrackIndex;

const myTopics = [
  'sky',
  'sea',
  'love',
  'friends',
  'power',
  'gym',
  'speed',
  'money',
];
const selectedTopics = [];
const targets = [mostPopular, bestMood, pushLimits];

document.addEventListener('load', init());

btnPlay.addEventListener('click', () => {
  if (btnPlay.className.includes('pause')) {
    audio.play();
    document
      .querySelector('#btnPlay .bi-play-fill')
      .setAttribute('hidden', 'true');
    document.querySelector('#btnPlay .bi-pause-fill').removeAttribute('hidden');

    btnPlay.classList.remove('pause');
    disk.classList.add('play');
    disk.classList.remove('pause');
  } else {
    audio.pause();
    document
      .querySelector('#btnPlay .bi-pause-fill')
      .setAttribute('hidden', 'true');
    document.querySelector('#btnPlay .bi-play-fill').removeAttribute('hidden');

    btnPlay.classList.add('pause');
    disk.classList.remove('play');
    disk.classList.add('pause');
  }
});

btnNext.addEventListener('click', () => {
  currentAlbumTrackIndex++;
  if (currentAlbumTrackIndex == currentAlbum.length - 1) {
    btnNext.setAttribute('disabled', 'true');
  }
  const myTrack = currentAlbum[currentAlbumTrackIndex];
  setPlayer(
    myTrack.title_short,
    myTrack.artist.name,
    myTrack.album.cover_medium,
    myTrack.duration,
    myTrack.preview
  );
  btnPrev.removeAttribute('disabled');
});

btnPrev.addEventListener('click', () => {
  currentAlbumTrackIndex--;
  if (currentAlbumTrackIndex == 0) {
    btnPrev.setAttribute('disabled', 'true');
  }
  const myTrack = currentAlbum[currentAlbumTrackIndex];
  setPlayer(
    myTrack.title_short,
    myTrack.artist.name,
    myTrack.album.cover_medium,
    myTrack.duration,
    myTrack.preview
  );
  btnNext.removeAttribute('disabled');
});

seekBar.addEventListener('change', () => {
  audio.currentTime = seekBar.value;
});

function init() {
  getRandomTopics(3);
  selectedTopics.forEach((topic, index) => {
    getSearchResult(topic, targets[index]);
  });
}

btnSearch.addEventListener('click', () => {
  if (searchBar.value) {
    getSearchResult(searchBar.value, searchResult);
    searchBar.value = '';
  } else {
    appendAlert();
  }
});

searchBar.addEventListener('keyup', () => {
  if (searchBar.value) {
    getSearchResult(searchBar.value, searchResult);
  }
});

function getRandomTopics(n) {
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * myTopics.length);
    selectedTopics.push(myTopics[index]);
    myTopics.splice(index, 1);
  }
}

function setPlayer(trkName, artName, albumCover, duration, preview) {
  seekBar.value = 0;

  trackName.innerText = trkName;
  artistName.innerText = artName;

  audio.setAttribute('src', `${preview}`);
  audio.setAttribute('autoplay', 'true');

  disk.style.background = `url(
    '${albumCover}'
    )`;

  currentTime.innerHTML = '00.00';
  seekBar.max = duration;
  // seekBar.max = 29;
  songDuration.innerText = getTimeFormat(duration);

  btnPlay.removeAttribute('disabled');
  btnNext.removeAttribute('disabled');
  seekBar.removeAttribute('disabled');

  document
    .querySelector('#btnPlay .bi-play-fill')
    .setAttribute('hidden', 'true');
  document.querySelector('#btnPlay .bi-pause-fill').removeAttribute('hidden');

  btnPlay.classList.remove('pause');
  disk.classList.add('play');
  disk.classList.remove('pause');
}

function albumClick(trkName, artName, albumCover, duration, preview, albumId) {
  setPlayer(trkName, artName, albumCover, duration, preview);
  getAlbum(albumId);
}

function getTimeFormat(num) {
  let min = 0;
  let sec = 0;

  if (num / 60 > 0) {
    min = Math.floor(num / 60);
    if (num - min * 60 > 0) {
      sec = Math.floor(num - min * 60);
    }
  } else {
    sec = num;
  }

  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }

  return `${min}:${sec}`;
}

// MUSIC BAR LOADER
setInterval(() => {
  seekBar.value = audio.currentTime;
  currentTime.innerHTML = getTimeFormat(audio.currentTime);
  if (seekBar.value == 30) {
    if (btnNext.disabled) {
      document
        .querySelector('#btnPlay .bi-pause-fill')
        .setAttribute('hidden', 'true');
      document
        .querySelector('#btnPlay .bi-play-fill')
        .removeAttribute('hidden');

      btnPlay.classList.add('pause');
      disk.classList.remove('play');
      disk.classList.add('pause');
    } else {
      btnNext.click();
    }
  }
}, 1000);

const appendAlert = () => {
  if (alertPlaceholder.innerHTML == '<div></div>') {
    alertPlaceholder.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-success alert-dismissible" role="alert">`,
      `   <div>You need to put something in the search bar</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('');

    alertPlaceholder.append(wrapper);
  }
};

async function getSearchResult(query, target) {
  try {
    const response = await fetch(searchURL + query, {
      headers: {
        'x-rapidapi-key': 'd199ac2f7cmshc83995374704875p160fb9jsnc22720509b31',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    showResult(data.data, target);
  } catch (error) {
    console.log(error);
  }

  // const [netErr, res] = await fetch(URL + query);

  // if (netErr) return console.log(netErr);

  // const [parseErr, data] = await res.json();

  // if (parseErr) return console.log(parseErr);

  // console.log(data);
}

function showResult(tracks, target) {
  target.innerHTML = '';
  let resultsNumber = 4;
  if (target == searchResult) {
    targets.forEach((target) => {
      target.parentElement.setAttribute('hidden', 'true');
    });
    resultsNumber = 20;
  }

  for (let i = 0; i < resultsNumber; i++) {
    const newCol = document.createElement('div');
    newCol.classList.add('col-lg-3', 'mb-3');

    const newCard = document.createElement('div');
    newCard.classList.add('card', 'rounded-3');
    newCard.setAttribute(
      'onclick',
      `albumClick("${tracks[i].title_short}", "${tracks[i].artist.name}", "${tracks[i].album.cover_medium}", ${tracks[i].duration}, "${tracks[i].preview}", "${tracks[i].album.id}")`
    );

    const newImg = document.createElement('img');
    newImg.src = tracks[i].album.cover_medium;
    newImg.classList.add('img-card-top', 'mx-3', 'mt-3', 'rounded-3');

    const newDiv = document.createElement('div');
    newDiv.classList.add('card-body');

    const newH5 = document.createElement('h5');
    newH5.classList.add('card-title', 'text-white');
    newH5.innerText = tracks[i].album.title;

    const newParagraph = document.createElement('p');
    newParagraph.classList.add('card-text', 'text-white');
    newParagraph.innerText = tracks[i].artist.name;

    newCard.appendChild(newImg);
    newDiv.appendChild(newH5);
    newDiv.appendChild(newParagraph);
    newCard.appendChild(newDiv);
    newCol.appendChild(newCard);

    target.appendChild(newCol);
  }

  target.parentElement.removeAttribute('hidden');

  document.getElementById('loadingSpinnerDiv').classList.add('d-none');
}

async function getAlbum(id) {
  try {
    const response = await fetch(
      'https://deezerdevs-deezer.p.rapidapi.com/album/' + id,
      {
        headers: {
          'x-rapidapi-key':
            'd199ac2f7cmshc83995374704875p160fb9jsnc22720509b31',
          'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
          'Content-type': 'application/json',
        },
      }
    );
    const data = await response.json();
    currentAlbum = data.tracks.data;
    if (currentAlbum.length == 1) {
      btnNext.setAttribute('disabled', 'true');
    }
    currentAlbumTrackIndex = 0;
  } catch (error) {
    console.log(error);
  }
}
