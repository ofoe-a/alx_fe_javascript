let quotes = [
  { text: "Stay hungry, stay foolish", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication", category: "Wisdom" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
];

const LS_KEY = "quotes.v1";
const FILTER_KEY = "quotes.lastFilter.v1";

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn  = document.getElementById("newQuote");

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const loaded = JSON.parse(raw);
    if (Array.isArray(loaded)) quotes = loaded;
  } catch {}
}
function saveQuotes() {
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
}

function getFilteredQuotes() {
  const sel = document.getElementById("categoryFilter");
  const cat = sel ? sel.value : "all";
  return cat === "all" ? quotes : quotes.filter(q => q.category === cat);
}
function showRandomQuote() {
  const list = getFilteredQuotes();
  if (!list.length) {
    const sel = document.getElementById("categoryFilter");
    const cat = sel ? sel.value : "all";
    quoteDisplay.innerHTML = cat === "all" ? "No quotes available!" : `No quotes in the “${cat}” category.`;
    return;
  }
  const idx = Math.floor(Math.random() * list.length);
  const q = list[idx];
  quoteDisplay.innerHTML = `"${q.text}" — [${q.category}]`;
}

function createAddQuoteForm() {
  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = "Add a new Quote";
  section.appendChild(h2);

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  section.appendChild(textInput);

  const catInput = document.createElement("input");
  catInput.type = "text";
  catInput.id = "newQuoteCategory";
  catInput.placeholder = "Enter quote category";
  section.appendChild(catInput);

  const addBtn = document.createElement("button");
  addBtn.id = "addQuote";
  addBtn.textContent = "Add Quote";
  section.appendChild(addBtn);

  newQuoteBtn.insertAdjacentElement("afterend", section);
  addBtn.addEventListener("click", addQuote);
}

function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const inputCatEl = document.getElementById("newQuoteCategory");
  const selectEl = document.getElementById("categorySelect");
  const selectedCategory = (selectEl && selectEl.value) || inputCatEl.value.trim();

  const text = (textEl?.value || "").trim();
  if (!text || !selectedCategory) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text, category: selectedCategory });
  saveQuotes();

  if (textEl) textEl.value = "";
  if (inputCatEl) inputCatEl.value = "";

  populateCategories();
  filterQuotes();
  postQuoteToServer(text);
}

function populateCategories() {
  const sel = document.getElementById("categoryFilter");
  if (!sel) return;

  const saved = localStorage.getItem(FILTER_KEY) || "all";
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();

  sel.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = "All Categories";
  sel.appendChild(allOpt);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });

  sel.value = categories.includes(saved) || saved === "all" ? saved : "all";
}
function filterQuotes() {
  const sel = document.getElementById("categoryFilter");
  if (sel) localStorage.setItem(FILTER_KEY, sel.value);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes-export.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
document.getElementById("exportBtn")?.addEventListener("click", exportToJsonFile);

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Failed to fetch quotes");
    const data = await response.json();
    quotes = data.slice(0, 20).map(item => ({
      text: item.title,
      category: "Server"
    }));
    saveQuotes();
    populateCategories();
    filterQuotes();
    return quotes;
  } catch (err) {
    console.error("Error fetching quotes:", err);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Quote", body: quote, userId: 1 })
    });
    const data = await response.json();
    console.log("Quote posted:", data);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

function syncQuotes() {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotes)
  })
    .then(r => r.json())
    .then(() => {
      console.log("Quotes synced with server!");
      return fetchQuotesFromServer();
    })
    .catch(err => console.error("Error syncing quotes:", err));
}

newQuoteBtn.addEventListener("click", showRandomQuote);

loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();

setInterval(syncQuotes, 30000);