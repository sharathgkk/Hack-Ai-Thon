/**
 * ============================================
 * MAIN CONTROLLER & COORDINATOR
 * ============================================
 * Purpose: Entry point that initializes and coordinates all modules
 * Imports: All 8 modules
 * Responsibilities: Module initialization, event delegation, state coordination
 */

// ============================================
// MODULE INITIALIZATION SEQUENCE
// ============================================

window.AppController = {
    // Store all module references
    modules: {
        auth: window.AuthModule || {},
        navigation: window.NavigationModule || {},
        modal: window.ModalModule || {},
        wellness: window.WellnessModule || {},
        financial: window.FinancialModule || {},
        career: window.CareerModule || {},
        booking: window.BookingModule || {},
        learning: window.LearningModule || {}
    },

    // Initialize entire application
    init: function() {
        console.log('🚀 Initializing Student Support Hub...');

        // Setup event listeners
        this.setupEventListeners();

        // Initialize UI
        this.setupUI();

        // Load initial data
        this.loadInitialData();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        console.log('✅ Application initialized successfully');
    },

    // Setup all event listeners
    setupEventListeners: function() {
        console.log('📌 Setting up event listeners...');

        // Sidebar navigation
        document.querySelectorAll('[data-nav-section]').forEach(navItem => {
            navItem.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-nav-section');
                this.modules.navigation.switchSection(section);
            });
        });

        // Modal triggers
        document.querySelectorAll('[data-modal-open]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal-open');
                this.modules.modal.openModal(modalId);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.modules.modal.closeModal(modal.id);
                }
            });
        });

        // Dropdown toggles
        document.querySelectorAll('[data-dropdown-toggle]').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const dropdownId = e.target.getAttribute('data-dropdown-toggle');
                this.modules.navigation.toggleDropdown(dropdownId);
            });
        });

        // Accordion toggles
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                this.modules.learning.toggleAccordion(header);
            });
        });

        // Hydration tracker
        document.querySelectorAll('[data-add-water]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.getAttribute('data-add-water'));
                this.modules.wellness.addWater(amount);
            });
        });

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                document.querySelectorAll('.modal[style*="display: block"]').forEach(modal => {
                    this.modules.modal.closeModal(modal.id);
                });
            }
        });

        // Resize listener for dropdown positioning
        window.addEventListener('resize', () => {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                const trigger = dropdown.previousElementSibling;
                if (trigger && dropdown.style.display === 'block') {
                    this.modules.navigation.smartDropdownPosition(dropdown, trigger);
                }
            });
        });

        console.log('✅ Event listeners setup complete');
    },

    // Setup initial UI state
    setupUI: function() {
        console.log('🎨 Setting up UI...');

        // Set first section as active
        const firstSection = document.querySelector('[data-nav-section]');
        if (firstSection) {
            const section = firstSection.getAttribute('data-nav-section');
            this.modules.navigation.switchSection(section);
        }

        // Initialize charts if on dashboard
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage && dashboardPage.style.display !== 'none') {
            this.modules.learning.initializeCharts();
        }

        // Set hydration display
        this.modules.wellness.updateHydrationDisplay();

        console.log('✅ UI setup complete');
    },

    // Load initial data
    loadInitialData: function() {
        console.log('📂 Loading initial data...');

        // This can be expanded to load data from localStorage or API
        // For now, we initialize with default state

        console.log('✅ Initial data loaded');
    },

    // Setup keyboard shortcuts
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal[style*="display: block"]').forEach(modal => {
                    this.modules.modal.closeModal(modal.id);
                });
            }

            // Ctrl+H for hydration quick add
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                this.modules.wellness.addWater(250);
            }

            // Ctrl+Q for generating quote
            if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
                e.preventDefault();
                this.modules.learning.generateQuote();
            }
        });
    },

    // Get all module states
    getAppState: function() {
        return {
            auth: this.modules.auth.getAuthState?.() || {},
            wellness: this.modules.wellness.getHydrationState?.() || {},
            financial: this.modules.financial.getFinancialState?.() || {},
            career: this.modules.career.getCareerState?.() || {},
            booking: this.modules.booking.getBookingState?.() || {},
            learning: this.modules.learning.getLearningState?.() || {}
        };
    },

    // Export data for backup
    exportData: function() {
        const state = this.getAppState();
        const dataStr = JSON.stringify(state, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `app_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Reset application state
    resetState: function() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }
};

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AppController.init();
    });
} else {
    window.AppController.init();
}

// Export for external access
window.APP = window.AppController;
console.log('💾 App controller loaded. Access via window.APP');
