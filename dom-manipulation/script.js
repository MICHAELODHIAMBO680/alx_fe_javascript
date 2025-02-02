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
const quotes = [];
async function fetchQuotesFromMockAPI() {
  try {
    const response = await fetch('https://<your-mockapi-endpoint>/quotes');
    const data = await response.json();
    const serverQuotes = data.map(item => ({
      text: item.text,
      category: item.category
    }));
    quotes.push(...serverQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes fetched from MockAPI successfully!");
  } catch (error) {
    console.error('Error fetching quotes from MockAPI:', error);
  }
}

async function postQuoteToMockAPI(quote) {
  try {
    const response = await fetch('https://<your-mockapi-endpoint>/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    if (response.ok) {
      alert("Quote posted to MockAPI successfully!");
    } else {
      alert("Failed to post quote to MockAPI.");
    }
  } catch (error) {
    console.error('Error posting quote to MockAPI:', error);
  }
}

function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteDisplay").innerText = quotes[randomIndex].text;
  } else {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
  }
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToMockAPI(newQuote); // Post new quote to MockAPI
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
fetchQuotesFromMockAPI(); // Fetch quotes from MockAPI when the page loads
populateCategories();




  

