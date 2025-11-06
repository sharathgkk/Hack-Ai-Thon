/**
 * ============================================
 * MODULE 3: MODAL MANAGEMENT SYSTEM
 * ============================================
 * Purpose: Handle all modal operations (open, close, display)
 * Functions: openModal(), closeModal()
 * Dependencies: None (standalone)
 */

// Open Modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`Modal with ID '${modalId}' not found`);
        return;
    }

    // Hide all other modals
    document.querySelectorAll('.modal').forEach(m => {
        if (m.id !== modalId) {
            m.style.display = 'none';
        }
    });

    // Show requested modal
    modal.style.display = 'block';
    modal.classList.add('modal-visible');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Add backdrop if not exists
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
    }
    backdrop.style.display = 'block';
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`Modal with ID '${modalId}' not found`);
        return;
    }

    modal.style.display = 'none';
    modal.classList.remove('modal-visible');

    // Check if any modals are still open
    const openModals = document.querySelectorAll('.modal[style*="display: block"]');
    if (openModals.length === 0) {
        document.body.style.overflow = 'auto';
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.display = 'none';
        }
    }
}

// Export functions
window.ModalModule = {
    openModal: openModal,
    closeModal: closeModal
};
