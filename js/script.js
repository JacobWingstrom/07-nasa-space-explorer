// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get the gallery element where images will be displayed
const gallery = document.getElementById('gallery');

// Find the "Get Space Images" button
const getImagesButton = document.querySelector('.filters button');

// NASA APOD API key
const apiKey = 'YizmnfpXiaczlqmQS4EO5j1LwmIEPeF7ffIiY1wu';

// Get modal elements for showing enlarged image
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.getElementById('closeModal');

// Function to open the modal with image details
function showModal(item) {
  // Set modal content using the clicked image's data
  modalImg.src = item.url;
  modalImg.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  imageModal.style.display = 'block';
}

// Function to close the modal
closeModal.addEventListener('click', () => {
  imageModal.style.display = 'none';
});

// Also close modal when clicking outside the modal content
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    imageModal.style.display = 'none';
  }
});

// Listen for button clicks to fetch images
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL using template literals
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Show a friendly loading message while fetching
  gallery.innerHTML = `<p style="font-size:1.2em;text-align:center;">🔄 Loading space photos…</p>`;

  // Fetch images from NASA's APOD API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // Check if we got an array of entries
      if (Array.isArray(data)) {
        // Create a grid container for entries
        const gridContainer = document.createElement('div');
        gridContainer.className = 'image-grid';

        // Loop through each entry and display it
        data.forEach(item => {
          // Create a div for each grid item
          const entryDiv = document.createElement('div');
          entryDiv.className = 'grid-item';

          if (item.media_type === 'image') {
            // If it's an image, show image, title, and date
            entryDiv.innerHTML = `
              <img src="${item.url}" alt="${item.title}" style="cursor:pointer;" />
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
            // When the image is clicked, show the modal with details
            entryDiv.querySelector('img').addEventListener('click', () => {
              showModal(item);
            });
          } else if (item.media_type === 'video') {
            // If it's a video, show a thumbnail (if available) and a link
            // Try to get a thumbnail from the API (sometimes 'thumbnail_url' exists)
            let thumbHtml = '';
            if (item.thumbnail_url) {
              thumbHtml = `<img src="${item.thumbnail_url}" alt="Video thumbnail" style="max-width:100%;border-radius:6px;margin-bottom:8px;" />`;
            } else {
              // If no thumbnail, use a generic video icon
              thumbHtml = `<div style="font-size:48px;margin-bottom:8px;">🎬</div>`;
            }
            entryDiv.innerHTML = `
              ${thumbHtml}
              <h3>${item.title}</h3>
              <p>${item.date}</p>
              <a href="${item.url}" target="_blank" style="display:inline-block;margin-top:8px;padding:8px 16px;background:#0072c6;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold;">Watch Video</a>
            `;
          }

          // Add the entry to the grid container
          gridContainer.appendChild(entryDiv);
        });

        // If there are entries, add the grid to the gallery
        if (gridContainer.children.length > 0) {
          gallery.appendChild(gridContainer);
        } else {
          gallery.innerHTML = `<p>No entries found for this date range.</p>`;
        }
      } else {
        // If the API returned an error or a single entry
        gallery.innerHTML = `<p>Could not load entries. Please try a different date range.</p>`;
      }
    })
    .catch(error => {
      // Show an error message if something went wrong
      gallery.innerHTML = `<p>Error loading entries. Please check your internet connection and try again.</p>`;
      // Log the error for debugging
      console.error(error);
    });
});

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? The largest volcano in the solar system is Olympus Mons on Mars.",
  "Did you know? A day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 times per second.",
  "Did you know? The Sun accounts for about 99.86% of the mass in our solar system.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has 95 known moons as of 2023.",
  "Did you know? Saturn's rings are made mostly of ice particles.",
  "Did you know? The Milky Way galaxy is about 100,000 light-years across.",
  "Did you know? Space is completely silent because there is no air to carry sound.",
  "Did you know? The footprints on the Moon will remain for millions of years."
];

// Pick a random fact from the array
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Display the fact in the spaceFact section
const spaceFactDiv = document.getElementById('spaceFact');
spaceFactDiv.textContent = randomFact;
