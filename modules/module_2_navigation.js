/**
 * ============================================
 * MODULE 2: NAVIGATION & UI STATE MANAGEMENT
 * ============================================
 * Purpose: Manage page navigation, section switching, and dropdown interactions
 * Functions: switchSection(), toggleDropdown(), toggleCategoryDropdown(), smartDropdownPosition()
 * Dependencies: None (standalone)
 */

// Section Navigation
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active-section');
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeItem = document.querySelector(`[onclick*="switchSection('${sectionName}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Toggle Dropdown Menu
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const isVisible = dropdown.style.display === 'block';
    document.querySelectorAll('[class*="dropdown"]').forEach(dd => {
        dd.style.display = 'none';
    });

    if (!isVisible) {
        dropdown.style.display = 'block';
    }
}

// Toggle Category Dropdown
function toggleCategoryDropdown(categoryId) {
    const category = document.getElementById(categoryId);
    if (!category) return;

    const isExpanded = category.getAttribute('aria-expanded') === 'true';
    const submenu = category.querySelector('.submenu') || category.nextElementSibling;

    if (submenu) {
        submenu.style.display = isExpanded ? 'none' : 'block';
        category.setAttribute('aria-expanded', !isExpanded);
    }
}

// Smart Dropdown Position Handler
function smartDropdownPosition(dropdownElement, toggleElement) {
    if (!dropdownElement || !toggleElement) return;

    const sidebarWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 250;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 20;

    const toggleRect = toggleElement.getBoundingClientRect();
    const dropdownRect = dropdownElement.getBoundingClientRect();

    let left = 0;
    let top = toggleRect.bottom + 5;

    if (toggleRect.left < sidebarWidth + offset) {
        left = toggleRect.right + 10;
        top = toggleRect.top;
    } else {
        left = toggleRect.left;
    }

    if (left + dropdownRect.width > viewportWidth - offset) {
        left = viewportWidth - dropdownRect.width - offset;
    }

    if (top + dropdownRect.height > viewportHeight - offset) {
        top = toggleRect.top - dropdownRect.height - 5;
    }

    if (top < offset) {
        top = offset;
    }

    dropdownElement.style.position = 'fixed';
    dropdownElement.style.left = left + 'px';
    dropdownElement.style.top = top + 'px';
}

// Export functions
window.NavigationModule = {
    switchSection: switchSection,
    toggleDropdown: toggleDropdown,
    toggleCategoryDropdown: toggleCategoryDropdown,
    smartDropdownPosition: smartDropdownPosition
};
