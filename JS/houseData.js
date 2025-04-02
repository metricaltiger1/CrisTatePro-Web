import { renderProperties } from './houseCard.js';
import HouseModel from './houseModel.js';

let houseData = [];
let currentPage = 1; 
let isFetching = false; 
const pageSize = 5; 
const CACHE_KEY = 'houseData';
const TIMESTAMP_KEY = 'cacheTimestamp';
const CACHE_DURATION = 10 * 60 * 1000; // Cache duration in milliseconds

// Function to fetch houses
async function fetchUserHouses() {
    if (isFetching) return; 
    isFetching = true; 

    try {
        console.log('Fetching houses...');
        const apiUrl = `${API.allHouses}?page=${currentPage}&pageSize=${pageSize}`;
      
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch houses: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const housesList = Array.isArray(jsonResponse.houses) ? jsonResponse.houses : [];

        if (housesList.length > 0) {
            const houseModels = housesList.map(house => HouseModel.fromJson(house));
            const existingHouses = houseData;

            houseModels.forEach(house => {
                if (!existingHouses.some(existingHouse => existingHouse.houseId === house.houseId)) {
                    existingHouses.push(house); 
                }
            });

            sessionStorage.setItem(CACHE_KEY, JSON.stringify(existingHouses));
            sessionStorage.setItem(TIMESTAMP_KEY, Date.now());
            houseData = existingHouses;
            renderProperties(houseData);
            currentPage++;
        } else {
            console.warn('No houses available to render.');
        }

        console.log('Fetched houses:', houseData);
    } catch (error) {
        console.error('Fetch error:', error.message);
        alert(`Error: ${error.message}`);
    } finally {
        isFetching = false; // Reset fetching state
        document.getElementById('loading-spinner').style.display = 'none';

        console.log('Fetch completed');
    }
}

// Function to load houses from session storage
function loadHousesFromCache() {
    const cachedData = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    const cacheTimestamp = parseInt(sessionStorage.getItem(TIMESTAMP_KEY), 10);
    const now = Date.now();

    if (cachedData && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('Using cached data');
        houseData = cachedData; 
        renderProperties(houseData); 
        document.getElementById('loading-spinner').style.display = 'none';
    } else {
        console.log('Cache expired or not found, fetching fresh data');
        fetchUserHouses();
    }
}

// Function to handle login checks
window.checkLoginAndRedirect = function(event, targetUrl) {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        event.preventDefault();
        alert("You need to log in to access your chats.");
    } else {
        window.location.href = targetUrl;
    }
};

// Function to handle user login and store details in sessionStorage
window.loginUser = function(userId, userFirstName) {
    sessionStorage.setItem("user_id", userId);
    sessionStorage.setItem("user_firstname", userFirstName);
};

// Function to update the greeting message based on time of day
function updateGreeting() {
    const greetingElement = document.getElementById("greeting");
    const firstName = localStorage.getItem("user_firstname") || "User";
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = `Good morning, ${firstName} 😊`;
    } else if (currentHour < 18) {
        greeting = `Good afternoon, ${firstName} 😊`;
    } else {
        greeting = `Good evening, ${firstName} 😊`;
    }

    greetingElement.textContent = greeting;
}

// Initialize Greeting on Load
updateGreeting();


// Load houses from cache or fetch fresh data on page load
window.addEventListener('DOMContentLoaded', loadHousesFromCache);

// Scroll event to handle infinite scrolling
let lastScrollTop = 0;
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', function() {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.transform = `translateY(-${Math.min(scrollTop, headerHeight)}px)`;
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Function to handle scroll events and load more houses when reaching bottom
function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        fetchUserHouses(); 
    }
}


window.addEventListener('scroll', handleScroll);

// Export the house data
export { houseData };
