let quotes = [
  { text: "Stay hungry, stay foolish", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication", category: "Wisdom" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn  = document.getElementById("newQuote");

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${q.text}" — [${q.category}]`;
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput  = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = catInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text, category });
  textInput.value = "";
  catInput.value = "";
  showRandomQuote();
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

newQuoteBtn.addEventListener("click", showRandomQuote);

createAddQuoteForm();
showRandomQuote();

const LS_KEY = "quotes.v1";

// load from localStorage (if present) and re-render
(function initFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      if (Array.isArray(loaded)) quotes = loaded;
      // refresh UI to reflect stored data
      showRandomQuote();
    }
  } catch (_) { /* ignore parse errors and keep seed quotes */ }
})();

// persist current quotes array
function saveQuotes() {
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
}

// ensure saves happen after clicking "Add Quote" (without changing your original function)
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "addQuote") {
    // your addQuote() has already pushed; just persist the new state
    saveQuotes();
  }
});

// Export: download quotes as JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes-export.json";
  document.body.appendChild(a);        // ensure it's in the DOM for Firefox
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import: read JSON file and merge/append into quotes, then persist
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON");
      quotes.push(...imported);        // append
      saveQuotes();                    // persist
      showRandomQuote();               // update UI
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    } finally {
      event.target.value = "";         // reset file input
    }
  };
  reader.readAsText(file);
}

// wire export button
document.getElementById("exportBtn")?.addEventListener("click", exportToJsonFile);