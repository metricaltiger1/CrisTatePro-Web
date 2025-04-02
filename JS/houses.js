// Import the renderProperties function from houseCard.js
import { renderProperties } from './houseCard.js';

// Define the initial state variables
let houses = []; // Array to hold the fetched houses
let currentPage = 1; // To keep track of the current page for pagination
let isFetching = false; // To prevent multiple requests at the same time
const pageSize = 25; // Number of houses to fetch per request

// Function to fetch houses
async function fetchUserHouses() {
  if (isFetching) return; // Prevent multiple simultaneous requests
  isFetching = true; // Set fetching state to true
  try {
    // Show a loading indicator or set a loading state here
    console.log('Fetching houses...');

    // Construct the API URL with the current page and page size
    const apiUrl = `${API.allHouses}?page=${currentPage}&pageSize=${pageSize}`;

    // Send GET request to the server
    const response = await fetch(apiUrl);

    // Check if the request was successful
    if (response.ok) {
      const jsonResponse = await response.json();

      // Check if the response was successful
      if (jsonResponse.success) {
        const housesList = jsonResponse.houses;

        // Call renderProperties with the fetched houses
        renderProperties(housesList);

        // Add the fetched houses to the main array
        houses = houses.concat(housesList);

        // Increase the page number for the next fetch
        currentPage++;

        console.log('Fetched houses:', houses);
      } else {
        // Handle failure response from the server
        console.error(`Failed to fetch houses: ${jsonResponse.message}`);
        alert(`Failed to fetch houses: ${jsonResponse.message}`);
      }
    } else {
      // Handle non-200 status codes
      console.error(`Failed to fetch houses: ${response.status}`);
      alert(`Failed to fetch houses: ${response.status}`);
    }
  } catch (error) {
    // Handle errors, such as network issues
    console.error('Failed to fetch houses, check your internet connection:', error);
    alert('Failed to fetch houses, check your internet connection');
  } finally {
    isFetching = false; // Reset fetching state
    // Hide loading indicator or set loading state to false here
    console.log('Fetch completed');
  }
}

// Call the function to fetch houses
fetchUserHouses();
