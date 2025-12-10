import { names } from "./names.mjs";

const randomNameEl = document.getElementById("randomName");
const surpriseBtn = document.getElementById("surpriseBtn");
const searchInput = document.getElementById("searchInput");
const suggestList = document.getElementById("suggestList");
const grid = document.getElementById("nameGrid");

const genderFilter = document.getElementById("genderFilter");
const lengthFilter = document.getElementById("lengthFilter");
const firstFilter = document.getElementById("firstFilter");
const sortFilter = document.getElementById("sortFilter"); 

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function pickRandom() {
  const n = names[Math.floor(Math.random() * names.length)];
  randomNameEl.textContent = n.name;
}

function getLengthCategory(n) {
  if (n.name.length <= 4) return "short";
  if (n.name.length <= 7) return "medium";
  return "long";
}

function renderGrid(list) {
  grid.innerHTML = "";
  list.forEach(n => {
    const card = document.createElement("div");
    card.className = "card";

    const h3 = document.createElement("h3");
    h3.textContent = n.name;

    const p = document.createElement("p");
    p.textContent = n.meaning;

    const fav = document.createElement("button");
    fav.className = "fav-btn";
    fav.textContent = favorites.includes(n.name) ? "♥" : "♡";

    if (favorites.includes(n.name)) {
      fav.classList.add("active");
    }

    fav.addEventListener("click", () => {
      if (favorites.includes(n.name)) {
        favorites = favorites.filter(f => f !== n.name);
      } else {
        favorites.push(n.name);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderGrid(list);
    });

    card.append(h3, p, fav);
    grid.appendChild(card);
  });
}

function applyFilters() {
  let list = names;

  if (genderFilter.value) {
    list = list.filter(n => n.gender === genderFilter.value);
  }

  if (lengthFilter.value) {
    list = list.filter(n => getLengthCategory(n) === lengthFilter.value);
  }

  if (firstFilter.value) {
    list = list.filter(n => n.name.startsWith(firstFilter.value));
  }

  if (sortFilter.value === "asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortFilter.value === "desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderGrid(list);
}

function showSuggestions(text) {
  suggestList.innerHTML = "";
  if (!text) {
    suggestList.style.display = "none";
    return;
  }

  const matches = names.filter(n =>
    n.name.toLowerCase().startsWith(text.toLowerCase())
  );

  matches.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.name;
    li.addEventListener("click", () => {
      searchInput.value = n.name;
      suggestList.style.display = "none";
      renderGrid([n]);
    });
    suggestList.appendChild(li);
  });

  suggestList.style.display = matches.length ? "block" : "none";
}

surpriseBtn.addEventListener("click", pickRandom);
searchInput.addEventListener("input", e => showSuggestions(e.target.value));
genderFilter.addEventListener("change", applyFilters);
lengthFilter.addEventListener("change", applyFilters);
firstFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters); 

pickRandom();
renderGrid(names);