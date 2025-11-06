/**
 * ============================================
 * MODULE 7: BOOKING & APPOINTMENT SERVICES
 * ============================================
 * Purpose: Manage all appointment booking for various services
 * Functions: handleCounselingBooking(), handleAdvisorBooking(),
 *            handleMentorBooking(), handleFacultyBooking()
 * Dependencies: None (standalone)
 */

// Booking State
const bookingState = {
    counselingAppointments: [],
    advisorAppointments: [],
    mentorAppointments: [],
    facultyAppointments: [],
    availableSlots: {
        counseling: ['10:00 AM', '2:00 PM', '4:00 PM'],
        advisor: ['9:00 AM', '11:00 AM', '3:00 PM'],
        mentor: ['10:00 AM', '2:00 PM', '5:00 PM'],
        faculty: ['9:00 AM', '1:00 PM', '3:00 PM']
    }
};

// Handle Counseling Booking
function handleCounselingBooking() {
    const date = document.getElementById('counselingDate')?.value || '';
    const time = document.getElementById('counselingTime')?.value || '';
    const concern = document.getElementById('counselingConcern')?.value || 'General Support';
    const counselor = document.getElementById('counselorChoice')?.value || 'Available Counselor';

    if (!date || !time) {
        alert('Please select date and time');
        return;
    }

    const appointment = {
        type: 'counseling',
        counselor: counselor,
        date: date,
        time: time,
        concern: concern,
        status: 'confirmed',
        confirmationCode: 'COUNSEL-' + Date.now(),
        timestamp: new Date()
    };

    bookingState.counselingAppointments.push(appointment);
    displayBookingConfirmation('Counseling', appointment);
}

// Handle Advisor Booking
function handleAdvisorBooking() {
    const date = document.getElementById('advisorDate')?.value || '';
    const time = document.getElementById('advisorTime')?.value || '';
    const topic = document.getElementById('advisorTopic')?.value || 'Academic Planning';
    const advisor = document.getElementById('advisorSelect')?.value || 'Prof. Johnson';

    if (!date || !time) {
        alert('Please select date and time');
        return;
    }

    const appointment = {
        type: 'advisor',
        advisor: advisor,
        date: date,
        time: time,
        topic: topic,
        status: 'confirmed',
        confirmationCode: 'ADVISOR-' + Date.now(),
        timestamp: new Date()
    };

    bookingState.advisorAppointments.push(appointment);
    displayBookingConfirmation('Academic Advisor', appointment);
}

// Handle Mentor Booking
function handleMentorBooking() {
    const date = document.getElementById('mentorDate')?.value || '';
    const time = document.getElementById('mentorTime')?.value || '';
    const skillArea = document.getElementById('mentorSkill')?.value || 'General Mentoring';
    const mentor = document.getElementById('mentorSelect')?.value || 'Available Mentor';

    if (!date || !time) {
        alert('Please select date and time');
        return;
    }

    const appointment = {
        type: 'mentor',
        mentor: mentor,
        date: date,
        time: time,
        skillArea: skillArea,
        status: 'confirmed',
        confirmationCode: 'MENTOR-' + Date.now(),
        timestamp: new Date()
    };

    bookingState.mentorAppointments.push(appointment);
    displayBookingConfirmation('Mentor Session', appointment);
}

// Handle Faculty Booking
function handleFacultyBooking() {
    const date = document.getElementById('facultyDate')?.value || '';
    const time = document.getElementById('facultyTime')?.value || '';
    const subject = document.getElementById('facultySubject')?.value || 'General Discussion';
    const professor = document.getElementById('professorSelect')?.value || 'Faculty Member';

    if (!date || !time) {
        alert('Please select date and time');
        return;
    }

    const appointment = {
        type: 'faculty',
        professor: professor,
        date: date,
        time: time,
        subject: subject,
        status: 'confirmed',
        confirmationCode: 'FACULTY-' + Date.now(),
        timestamp: new Date()
    };

    bookingState.facultyAppointments.push(appointment);
    displayBookingConfirmation('Faculty Office Hours', appointment);
}

// Display Booking Confirmation
function displayBookingConfirmation(type, appointment) {
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'booking-confirmation-popup';
    confirmationDiv.innerHTML = `
        <div class="confirmation-content">
            <h3>✅ ${type} Booking Confirmed!</h3>
            <p><strong>Confirmation Code:</strong> ${appointment.confirmationCode}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p>A reminder will be sent 24 hours before your appointment.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-close">Close</button>
        </div>
    `;
    confirmationDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(10, 14, 39, 0.95);
        border: 2px solid rgb(57, 255, 20);
        padding: 30px;
        border-radius: 15px;
        z-index: 5000;
        min-width: 400px;
        box-shadow: 0 0 40px rgba(57, 255, 20, 0.5);
    `;

    document.body.appendChild(confirmationDiv);

    setTimeout(() => {
        if (confirmationDiv.parentElement) {
            confirmationDiv.remove();
        }
    }, 5000);
}

// Get Upcoming Appointments
function getUpcomingAppointments() {
    const allAppointments = [
        ...bookingState.counselingAppointments,
        ...bookingState.advisorAppointments,
        ...bookingState.mentorAppointments,
        ...bookingState.facultyAppointments
    ];

    return allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Export functions
window.BookingModule = {
    handleCounselingBooking: handleCounselingBooking,
    handleAdvisorBooking: handleAdvisorBooking,
    handleMentorBooking: handleMentorBooking,
    handleFacultyBooking: handleFacultyBooking,
    getUpcomingAppointments: getUpcomingAppointments,
    getBookingState: () => bookingState
};
