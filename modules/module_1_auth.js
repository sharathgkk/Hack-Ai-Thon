/**
 * ============================================
 * MODULE 1: AUTHENTICATION & USER MANAGEMENT
 * ============================================
 * Purpose: Handle user login, session management, and authentication flows
 * Functions: showLogin(), handleLogin()
 * Dependencies: None (standalone)
 */

// Page Navigation Functions
function showLogin() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail')?.value || '';
    const password = document.getElementById('loginPassword')?.value || '';

    if (email && password) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboardPage')?.classList.remove('hidden');

        if (typeof initializeCharts === 'function') {
            initializeCharts();
        }

        event.target.reset();
    } else {
        alert('Please enter valid credentials');
    }
}

// Export functions
window.AuthModule = {
    showLogin: showLogin,
    handleLogin: handleLogin
};
