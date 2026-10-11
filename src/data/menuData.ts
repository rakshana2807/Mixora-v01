export interface DrinkItem {
  id: string;
  name: string;
  base: string;
  description: string;
  basePrice: number;
  imageColor: string;
  featured?: boolean;
  bestSeller?: boolean;
  category: string;
  availableSizes: ('Small' | 'Medium' | 'Large')[];
}

export interface BobaOption {
  price: number;
  color: string;
  type: 'tapioca' | 'tapioca_mini' | 'crystal' | 'popping';
}

export interface JellyOption {
  price: number;
  color: string;
  type: 'cube' | 'round' | 'bean' | 'pudding_layer';
}

export interface MilkFoamOption {
  price: number;
  color?: string;
  type?: 'foam' | 'whip' | 'scoop';
}

export interface SyrupOption {
  price: number;
  color: string;
}

export interface GarnishOption {
  price: number;
  type: string;
}

export interface CustomizerState {
  baseDrinkId: string;
  size: 'Small' | 'Medium' | 'Large';
  sugar: '0%' | '25%' | '50%' | '75%' | '100%';
  ice: 'No Ice' | 'Less Ice' | 'Regular Ice' | 'Extra Ice';
  bobas: string[];
  jellies: string[];
  milks_foams: string[];
  syrups: string[];
  garnishes: string[];
}

export interface CartItem {
  id: string;
  drinkId: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  sugar: string;
  ice: string;
  bobas: string[];
  jellies: string[];
  milks_foams: string[];
  syrups: string[];
  garnishes: string[];
  unitPrice: number;
  quantity: number;
  imageColor: string;
}

export const MENU_DATA: DrinkItem[] = [
  { id: "d_classic_milk_tea", name: "Classic Milk Tea", base: "tea", description: "Our signature blend of premium black tea and rich milk.", basePrice: 99, imageColor: "#C19A6B", featured: true, bestSeller: true, category: "Milk Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_brown_sugar_boba", name: "Brown Sugar Boba Milk Tea", base: "milk", description: "Rich brown sugar with milk and pearls.", basePrice: 129, imageColor: "#8B4513", featured: true, bestSeller: true, category: "Brown Sugar Boba", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_taro_milk_tea", name: "Taro Milk Tea", base: "milk", description: "Sweet, creamy taro with a gorgeous purple hue.", basePrice: 139, imageColor: "#D8BFD8", featured: false, bestSeller: false, category: "Milk Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_thai_milk_tea", name: "Thai Milk Tea", base: "tea", description: "Authentic Thai tea with sweet condensed milk.", basePrice: 119, imageColor: "#FF8C00", featured: true, bestSeller: true, category: "Milk Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_jasmine_green", name: "Jasmine Green Tea", base: "tea", description: "Light and floral jasmine green tea.", basePrice: 99, imageColor: "#E0FFDD", featured: false, bestSeller: false, category: "Fruit Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_matcha_latte", name: "Matcha Latte", base: "matcha", description: "Ceremonial grade matcha with steamed milk.", basePrice: 119, imageColor: "#8FBC8F", featured: true, bestSeller: true, category: "Matcha", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_strawberry_matcha", name: "Strawberry Matcha Latte", base: "matcha", description: "Matcha layered with sweet strawberry milk.", basePrice: 149, imageColor: "#FF6B81", featured: true, bestSeller: true, category: "Matcha", availableSizes: ["Medium", "Large"] },
  { id: "d_mango_green", name: "Mango Green Tea", base: "fruit", description: "Refreshing green tea with real mango pieces.", basePrice: 109, imageColor: "#FFC857", featured: false, bestSeller: false, category: "Fruit Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_passion_fruit", name: "Passion Fruit Tea", base: "fruit", description: "Tart and sweet passion fruit green tea.", basePrice: 119, imageColor: "#FFB347", featured: false, bestSeller: false, category: "Fruit Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_lychee_rose", name: "Lychee Rose Tea", base: "fruit", description: "Floral rose tea with sweet lychee.", basePrice: 129, imageColor: "#FF6B81", featured: false, bestSeller: false, category: "Fruit Tea", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_strawberry_milk", name: "Strawberry Milk", base: "milk", description: "Sweet strawberry blended with creamy milk.", basePrice: 119, imageColor: "#FF8597", featured: false, bestSeller: false, category: "Milkshakes", availableSizes: ["Small", "Medium", "Large"] },
  { id: "d_mango_smoothie", name: "Mango Smoothie", base: "smoothie", description: "Blended fresh golden mango smoothie.", basePrice: 149, imageColor: "#FFC857", featured: true, bestSeller: true, category: "Smoothies", availableSizes: ["Medium", "Large"] },
  { id: "d_strawberry_milkshake", name: "Strawberry Milkshake", base: "milkshake", description: "Classic thick strawberry velvet shake.", basePrice: 139, imageColor: "#FF6B81", featured: true, bestSeller: false, category: "Milkshakes", availableSizes: ["Medium", "Large"] },
  { id: "d_mango_passion", name: "Mango Passion Fruit Tea", base: "fruit", description: "Tropical blend of mango and passion fruit.", basePrice: 129, imageColor: "#FFC857", featured: true, bestSeller: true, category: "Fruit Tea", availableSizes: ["Small", "Medium", "Large"] }
];

export const INGREDIENTS = {
  size_surcharge: { "Small": 0, "Medium": 15, "Large": 30 },
  bobas: {
    "Classic Black Tapioca Pearls": { price: 15, color: "#1A1A1A", type: "tapioca" },
    "Brown Sugar Tapioca Pearls": { price: 20, color: "#3E2723", type: "tapioca" },
    "Mini Tapioca Pearls": { price: 15, color: "#1A1A1A", type: "tapioca_mini" },
    "Crystal Boba": { price: 20, color: "#FFFFFF", type: "crystal" },
    "Golden Boba": { price: 20, color: "#FFC857", type: "crystal" },
    "Strawberry Popping Boba": { price: 25, color: "#FF6B81", type: "popping" },
    "Mango Popping Boba": { price: 25, color: "#FFC857", type: "popping" },
    "Rainbow Popping Boba": { price: 30, color: "rainbow", type: "popping" }
  } as Record<string, BobaOption>,
  jellies: {
    "Coconut Jelly": { price: 15, color: "#FFFFFF", type: "cube" },
    "Mango Jelly": { price: 15, color: "#FFC857", type: "cube" },
    "Strawberry Jelly": { price: 15, color: "#FF6B81", type: "cube" },
    "Grass Jelly": { price: 15, color: "#2F4F4F", type: "cube" },
    "Aloe Vera Cubes": { price: 20, color: "#A8D5BA", type: "cube" },
    "Egg Pudding": { price: 20, color: "#FFF8DC", type: "pudding_layer" }
  } as Record<string, JellyOption>,
  milks_foams: {
    "Regular Milk": { price: 0 },
    "Oat Milk": { price: 20 },
    "Soy Milk": { price: 15 },
    "Vanilla Sweet Cream": { price: 25, color: "#FFF7ED", type: "foam" },
    "Whipped Cream": { price: 20, color: "#FFF", type: "whip" },
    "Matcha Foam": { price: 25, color: "#A8D5BA", type: "foam" },
    "Strawberry Foam": { price: 25, color: "#FF6B81", type: "foam" },
    "Vanilla Ice Cream Scoop": { price: 30, color: "#FFF7ED", type: "scoop" }
  } as Record<string, MilkFoamOption>,
  syrups: {
    "Brown Sugar Syrup": { price: 15, color: "#3E2723" },
    "Strawberry Syrup": { price: 15, color: "#FF6B81" },
    "Mango Syrup": { price: 15, color: "#FFC857" },
    "Caramel Syrup": { price: 15, color: "#D2691E" },
    "Vanilla Syrup": { price: 15, color: "#FFF7ED" },
    "Honey": { price: 15, color: "#FFC857" }
  } as Record<string, SyrupOption>,
  garnishes: {
    "Fresh Strawberry": { price: 15, type: "fruit" },
    "Mango Cubes": { price: 15, type: "fruit" },
    "Mint Leaves": { price: 10, type: "garnish" },
    "Lemon Slices": { price: 10, type: "fruit" }
  } as Record<string, GarnishOption>
};
