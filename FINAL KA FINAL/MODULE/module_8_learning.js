/**
 * ============================================
 * MODULE 8: LEARNING & ACADEMIC FEATURES
 * ============================================
 * Purpose: Manage academic features, study tools, and learning modes
 * Functions: initializeCharts(), toggleAccordion(), toggleStudyTimer(),
 *            toggleFeature(), generateQuote()
 * Dependencies: Chart.js (external library)
 */

// Learning State
const learningState = {
    studyTimer: {
        isRunning: false,
        timeRemaining: 25 * 60,
        originalDuration: 25 * 60
    },
    accordionStates: {},
    featureToggles: {
        assignments: true,
        exams: true,
        resources: true
    },
    progressData: {
        lessonsCompleted: 0,
        quizzesAttempted: 0,
        averageScore: 0
    }
};

// Initialize Charts
function initializeCharts() {
    initializeProgressChart();
    initializePerformanceChart();
    initializeTimelineChart();
}

function initializeProgressChart() {
    const ctx = document.getElementById('progressChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Learning Progress (%)',
            data: [25, 45, 60, 85],
            borderColor: 'rgb(57, 255, 20)',
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { color: '#fff' } }
            },
            scales: {
                y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
        labels: ['Mathematics', 'Science', 'English', 'History', 'Computer Science'],
        datasets: [{
            label: 'Your Scores',
            data: [88, 92, 85, 90, 95],
            backgroundColor: [
                'rgb(0, 217, 255)',
                'rgb(255, 0, 110)',
                'rgb(191, 0, 255)',
                'rgb(57, 255, 20)',
                'rgb(255, 215, 0)'
            ]
        }]
    };

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                r: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

function initializeTimelineChart() {
    const ctx = document.getElementById('timelineChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Hours Studied',
            data: [10, 15, 20, 18, 25, 30],
            borderColor: 'rgb(191, 0, 255)',
            backgroundColor: 'rgba(191, 0, 255, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    });
}

// Toggle Accordion
function toggleAccordion(element) {
    const accordionId = element.getAttribute('data-accordion') || element.id;
    const content = element.nextElementSibling;

    if (!content) return;

    const isOpen = learningState.accordionStates[accordionId];

    // Close all other accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        const id = header.getAttribute('data-accordion') || header.id;
        const nextContent = header.nextElementSibling;

        if (id !== accordionId && nextContent) {
            nextContent.style.display = 'none';
            header.classList.remove('active');
        }
    });

    // Toggle current
    if (isOpen) {
        content.style.display = 'none';
        element.classList.remove('active');
        learningState.accordionStates[accordionId] = false;
    } else {
        content.style.display = 'block';
        element.classList.add('active');
        learningState.accordionStates[accordionId] = true;
    }
}

// Toggle Study Timer
function toggleStudyTimer() {
    const timer = learningState.studyTimer;
    const timerDisplay = document.querySelector('.study-timer-display');
    const timerButton = document.querySelector('.study-timer-toggle');

    if (!timer.isRunning) {
        timer.isRunning = true;
        if (timerButton) timerButton.textContent = 'Pause';

        const interval = setInterval(() => {
            timer.timeRemaining--;

            if (timerDisplay) {
                const minutes = Math.floor(timer.timeRemaining / 60);
                const seconds = timer.timeRemaining % 60;
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }

            if (timer.timeRemaining <= 0) {
                clearInterval(interval);
                timer.isRunning = false;
                alert('Study session complete! Great work!');
                timer.timeRemaining = timer.originalDuration;
                if (timerButton) timerButton.textContent = 'Start';
            }
        }, 1000);
    } else {
        timer.isRunning = false;
        if (timerButton) timerButton.textContent = 'Start';
    }
}

// Toggle Feature
function toggleFeature(featureName) {
    learningState.featureToggles[featureName] = !learningState.featureToggles[featureName];

    const featureElement = document.querySelector(`[data-feature="${featureName}"]`);
    if (featureElement) {
        if (learningState.featureToggles[featureName]) {
            featureElement.style.display = 'block';
            featureElement.classList.add('feature-enabled');
        } else {
            featureElement.style.display = 'none';
            featureElement.classList.remove('feature-enabled');
        }
    }

    console.log(`Feature '${featureName}' toggled: ${learningState.featureToggles[featureName]}`);
}

// Generate Motivational Quote
function generateQuote() {
    const quotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It does not matter how slowly you go as long as you do not stop. - Confucius",
        "Education is the power to think clearly, the power to act well in the world's work. - Brigham Young",
        "Knowledge is power. - Francis Bacon",
        "The expert in anything was once a beginner. - Helen Hayes",
        "Learning never exhausts the mind. - Leonardo da Vinci",
        "An investment in knowledge pays the best interest. - Benjamin Franklin"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const quoteElement = document.querySelector('.motivational-quote');
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        quoteElement.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            quoteElement.textContent = randomQuote;
            quoteElement.style.opacity = '1';
        }, 300);
    }

    return randomQuote;
}

// Get Learning Progress
function getLearningProgress() {
    return learningState.progressData;
}

// Update Learning Progress
function updateLearningProgress(lessonsCompleted, quizzesAttempted, averageScore) {
    learningState.progressData.lessonsCompleted = lessonsCompleted;
    learningState.progressData.quizzesAttempted = quizzesAttempted;
    learningState.progressData.averageScore = averageScore;
}

// Export functions
window.LearningModule = {
    initializeCharts: initializeCharts,
    toggleAccordion: toggleAccordion,
    toggleStudyTimer: toggleStudyTimer,
    toggleFeature: toggleFeature,
    generateQuote: generateQuote,
    getLearningProgress: getLearningProgress,
    updateLearningProgress: updateLearningProgress,
    getLearningState: () => learningState
};
