const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" }
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerText = quotes[randomIndex].text;
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.push(...JSON.parse(storedQuotes));
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const dataUrl = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "quotes.json";
  link.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  document.getElementById("quoteDisplay").innerText = filteredQuotes.map(quote => quote.text).join("\n");
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
loadQuotes();
populateCategories();


  

