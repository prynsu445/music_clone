// ============================================================
//  HellFire Club — mobile.js
//  Injects bottom nav + library drawer ONLY on mobile (≤768px)
// ============================================================

(function () {

    // ── ONLY RUN ON MOBILE ────────────────────────────────────
    if (window.innerWidth > 768) return;

    // ── BUILD BOTTOM NAV ─────────────────────────────────────
    const bottomNav = document.createElement("nav");
    bottomNav.className = "mobile-bottom-nav";
    bottomNav.innerHTML = `
        <div class="mob-nav-item" id="mobHomeBtn">
            <img src="home2.svg" alt="Home">
            <span>Home</span>
        </div>
        <div class="mob-nav-item" id="mobSearchBtn">
            <img src="search2.svg" alt="Search">
            <span>Search</span>
        </div>
        <div class="mob-nav-item" id="mobLibBtn">
            <img src="library.svg" alt="Library">
            <span>Library</span>
        </div>
    `;
    document.body.appendChild(bottomNav);

    // ── BUILD LIBRARY DRAWER ──────────────────────────────────
    const drawer = document.createElement("div");
    drawer.className = "mobile-library-drawer";
    drawer.id = "mobileLibDrawer";

    const libList = document.querySelector(".library-list");
    drawer.innerHTML = `<h3>Your Library</h3>`;
    if (libList) {
        const clonedList = libList.cloneNode(true);
        clonedList.id = "mobileLibList";
        drawer.appendChild(clonedList);
    }
    document.body.appendChild(drawer);

    // ── WIRE DRAWER LIB ITEMS ─────────────────────────────────
    drawer.querySelectorAll(".lib-item").forEach((item) => {
        item.addEventListener("click", () => {
            currentIndex = parseInt(item.dataset.index);
            changeSong();
            closeDrawer();
        });
    });

    // ── ELEMENT REFS ─────────────────────────────────────────
    const mobHomeBtn       = document.getElementById("mobHomeBtn");
    const mobSearchBtn     = document.getElementById("mobSearchBtn");
    const mobLibBtn        = document.getElementById("mobLibBtn");
    const spotifySearchBar = document.getElementById("spotifySearchBar");
    const genreSection     = document.getElementById("genreSection");
    const cardContainer    = document.querySelector(".cardContainer");
    const mainTitle        = document.querySelector(".spotify_playlist h1");
    const allCards         = document.querySelectorAll(".card");
    const searchInput      = document.getElementById("searchInput");
    const searchClear      = document.getElementById("searchClear");

    function clearAllActiveStates() {
        [mobHomeBtn, mobSearchBtn, mobLibBtn].forEach(b => b.classList.remove("nav-active"));
    }

    function closeDrawer() {
        drawer.classList.remove("open");
    }

    // ── HOME ─────────────────────────────────────────────────
    mobHomeBtn.addEventListener("click", () => {
        const isActive = mobHomeBtn.classList.contains("nav-active");
        clearAllActiveStates();
        closeDrawer();
        if (isActive) {
            genreSection.style.display  = "none";
            cardContainer.style.display = "flex";
            mainTitle.style.display     = "block";
        } else {
            genreSection.style.display     = "block";
            cardContainer.style.display    = "none";
            mainTitle.style.display        = "none";
            spotifySearchBar.style.display = "none";
            searchInput.value = "";
            allCards.forEach(c => c.classList.remove("hidden"));
            mobHomeBtn.classList.add("nav-active");
        }
    });

    // ── SEARCH ───────────────────────────────────────────────
    mobSearchBtn.addEventListener("click", () => {
        const isActive = mobSearchBtn.classList.contains("nav-active");
        clearAllActiveStates();
        closeDrawer();
        if (isActive) {
            spotifySearchBar.style.display = "none";
            searchInput.value = "";
            searchClear.classList.remove("visible");
            allCards.forEach(c => c.classList.remove("hidden"));
            cardContainer.style.display = "flex";
            mainTitle.style.display     = "block";
        } else {
            spotifySearchBar.style.display = "block";
            genreSection.style.display     = "none";
            cardContainer.style.display    = "flex";
            mainTitle.style.display        = "block";
            searchInput.focus();
            mobSearchBtn.classList.add("nav-active");
        }
    });

    // ── LIBRARY ──────────────────────────────────────────────
    mobLibBtn.addEventListener("click", () => {
        const isOpen = drawer.classList.contains("open");
        clearAllActiveStates();
        if (isOpen) {
            closeDrawer();
        } else {
            drawer.classList.add("open");
            mobLibBtn.classList.add("nav-active");
        }
    });

    // ── CLOSE DRAWER ON OUTSIDE TAP ──────────────────────────
    document.addEventListener("click", (e) => {
        if (!drawer.contains(e.target) && !mobLibBtn.contains(e.target)) {
            if (drawer.classList.contains("open")) {
                closeDrawer();
                mobLibBtn.classList.remove("nav-active");
            }
        }
    });

    // ── GENRE TILES ──────────────────────────────────────────
    document.querySelectorAll(".genre-tile").forEach(tile => {
        tile.addEventListener("click", () => {
            clearAllActiveStates();
            genreSection.style.display  = "none";
            cardContainer.style.display = "flex";
            mainTitle.style.display     = "block";
        });
    });

    // ── HIDE ON RESIZE TO DESKTOP ─────────────────────────────
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            bottomNav.style.display = "none";
            drawer.style.display    = "none";
        } else {
            bottomNav.style.display = "flex";
        }
    });

})();