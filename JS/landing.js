document.addEventListener("DOMContentLoaded", function () {

    const propertyList = document.getElementById("property-list");
    const getStartedButton = document.querySelector(".cta-btn.primary");
    const exploreListingsButton = document.querySelector(".cta-btn.secondary");
    const userLoggedIn = !!localStorage.getItem("user_email");
    
    const houseData = [
        {
            id: 1,
            image: "https://plus.unsplash.com/premium_photo-1666211974795-1d1e0245043b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyJTIwYm5ifGVufDB8fDB8fHww",
            title: "Air BNB",
            description: "Discover exceptional short-term stays at prime locations with Air BNB listings on CrisTatePro. Ideal for travelers or temporary accommodations, our Air BNB options are crafted for comfort and convenience.",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            title: "Office",
            description: "Find the perfect office space for your business on CrisTatePro. From creative studios to executive suites, our listings cater to a wide range of professional needs and environments.",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2UlMjBmb3JzYWxlfGVufDB8fDB8fHww",
            title: "Rental",
            description: "Explore diverse rental properties for long-term living. CrisTatePro offers a seamless search experience, helping you find a home that matches your lifestyle and budget.",
        },
        {
            id: 4,
            image: "https://plus.unsplash.com/premium_photo-1686782502531-feb0e6a56eb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVudGFsfGVufDB8fDB8fHww",
            title: "For Sale",
            description: "Looking to buy a new home? Browse through our selection of homes for sale on CrisTatePro, featuring properties that offer the best in style, space, and amenities.",
        }
    ];

    window.checkLoginAndRedirect = function(event, targetUrl) {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
           
            event.preventDefault();
            
     
            alert("You need to log in to access your chats.");

          
           
        } else {
          
            window.location.href = targetUrl;
        }
    };
    
    // Function to load house cards
    function loadHouseCards() {
        houseData.forEach(house => {
            const card = document.createElement("div");
            card.className = "house-card";
            card.style.backgroundImage = `url(${house.image})`;
            
            card.innerHTML = `
                <h3>${house.title}</h3>
                <div class="details">
                    <p>${house.description}</p>
                </div>
            `;
            propertyList.appendChild(card);
        });
    }

    
    if (userLoggedIn) {
        getStartedButton.style.display = "none";
    }

    getStartedButton.addEventListener("click", function (event) {
        if (!userLoggedIn) {
            event.preventDefault(); 
            window.location.href = "/HTML/Authentication/login.html";  
        }
    });

 
    exploreListingsButton.addEventListener("click", function (event) {
        event.preventDefault();  
        window.location.href = "houselist.html";  
    });

    loadHouseCards();

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

    // Scroll to Features Function
    window.scrollToFeatures = function(event) {
        event.preventDefault();
        const featuresSection = document.getElementById("features");
        featuresSection.scrollIntoView({ behavior: "smooth" });
    };
});
