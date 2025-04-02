class AmenityIcons {
  // Map of amenity names to corresponding Material Icons classes
  static amenityIcons = {
    'Swimming Pool': 'pool',
    'Gym': 'fitness_center',
    'Security': 'security',
    'Garden': 'eco',
    'Clubhouse': 'house',
    'Free WiFi': 'wifi',
    'Playground': 'child_friendly',
    'BBQ Area': 'local_fire_department',
    'Sauna': 'spa',
    'Jacuzzi': 'bathtub',
    'Library': 'menu_book',
    'Business Center': 'business',
    'Cafeteria': 'restaurant',
    'Air conditioning': 'ac_unit',
    'Kitchen': 'kitchen',
    'Heating': 'whatshot',
    'TV': 'tv',
    'Washing machine': 'local_laundry_service',
    'Dryer': 'dry',
    'Free parking on premises': 'local_parking',
    'Dishwasher': 'palette',
    'Hot tub': 'hot_tub',
    'Elevator': 'elevator',
    'Fireplace': 'fireplace',
    'Balcony': 'alt_route',
    'Patio': 'pallet',
    'Roof deck': 'roofing',
    'Pet-friendly': 'pets',
    'Smart Home Technology': 'phone_android',
    'Home Theater': 'theaters',
    'Wine Cellar': 'wine_bar',
    'Fitness Center': 'fitness_center',
    'Billiards Room': 'sports_bar',
    'Tennis Court': 'sports_tennis',
    'Basketball Court': 'sports_basketball',
    'Yoga Studio': 'self_improvement',
    'Spa': 'spa',
    'Game Room': 'sports_esports',
    'Laundry Service': 'local_laundry_service',
    'Car Wash Service': 'local_car_wash',
    'Bike Storage': 'directions_bike',
    'On-site Maintenance': 'build',
    '24-hour Security': 'security',
    'Valet Parking': 'local_parking',
    'Shuttle Service': 'directions_bus',
    'Private Beach Access': 'beach_access',
    'Furnished': 'weekend',
    'Walk-in Closets': 'airline_seat_individual_suite',
    'High-speed Internet': 'wifi',
    'Electric Vehicle Charging Stations': 'ev_station',
  };

  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with ID '${containerId}' not found.`);
    }
  }

  // Method to create an amenity card element
  createAmenityElement(amenity) {
    const iconClass = AmenityIcons.amenityIcons[amenity];
    if (iconClass) {
      const amenityCard = document.createElement('div');
      amenityCard.classList.add('amenity-card');

      // Create the icon element
      const iconElement = document.createElement('i');
      iconElement.classList.add('material-icons', 'amenity-icon');
      iconElement.textContent = iconClass;  // Set the icon name

      // Create the text element for the amenity name
      const textElement = document.createElement('span');
      textElement.classList.add('amenity-name');
      textElement.textContent = amenity;

      // Append the icon and text to the amenity card
      amenityCard.appendChild(iconElement);
      amenityCard.appendChild(textElement);

      return amenityCard;
    }
    return null; // Return null if the icon class is not found
  }

  // Method to render amenities in the container
  renderAmenities(amenitiesList) {
    if (this.container) {
      this.container.innerHTML = ''; // Clear previous content
      amenitiesList.forEach(amenity => {
        const amenityElement = this.createAmenityElement(amenity);
        if (amenityElement) {
          this.container.appendChild(amenityElement);
        } else {
          console.warn(`No element created for amenity: ${amenity}`);
        }
      });
    } else {
      console.error(`Container with ID '${this.container.id}' not found.`);
    }
  }
}

// Export the AmenityIcons class as the default export
export default AmenityIcons;
