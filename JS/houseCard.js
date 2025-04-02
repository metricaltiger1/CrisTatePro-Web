const propertyList = document.getElementById("property-list");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let isLoggedIn = !!localStorage.getItem("user_email");

function checkLogin() {
    if (!isLoggedIn) {
        if (confirm("You need to log in to like this property. Log in now?")) {
            window.location.href = "/HTML/Authentification/login.html"; 
        }
        return false; 
    }
    return true;
}

// Reusable function to create the house card HTML
function createHouseCard(house) {
    const houseImageUrl = `${API.profileImage}${house.houseProfileImage}`;


    const formattedPrice = house.housePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


    const priceLabel = house.transactionType.toLowerCase() === "rent" || house.transactionType.toLowerCase() === "office" ? "per month" : "per night";

   
    const [latitude, longitude, locationName] = house.houseLocation.split(', ');

    return `
        <div class="house-card" data-house-id="${house.houseId}">
            <img src="${houseImageUrl}" alt="${house.houseTitle}" class="house-image">
            <div class="house-info">
                <h3>${house.houseTitle}</h3>
                
                
                
                <div class="house-details">
                    ${house.houseBedrooms > 0 ? `<span class="icon">🛏️ ${house.houseBedrooms}</span>` : ''}
                    ${house.houseBathrooms > 0 ? `<span class="icon">🛁 ${house.houseBathrooms}</span>` : ''}
                </div>

                <p class="price">💵 Ksh ${formattedPrice} ${priceLabel ? `/${priceLabel}` : ''}</p>

                <p class="location">
                    <a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}" target="_blank" class="location-link">
                        📍 ${locationName.trim()}
                    </a>
                </p>
            </div>
            
            <button class="like-btn">
                <span class="like-icon ${favorites.includes(house.houseId) ? 'liked' : ''}">
                    ${favorites.includes(house.houseId) ? "❤️" : "🤍"}
                </span>
            </button>
        </div>
    `;
}




function renderProperties(filteredHouses) {
    propertyList.innerHTML = ""; // Clear previous properties

    if (filteredHouses.length === 0) {
        propertyList.innerHTML = "<p>No properties found.</p>";
        return;
    }

    filteredHouses.forEach(house => {
        const houseCardHTML = createHouseCard(house);
        const houseCard = document.createElement('div');
        houseCard.innerHTML = houseCardHTML;

        const likeButton = houseCard.querySelector('.like-btn');
        likeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(house.houseId, likeButton);
        });

        houseCard.addEventListener('click', () => {
            console.log(`Navigating to house detail for ID: ${house.houseId}`);
            window.location.href = `housedetails.html?id=${house.houseId}`;
        });

        propertyList.appendChild(houseCard); // Append the card to the property list
    });
}

function toggleFavorite(houseId, button) {
    if (checkLogin()) {
        const icon = button.querySelector('.like-icon');
        const isCurrentlyFavorite = favorites.includes(houseId);

        const apiUrl = API.favouriteHouse;

        const requestBody = new URLSearchParams();
        requestBody.append('user_id', localStorage.getItem('user_id'));
        requestBody.append('house_id', houseId);

        fetch(apiUrl, {
            method: 'POST',
            body: requestBody
        })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);

            const houseCard = button.closest('.house-card');

            if (isCurrentlyFavorite) {
                favorites = favorites.filter(id => id !== houseId);
                icon.classList.remove('liked');
                icon.textContent = "🤍"; 
               
            } else {
                favorites.push(houseId);
                icon.classList.add('liked');
                icon.textContent = "❤️"; 
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
            window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

export { createHouseCard, renderProperties, toggleFavorite, checkLogin };
