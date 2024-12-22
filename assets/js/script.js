const searchURL = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=';

document.addEventListener('load', init());

function init() {
  getTracks('eminem');
}

async function getTracks(query) {
  try {
    const response = await fetch(searchURL + query, {
      headers: {
        'x-rapidapi-key': 'd199ac2f7cmshc83995374704875p160fb9jsnc22720509b31',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    setFirstTrack(data.data);
  } catch (error) {
    console.log(error);
  }
}

function setFirstTrack(tracks) {
  const audio = document.getElementById('player');
  audio.setAttribute('src', `${tracks[0].preview}`);
  // audio.setAttribute('autoplay', 'true');

  const disk = document.getElementById('disk');
  disk.style.background = `url(
    '${tracks[0].album.cover_medium}'
  )`;
}
