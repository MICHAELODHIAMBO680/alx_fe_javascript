/ script.js

// Global quotes array – initialize with some default quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "Be yourself; everyone else is already taken.", category: "humor" }
  ];
  
  // Use local storage key
  const QUOTES_KEY = "quotesData";
  const FILTER_KEY = "lastFilter";
  
  // DOM Elements
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const addQuoteBtn = document.getElementById("addQuoteBtn");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const categoryFilter = document.getElementById("categoryFilter");
  const filterBtn = document.getElementById("filterBtn");
  const exportBtn = document.getElementById("exportBtn");
  const importFile = document.getElementById("importFile");
  const notificationArea = document.getElementById("notificationArea");
  
  // Initialize application
  function init() {
    loadQuotes();
    populateCategories();
    restoreLastFilter();
    attachEventListeners();
    // Show an initial random quote
    showRandomQuote();
    // Start syncing with the server every 30 seconds
    setInterval(syncWithServer, 30000);
  }
  
  // Load quotes from localStorage (if available)
  function loadQuotes() {
    const storedQuotes = localStorage.getItem(QUOTES_KEY);
    if (storedQuotes) {
      try {
        quotes = JSON.parse(storedQuotes);
      } catch (e) {
        console.error("Error parsing stored quotes:", e);
      }
    }
  }
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  }
  
  // Display a random quote (or filtered quote if filter is applied)
  function showRandomQuote() {
    // Get current filter value
    const selectedCategory = categoryFilter.value;
    let filteredQuotes = quotes;
    if (selectedCategory !== "all") {
      filteredQuotes = quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerText = "No quotes available for this category. Please add some!";
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `"${quote.text}" – ${quote.category}`;
  }
  
  // Add a new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
  
    if (!text || !category) {
      showNotification("Please fill in both fields.", true);
      return;
    }
  
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showNotification("Quote added successfully!");
    // Clear input fields
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    // Refresh displayed quote
    showRandomQuote();
  }
  
  // Populate the category filter dropdown based on quotes array
  function populateCategories() {
    // Get unique categories (case-insensitive)
    const categories = quotes.reduce((acc, curr) => {
      const catLower = curr.category.toLowerCase();
      if (!acc.includes(catLower)) {
        acc.push(catLower);
      }
      return acc;
    }, []);
  
    // Clear existing options except "all"
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
      categoryFilter.appendChild(option);
    });
  }
  
  // Filter quotes based on selected category
  function filterQuotes() {
    // Save current filter to localStorage so it persists
    localStorage.setItem(FILTER_KEY, categoryFilter.value);
    showRandomQuote();
  }
  
  // Restore the last selected filter from localStorage
  function restoreLastFilter() {
    const lastFilter = localStorage.getItem(FILTER_KEY);
    if (lastFilter) {
      categoryFilter.value = lastFilter;
    }
  }
  
  // JSON Export: Create a JSON file download from the quotes array
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Quotes exported successfully!");
  }
  
  // JSON Import: Handle file input and load quotes from a JSON file
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        // Validate imported data format (should be an array of objects)
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          showNotification("Quotes imported successfully!");
        } else {
          showNotification("Invalid JSON format.", true);
        }
      } catch (err) {
        console.error("Error importing JSON:", err);
        showNotification("Error parsing JSON file.", true);
      }
    };
    fileReader.readAsText(file);
  }
  
  // Simulate server synchronization using a mock API
  function syncWithServer() {
    // For demonstration, we simulate a GET request to fetch new quotes.
    // Here, we'll use the JSONPlaceholder API (replace with your own API if needed)
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=1")
      .then(response => response.json())
      .then(data => {
        // Simulate converting server data to quote objects:
        const serverQuote = {
          text: data[0].title,
          category: "server"
        };
        // Simple conflict resolution: If the server quote doesn't exist locally, add it.
        if (!quotes.find(q => q.text === serverQuote.text)) {
          quotes.push(serverQuote);
          saveQuotes();
          populateCategories();
          showNotification("New quote synced from server.");
        }
      })
      .catch(err => console.error("Server sync error:", err));
  }
  
  // Utility function to display notifications
  function showNotification(message, isError = false) {
    const note = document.createElement("div");
    note.className = "notification";
    note.style.backgroundColor = isError ? "#fdd" : "#dfd";
    note.innerText = message;
    notificationArea.appendChild(note);
    // Remove the notification after 3 seconds
    setTimeout(() => {
      notificationArea.removeChild(note);
    }, 3000);
  }
  
  // Attach event listeners to DOM elements
  function attachEventListeners() {
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);
    filterBtn.addEventListener("click", filterQuotes);
    exportBtn.addEventListener("click", exportQuotes);
    importFile.addEventListener("change", importFromJsonFile);
  }
  
  // Initialize the application when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", init);
  