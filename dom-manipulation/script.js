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