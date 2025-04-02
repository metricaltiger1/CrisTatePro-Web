// Retrieve user data from localStorage
const firstName = localStorage.getItem("user_firstname");
const lastName = localStorage.getItem("user_lastname");
const phoneNumber = localStorage.getItem("phoneNumber");
const email = localStorage.getItem("user_email");
let profileImage = localStorage.getItem("user_profileImage");
const defaultProfileImage = "path/to/default/profile/image.png"; // Set the path to your default image

// If no user is logged in, redirect to login page
if (!email) {
    window.location.href = "login.html";
} else {
    // Combine first name and last name into a single name
    const userName = `${firstName} ${lastName}`;
    // Populate the profile with the user's data
    document.getElementById("user-name").textContent = userName;
    document.getElementById("phone-number").textContent = phoneNumber;
    document.getElementById("user-email").textContent = email;

    // For profile image, display the Base64 string or the default image if none exists
    document.getElementById("profile-image").src = profileImage ? `data:image/png;base64,${profileImage}` : defaultProfileImage;
}

// Show user info edit section on button click
document.getElementById("edit-info-btn").addEventListener("click", function () {
    // Preload existing data into input fields
    document.getElementById("first-name").value = firstName;
    document.getElementById("last-name").value = lastName;
    document.getElementById("phone-number-edit").value = phoneNumber;

    // Show the edit section for user info
    document.getElementById("edit-info-section").style.display = "block";
});

// Save user info changes functionality
document.getElementById("save-info-btn").addEventListener("click", function () {
    const updatedFirstName = document.getElementById("first-name").value;
    const updatedLastName = document.getElementById("last-name").value;
    const updatedPhoneNumber = document.getElementById("phone-number-edit").value;
    const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage

    // Prepare form data for the update
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("first_name", updatedFirstName);
    formData.append("last_name", updatedLastName);
    formData.append("phone", updatedPhoneNumber);

    // Update localStorage
    localStorage.setItem("user_firstname", updatedFirstName);
    localStorage.setItem("user_lastname", updatedLastName);
    localStorage.setItem("phoneNumber", updatedPhoneNumber);

    // Make API request to update user info
    fetch(API.updateUserInfo, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update displayed profile info
            const userName = `${updatedFirstName} ${updatedLastName}`;
            document.getElementById("user-name").textContent = userName;
            document.getElementById("phone-number").textContent = updatedPhoneNumber;

            // Hide edit info section
            document.getElementById("edit-info-section").style.display = "none";
            alert("User info updated successfully!");
        } else {
            alert(data.message); // Show error message from API response
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while updating user info.");
    });
});

// Show profile image edit section on button click
document.getElementById("edit-image-btn").addEventListener("click", function () {
    document.getElementById("image-upload").value = ""; // Clear previous selection
    document.getElementById("edit-image-section").style.display = "block";
});

// Handle image upload preview
document.getElementById("image-upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function () {
        document.getElementById("profile-image-preview").src = reader.result; // Preview selected image
    };
    
    if (file) {
        reader.readAsDataURL(file); // Read the file as a Data URL
    }
});

// Save profile image functionality
document.getElementById("save-image-btn").addEventListener("click", function () {
    const imageUpload = document.getElementById("image-upload").files[0];
    const userId = localStorage.getItem("user_id"); // Assuming user_id is stored in localStorage

    if (imageUpload) {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("newImage", imageUpload); // Add new image to form data

        // Make API request to update user profile image
        fetch(API.updateUserProfile, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    profileImage = reader.result.split(',')[1]; // Get Base64 part
                    localStorage.setItem("user_profileImage", profileImage);
                    document.getElementById("profile-image").src = `data:image/png;base64,${profileImage}`; // Update displayed image
                    alert("Profile image updated successfully!");
                };
                reader.readAsDataURL(imageUpload);
            } else {
                alert(data.message); // Show error message from API response
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while updating profile image.");
        });
    }

    // Hide edit image section
    document.getElementById("edit-image-section").style.display = "none";
});

// Remove image functionality
document.getElementById("remove-image").addEventListener("click", function () {
    profileImage = ""; // Clear the profile image
    localStorage.removeItem("user_profileImage");
    document.getElementById("profile-image").src = defaultProfileImage; // Show default image
});

// Cancel edit functionality for user info
document.getElementById("cancel-info-btn").addEventListener("click", function () {
    document.getElementById("edit-info-section").style.display = "none";
});

// Cancel edit functionality for profile image
document.getElementById("cancel-image-btn").addEventListener("click", function () {
    document.getElementById("edit-image-section").style.display = "none";
    // Restore previous image if available
    if (profileImage) {
        document.getElementById("profile-image-preview").src = `data:image/png;base64,${profileImage}`;
    } else {
        document.getElementById("profile-image-preview").src = defaultProfileImage; // Show default image if no image exists
    }
});

function openFullScreen() {
    const profileImage = document.getElementById("profile-image");
    const fullscreenImage = document.getElementById("fullscreen-image");
    fullscreenImage.src = profileImage.src; // Set the source of the fullscreen image
    document.getElementById("fullscreen-modal").style.display = "flex"; // Show the modal
}

function closeFullScreen() {
    document.getElementById("fullscreen-modal").style.display = "none"; // Hide the modal
}

// Function to update user profile information
function updateUserProfile(firstName, lastName, phoneNumber, email) {
    const userName = `${firstName} ${lastName}`; // Combine first and last names
    document.get
}

// Logout functionality
document.getElementById("logout").addEventListener("click", function () {
    localStorage.clear(); // Clear localStorage

    // Redirect to login page
    window.location.href = "login.html";

    // Prevent going back
    setTimeout(() => {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, null, window.location.href);
        };
    }, 0);
});

