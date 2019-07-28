const giphyApiKey = "tERZTBpegoO9vTp535UAmVHO9JHrMNA0";
let offset = 0;
let type = "trending";
let searchValue = "";
const search = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const btnLoad = document.getElementById("btnLoad");
const gifContent = document.querySelector(".gif-content");
const title = document.querySelector("h1");
const loading = document.querySelector(".loading");

// Function called when the website is loaded, click to see more results or search for something
const loadGif = (type, searchValue, offset) => {
  // Mount a API URL with the type (serach or trending), key, and the offset
  let url = `https://api.giphy.com/v1/gifs/${type}?api_key=${giphyApiKey}&offset=${offset}&limit=10`;

  // Check if the user is searching to add a string to the API URL
  if (type == "search") {
    url += "&q=" + searchValue;
  }

  // Show the "loading" display
  loading.style.display = "block";

  fetch(url)
    .then(response => response.json())
    .then(content => {
      // Check if the results are less the one to hide the button load
      if (content.data.length < 1) {
        btnLoad.style.display = "none";
        setResultNotFound();
      } else {
        createGiphys(content.data);
      }

      // Hide the "loading" display
      loading.style.display = "none";
    })
    .catch(err => {
      console.error(err);
    });
};

// Check if the search did not find any results to show a "no results" message
const setResultNotFound = () => {
  if (gifContent.childNodes.length === 0) {
    const notice = document.createElement("p");
    notice.textContent = "Results not found";
    gifContent.appendChild(notice);
  }
};

// Create an image element to each result
const createGiphys = data => {
  data.forEach(data => {
    const img = document.createElement("img");
    img.src = data.images.downsized.url;
    gifContent.appendChild(img);
  });
};

// Function called when the user press ENTER or click on search button
const handleSearch = () => {
  // Set the search title
  title.innerHTML = `Results for "<i>${search.value}</i>"`;
  // Clean the gifContent div
  gifContent.innerHTML = "";
  // Set the type to mount the API URL
  type = "search";
  // Save the search value in a variable to be able to clean to search input
  searchValue = search.value.trim();
  // Call the loadGif function to show teh results
  loadGif(type, searchValue, offset);
  // Clean the search input
  search.value = "";
};

document.addEventListener("DOMContentLoaded", () => {
  // Call the loadGif function when the website is loaded
  loadGif(type, searchValue, offset);

  btnLoad.addEventListener("click", () => {
    // Set a offset to specifie the starting position of the new results
    offset += 10;
    // Call the loadGif function to show more results
    loadGif(type, searchValue, offset);
  });

  btnSearch.addEventListener("click", handleSearch);

  search.addEventListener("keyup", e => {
    // Check if the user pressed the ENTER key
    if (e.keyCode === 13) {
      handleSearch();
    }
  });
});
