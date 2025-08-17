// seed
let quotes = [
  { text: "Stay hungry, stay foolish", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication", category: "Wisdom" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn  = document.getElementById("newQuote");

// render one random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  quoteDisplay.innerHTML = `"${q.text}" — [${q.category}]`;
}

// push a new quote from inputs
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl  = document.getElementById("newQuoteCategory");
  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) return;

  quotes.push({ text, category });
  textEl.value = "";
  catEl.value = "";
  showRandomQuote();
}

// build the add-quote form dynamically
function createAddQuoteForm() {
  const host = document.getElementById("formContainer");
  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = "Add a new Quote";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const catInput = document.createElement("input");
  catInput.type = "text";
  catInput.id = "newQuoteCategory";
  catInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.id = "addQuote";
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  section.append(h2, textInput, catInput, addBtn);
  host.replaceChildren(section); // ensures only one form exists
}

// wire up + initial paint
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();
showRandomQuote();