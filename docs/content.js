// ✏️ EDITA AQUÍ: todo el texto de la página vive en este archivo.

const HER_NAME = 'Mochita'; // ← pon su nombre o apodo
const MY_NAME = 'Toshito'; // ← firma de la carta
const TOGETHER_SINCE = '2023-10-20'; // ← ej. '2024-03-14' para mostrar "días juntos"

const LETTER = [
  'Hoy Lima se llena de flores amarillas y yo solo pienso en ti.',
  'Gracias por ser mi lugar favorito: mi invierno, mi lila, mi fondo negro donde todo brilla más.',
  'Quiero que en cada día nuestro haya una maratón de anime, un mil hojas a medias y una canción de The Weeknd sonando de fondo.',
  'Aunque digan que los chicos son mejores que las flores, hoy te regalo todas las flores que existen… y aun así tú eres mi favorita.',
  'Feliz Día de las Flores Amarillas. Te amo muchísimo.',
];

const FAVORITES = [
  { emoji: '💜', title: 'Tus colores', back: 'Morado, lila y negro. Tan tú: misteriosa, dulce y elegante.' },
  { emoji: '❄️', title: 'Tu estación', back: 'El invierno. Prometo abrigarte siempre y compartir mis poleras contigo.' },
  { emoji: '🐾', title: 'Tu animal', back: 'La osa, tan valiente y dormilona como tú.' }, // ← puedes poner el nombre
  { emoji: '🎧', title: 'The Weeknd', back: 'Blinding Lights suena y yo solo quiero bailar contigo.', link: 'https://open.spotify.com/search/The%20Weeknd' },
  { emoji: '🎤', title: 'EXO', back: 'Como “Heaven” dice: cuando miro al cielo solo pienso en ti.', link: 'https://open.spotify.com/search/EXO%20Heaven' },
  { emoji: '🏐', title: 'Vóley', back: 'Tu deporte favorito. Yo pongo el balón, tú el remate.' },
  { emoji: '⚔️', title: 'Tus animes', back: 'Shingeki no Kyojin, Kimetsu no Yaiba, Haikyuu!! y Banana Fish. Buen gusto, como siempre.' },
  { emoji: '🌸', title: 'Tu dorama', back: 'Boys Over Flowers: los chicos son mejores que las flores… pero hoy ganan las flores.' },
  { emoji: '🍫', title: 'Tus antojos', back: 'Chocotejas con guindones y pecanas. Te los compro cuando quieras.' },
  { emoji: '🐰', title: 'De pequeña', back: 'El conejito Luis y sus dibujos. Sigues dibujando sonrisas, ahora en mí.' },
  { emoji: '🍓', title: 'Tu postre', back: 'Mil hojas con crema pastelera y fresas. Mi cita ideal: tú y un mil hojas.' },
  { emoji: '🎬', title: 'Tu película', back: 'Shrek 2. Contigo hasta el "felices para siempre".' },
  { emoji: '🌹', title: 'Tus flores', back: 'Rosas blancas con florecitas moradas delgaditas. Hoy te toca ramo amarillo 💛' },
  { title: 'Nino', back: 'Tu Nino: el que siempre te busca la mano y nunca se cansa de mirarte.', photo: 'img/nino.jpg' },
];

const COUPONS = [
  { emoji: '🍰', title: 'Mil hojas de fresas', text: 'Un mil hojas para ti solita, con todas las fresas.' },
  { emoji: '🎬', title: 'Noche de Shrek 2', text: 'Película, frazada y cero interrupciones.' },
  { emoji: '🍫', title: 'Antojo dulce', text: 'Chocotejas o Pecas: tú eliges.' },
  { emoji: '🎧', title: 'Playlist compartida', text: 'Una noche de The Weeknd y EXO, con audífono para cada uno o en discord.' },
  { emoji: '🤗', title: 'Abrazo eterno', text: 'Canjeable cuando quieras, las veces que quieras.' },
];

const WISHES = [
  'Que este año tengamos aún más ganas de vernos.',
  'Que nunca nos falte un mil hojas para compartir.',
  'Que todas tus canciones favoritas suenen justo cuando las necesites.',
  'Que sigas brillando con tu luz lila.',
  'Que haya un invierno lleno de abrazos.',
  'Que tu equipo de vóley gane todos los partidos.',
  'Que nos alcance la vida para ver todos los animes.',
  'Que cada flor amarilla te recuerde lo mucho que te quiero.',
];

// ── MUÑEQUITOS ("Nuestro mundito") ──────────────────────────────────
// Puedes ajustarlos en la página con el botón "Personalizar".
// Para verlos igual en el celular de ella, abre la página con ?editor al final,
// personaliza, presiona "Copiar" y pega el resultado aquí.
// style: 'curls' | 'long' | 'short' | 'quiff' | 'bun' | 'tails'
// extras (true/false): glasses, freckles, earrings, cap, flower
const CHARACTERS = {
  her: { skin: '#D9A074', hair: '#1B1420', style: 'curls', outfit: '#EFE4D3', pants: '#8FB0D4', glasses: false, freckles: true, earrings: true, cap: false, flower: true },
  him: { skin: '#E2A97E', hair: '#1B1420', style: 'quiff', outfit: '#F4EFF8', pants: '#1B1420', glasses: false, freckles: false, earrings: false, cap: true, flower: false },
};

// ── PLAYLIST ────────────────────────────────────────────────────────
// ID de tu lista de YouTube (lo que va después de "list=" en el enlace).
// Debe ser pública o "no listada". Déjalo vacío ('') para ocultar la sección.
const PLAYLIST_ID = 'PLB43PaGAs7iWzrtFPKyqn3MbFRCaPcFS2';

// ID de tu playlist de Spotify (lo que va después de "playlist/" en el enlace). '' para ocultarla.
const SPOTIFY_ID = '1EolYSmfYm7IknQeCLlAfm';
