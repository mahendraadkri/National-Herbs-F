// products.js
import scarShinePng from "../assets/banner001.png"
export const CATEGORIES = ["New Arrivals", "Bestseller", "Special"];

export const PRODUCTS = [
    {
        id: "scar-shine",
        name: "Scar Shine Moisturizing Cream",
        price: 599,
        rating: 4.5,
        image: scarShinePng, // import from /src/assets
        tags: ["New Arrivals", "Bestseller"],
    },
    // ...
];
