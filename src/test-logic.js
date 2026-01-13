// src/test-logic.js

// 1. TEST DATA TRANSFORMATION
// This simulates how we handle Firebase data to ensure no crashes
export const transformFirebaseData = (docs) => {
    try {
        return docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            price: Number(doc.data().price) || 0, // Ensure price is always a number
            stock: doc.data().stock ?? 0         // Default to 0 if missing
        }));
    } catch (e) {
        console.error("Transformation Error:", e);
        return [];
    }
};

// 2. TEST CART CALCULATIONS
export const calculateTotal = (cartItems) => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
};

// --- RUN TESTS ---
const mockDocs = [
    { id: '1', data: () => ({ name: 'Rose', price: '25.50', stock: 10 }) },
    { id: '2', data: () => ({ name: 'Fern', price: '15', stock: 5 }) }
];

console.log("--- STARTING LOCAL TESTS ---");

const plants = transformFirebaseData(mockDocs);
console.log("Test 1 (Data Transform):", plants.length === 2 ? "✅ PASSED" : "❌ FAILED");
console.log("Check Number conversion:", typeof plants[0].price === 'number' ? "✅ PASSED" : "❌ FAILED");

const total = calculateTotal(plants);
console.log("Test 2 (Total Calculation):", total === 40.5 ? "✅ PASSED" : "❌ FAILED");

console.log("--- TESTS COMPLETE ---");