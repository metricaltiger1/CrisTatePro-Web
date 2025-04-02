// Function to show alert message
function showAlert(message, type) {
    const alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`; // Set class based on type
    alertMessage.style.display = "block";
    setTimeout(() => {
        alertMessage.style.display = "none";
        alertMessage.className = 'alert-message'; // Reset class after hiding
    }, 3000);
}

// Function to toggle password visibility
function togglePassword(id) {
    const passwordField = document.getElementById(id);
    const icon = document.getElementById(`toggle-${id}`);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.textContent = "🙈"; 
    } else {
        passwordField.type = "password";
        icon.textContent = "👁️"; 
    }
}

// Event listener for form submission
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    document.getElementById("loading-overlay").style.display = "flex"; // Show loading overlay

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check for empty fields
    if (!email || !password) {
        showAlert("Please fill in both email and password.", 'error');
        document.getElementById("loading-overlay").style.display = "none"; // Hide loading
        return;
    }

    try {
        // Sending login request to the server
        const response = await fetch(API.signInUser, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                email: email,
                password: password,
            }),
        });

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.success) {
            // Save user data to localStorage
            const userData = result.userData;
            localStorage.setItem("user_id", userData.user_id);
            localStorage.setItem("user_firstname", userData.user_firstname);
            localStorage.setItem("user_lastname", userData.user_lastname);
            localStorage.setItem("phoneNumber", userData.phoneNumber);
            localStorage.setItem("user_email", userData.user_email);
            localStorage.setItem("user_profileImage", userData.user_profileImage); 

            showAlert(result.message, 'success'); // Show success alert
            setTimeout(() => {
                window.location.href = "/HTML/Pages/landing.html"; // Redirect to profile
            }, 500); 
        } else {
            console.error("Login error:", result.message);
            showAlert(result.message, 'error'); // Show error alert
        }
    } catch (error) {
        console.error("Error during login:", error);
        showAlert("An error occurred during login. Please try again.", 'error'); // Show error alert
    } finally {
        document.getElementById("loading-overlay").style.display = "none"; // Hide loading overlay
    }
});
