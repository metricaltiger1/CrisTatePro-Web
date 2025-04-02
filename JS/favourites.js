import { createHouseCard, toggleFavorite } from './houseCard.js';
import HouseModel from './houseModel.js';

document.addEventListener("DOMContentLoaded", function () {
    const propertyList = document.getElementById('property-list');

    // Function to show alert message
    function showAlert(message, type) {
        const alertMessage = document.getElementById("alert-message");
        if (alertMessage) {
            alertMessage.textContent = message;
            alertMessage.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
            alertMessage.style.display = "block";
            setTimeout(() => {
                alertMessage.style.display = "none";
                alertMessage.className = 'alert-message';
            }, 3000);
        } else {
            console.error("Alert message element not found.");
        }
    }

    // Function to render properties using createHouseCard
    function renderProperties(houses) {
        propertyList.innerHTML = ""; // Clear previous properties

        if (houses.length === 0) {
            propertyList.innerHTML = "<p>You have no favourite houses yet.</p>";
            return;
        }

        houses.forEach(houseData => {
            const house = HouseModel.fromJson(houseData); 
            const houseCardHTML = createHouseCard(house); 
            const houseCard = document.createElement('div');
            houseCard.innerHTML = houseCardHTML;

            const likeButton = houseCard.querySelector('.like-btn');
            likeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(house.houseId, likeButton); // Pass houseId and likeButton
            });

            // Add click event to navigate to house details
            houseCard.addEventListener('click', () => {
                console.log(`Navigating to house detail for ID: ${house.houseId}`);
                window.location.href = `housedetails.html?id=${house.houseId}`;
            });

            propertyList.appendChild(houseCard);
        });
    }

    // Fetch favorite houses using the URL from API.allFavHouses
    async function fetchFavoriteHouses(userId, page = 1, pageSize = 50) {
        try {
            const apiUrl = API.allFavHouses;

            const params = new URLSearchParams();
            params.append('user_id', userId);
            params.append('page', page);
            params.append('pageSize', pageSize);

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: params,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch houses: ${response.status} ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            if (jsonResponse.success) {
                const favoriteHouses = jsonResponse.favourite_houses;
                renderProperties(favoriteHouses); // Call the updated renderProperties function
            } else {
                showAlert(jsonResponse.message, 'error');
            }
        } catch (error) {
            console.error("Error fetching favorite houses:", error);
            showAlert("Failed to fetch favourite houses. Please check your connection or try again later.", 'error');
        }
    }

    // Function to update favorite houses
    function updateFavoriteHouses() {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            propertyList.innerHTML = "<p>You need to log in to see your favourite houses.</p>";
            return; 
        }

        fetchFavoriteHouses(userId);
    }

    window.checkLoginAndRedirect = function(event, targetUrl) {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
           
            event.preventDefault();
            
     
            alert("You need to log in to access your chats.");

          
           
        } else {
          
            window.location.href = targetUrl;
        }
    };
    // Initial call to update favorite houses
    updateFavoriteHouses();

    // Listen for the favoritesUpdated event and update favorite houses
    window.addEventListener('favoritesUpdated', updateFavoriteHouses);

        // Update Greeting Function
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


    // Mobile Menu Toggle
    const mobileMenuIcon = document.getElementById("mobile-menu-icon");
    const navList = document.querySelector(".nav-list");
    const menuIcon = document.getElementById("menu-icon");
    
    mobileMenuIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        navList.classList.toggle("show");
    
        // Toggle the icon
        if (navList.classList.contains("show")) {
            menuIcon.textContent = "close"; // Change to close icon
        } else {
            menuIcon.textContent = "menu"; // Change back to menu icon
        }
    });
    
    window.addEventListener("click", function (event) {
        if (!mobileMenuIcon.contains(event.target) && !navList.contains(event.target)) {
            navList.classList.remove('show');
            menuIcon.textContent = "menu"; // Ensure it reverts to menu icon when closed
        }
    });
});
