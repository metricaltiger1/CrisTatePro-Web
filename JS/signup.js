function togglePassword(id) {
    const passwordField = document.getElementById(id);
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;

    const icon = document.getElementById(`toggle-${id}`);
    icon.textContent = type === "password" ? "👁️" : "🙈";
}

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

document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Show loading overlay
    document.getElementById("loading-overlay").style.display = "flex";

    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const phoneNumber = document.getElementById("phone").value; // Get phone number
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        showAlert("Passwords do not match!", 'error');
        document.getElementById("loading-overlay").style.display = "none"; // Hide loading overlay
        return;
    }

    try {
        const response = await fetch(API.signUpUser, { // Use the API class to get the sign-up URL
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber, // Include phone number in the request
                email: email,
                password: password,
            }),
        });

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.success) {
            // Clear textboxes on successful registration
            document.getElementById("signup-form").reset();
            showAlert(result.message, 'success'); // Show success message
        } else {
            console.error("Registration error:", result.message);
            showAlert(result.message, 'error'); // Show error message
        }
    } catch (error) {
        console.error("Error during registration:", error);
        showAlert("An error occurred during registration. Please try again.", 'error'); // Show error message
    } finally {
        // Hide loading overlay after process
        document.getElementById("loading-overlay").style.display = "none";
    }
});
