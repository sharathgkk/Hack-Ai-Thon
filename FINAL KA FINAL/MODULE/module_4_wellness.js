/**
 * ============================================
 * MODULE 4: WELLNESS & HEALTH TRACKING
 * ============================================
 * Purpose: Manage hydration tracking, wellness features, and emoji animations
 * Functions: addWater(), addWaterCup(), updateHydrationDisplay(), toggleHydrationReminders(),
 *            showHydrationNotification(), triggerEmojiAnimation(), trackMood(), createFloatingEmoji()
 * Dependencies: None (standalone)
 */

// Hydration Tracker Data
const hydrationState = {
    dailyIntake: 0,
    target: 2000,
    remindersEnabled: true,
    moodHistory: []
};

// Add Water Intake
function addWater(amount) {
    hydrationState.dailyIntake += amount;
    updateHydrationDisplay();

    if (hydrationState.dailyIntake >= hydrationState.target) {
        showHydrationNotification('Daily goal achieved! Stay healthy!');
        triggerEmojiAnimation('great');
    } else {
        showHydrationNotification(`Added ${amount}ml. Total: ${hydrationState.dailyIntake}ml`);
    }
}

// Add Water Cup Animation
function addWaterCup(size) {
    const cupElement = document.createElement('div');
    cupElement.className = 'water-cup-animation';
    cupElement.innerHTML = `<span>${size}ml</span>`;

    const container = document.querySelector('.water-tracker-container') || document.body;
    container.appendChild(cupElement);

    // Animate
    setTimeout(() => cupElement.style.opacity = '1', 10);
    setTimeout(() => {
        cupElement.style.opacity = '0';
        setTimeout(() => cupElement.remove(), 300);
    }, 1500);

    // Add water
    addWater(size);
}

// Update Hydration Display
function updateHydrationDisplay() {
    const percentageElement = document.querySelector('.hydration-percentage');
    const progressElement = document.querySelector('.hydration-progress');

    if (percentageElement) {
        const percentage = Math.min((hydrationState.dailyIntake / hydrationState.target) * 100, 100);
        percentageElement.textContent = Math.round(percentage) + '%';
    }

    if (progressElement) {
        const percentage = Math.min((hydrationState.dailyIntake / hydrationState.target) * 100, 100);
        progressElement.style.width = percentage + '%';
    }

    // Update remaining water info
    const remainingElement = document.querySelector('.remaining-water');
    if (remainingElement) {
        const remaining = Math.max(hydrationState.target - hydrationState.dailyIntake, 0);
        remainingElement.textContent = remaining + 'ml remaining';
    }
}

// Toggle Hydration Reminders
function toggleHydrationReminders() {
    hydrationState.remindersEnabled = !hydrationState.remindersEnabled;
    const toggle = document.querySelector('.hydration-reminder-toggle');

    if (toggle) {
        toggle.textContent = hydrationState.remindersEnabled ? 'Reminders ON' : 'Reminders OFF';
        toggle.classList.toggle('enabled', hydrationState.remindersEnabled);
    }

    if (hydrationState.remindersEnabled) {
        showHydrationNotification('Hydration reminders enabled');
    }
}

// Show Hydration Notification
function showHydrationNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'hydration-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgb(var(--neon-cyan));
        color: black;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 5000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Trigger Emoji Animation
function triggerEmojiAnimation(mood) {
    const emojiMap = {
        'great': '😄',
        'okay': '😐',
        'struggling': '😓',
        'happy': '🎉',
        'water': '💧'
    };

    const emoji = emojiMap[mood] || '😊';
    createFloatingEmoji(emoji);
}

// Create Floating Emoji
function createFloatingEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.style.cssText = `
        position: fixed;
        font-size: 3rem;
        z-index: 3000;
        pointer-events: none;
        animation: float 2s ease-in-out;
    `;

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    emojiElement.style.left = startX + 'px';
    emojiElement.style.top = startY + 'px';

    document.body.appendChild(emojiElement);
    setTimeout(() => emojiElement.remove(), 2000);
}

// Track Mood
function trackMood(moodValue) {
    const moodData = {
        timestamp: new Date(),
        value: moodValue,
        hydration: hydrationState.dailyIntake
    };

    hydrationState.moodHistory.push(moodData);

    const moodEmojis = {
        1: 'struggling',
        2: 'okay',
        3: 'happy',
        4: 'great',
        5: 'great'
    };

    triggerEmojiAnimation(moodEmojis[moodValue] || 'okay');
    showHydrationNotification(`Mood tracked: ${moodValue}/5`);
}

// Export functions
window.WellnessModule = {
    addWater: addWater,
    addWaterCup: addWaterCup,
    updateHydrationDisplay: updateHydrationDisplay,
    toggleHydrationReminders: toggleHydrationReminders,
    showHydrationNotification: showHydrationNotification,
    triggerEmojiAnimation: triggerEmojiAnimation,
    trackMood: trackMood,
    createFloatingEmoji: createFloatingEmoji,
    getHydrationState: () => hydrationState
};
