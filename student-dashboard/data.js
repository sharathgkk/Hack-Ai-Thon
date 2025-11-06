// Additional Mock Data and Helper Functions
// Extended data structures for the Student Dashboard

const ExtendedMockData = {
  // Wellness activities with detailed information
  wellnessActivities: [
    {
      id: 1,
      name: 'Morning Meditation',
      type: 'meditation',
      duration: 20,
      time: '7:00 AM',
      instructor: 'Dr. Sarah Williams',
      benefits: ['Reduces stress', 'Improves focus', 'Enhances mood'],
      description: 'Start your day with guided meditation to center yourself and prepare for academic challenges.'
    },
    {
      id: 2,
      name: 'Yoga for Students',
      type: 'yoga',
      duration: 45,
      time: '4:00 PM',
      instructor: 'Priya Sharma',
      benefits: ['Physical fitness', 'Flexibility', 'Mental clarity'],
      description: 'Gentle yoga sessions designed specifically for students to relieve tension from long study hours.'
    },
    {
      id: 3,
      name: 'Peer Support Circle',
      type: 'support',
      duration: 60,
      time: '6:00 PM',
      instructor: 'Facilitated by Counselors',
      benefits: ['Community building', 'Emotional support', 'Shared experiences'],
      description: 'Connect with fellow students in a safe space to share challenges and successes.'
    }
  ],
  
  // Career readiness scoring system
  careerReadiness: {
    categories: [
      { name: 'Technical Skills', score: 75, color: '#3B82F6' },
      { name: 'Communication', score: 82, color: '#10B981' },
      { name: 'Leadership', score: 68, color: '#F59E0B' },
      { name: 'Teamwork', score: 85, color: '#8B5CF6' },
      { name: 'Problem Solving', score: 79, color: '#EF4444' }
    ],
    overallScore: 78,
    recommendations: [
      'Consider taking a leadership workshop to boost your score',
      'Your communication skills are strong - leverage them in interviews',
      'Join more team projects to enhance collaboration experience'
    ]
  },
  
  // Financial aid budgeting categories
  budgetCategories: [
    { name: 'Tuition & Fees', allocated: 40000, spent: 40000, percentage: 50 },
    { name: 'Books & Supplies', allocated: 8000, spent: 6500, percentage: 10 },
    { name: 'Accommodation', allocated: 20000, spent: 20000, percentage: 25 },
    { name: 'Food & Dining', allocated: 8000, spent: 7200, percentage: 10 },
    { name: 'Transportation', allocated: 4000, spent: 3500, percentage: 5 }
  ],
  
  // Study group chat messages (mock)
  studyGroupMessages: [
    {
      groupId: 1,
      messages: [
        { sender: 'Alex Kumar', message: 'Hey everyone! Ready for tomorrow\'s DSA practice?', time: '10:30 AM' },
        { sender: 'Maria Garcia', message: 'Yes! I\'ve prepared some tree problems', time: '10:32 AM' },
        { sender: 'John Doe', message: 'Great! Let\'s meet at 2 PM in the library', time: '10:35 AM' }
      ]
    }
  ],
  
  // Interview preparation resources
  interviewPrep: {
    beforeInterview: [
      'Research the company thoroughly',
      'Prepare your elevator pitch',
      'Review common interview questions',
      'Prepare questions to ask the interviewer',
      'Plan your outfit and route'
    ],
    duringInterview: [
      'Arrive 10-15 minutes early',
      'Use the STAR method for behavioral questions',
      'Maintain eye contact and good posture',
      'Listen carefully before answering',
      'Show enthusiasm and interest'
    ],
    afterInterview: [
      'Send a thank-you email within 24 hours',
      'Reflect on your performance',
      'Note questions you struggled with',
      'Follow up appropriately',
      'Continue your job search'
    ]
  },
  
  // Digital library resources with categories
  libraryResources: {
    digitalBooks: [
      { title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Computer Science', available: true },
      { title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', available: true },
      { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', category: 'Software Engineering', available: true }
    ],
    researchPapers: [
      { title: 'Machine Learning in Healthcare', author: 'Various', year: 2023, citations: 145 },
      { title: 'Quantum Computing Advances', author: 'Various', year: 2023, citations: 89 }
    ],
    videoLectures: [
      { title: 'Data Structures Masterclass', instructor: 'Prof. Johnson', duration: '12 hours', platform: 'Coursera' },
      { title: 'Web Development Bootcamp', instructor: 'Angela Yu', duration: '40 hours', platform: 'Udemy' }
    ]
  },
  
  // Appointment availability slots
  appointmentSlots: {
    faculty: [
      { name: 'Dr. Robert Smith', department: 'Computer Science', availableSlots: ['Mon 2PM', 'Wed 4PM', 'Fri 10AM'] },
      { name: 'Prof. Emily Chen', department: 'Mathematics', availableSlots: ['Tue 3PM', 'Thu 11AM'] }
    ],
    advisors: [
      { name: 'Jessica Brown', role: 'Academic Advisor', availableSlots: ['Mon 10AM', 'Wed 2PM', 'Fri 3PM'] }
    ],
    counselors: [
      { name: 'Dr. Michael Lee', specialty: 'Mental Health', availableSlots: ['Daily 9AM-5PM'] }
    ]
  },
  
  // Campus dining options
  diningOptions: [
    { name: 'Main Cafeteria', hours: '7 AM - 9 PM', menu: 'Full meals, vegetarian options', building: 'Student Center' },
    { name: 'Coffee Shop', hours: '6 AM - 10 PM', menu: 'Coffee, snacks, pastries', building: 'Library' },
    { name: 'Food Court', hours: '11 AM - 8 PM', menu: 'Multiple cuisines', building: 'Campus Center' }
  ],
  
  // Notification types and examples
  notifications: [
    { type: 'academic', message: 'Assignment due tomorrow: Data Structures Project', time: '2 hours ago', read: false },
    { type: 'wellness', message: 'Time for your wellness check-in!', time: '5 hours ago', read: false },
    { type: 'career', message: 'New internship posted: Frontend Developer', time: '1 day ago', read: true }
  ],
  
  // Gamification elements
  achievements: [
    { name: 'Study Streak Master', description: '7 day study streak', icon: 'fire', earned: true, date: '2024-01-15' },
    { name: 'Wellness Warrior', description: 'Complete 30 wellness activities', icon: 'heart', earned: false, progress: 18 },
    { name: 'Knowledge Seeker', description: 'Complete 10 courses', icon: 'book', earned: false, progress: 6 },
    { name: 'Community Leader', description: 'Create 5 study groups', icon: 'users', earned: false, progress: 2 }
  ],
  
  // Motivational quotes for different contexts
  motivationalQuotes: {
    study: [
      'Success is the sum of small efforts repeated day in and day out.',
      'The expert in anything was once a beginner.',
      'Education is the passport to the future.'
    ],
    wellness: [
      'Take care of your body. It\'s the only place you have to live.',
      'Mental health is just as important as physical health.',
      'Self-care is not selfish. You cannot serve from an empty vessel.'
    ],
    career: [
      'The future depends on what you do today.',
      'Opportunities don\'t happen. You create them.',
      'Success is walking from failure to failure with no loss of enthusiasm.'
    ]
  },
  
  // Emergency contacts
  emergencyContacts: [
    { type: 'Campus Security', number: '555-0123', available: '24/7' },
    { type: 'Medical Emergency', number: '555-0911', available: '24/7' },
    { type: 'Counseling Crisis Line', number: '1-800-CRISIS', available: '24/7' },
    { type: 'Title IX Office', number: '555-0456', available: 'Mon-Fri 9AM-5PM' }
  ],
  
  // Skill development paths
  skillPaths: {
    'Web Development': {
      beginner: ['HTML Basics', 'CSS Fundamentals', 'JavaScript Intro'],
      intermediate: ['React.js', 'Node.js', 'Database Design'],
      advanced: ['System Design', 'Performance Optimization', 'Cloud Deployment']
    },
    'Data Science': {
      beginner: ['Python Basics', 'Statistics', 'Data Visualization'],
      intermediate: ['Machine Learning', 'Data Analysis', 'SQL'],
      advanced: ['Deep Learning', 'Big Data', 'AI Ethics']
    },
    'Mobile Development': {
      beginner: ['Mobile UI/UX', 'Flutter Basics', 'App Design'],
      intermediate: ['React Native', 'API Integration', 'State Management'],
      advanced: ['Performance Tuning', 'Publishing Apps', 'Monetization']
    }
  }
};

// Helper Functions
const HelperFunctions = {
  // Format date to readable string
  formatDate: (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  },
  
  // Calculate days until deadline
  daysUntilDeadline: (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },
  
  // Calculate CGPA from grades
  calculateCGPA: (grades) => {
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return (sum / grades.length).toFixed(2);
  },
  
  // Generate random motivational quote
  getRandomQuote: (category) => {
    const quotes = ExtendedMockData.motivationalQuotes[category];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },
  
  // Calculate progress percentage
  calculateProgress: (completed, total) => {
    return Math.round((completed / total) * 100);
  },
  
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },
  
  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // Generate avatar URL
  generateAvatar: (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=21808d&color=fff&size=128`;
  },
  
  // Time ago formatter
  timeAgo: (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  },
  
  // Truncate text
  truncate: (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
  
  // Sort array by property
  sortBy: (array, property, order = 'asc') => {
    return array.sort((a, b) => {
      if (order === 'asc') {
        return a[property] > b[property] ? 1 : -1;
      } else {
        return a[property] < b[property] ? 1 : -1;
      }
    });
  },
  
  // Filter array by search term
  filterBySearch: (array, searchTerm, properties) => {
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
      return properties.some(prop => {
        return item[prop] && item[prop].toString().toLowerCase().includes(term);
      });
    });
  },
  
  // Calculate streak
  calculateStreak: (activities) => {
    // Assumes activities is an array of dates
    if (activities.length === 0) return 0;
    
    let streak = 1;
    const sorted = activities.sort((a, b) => new Date(b) - new Date(a));
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i]);
      const next = new Date(sorted[i + 1]);
      const diffDays = Math.floor((current - next) / 86400000);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  },
  
  // Generate unique ID
  generateId: () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Local storage wrapper (with fallback for sandboxed environment)
  storage: {
    set: (key, value) => {
      try {
        // Try to use localStorage, but catch security errors
        return false; // Disabled due to sandbox restrictions
      } catch (e) {
        // Use in-memory storage instead
        if (!window._memoryStorage) window._memoryStorage = {};
        window._memoryStorage[key] = JSON.stringify(value);
        return true;
      }
    },
    get: (key) => {
      try {
        return null; // Disabled due to sandbox restrictions
      } catch (e) {
        if (!window._memoryStorage) return null;
        const item = window._memoryStorage[key];
        return item ? JSON.parse(item) : null;
      }
    },
    remove: (key) => {
      try {
        return false;
      } catch (e) {
        if (window._memoryStorage) {
          delete window._memoryStorage[key];
        }
      }
    }
  }
};

// Export for use in main application
if (typeof window !== 'undefined') {
  window.ExtendedMockData = ExtendedMockData;
  window.HelperFunctions = HelperFunctions;
}

console.log('Extended mock data and helper functions loaded!');
