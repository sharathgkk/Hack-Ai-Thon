/**
 * ============================================
 * MODULE 1: AUTHENTICATION & USER MANAGEMENT
 * ============================================
 * Purpose: Handle user login, session management, and authentication flows
 * Functions: showLogin(), handleLogin(), checkSession(), logout()
 * Dependencies: None (standalone)
 */

// Session Management
function saveSession(email) {
    const session = {
        email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('userSession', JSON.stringify(session));
}

function checkSession() {
    try {
        const session = JSON.parse(localStorage.getItem('userSession'));
        if (session) {
            document.getElementById('loginPage')?.classList.add('hidden');
            document.getElementById('landingPage')?.classList.add('hidden');
            document.getElementById('mainDashboard')?.classList.remove('hidden');
            return true;
        }
    } catch (e) {
        console.warn('Session check failed', e);
    }
    return false;
}

function logout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('userProfile');
    location.reload();
}

// Navigation Functions
function showLogin() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail')?.value || '';
    const password = document.getElementById('loginPassword')?.value || '';

    if (!email || !password) {
        alert('Please enter your email and password to continue.');
        return;
    }

    // Save session
    saveSession(email);

    // Navigate to dashboard
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainDashboard')?.classList.remove('hidden');

    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
    event.target.reset();
}

// Check for existing session on load
document.addEventListener('DOMContentLoaded', checkSession);

// Export functions
window.AuthModule = {
    showLogin: showLogin,
    handleLogin: handleLogin,
    checkSession: checkSession,
    logout: logout
};
