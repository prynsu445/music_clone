// ============================================================
//  HellFire Club — script.js  (clean merged version)
// ============================================================

// ─── SONGS ───────────────────────────────────────────────────
const songs = [
    "song_h/aicanvas-kakano-flower-te-reo-maori-238656.mp3",
    "song_h/geoffharvey-fat-cat-374614.mp3",
    "song_h/grand_project-deep-epic-cinematic-when-time-collapses_short-1-501529.mp3",
    "song_h/jean-paul-v-la-marchande-de-cigarettes-tango-pop-279955.mp3",
    "song_h/mfcc-hero-marvel-superhero-music-354045.mp3",
    "song_h/mondamusic-lofi-beats-499181.mp3",
    "song_h/welc0mei0-200330-sad-japan-piano-flower-spring-155539.mp3"
];

let currentIndex = 0;
let audio = new Audio(songs[currentIndex]);
let isPlaying = false;

// ─── PLAYBAR ELEMENTS ────────────────────────────────────────
const playBtn       = document.querySelector(".btn-play");
const progressBar   = document.querySelector(".progress-bar input");
const currentTimeEl = document.querySelector(".progress-bar span:first-child");
const totalTimeEl   = document.querySelector(".progress-bar span:last-child");
const playbarImg    = document.querySelector(".playbar-left img");
const playbarTitle  = document.querySelector(".playbar-song h4");

// ─── NAV / UI ELEMENTS ───────────────────────────────────────
const homeBtn        = document.querySelector(".nav-list li:nth-child(1)");
const searchBtn      = document.querySelector(".nav-list li:nth-child(2)");
const spotifySearchBar = document.getElementById("spotifySearchBar");
const genreSection   = document.getElementById("genreSection");
const searchInput    = document.getElementById("searchInput");
const searchClear    = document.getElementById("searchClear");
const cardContainer  = document.querySelector(".cardContainer");
const mainTitle      = document.querySelector(".spotify_playlist h1");
const allCards       = document.querySelectorAll(".card");
const libItems       = document.querySelectorAll(".lib-item");

let homeOpen   = false;
let searchOpen = false;

// ─── HELPERS ─────────────────────────────────────────────────
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function updateProgress() {
    const current = audio.currentTime;
    const total   = audio.duration || 0;
    progressBar.value       = (current / total) * 100 || 0;
    currentTimeEl.textContent = formatTime(current);
    totalTimeEl.textContent   = formatTime(total);
}

function updateLibraryHighlight() {
    libItems.forEach((item, i) => {
        item.classList.remove("active", "playing");
        if (i === currentIndex) {
            item.classList.add("active");
            if (isPlaying) item.classList.add("playing");
        }
    });
}

// ─── CHANGE SONG ─────────────────────────────────────────────
function changeSong() {
    audio.pause();
    audio = new Audio(songs[currentIndex]);
    audio.play();
    playBtn.innerHTML = "⏸";
    isPlaying = true;

    // Update playbar artwork & title
    playbarImg.src          = allCards[currentIndex].querySelector("img").src;
    playbarTitle.textContent = allCards[currentIndex].querySelector("h2").textContent;

    // Attach events to new audio object
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
        currentIndex = (currentIndex + 1) % songs.length;
        changeSong();
    });

    updateLibraryHighlight();
}

// ─── CARD CLICKS ─────────────────────────────────────────────
allCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        currentIndex = index;
        changeSong();
    });
});

// ─── PLAY / PAUSE ────────────────────────────────────────────
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = "▶";
        isPlaying = false;
    } else {
        audio.play();
        playBtn.innerHTML = "⏸";
        isPlaying = true;
    }
    updateLibraryHighlight();
});

// ─── NEXT / PREV ─────────────────────────────────────────────
document.querySelector(".playbar-controls img:last-child").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    changeSong();
});

document.querySelector(".playbar-controls img:first-child").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    changeSong();
});

// ─── PROGRESS & VOLUME ───────────────────────────────────────
audio.addEventListener("timeupdate", updateProgress);

progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

document.querySelector(".playbar-right input").addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

// ─── LIBRARY SIDEBAR ─────────────────────────────────────────
libItems.forEach((item) => {
    item.addEventListener("click", () => {
        currentIndex = parseInt(item.dataset.index);
        changeSong();
    });
});

updateLibraryHighlight(); // highlight on page load

// ─── HOME TOGGLE ─────────────────────────────────────────────
homeBtn.addEventListener("click", () => {
    if (homeOpen) {
        // Close → back to normal
        genreSection.style.display  = "none";
        cardContainer.style.display = "flex";
        mainTitle.style.display     = "block";
        homeOpen = false;
        homeBtn.classList.remove("nav-active");
    } else {
        // Open genre view
        genreSection.style.display  = "block";
        cardContainer.style.display = "none";
        mainTitle.style.display     = "none";

        // Close search if open
        spotifySearchBar.style.display = "none";
        searchInput.value = "";
        searchClear.classList.remove("visible");
        allCards.forEach(c => c.classList.remove("hidden"));
        searchOpen = false;
        searchBtn.classList.remove("nav-active");

        homeOpen = true;
        homeBtn.classList.add("nav-active");
    }
});

// ─── SEARCH TOGGLE ───────────────────────────────────────────
searchBtn.addEventListener("click", () => {
    if (searchOpen) {
        // Close → back to normal
        spotifySearchBar.style.display = "none";
        searchInput.value = "";
        searchClear.classList.remove("visible");
        allCards.forEach(c => c.classList.remove("hidden"));
        cardContainer.style.display = "flex";
        mainTitle.style.display     = "block";
        searchOpen = false;
        searchBtn.classList.remove("nav-active");
    } else {
        // Open search view
        spotifySearchBar.style.display = "block";
        cardContainer.style.display    = "flex";
        mainTitle.style.display        = "block";
        searchInput.focus();

        // Close home if open
        genreSection.style.display  = "none";
        cardContainer.style.display = "flex";
        homeOpen = false;
        homeBtn.classList.remove("nav-active");

        searchOpen = true;
        searchBtn.classList.add("nav-active");
    }
});

// ─── SEARCH FILTER ───────────────────────────────────────────
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    searchClear.classList.toggle("visible", query.length > 0);
    allCards.forEach(card => {
        const title = card.querySelector("h2").textContent.toLowerCase();
        const desc  = card.querySelector("p").textContent.toLowerCase();
        card.classList.toggle("hidden", !(title.includes(query) || desc.includes(query)));
    });
});

searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.classList.remove("visible");
    allCards.forEach(c => c.classList.remove("hidden"));
    searchInput.focus();
});

// ─── GENRE TILES ─────────────────────────────────────────────
document.querySelectorAll(".genre-tile").forEach(tile => {
    tile.addEventListener("click", () => {
        currentIndex = parseInt(tile.dataset.index);
        changeSong();

        // Return to normal playlist view
        genreSection.style.display  = "none";
        cardContainer.style.display = "flex";
        mainTitle.style.display     = "block";
        homeOpen = false;
        homeBtn.classList.remove("nav-active");

        allCards.forEach(c => c.classList.remove("hidden"));
        allCards[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
});

// === MODALS ===
const signupModal = document.getElementById("signupModal");
const loginModal  = document.getElementById("loginModal");

document.querySelector(".signup").addEventListener("click", () => {
    signupModal.classList.add("active");
});

document.querySelector(".login").addEventListener("click", () => {
    loginModal.classList.add("active");
});

document.getElementById("closeSignup").addEventListener("click", () => {
    signupModal.classList.remove("active");
});

document.getElementById("closeLogin").addEventListener("click", () => {
    loginModal.classList.remove("active");
});

// Switch between modals
document.getElementById("goLogin").addEventListener("click", () => {
    signupModal.classList.remove("active");
    loginModal.classList.add("active");
});

document.getElementById("goSignup").addEventListener("click", () => {
    loginModal.classList.remove("active");
    signupModal.classList.add("active");
});

// Click outside to close
signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) signupModal.classList.remove("active");
});

loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.classList.remove("active");
});