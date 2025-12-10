import { names } from "./names.mjs";

const favoritesList = document.querySelector("#favorites-list");
const clearBtn = document.querySelector("#clear-favorites");
const sortSelect = document.querySelector("#sort-select");
const genderFilter = document.querySelector("#gender-filter");

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function applyFilters(allFavorites) {
  let filtered = [...allFavorites];

  if (genderFilter.value !== "all") {
    filtered = filtered.filter(fav => {
      const data = names.find(n => n.name === fav);
      if (!data) return false;
      return data.gender === genderFilter.value;
    });
  }

  if (sortSelect.value === "az") {
    filtered.sort((a, b) => a.localeCompare(b));
  } else if (sortSelect.value === "za") {
    filtered.sort((a, b) => b.localeCompare(a));
  }

  return filtered;
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = `<p class="empty-message">No favorites yet.</p>`;
    return;
  }

  const filteredSorted = applyFilters(favorites);

  if (filteredSorted.length === 0) {
    favoritesList.innerHTML = `<p class="empty-message">No names match this filter.</p>`;
    return;
  }

  filteredSorted.forEach((favName) => {
    const data = names.find((n) => n.name === favName);
    if (!data) return;

    const card = document.createElement("div");
    card.classList.add("fav-card");

    card.innerHTML = `
      <h3>${data.name}</h3>
      <p class="meaning">${data.meaning}</p>
      <p class="origin"><strong>Origin:</strong> ${data.origin}</p>
      <p class="gender-tag">${data.gender}</p>
      <button class="remove-btn" data-name="${data.name}">Remove</button>
    `;

    favoritesList.appendChild(card);
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const updated = getFavorites().filter(n => n !== btn.dataset.name);
      saveFavorites(updated);
      renderFavorites();
    });
  });
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("favorites");
  renderFavorites();
});

sortSelect.addEventListener("change", renderFavorites);
genderFilter.addEventListener("change", renderFavorites);

renderFavorites();
