class API {
    static hostConnect = "http://class-26.com/Okumu_Christopher/api_cristatepro";

    // Profile images
    static get profileImage() {
        return `${this.hostConnect}/images/houses/house_profile_image/`;
    }

    // Display images
    static get displayImages() {
        return `${this.hostConnect}/images/houses/house_display_image/`;
    }

    // House videos
    static get houseVideo() {
        return `${this.hostConnect}/videos/`;
    }

    // Sign up user
    static get signUpUser() {
        return `${this.hostConnect}/user/signup.php`;
    }

    // Log in user
    static get signInUser() {
        return `${this.hostConnect}/user/signin.php`;
    }

    // Reset password
    static get resetPassword() {
        return `${this.hostConnect}/user/reset_password.php`;
    }

    // Check email for reset password
    static get checkEmail() {
        return `${this.hostConnect}/user/check_email.php`;
    }

    // Send user feedback
    static get sendUserFeedback() {
        return `${this.hostConnect}/user/feedback.php`;
    }

    // Update user profile picture
    static get updateUserProfile() {
        return `${this.hostConnect}/user/update_user_image.php`;
    }

    // Update user info
    static get updateUserInfo() {
        return `${this.hostConnect}/user/update_user_info.php`;
    }

    // Delete user profile picture
    static get deleteProfilePicture() {
        return `${this.hostConnect}/user/delete_user_image.php`;
    }

    // Fetch all houses
    static get allHouses() {
        return `${this.hostConnect}/user/fetch_all_houses.php`;
    }

    // Rate houses
    static get houseRating() {
        return `${this.hostConnect}/user/house_rating.php`;
    }

    // Home decor image
    static get homeDecorImage() {
        return `${this.hostConnect}/images/home_decor/`;
    }

    // Home decor
    static get homeDecor() {
        return `${this.hostConnect}/user/home_decor.php/`;
    }

    // Chat app
    static get chatApp() {
        return `${this.hostConnect}/user/chats.php/`;
    }

    // Fetch chats
    static get chatFetch() {
        return `${this.hostConnect}/user/chats_fetch.php/`;
    }

    // House architects
    static get houseArchitects() {
        return `${this.hostConnect}/user/house_architects.php/`;
    }

    // House architects image
    static get houseArchitectsImage() {
        return `${this.hostConnect}/images/house_architects/`;
    }

    // Add/remove favourite house
    static get favouriteHouse() {
        return `${this.hostConnect}/user/add_remove_favourite_houses.php`;
    }

    // Fetch all favourite houses
    static get allFavHouses() {
        return `${this.hostConnect}/user/fetch_fav_houses.php`;
    }

    // Update admin profile picture
    static get updateAdminProfile() {
        return `${this.hostConnect}/admin/update_admin_image.php`;
    }

    // Delete admin profile picture
    static get deleteAdminProfilePicture() {
        return `${this.hostConnect}/admin/delete_admin_image.php`;

    }

    // Log in admin
    static get signInAdmin() {
        return `${this.hostConnect}/admin/signin.php`;
    }

    // House registration
    static get houseRegistration() {
        return `${this.hostConnect}/admin/house.php`;
    }

    // House deletion
    static get houseDeletion() {
        return `${this.hostConnect}/admin/delete_admin_house.php`;
    }

    // House update
    static get houseUpdate() {
        return `${this.hostConnect}/admin/update_house.php`;
    }

    // Fetch admin houses
    static get currentAdminHouses() {
        return `${this.hostConnect}/admin/admin_houses.php`;
    }

    // Subscription update
    static get subscription() {
        return `${this.hostConnect}/user/subscription.php`;
    }

    // Subscription fetching
    static get getSubscription() {
        return `${this.hostConnect}/user/get_subscription.php`;
    }

    // Subscription decrementing
    static get decrementSubscription() {
        return `${this.hostConnect}/user/decrement_subscription.php`;
    }
}
