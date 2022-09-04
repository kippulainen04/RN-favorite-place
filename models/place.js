class Place { //define a blueprint for place object
    constructor(title, imageUri, address, location) {
        this.title = title;
        this.imageUrl = imageUri;
        this.address = address;
        this.location = location; // { lat: 0.141241, lng: 127.121 }
        this.id = new Date().toString() + Math.random().toString();
    }
}