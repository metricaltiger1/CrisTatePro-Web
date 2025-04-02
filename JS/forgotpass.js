// Function to show alert message
function showAlert(message) {
    const alertMessage = document.getElementById("alert-message");
    alertMessage.textContent = message;
    alertMessage.style.display = "block";
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000);
}

// Function to toggle password visibility
function togglePassword(id, element) {
    const passwordField = document.getElementById(id);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        element.textContent = "🙈";
    } else {
        passwordField.type = "password";
        element.textContent = "👁️";
    }
}

// Verify Email Button
document.getElementById('verify-email-btn').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const loadingOverlay = document.getElementById('loading-overlay');

    if (!email) {
        showAlert("Please enter your email address.");
        return;
    }

    loadingOverlay.style.display = "flex";

    try {
        const response = await fetch(`${API.checkEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ email: email })
        });

        const text = await response.text();

        if (!response.ok) {
            showAlert("An error occurred. Please try again.");
            return;
        }

        const result = JSON.parse(text);

        if (result.success) {
            toggleSections('phone-verification', 'email-verification');
            document.getElementById('first-name').innerText = result.firstname || "UserFirstName";
            document.getElementById('last-name').innerText = result.lastname || "UserLastName";
            const originalPhone = result.phone 
            window.originalPhoneNumber = originalPhone; 
            document.getElementById('masked-phone').innerText = maskPhoneNumber(originalPhone);
        } else {
            showAlert(result.message || "Email not found.");
        }
    } catch (error) {
        showAlert("An error occurred during email verification. Please try again.");
    } finally {
        loadingOverlay.style.display = "none";
    }
});

// Function to mask phone number
function maskPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{4})(\d+)/, '$1****$3');
}

// Verify Phone Button
document.getElementById('verify-phone-btn').addEventListener('click', function () {
    const userInputPhone = document.getElementById('phone-number').value.trim();

   
    if (userInputPhone.length !== window.originalPhoneNumber.length) {
        showAlert("Please enter a valid phone number.");
        return;
    }

 
    if (userInputPhone === window.originalPhoneNumber) {
        // Proceed to the password reset section if the phone number matches
        toggleSections('password-reset', 'phone-verification');
    } else {
        showAlert("The phone number does not match. Please try again.");
    }
});

// Reset Password Button
document.getElementById('reset-password-btn').addEventListener('click', async function () {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMessage = document.getElementById('loading-message');

    if (!newPassword || !confirmPassword) {
        showAlert("Please fill in both password fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert("Passwords do not match!");
        return;
    }

    // Update loading message for password reset
    loadingMessage.textContent = "Resetting your password, please wait...";
    loadingOverlay.style.display = "flex"; 

    try {
        const response = await fetch(API.resetPassword, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: document.getElementById('email').value, 
                new_password: newPassword 
            })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('success-first-name').innerText = document.getElementById('first-name').innerText;
            toggleSections('success-message', 'password-reset');
            startCountdown();
        } else {
            showAlert("Failed to reset the password: " + data.message);
        }
    } catch (error) {
        showAlert("An error occurred while resetting the password. Please try again.");
    } finally {
        loadingOverlay.style.display = "none"; 
    }
});


// Navigation Buttons
document.getElementById('back-to-login-btn').addEventListener('click', redirectToLogin);
document.getElementById('back-to-login-phone-btn').addEventListener('click', redirectToLogin);
document.getElementById('back-to-login-reset-btn').addEventListener('click', redirectToLogin);

// Helper Functions
function toggleSections(showId, hideId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

function redirectToLogin() {
    window.location.href = '/HTML/Authentification/login.html';
}

function startCountdown() {
    let countdownValue = 15;
    const countdownElement = document.getElementById('countdown');
    const interval = setInterval(() => {
        if (countdownValue > 0) {
            countdownValue--;
            countdownElement.innerText = countdownValue;
        } else {
            clearInterval(interval);
            window.location.href = '/HTML/Authentification/login.html';
        }
    }, 1000);
}
