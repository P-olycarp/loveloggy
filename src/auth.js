// LoveLoggy Authentication & Partner Pairing System
// Production-ready auth for two users

const AUTH_KEYS = {
    user: 'loveloggy_user',
    creds: 'loveloggy_creds',
    couple: 'loveloggy_couple',
    inviteCode: 'loveloggy_invite',
    // Shared data keys
    chat: 'loveloggy_chat',
    events: 'loveloggy_events',
    entries: 'loveloggy_entries',
    goals: 'loveloggy_goals',
    gallery: 'loveloggy_gallery',
    dates: 'loveloggy_dates',
    resolutions: 'loveloggy_resolutions',
    prefs: 'loveloggy_prefs',
    theme: 'loveloggy_theme',
    settings: 'loveloggy_settings'
};

// Migrate old keys to new keys (for consistency)
function migrateOldKeys() {
    const migrations = [
        ['lovelogg_user', AUTH_KEYS.user],
        ['lovelogg_creds', AUTH_KEYS.creds],
        ['lovelogg_chat', AUTH_KEYS.chat],
        ['lovelogg_events', AUTH_KEYS.events],
        ['lovelogg_entries', AUTH_KEYS.entries],
        ['lovelogg_goals', AUTH_KEYS.goals],
        ['lovelogg_gallery', AUTH_KEYS.gallery],
        ['lovelogg_dates', AUTH_KEYS.dates],
        ['lovelogg_resolutions', AUTH_KEYS.resolutions]
    ];
    
    migrations.forEach(([oldKey, newKey]) => {
        const oldValue = localStorage.getItem(oldKey);
        if (oldValue && !localStorage.getItem(newKey)) {
            localStorage.setItem(newKey, oldValue);
            localStorage.removeItem(oldKey);
        } else if (oldValue) {
            localStorage.removeItem(oldKey);
        }
    });
}

// Run migration on load
migrateOldKeys();

// Generate a unique invite code for partner pairing
function generateInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Generate a unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get current logged-in user
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_KEYS.user) || 'null');
    } catch (e) {
        return null;
    }
}

// Get couple data
function getCoupleData() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_KEYS.couple) || 'null');
    } catch (e) {
        return null;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    const user = getCurrentUser();
    return user && user.id && user.email;
}

// Check if couple is paired
function isPaired() {
    const couple = getCoupleData();
    return couple && couple.user1 && couple.user2 && couple.isPaired;
}

// Get the current user's role in the couple (user1 or user2)
function getUserRole() {
    const user = getCurrentUser();
    const couple = getCoupleData();
    if (!user || !couple) return null;
    
    if (couple.user1 && couple.user1.id === user.id) return 'user1';
    if (couple.user2 && couple.user2.id === user.id) return 'user2';
    return null;
}

// Get partner info
function getPartnerInfo() {
    const role = getUserRole();
    const couple = getCoupleData();
    if (!role || !couple) return null;
    
    return role === 'user1' ? couple.user2 : couple.user1;
}

// Create a new user account (signup)
function createAccount(userData) {
    const userId = generateUserId();
    const inviteCode = generateInviteCode();
    
    const user = {
        id: userId,
        name: userData.name,
        email: userData.email.toLowerCase(),
        profilePic: userData.profilePic || null,
        createdAt: new Date().toISOString()
    };
    
    // Store credentials
    const creds = {
        email: userData.email.toLowerCase(),
        password: userData.password
    };
    
    localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
    localStorage.setItem(AUTH_KEYS.creds, JSON.stringify(creds));
    
    // Check if joining via invite code or creating new couple
    if (userData.inviteCode) {
        // Try to join existing couple
        const joinResult = joinCouple(userData.inviteCode, user);
        return { success: joinResult.success, user, error: joinResult.error };
    } else {
        // Create new couple space and generate invite
        const couple = {
            id: 'couple_' + Date.now(),
            inviteCode: inviteCode,
            user1: user,
            user2: null,
            isPaired: false,
            startDate: userData.startDate || null,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(AUTH_KEYS.couple, JSON.stringify(couple));
        localStorage.setItem(AUTH_KEYS.inviteCode, inviteCode);
        
        return { success: true, user, inviteCode };
    }
}

// Join an existing couple with invite code
function joinCouple(inviteCode, user) {
    const couple = getCoupleData();
    
    // If no couple exists locally, this is a new device joining
    // In production, this would fetch from a server
    if (!couple || couple.inviteCode !== inviteCode.toUpperCase()) {
        return { success: false, error: 'Invalid invite code. Please check and try again.' };
    }
    
    if (couple.isPaired) {
        return { success: false, error: 'This couple space is already paired.' };
    }
    
    // Add user2 to the couple
    couple.user2 = user;
    couple.isPaired = true;
    couple.pairedAt = new Date().toISOString();
    
    localStorage.setItem(AUTH_KEYS.couple, JSON.stringify(couple));
    
    return { success: true };
}

// Login with email and password
function login(email, password) {
    const creds = JSON.parse(localStorage.getItem(AUTH_KEYS.creds) || 'null');
    
    if (!creds) {
        return { success: false, error: 'No account found. Please sign up.' };
    }
    
    if (creds.email.toLowerCase() !== email.toLowerCase() || creds.password !== password) {
        return { success: false, error: 'Invalid email or password.' };
    }
    
    // Load user data
    const user = getCurrentUser();
    if (!user) {
        return { success: false, error: 'Account data corrupted. Please sign up again.' };
    }
    
    return { success: true, user };
}

// Update user profile
function updateUserProfile(updates) {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'Not logged in.' };
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(AUTH_KEYS.user, JSON.stringify(updatedUser));
    
    // Also update in couple data
    const couple = getCoupleData();
    if (couple) {
        const role = getUserRole();
        if (role === 'user1') {
            couple.user1 = updatedUser;
        } else if (role === 'user2') {
            couple.user2 = updatedUser;
        }
        localStorage.setItem(AUTH_KEYS.couple, JSON.stringify(couple));
    }
    
    return { success: true, user: updatedUser };
}

// Update couple info (like start date)
function updateCoupleInfo(updates) {
    const couple = getCoupleData();
    if (!couple) return { success: false, error: 'No couple data.' };
    
    const updatedCouple = { ...couple, ...updates };
    localStorage.setItem(AUTH_KEYS.couple, JSON.stringify(updatedCouple));
    
    return { success: true, couple: updatedCouple };
}

// Logout current user
function logout() {
    localStorage.removeItem(AUTH_KEYS.user);
    localStorage.removeItem(AUTH_KEYS.creds);
    // Keep couple data so partner can still access
}

// Full reset (delete all data)
function resetAllData() {
    Object.values(AUTH_KEYS).forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('lovelogg_chat');
    localStorage.removeItem('lovelogg_events');
    localStorage.removeItem('lovelogg_goals');
    localStorage.removeItem('lovelogg_gallery');
    localStorage.removeItem('loveloggy_prefs');
    localStorage.removeItem('loveloggy_theme');
}

// Calculate days together
function daysTogether() {
    const couple = getCoupleData();
    if (!couple || !couple.startDate) return 0;
    
    try {
        const msPerDay = 24 * 60 * 60 * 1000;
        const start = new Date(couple.startDate);
        const now = new Date();
        const diff = Math.floor((now - start) / msPerDay);
        return diff >= 0 ? diff : 0;
    } catch (e) {
        return 0;
    }
}

// Require authentication - redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Export to window for global access
window.LoveLoggyAuth = {
    generateInviteCode,
    generateUserId,
    getCurrentUser,
    getCoupleData,
    isAuthenticated,
    isPaired,
    getUserRole,
    getPartnerInfo,
    createAccount,
    joinCouple,
    login,
    updateUserProfile,
    updateCoupleInfo,
    logout,
    resetAllData,
    daysTogether,
    requireAuth
};
