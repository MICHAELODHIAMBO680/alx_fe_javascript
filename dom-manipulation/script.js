let quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  // Add more quotes as needed
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available. Please add some quotes.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    saveQuotes();
    populateCategories(); // Update categories if new category added
    alert("New quote added!");

    // Post the new quote to the server
    postQuoteToServer(newQuote);
  } else {
    alert("Please fill out both fields.");
  }
}

// Function to post a new quote to the server
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Quote posted to server:", data);
      alert("Quote posted to server successfully!");
    })
    .catch(error => console.error("Error posting data to server:", error));
}

// Function to fetch quotes from the server
function fetchQuotesFromServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.map(item => ({
        text: item.body,
        category: "Server"
      }));
      quotes.push(...serverQuotes);
      saveQuotes();
      populateCategories(); // Update categories if new categories are added
      alert("Quotes fetched from server!");
    })
    .catch(error => console.error("Error fetching data from server:", error));
}

// Call this function periodically (e.g., every 5 minutes)
setInterval(fetchQuotesFromServer, 5 * 60 * 1000);

// Call the function once to fetch initial data
fetchQuotesFromServer();

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`; // Reset categories
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

function saveSelectedCategory() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
}

function loadSelectedCategory() {
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes();
  }
}

// Save selected category when it changes
document.getElementById("categoryFilter").addEventListener("change", saveSelectedCategory);

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  loadSelectedCategory();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

document.getElementById("exportQuotes").addEventListener("click", function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories(); // Update categories if new categories added
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

function syncQuotesWithServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.map(item => ({
        text: item.body,
        category: "Server"
      }));
      quotes = serverQuotes;
      saveQuotes();
      alert("Quotes synchronized with server!");
    });
}

function resolveConflicts(localQuotes, serverQuotes) {
  return serverQuotes; // Example strategy: Server data takes precedence
}

function syncQuotesWithConflictResolution() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.map(item => ({
        text: item.body,
        category: "Server"
      }));
      quotes = resolveConflicts(quotes, serverQuotes);
      saveQuotes();
      alert("Quotes synchronized with server. Conflicts resolved!");
    });
}

document.getElementById("resolveConflicts").addEventListener("click", function() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.map(item => ({
        text: item.body,
        category: "Server"
      }));
      quotes = manualConflictResolution(quotes, serverQuotes);
      saveQuotes();
      alert("Conflicts resolved manually!");
    });
});

function manualConflictResolution(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes, ...serverQuotes];
  return Array.from(new Set(mergedQuotes.map(quote => quote.text)))
    .map(text => mergedQuotes.find(quote => quote.text === text));
}

// Sync every 10 minutes
setInterval(syncQuotesWithConflictResolution, 10 * 60 * 1000);


