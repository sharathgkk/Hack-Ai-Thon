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
    // Close other modals first
    document.querySelectorAll('.modal').forEach(m => {
        if (m.id !== modalId) {
            m.classList.remove('show');
        }
    });

    // Show requested modal using the .show class (styles.css handles display)
    modal.classList.add('show');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Ensure a backdrop exists and is visible
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
    modal.classList.remove('show');

    // If no other modals are visible, hide backdrop and restore scrolling
    const anyOpen = Array.from(document.querySelectorAll('.modal')).some(m => m.classList.contains('show'));
    if (!anyOpen) {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Export functions
window.ModalModule = {
    openModal: openModal,
    closeModal: closeModal
};
