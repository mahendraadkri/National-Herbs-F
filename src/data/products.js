// products.js
import scarShinePng from "../assets/banner001.png"
export const CATEGORIES = ["New Arrivals", "Bestseller", "Special"];

// demo data — replace with your API later
export const PRODUCTS = [
    {
        id: "scar-shine",
        name: "Scar Shine Moisturizing Cream",
        price: 599,
        rating: 4.5,
        image: scarShinePng, // import from /src/assets
        tags: ["New Arrivals", "Bestseller"],
    },
    {
        id: "p1",
        name: "Aloe Vera Facewash",
        price: 399,
        rating: 4.6,
        category: "Skincare",
        image: "/assets/products/aloe-facewash.jpg",
        images: ["/assets/products/aloe-facewash.jpg"],
        description:
            "Hydrating and soothing facewash with pure Aloe Vera for daily use.",
    },
    {
        id: "p2",
        name: "Scar Shine Cream",
        price: 549,
        rating: 4.8,
        category: "Skincare",
        image: "/assets/products/scar-shine.jpg",
        images: ["/assets/products/scar-shine.jpg"],
        description:
            "Targets spots and scars with natural actives for an even skin tone.",
    },
    {
        id: "p3",
        name: "Tulsi Herbal Tea",
        price: 299,
        rating: 4.5,
        category: "Wellness",
        image: "/assets/products/tulsi-tea.jpg",
        images: ["/assets/products/tulsi-tea.jpg"],
        description:
            "A calming, antioxidant-rich tea for everyday balance and clarity.",
    },
    // ...add the rest you already had
];
