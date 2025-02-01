// Initialize quotes from local storage or default list
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
];

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
      document.getElementById("quoteDisplay").innerText = "No quotes available.";
      return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" - ${quote.category}`;
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
      alert("Both fields are required!");
      return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  alert("Quote added successfully!");
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.innerText = category;
      categoryFilter.appendChild(option);
  });
}

// Filter quotes based on category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
      showRandomQuote();
      return;
  }
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length > 0) {
      document.getElementById("quoteDisplay").innerText = `"${filteredQuotes[0].text}" - ${filteredQuotes[0].category}`;
  } else {
      document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
  }
}

// Export quotes as JSON file
function exportQuotes() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          if (Array.isArray(importedQuotes)) {
              quotes.push(...importedQuotes);
              localStorage.setItem("quotes", JSON.stringify(quotes));
              populateCategories();
              alert("Quotes imported successfully!");
          } else {
              alert("Invalid JSON file format.");
          }
      } catch (error) {
          alert("Error importing JSON file.");
      }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Sync with mock server (JSONPlaceholder)
const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function syncWithServer() {
  try {
      const response = await fetch(API_URL);
      const serverQuotes = await response.json();

      if (serverQuotes.length > 0) {
          const newQuotes = serverQuotes.map(post => ({
              text: post.title,
              category: "General"
          }));
          quotes = [...newQuotes, ...quotes]; // Merge server and local quotes
          localStorage.setItem("quotes", JSON.stringify(quotes));
          populateCategories();
          showRandomQuote();
      }
  } catch (error) {
      console.error("Error syncing with server:", error);
  }
}

// Conflict resolution: merge local and server quotes
async function resolveConflicts() {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const serverQuotes = await (await fetch(API_URL)).json();

  const mergedQuotes = [...new Map([...localQuotes, ...serverQuotes.map(q => ({ text: q.title, category: "General" }))].map(q => [q.text, q])).values()];
  
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  alert("Conflicts resolved! Quotes updated.");
}

// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  populateCategories();
  syncWithServer();
});

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  

