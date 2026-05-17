// ========================================
// MENU CONFIGURATION
// ========================================
const menu = {
  sections: [
    {
      id: 1,
      name: "Tea",
      level: 1,
      unlockCoins: 0,
      items: [
        { id: 1, name: "Green Tea", price: 3.50, gameType: "tea", emoji: "🍵" },
        { id: 2, name: "Strawberry Tea", price: 4.20, gameType: "tea", emoji: "🍓" }
      ]
    },
    {
      id: 2,
      name: "Matcha",
      level: 2,
      unlockCoins: 20,
      items: [
        { id: 3, name: "Matcha Latte", price: 5.20, gameType: "matcha", emoji: "🍃" },
        { id: 4, name: "Iced Matcha Latte", price: 5.60, gameType: "matcha", emoji: "🍃❄️" },
        { id: 5, name: "Strawberry Matcha Latte", price: 5.90, gameType: "matcha", emoji: "🍓🍃" },
        { id: 6, name: "Iced Strawberry Matcha Latte", price: 6.30, gameType: "matcha", emoji: "🍓🍃❄️" }
      ]
    },
    {
      id: 3,
      name: "Coffee",
      level: 3,
      unlockCoins: 50,
      items: [
        { id: 7, name: "Strawberry Coffee", price: 5.10, gameType: "coffee", emoji: "☕🍓" },
        { id: 8, name: "Velvet Coffee", price: 5.40, gameType: "coffee", emoji: "☕" },
        { id: 9, name: "Iced Strawberry Coffee", price: 5.50, gameType: "coffee", emoji: "☕🍓❄️" },
        { id: 10, name: "Iced Velvet Coffee", price: 5.80, gameType: "coffee", emoji: "☕❄️" }
      ]
    },
    {
      id: 4,
      name: "Cake Cups",
      level: 4,
      unlockCoins: 100,
      items: [
        { id: 11, name: "Strawberry Cake Cup", price: 4.30, gameType: "cake", emoji: "🍓" },
        { id: 12, name: "Banana Cake Cup", price: 4.20, gameType: "cake", emoji: "🍌" },
        { id: 13, name: "Raspberry Cake Cup", price: 4.40, gameType: "cake", emoji: "🫐" }
      ]
    },
    {
      id: 5,
      name: "Toasts",
      level: 5,
      unlockCoins: 150,
      items: [
        { id: 14, name: "Apple Honey Toast", price: 4.80, gameType: "toast", emoji: "🍎🍯" },
        { id: 15, name: "Berry Cream Toast", price: 4.90, gameType: "toast", emoji: "🫐🍞" },
        { id: 16, name: "Banana Nut Toast", price: 4.90, gameType: "toast", emoji: "🍌🥜" }
      ]
    }
  ]
};