// searchFilter.js
import { renderProperties } from './houseCard.js'; 
import { houseData } from './houseData.js';


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

document.addEventListener("DOMContentLoaded", () => {
    // Load saved filters from localStorage
    const savedFilters = JSON.parse(localStorage.getItem("filters"));
    if (savedFilters) {
        searchField.value = savedFilters.searchValue || "";
        countyField.value = savedFilters.countyValue || "";
        propertyTypeField.value = savedFilters.propertyTypeValue || "";
        minPriceField.value = savedFilters.minPriceValue || "";
        maxPriceField.value = savedFilters.maxPriceValue || "";
        bedroomsField.value = savedFilters.bedroomsValue || "";
        bathroomsField.value = savedFilters.bathroomsValue || "";
        amenitiesField.value = savedFilters.amenitiesValue || "";
    }

    filterHouses(); 
    setupClearButtons();
    document.getElementById("remove-all-filters").addEventListener("click", clearAllFilters);
    setupSearchFilterToggle();
});

// Selectors
const searchField = document.getElementById("search");
const countyField = document.getElementById("county");
const propertyTypeField = document.getElementById("property-type");
const minPriceField = document.getElementById("min-price");
const maxPriceField = document.getElementById("max-price");
const bedroomsField = document.getElementById("bedrooms");
const bathroomsField = document.getElementById("bathrooms");
const amenitiesField = document.getElementById("amenities");

const searchToggle = document.getElementById("search-toggle");
const filterToggle = document.getElementById("filter-toggle");
const filterSection = document.querySelector(".filter");
const searchContainer = document.querySelector(".input-container:first-child").parentElement;

function filterHouses() {
    const searchValue = searchField.value.toLowerCase();
    const countyValue = countyField.value.toLowerCase();
    const propertyTypeValue = propertyTypeField.value;
    const minPriceValue = parseFloat(minPriceField.value);
    const maxPriceValue = parseFloat(maxPriceField.value);
    const bedroomsValue = bedroomsField.value;
    const bathroomsValue = bathroomsField.value;
    const amenitiesValue = amenitiesField.value.toLowerCase();

    localStorage.setItem("filters", JSON.stringify({
        searchValue,
        countyValue,
        propertyTypeValue,
        minPriceValue,
        maxPriceValue,
        bedroomsValue,
        bathroomsValue,
        amenitiesValue
    }));

    const filteredHouses = houseData.filter(house => {
        const matchesSearch = 
            house.houseTitle.toLowerCase().includes(searchValue) || 
            house.houseLocation.toLowerCase().includes(searchValue);
        const matchesCounty = countyValue === "" || house.houseLocation.toLowerCase().includes(countyValue);
        const matchesType = propertyTypeValue === "" || house.houseType === propertyTypeValue;
        const matchesPrice = 
            (isNaN(minPriceValue) || house.housePrice >= minPriceValue) &&
            (isNaN(maxPriceValue) || house.housePrice <= maxPriceValue);
        const matchesBedrooms = bedroomsValue === "" || house.houseBedrooms === bedroomsValue;
        const matchesBathrooms = bathroomsValue === "" || house.houseBathrooms === bathroomsValue;
        const matchesAmenities = amenitiesValue === "" || house.houseAmenities.toLowerCase().includes(amenitiesValue);
        
        return matchesSearch && matchesCounty && matchesType && matchesPrice && matchesBedrooms && matchesBathrooms && matchesAmenities;
    });


    renderProperties(filteredHouses);
}

function setupClearButtons() {
    const inputs = document.querySelectorAll(".input-container input");
    inputs.forEach(input => {
        const clearButton = input.nextElementSibling;
        clearButton.addEventListener("click", () => {
            input.value = "";
            filterHouses();
        });
        
        input.addEventListener("input", () => {
            clearButton.style.display = input.value ? "inline" : "none";
        });
    });
}

function clearAllFilters() {
    searchField.value = "";
    countyField.value = "";
    propertyTypeField.value = "";
    minPriceField.value = "";
    maxPriceField.value = "";
    bedroomsField.value = "";
    bathroomsField.value = "";
    amenitiesField.value = "";

    localStorage.removeItem("filters");
    filterHouses();
}
function setupSearchFilterToggle() {
    
    searchContainer.style.display = "none"; 
    filterSection.style.display = "none"; 

    let previousScrollPosition = 0; 

    searchToggle.addEventListener("click", () => {
        const isSearchVisible = searchContainer.style.display === "block";

        if (isSearchVisible) {
        
            searchContainer.style.display = "none";
            window.scrollTo(0, previousScrollPosition); 
        } else {
          
            previousScrollPosition = window.scrollY; 
            filterSection.style.display = "none"; 
            searchContainer.style.display = "block";
            window.scrollTo(0, 0); 
        }
    });

    filterToggle.addEventListener("click", () => {
        const isFilterVisible = filterSection.style.display === "block";

        if (isFilterVisible) {

            filterSection.style.display = "none";
            window.scrollTo(0, previousScrollPosition); 
        } else {
        
            previousScrollPosition = window.scrollY; 
            searchContainer.style.display = "none"; 
            filterSection.style.display = "block";
            window.scrollTo(0, 0); 
        }
    });
}



// Event listeners for filters
searchField.addEventListener("input", filterHouses);
countyField.addEventListener("input", filterHouses);
propertyTypeField.addEventListener("change", filterHouses);
minPriceField.addEventListener("input", filterHouses);
maxPriceField.addEventListener("input", filterHouses);
bedroomsField.addEventListener("change", filterHouses);
bathroomsField.addEventListener("change", filterHouses);
amenitiesField.addEventListener("input", filterHouses);
