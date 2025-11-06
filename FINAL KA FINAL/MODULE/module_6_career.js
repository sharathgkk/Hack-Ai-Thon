/**
 * ============================================
 * MODULE 6: CAREER & JOB MANAGEMENT
 * ============================================
 * Purpose: Handle job applications, internship filtering, and career-related operations
 * Functions: applyForJob(), filterJobs(), filterInternships(), handleCareerBooking()
 * Dependencies: None (standalone)
 */

// Career State
const careerState = {
    applications: [],
    savedJobs: [],
    internships: [],
    mentors: [],
    activeFilters: {
        jobCategory: 'all',
        internshipType: 'all'
    }
};

// Apply for Job
function applyForJob(jobTitle) {
    const applicationData = {
        jobTitle: jobTitle,
        timestamp: new Date(),
        status: 'pending',
        resume: document.getElementById('resumeFile')?.value || 'default_resume.pdf',
        coverLetter: document.getElementById('coverLetter')?.value || ''
    };

    careerState.applications.push(applicationData);

    const messageElement = document.querySelector('.application-message');
    if (messageElement) {
        messageElement.innerHTML = `<p class="success">✅ Application submitted for ${jobTitle}</p>`;
        setTimeout(() => {
            messageElement.innerHTML = '';
        }, 3000);
    }

    alert(`Application submitted for ${jobTitle}. Good luck!`);
}

// Filter Jobs by Category
function filterJobs(category) {
    careerState.activeFilters.jobCategory = category;

    const jobElements = document.querySelectorAll('.job-card');

    jobElements.forEach(jobCard => {
        const jobCategory = jobCard.getAttribute('data-category') || 'all';

        if (category === 'all' || jobCategory === category) {
            jobCard.style.display = 'block';
            jobCard.classList.add('fade-in');
        } else {
            jobCard.style.display = 'none';
        }
    });

    // Update active filter button
    document.querySelectorAll('.job-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });
}

// Filter Internships
function filterInternships(internshipType) {
    careerState.activeFilters.internshipType = internshipType;

    const internshipElements = document.querySelectorAll('.internship-card');

    internshipElements.forEach(internshipCard => {
        const type = internshipCard.getAttribute('data-type') || 'all';

        if (internshipType === 'all' || type === internshipType) {
            internshipCard.style.display = 'block';
            internshipCard.classList.add('fade-in');
        } else {
            internshipCard.style.display = 'none';
        }
    });

    // Update filter button states
    document.querySelectorAll('.internship-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(internshipType)) {
            btn.classList.add('active');
        }
    });
}

// Handle Career Counselor Booking
function handleCareerBooking() {
    const counselorName = document.getElementById('counselorSelect')?.value || 'Dr. Smith';
    const date = document.getElementById('careerBookingDate')?.value || '';
    const time = document.getElementById('careerBookingTime')?.value || '';
    const topic = document.getElementById('careerTopic')?.value || 'General Career Guidance';

    if (!date || !time) {
        alert('Please select a date and time');
        return;
    }

    const bookingData = {
        counselor: counselorName,
        date: date,
        time: time,
        topic: topic,
        timestamp: new Date(),
        status: 'confirmed'
    };

    careerState.mentors.push(bookingData);

    const confirmationElement = document.querySelector('.career-booking-confirmation');
    if (confirmationElement) {
        confirmationElement.innerHTML = `
            <div class="booking-confirmation success">
                <h4>✅ Booking Confirmed!</h4>
                <p>Counselor: ${counselorName}</p>
                <p>Date: ${date}</p>
                <p>Time: ${time}</p>
                <p>Topic: ${topic}</p>
                <p>You will receive a reminder 24 hours before your session.</p>
            </div>
        `;
    }

    alert(`Career counseling session booked with ${counselorName}`);
}

// Get Applications Summary
function getApplicationsSummary() {
    const totalApplications = careerState.applications.length;
    const pending = careerState.applications.filter(app => app.status === 'pending').length;
    const rejected = careerState.applications.filter(app => app.status === 'rejected').length;
    const accepted = careerState.applications.filter(app => app.status === 'accepted').length;

    return {
        total: totalApplications,
        pending: pending,
        rejected: rejected,
        accepted: accepted
    };
}

// Export functions
window.CareerModule = {
    applyForJob: applyForJob,
    filterJobs: filterJobs,
    filterInternships: filterInternships,
    handleCareerBooking: handleCareerBooking,
    getApplicationsSummary: getApplicationsSummary,
    getCareerState: () => careerState
};
