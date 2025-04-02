import AmenityIcons from './amenityIcons.js';

const houseDetail = document.getElementById("house-detail");
const backBtn = document.getElementById("back-btn");
const urlParams = new URLSearchParams(window.location.search);
const houseId = Number(urlParams.get("id"));

function loadHouseDetails() {
    // Fetch house data from sessionStorage instead of localStorage
    const existingHouses = JSON.parse(sessionStorage.getItem('houseData')) || [];
    console.log('Existing houses from sessionStorage:', existingHouses);  // Log the houses in sessionStorage

    const house = existingHouses.find(house => house.houseId === houseId);
    console.log('House found:', house);  // Log the found house

    if (house) {
        if (typeof house.houseAmenities === 'string') {
            house.houseAmenities = house.houseAmenities.split(',').map(amenity => amenity.trim());
        }
        renderHouseDetails(house);
    } else {
        houseDetail.innerHTML = "<p>House not found.</p>";
    }
}

function getRandomPhrase() {
    const phrases = [
        "Discover this",
        "Check out this",
        "Step into this",
        "Unveil the charm of this",
        "Dive into this",
        "Behold this stunning",
        "Experience the beauty of this",
        "Get ready to explore this",
        "Welcome to your future",
        "Imagine life in this"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function renderHouseDetails(house) {
    const userId = localStorage.getItem('user_id');
    let currentIndex = 0; // Start with the profile image as active

    const houseDisplayImagesHtml = [house.houseProfileImage, ...house.displayImages].map((img, index) => {
        const imageUrl = index === 0 
            ? `${API.profileImage}${img}` 
            : `${API.displayImages}${img}`;
        
        return `<div class="image-box">
                    <img src="${imageUrl}" alt="House Image" class="gallery-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                </div>`;
    }).join(''); 

    const [latitude, longitude, locationName] = house.houseLocation.split(', ');

    let videoSectionHtml = '';
    if (house.videoUrl) {
        videoSectionHtml = ` 
            <h3>House Video</h3>
            <video width="100%" controls>
                <source src="${API.houseVideo}${house.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }

    const phrase = getRandomPhrase(); 
    const bedroomsHtml = house.houseBedrooms > 0 ? `<span class="icon-container"><i class="fa fa-bed"></i> ${house.houseBedrooms}</span>` : '';
    const bathroomsHtml = house.houseBathrooms > 0 ? `<span class="icon-container"><i class="fa fa-shower"></i> ${house.houseBathrooms}</span>` : '';

    const priceLabel = house.transactionType.toLowerCase() === "rent" || house.transactionType.toLowerCase() === "office" ? "per month" : "per night";
    const formattedPrice = `Ksh ${house.housePrice.toLocaleString()}`;
    const rentalTerms = house.transactionType.toLowerCase() === 'rent'
        ? 'Lease agreement terms for this rental property apply'
        : house.transactionType.toLowerCase() === 'buy'
        ? 'Once purchased, this house is yours to own'
        : 'Terms and conditions apply';

    houseDetail.innerHTML = `
        <p><strong>${phrase}</strong> ${house.houseType}</p>    
        <div class="house-images-container">
            <img id="active-image" class="active-image" src="${API.profileImage}${house.houseProfileImage}" alt="Active Image">
            <div class="image-gallery">
                ${houseDisplayImagesHtml}
            </div>
        </div>
        <h2>${house.houseTitle}</h2>
        <div class="icon-row">
            ${bedroomsHtml}
            ${bathroomsHtml}
        </div>
        <div class="booking-container">
            <p><strong>${house.transactionType === 'buy' ? 'Own this dream' : 'Rent this'} ${house.houseType}!</strong> - 
            <span>${formattedPrice}</span> ${priceLabel}</p>
        </div>
        <p><strong>Amenities & Features</strong></p>
        <div id="amenity-container" class="amenity-container"></div>
        <div class="info-row">
            <div class="info-container">
                <p><strong>Description:</strong> ${house.houseDescription}</p>
            </div>
            <div class="info-container">
                <p><strong>${rentalTerms}:</strong> ${house.rentalTerms}</p>
            </div>
        </div>
        ${videoSectionHtml}
        <div id="map" style="height: 400px; width: 100%;"></div>
        <div class="info-row">
            <div class="info-container">
                <p><strong>Location:</strong> 
                    <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" class="location-link">
                        📍 ${locationName.trim()}
                    </a>
                </p>
            </div>
            <div class="info-container">
                ${userId !== String(house.userId) ? '<button id="startChatBtn">Start Chat</button>' : ''}
            </div>
        </div>
        <p><strong>Listed by:</strong> ${house.userFullname}</p>
    `;

    const amenityIcons = new AmenityIcons("amenity-container");
    amenityIcons.renderAmenities(house.houseAmenities, (amenity) => `
        <div class="amenity-item">
            <i class="${amenity.icon}"></i>
            <p>${amenity.label}</p>
        </div>
    `);

    const map = L.map('map').setView([latitude, longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`<b>${house.houseTitle}</b><br>${locationName.trim()}`)
        .openPopup();

    function updateImageGallery() {
        const images = document.querySelectorAll('.gallery-image');
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex); // Toggle active class
        });

        const currentImage = currentIndex === 0 
            ? `${API.profileImage}${house.houseProfileImage}` 
            : `${API.displayImages}${house.displayImages[currentIndex - 1]}`;

        document.getElementById('active-image').src = currentImage; // Update active image display
    }

    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            updateImageGallery();
        });
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % (house.displayImages.length + 1); // Include profile image
        updateImageGallery();
    }, 5000);

    updateImageGallery();

    if (userId !== String(house.userId)) {
        document.getElementById("startChatBtn").addEventListener("click", () => {
            if (!userId) {
                alert("You need to log in to start a chat.");
                return;
            }
            startChat(house);
        });
    }
}

function startChat(house) {
    const userId = localStorage.getItem('user_id'); 
    const userName = house.userFullname; 
    const receiverId = house.userId; 
    const propertyId = house.houseId; 

    window.location.href = `/HTML/Features/inbox.html?senderId=${userId}&senderName=${userName}&receiverId=${receiverId}&propertyId=${propertyId}`;
}

backBtn.addEventListener("click", () => {
    window.history.back();
});

loadHouseDetails();
