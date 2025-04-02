// House Model
class HouseModel {
    constructor(
        houseId,
        userId,
        userFullname,
        houseType,
        houseTitle,
        transactionType,
        houseDescription,
        houseBedrooms,
        houseBathrooms,
        houseAmenities,
        rentalTerms,
        contactInfo,
        housePrice,
        houseLocation,
        houseProfileImage,
        createdAt,
        displayImages,
        averageRating,
        totalRatings,
        thumbnailUrl,
        videoUrl
    ) {
        this.houseId = houseId;
        this.userId = userId;
        this.userFullname = userFullname;
        this.houseType = houseType;
        this.houseTitle = houseTitle;
        this.transactionType = transactionType;
        this.houseDescription = houseDescription;
        this.houseBedrooms = houseBedrooms;
        this.houseBathrooms = houseBathrooms;
        this.houseAmenities = houseAmenities;
        this.rentalTerms = rentalTerms;
        this.contactInfo = contactInfo;
        this.housePrice = housePrice;
        this.houseLocation = houseLocation;
        this.houseProfileImage = houseProfileImage;
        this.createdAt = createdAt;
        this.displayImages = displayImages;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.thumbnailUrl = thumbnailUrl;
        this.videoUrl = videoUrl;
    }

    // Factory method to create an instance from JSON
    static fromJson(json) {
        return new HouseModel(
            parseInt(json.house_id || '0'),
            parseInt(json.user_id || '0'),
            json.user_fullname || '',
            json.house_type || '',
            json.house_title || '',
            json.transaction_type || '',
            json.house_description || '',
            json.house_bedrooms || '',
            json.house_bathrooms || '',
            json.house_amenities || '',
            json.rental_terms || '',
            json.contact_info || '',
            parseFloat(json.house_price || '0.0'),
            json.house_location || '',
            json.house_profile_image || '',
            json.created_at || '',
            Array.isArray(json.display_images) ? json.display_images : [],
            parseFloat(json.average_rating || '0.0'),
            parseInt(json.total_ratings || '0'),
            json.video_thumbnail || '',
            json.video_name || ''
        );
    }
}

export default HouseModel;
