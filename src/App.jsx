import React, { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";

import MouseStealing from "./MouseStealer.jsx";
import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import Lovegif from "./assets/GifData/main_temp.gif";
import heartGif from "./assets/GifData/happy.gif";
import sadGif from "./assets/GifData/sad.gif";
import WordMareque from "./MarqueeProposal.jsx";
import purposerose from "./assets/GifData/RoseCute.gif";
import swalbg from "./assets/Lovingbg2_main.jpg";
import loveu from "./assets/GifData/cutieSwal4.gif";

// Yes GIFs
import yesgif0 from "./assets/GifData/Yes/lovecutie0.gif";
import yesgif1 from "./assets/GifData/Yes/love2.gif";
import yesgif2 from "./assets/GifData/Yes/love3.gif";
import yesgif3 from "./assets/GifData/Yes/love1.gif";
import yesgif4 from "./assets/GifData/Yes/lovecutie1.gif";
import yesgif5 from "./assets/GifData/Yes/lovecutie5.gif";
import yesgif6 from "./assets/GifData/Yes/lovecutie7.gif";
import yesgif7 from "./assets/GifData/Yes/lovecutie8.gif";
import yesgif8 from "./assets/GifData/Yes/lovecutie3.gif";
import yesgif9 from "./assets/GifData/Yes/lovecutie9.gif";
import yesgif10 from "./assets/GifData/Yes/lovecutie6.gif";
import yesgif11 from "./assets/GifData/Yes/lovecutie4.gif";

// No GIFs
import nogif0 from "./assets/GifData/No/breakRej0.gif";
import nogif0_1 from "./assets/GifData/No/breakRej0_1.gif";
import nogif1 from "./assets/GifData/No/breakRej1.gif";
import nogif2 from "./assets/GifData/No/breakRej2.gif";
import nogif3 from "./assets/GifData/No/breakRej3.gif";
import nogif4 from "./assets/GifData/No/breakRej4.gif";
import nogif5 from "./assets/GifData/No/breakRej5.gif";
import nogif6 from "./assets/GifData/No/breakRej6.gif";
import nogif7 from "./assets/GifData/No/RejectNo.gif";
import nogif8 from "./assets/GifData/No/breakRej7.gif";

// Music
import yesmusic1 from "./assets/AudioTracks/Love_LoveMeLikeYouDo.mp3";
import yesmusic2 from "./assets/AudioTracks/Love_EDPerfect.mp3";
import yesmusic3 from "./assets/AudioTracks/Love_Nadaaniyan.mp3";
import yesmusic4 from "./assets/AudioTracks/Love_JoTumMereHo.mp3";
import nomusic1 from "./assets/AudioTracks/Rejection_WeDontTalkAnyMore.mp3";
import nomusic2 from "./assets/AudioTracks/Rejection_LoseYouToLoveMe.mp3";
import nomusic3 from "./assets/AudioTracks/Reject_withoutMe.mp3";
import nomusic4 from "./assets/AudioTracks/Neutral_Base_IHateU.mp3";
import nomusic5 from "./assets/AudioTracks/Reject1_TooGood.mp3";

const YesGifs = [
  yesgif0,
  yesgif1,
  yesgif2,
  yesgif3,
  yesgif4,
  yesgif5,
  yesgif6,
  yesgif7,
  yesgif8,
  yesgif9,
  yesgif10,
  yesgif11,
];
const NoGifs = [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8];
const YesMusic = [yesmusic1, yesmusic3, yesmusic4, yesmusic2];
const NoMusic = [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5];

export default function Page() {
  // state
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [yespopupShown, setYesPopupShown] = useState(false);

  const gifRef = useRef(null);
  const yesButtonSize = noCount * 16 + 16;

  // floating gifs
  const [floatingGifs, setFloatingGifs] = useState([]);
  const generateRandomPositionWithSpacing = (existingPositions) => {
    let position;
    let tooClose;
    const minDistance = 15;
    do {
      position = {
        top: `${Math.random() * 90}vh`,
        left: `${Math.random() * 90}vw`,
      };
      tooClose = existingPositions.some((p) => {
        const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
        const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    } while (tooClose);
    return position;
  };

  const handleMouseEnterYes = () => {
    const gifs = [];
    const positions = [];
    for (let i = 0; i < 10; i++) {
      const np = generateRandomPositionWithSpacing(positions);
      positions.push(np);
      gifs.push({ id: `heart-${i}`, src: heartGif, style: { ...np, animationDuration: `${Math.random() * 2 + 1}s` } });
    }
    setFloatingGifs(gifs);
  };
  const handleMouseEnterNo = () => {
    const gifs = [];
    const positions = [];
    for (let i = 0; i < 10; i++) {
      const np = generateRandomPositionWithSpacing(positions);
      positions.push(np);
      gifs.push({ id: `sad-${i}`, src: sadGif, style: { ...np, animationDuration: `${Math.random() * 2 + 1}s` } });
    }
    setFloatingGifs(gifs);
  };
  const handleMouseLeave = () => setFloatingGifs([]);

  // keep updating current yes gif
  useEffect(() => {
    if (gifRef.current && yesPressed) {
      gifRef.current.src = YesGifs[currentGifIndex];
    }
  }, [yesPressed, currentGifIndex]);

  // rotate yes gifs every 5s while yes screen is active
  useEffect(() => {
    if (!accepted) return;
    const id = setInterval(() => setCurrentGifIndex((i) => (i + 1) % YesGifs.length), 5000);
    return () => clearInterval(id);
  }, [accepted]);

  // reset GIF on changes to force loop
  useEffect(() => {
    if (gifRef.current) gifRef.current.src = gifRef.current.src;
  }, [noCount]);

  const playMusic = (url, musicArray) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(url);
    audio.muted = isMuted;
    setCurrentAudio(audio);
    audio.addEventListener("ended", () => {
      const idx = musicArray.indexOf(url);
      const nextIdx = (idx + 1) % musicArray.length;
      playMusic(musicArray[nextIdx], musicArray);
    });
    audio.play();
  };

  const handleNoClick = () => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);

    if (nextCount >= 4 && gifRef.current) {
      const nextGifIndex = (nextCount - 4) % NoGifs.length;
      gifRef.current.src = NoGifs[nextGifIndex];
    }

    if (nextCount === 1 || (nextCount - 1) % 7 === 0) {
      const nextSongIndex = Math.floor(nextCount / 7) % NoMusic.length;
      playMusic(NoMusic[nextSongIndex], NoMusic);
    }
  };

  const handleYesClick = async () => {
    // show a single popup depending on attempts
    if (noCount < 4 && !popupShown) {
      setPopupShown(true);
      await Swal.fire({
        title:
          "Acabas de tomar la mejor decisión de nuestras vidas ❤️ Hoy comienza una nueva historia para ti y para mí… una historia llena de amor, risas, aventuras y momentos que atesoraremos por siempre. Gracias por elegirme, Mayra 💕 Ahora caminaremos juntos hacia todo lo hermoso que nos espera.",
        width: 700,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `rgba(0,0,123,0.2) url(${loveu}) right no-repeat`,
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
      });
    } else if (noCount >= 4 && !yespopupShown) {
      setYesPopupShown(true);
      await Swal.fire({
        title:
          "De ahora en adelante, me dedicaré a hacerte sentir la mujer más amada del mundo 💖. Cuidaré tu corazón, te llenaré de detalles, sonrisas y abrazos infinitos, y cada día te recordaré lo afortunado que soy de tenerte, Mayra. Nuestro amor será mi prioridad, hoy y siempre. ❤️",
        width: 800,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `rgba(0,0,123,0.7) url(${purposerose}) right no-repeat`,
      });
    }

    setAccepted(true);     // ← esto activa la vista final (con botón de WhatsApp)
    setYesPressed(true);   // ← se usa para rotación y música
    playMusic(YesMusic[0], YesMusic);
  };

  const toggleMute = () => {
    if (currentAudio) currentAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "¿Estás segura, Mayra?",
      "¿De verdad quieres decir que no?",
      "Piénsalo otra vez...",
      "Es la última oportunidad...",
      "No me digas que ya decidiste...",
      "Podrías arrepentirte de esto...",
      "Dame otra oportunidad para amarte...",
      "¿Segura que no quieres intentarlo juntos?",
      "Esto podría ser un error...",
      "Ten un poquito de corazón 💕",
      "No seas tan fría conmigo...",
      "¿No reconsiderarías?",
      "¿Es esa tu última palabra?",
      "Estás rompiendo mi corazón 😢",
      "Pero… ¿por qué, Mayra? 😢",
      "Por favor… dame una oportunidad 💖",
      "No puedo con este dolor 😫",
      "¿Estás segura que quieres alejarme así? 😢",
      "Me vas a romper por dentro 😥",
      "Te pido que lo pienses otra vez, ahora… 😓",
      "Creo en nosotros, no me falles 💔",
      "Mi corazón dice sí, ¿y el tuyo? ❤️",
      "No me dejes colgado así 😬",
      "Por favor, Mayra… 💔",
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  useEffect(() => {
    if (noCount === 25) {
      Swal.fire({
        title:
          "💫❤️ Mayra… estamos a punto de comenzar una nueva vida juntos. Hoy soy un hombre distinto, más consciente, más fuerte y más enamorado que nunca. 🌹✨ Estoy listo para amarte, cuidarte y caminar a tu lado en cada paso que nos quede por vivir. 👫💍",
        width: 850,
        padding: "2em",
        color: "#716add",
        background: `#fff url(${swalbg})`,
        backdrop: `rgba(0, 104, 123, 0.7) url(${nogif1}) right no-repeat`,
      });
    }
  }, [noCount]);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Spline scene="https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode" />
      </div>

      {noCount > 16 && noCount < 25 && !yesPressed && <MouseStealing />}

      <div className="overflow-hidden flex flex-col items-center justify-center pt-4 h-screen -mt-16 selection:bg-rose-600 selection:text-white text-zinc-900">
        {accepted ? (
          <>
            <img ref={gifRef} className="h-[230px] rounded-lg" src={YesGifs[currentGifIndex]} alt="Yes Response" />
            <div
              className="text-4xl md:text-6xl font-bold my-2"
              style={{ fontFamily: "Charm, serif", fontWeight: 700 }}
            >
              Te Amo ❤️!!!
            </div>
            <div
              className="text-4xl md:text-4xl font-bold my-1"
              style={{ fontFamily: "Beau Rivage, serif", fontWeight: 500 }}
            >
              Eres el amor de mi vida 🌹✨
            </div>

            {/* WhatsApp button */}
            <button
              onClick={() =>
                window.open(
                  "https://wa.me/522222708631?text=Vamos%20a%20intentarlo%20💖%20Desde%20hoy%20comienza%20nuestra%20nueva%20historia%20juntos%20❤️",
                  "_blank"
                )
              }
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition"
            >
              Click para abrir la sorpresa
            </button>

            <WordMareque />
          </>
        ) : (
          <>
            <img
              src={lovesvg}
              className="fixed animate-pulse top-10 md:left-15 left-6 md:w-40 w-28"
              alt="Love SVG"
            />
            <img ref={gifRef} className="h-[230px] rounded-lg" src={Lovegif} alt="Love Animation" />
            <h1 className="text-4xl md:text-6xl my-4 text-center">¿Le damos otra oportunidad a nuestro amor?</h1>

            <div className="flex flex-wrap justify-center gap-2 items-center">
              <button
                onMouseEnter={handleMouseEnterYes}
                onMouseLeave={handleMouseLeave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
                style={{ fontSize: yesButtonSize }}
                onClick={handleYesClick}
              >
                Sí
              </button>
              <button
                onMouseEnter={handleMouseEnterNo}
                onMouseLeave={handleMouseLeave}
                onClick={handleNoClick}
                className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4"
              >
                {noCount === 0 ? "No" : getNoButtonText()}
              </button>
            </div>

            {floatingGifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.src}
                alt="Floating Animation"
                className="absolute w-12 h-12 animate-bounce"
                style={gif.style}
              />
            ))}
          </>
        )}

        <button
          className="fixed bottom-10 right-10 bg-gray-200 p-1 mb-2 rounded-full hover:bg-gray-300"
          onClick={toggleMute}
        >
          {isMuted ? <BsVolumeMuteFill size={26} /> : <BsVolumeUpFill size={26} />}
        </button>

        <Footer />
      </div>
    </>
  );
}

const Footer = () => (
  <a
    className="fixed bottom-2 right-2 backdrop-blur-md opacity-80 hover:opacity-95 border p-1 rounded border-rose-300"
    href="https://github.com/UjjwalSaini07"
    target="_blank"
    rel="noopener noreferrer"
  >
    Made with <span role="img" aria-label="heart">❤️</span> by Ujjwal
  </a>
);
