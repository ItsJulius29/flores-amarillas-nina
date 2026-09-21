(function () {
  'use strict';
  if (typeof INTRO_SONG === 'undefined' || !INTRO_SONG || !INTRO_SONG.id) return; // sin canción configurada: no hace nada

  const btn = FA.$('sound');
  let player = null, ready = false, wants = false, playing = false;

  function paint() {
    btn.classList.toggle('on', playing);
    btn.setAttribute('aria-pressed', playing);
    btn.setAttribute('aria-label', playing ? 'Pausar la música' : 'Reproducir la música');
  }
  function play() { wants = true; if (ready) { try { player.playVideo(); } catch (e) {} } }
  function pause() { wants = false; if (ready) { try { player.pauseVideo(); } catch (e) {} } }

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('bgPlayer', {
      width: 200, height: 200, videoId: INTRO_SONG.id,
      playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0, modestbranding: 1, start: INTRO_SONG.start || 0, loop: 1, playlist: INTRO_SONG.id },
      events: {
        onReady: () => { ready = true; player.setVolume(INTRO_SONG.volume || 70); btn.hidden = false; if (wants) player.playVideo(); },
        onStateChange: (e) => { playing = e.data === 1 || e.data === 3; paint(); },
      },
    });
  };
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);

  // El toque en "Abrir mi regalo" es el gesto que permite el audio.
  document.querySelector('#intro .btn-fill').addEventListener('click', () => {
    play();
    // si el celular lo bloqueó, resaltamos el botón de música para que lo toque
    setTimeout(() => { if (!playing) btn.classList.add('nudge'); }, 2000);
  });
  btn.addEventListener('click', () => { btn.classList.remove('nudge'); if (playing) pause(); else play(); });
  // en "Nuestra playlist" se pausa para que no se mezclen dos músicas
  window.addEventListener('hashchange', () => { if (location.hash === '#music') pause(); });
})();
