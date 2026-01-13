// src/test-auth.js

// 1. THE AUTH LOGIC (The same logic used in your AdminPanel)
const validateAccess = (user, allowedRoles) => {
    if (!user) return { allowed: false, reason: "No user logged in" };
    
    if (allowedRoles.includes(user.role)) {
        return { allowed: true, role: user.role };
    }
    
    return { allowed: false, reason: `Role '${user.role}' does not have permission.` };
};

// 2. THE LOGIN HANDLER MOCK
const simulateLogin = (email, password) => {
    // This simulates your Firebase Logic
    const mockDB = [
        { email: 'admin@greengold.com', pass: 'boss123', role: 'master' },
        { email: 'staff@greengold.com', pass: 'plant123', role: 'editor' }
    ];

    const found = mockDB.find(u => u.email === email && u.pass === password);
    
    if (found) {
        return { success: true, user: { email: found.email, role: found.role } };
    }
    return { success: false, error: "Invalid credentials" };
};

// --- RUNNING THE AUTH TESTS ---

console.log("--- STARTING ADMIN AUTH TESTS ---");

// Test A: Correct Master Login
const login1 = simulateLogin('admin@greengold.com', 'boss123');
const access1 = validateAccess(login1.user, ['master']);
console.log("Test A (Master Login):", access1.allowed ? "✅ PASSED" : "❌ FAILED");

// Test B: Correct Staff Login but trying to access Master Panel
const login2 = simulateLogin('staff@greengold.com', 'plant123');
const access2 = validateAccess(login2.user, ['master']);
console.log("Test B (Staff Role Restriction):", (!access2.allowed && access2.reason.includes('editor')) ? "✅ PASSED" : "❌ FAILED");

// Test C: Wrong Password
const login3 = simulateLogin('admin@greengold.com', 'wrong-pass');
console.log("Test C (Wrong Password Prevention):", !login3.success ? "✅ PASSED" : "❌ FAILED");

// Test D: Session Simulation
let currentUser = login1.user;
console.log("Test D (Session Identity):", currentUser.role === 'master' ? "✅ PASSED" : "❌ FAILED");

console.log("--- AUTH TESTS COMPLETE ---");