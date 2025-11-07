import os
from datetime import datetime, date, timedelta, timezone
from functools import wraps

from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, Date, desc, asc
from sqlalchemy.orm import Session # Import Session for modern ORM access

# --- FLASK CONFIGURATION ---
app = Flask(__name__)
# Configure a simple SQLite database for this demo
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'unisphere.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'a_very_secret_key_for_unisphere' 

db = SQLAlchemy(app)

# --- DATABASE MODELS ---

class User(db.Model):
    """Represents a student or an admin."""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    gpa = db.Column(db.Float, default=0.0) 
    
    # Relationships
    appointments = db.relationship('Appointment', backref='student', lazy=True)
    hydration_entries = db.relationship('HydrationEntry', backref='student', lazy=True)
    courses = db.relationship('Course', backref='student', lazy=True)
    mood_entries = db.relationship('MoodEntry', backref='student', lazy=True) 
    financial_entries = db.relationship('FinancialEntry', backref='student', lazy=True)
    notifications = db.relationship('Notification', backref='recipient', lazy=True) 
    timetable_entries = db.relationship('TimetableEntry', backref='student', lazy=True)
    tests = db.relationship('Test', backref='student', lazy=True)
    study_sessions = db.relationship('StudySession', backref='student', lazy=True)
    
    # NEW Community Relationships
    community_posts = db.relationship('CommunityPost', backref='author', lazy=True)
    community_comments = db.relationship('CommunityComment', backref='author', lazy=True)
    sent_messages = db.relationship('DirectMessage', foreign_keys='DirectMessage.sender_id', backref='sender', lazy=True)
    received_messages = db.relationship('DirectMessage', foreign_keys='DirectMessage.receiver_id', backref='receiver', lazy=True)


    def __repr__(self):
        return f'<User {self.username}>'

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, default=0)
    credits = db.Column(db.Float, default=3.0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'score': self.score,
            'credits': self.credits,
        }

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        # Format the datetime for easier frontend use (though FE handles isoformat too)
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'date_time': self.date_time.isoformat(),
            'details': self.details,
        }

class HydrationEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount_ml = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 

    def to_dict(self):
        return {
            'id': self.id,
            'amount_ml': self.amount_ml,
            'timestamp': self.timestamp.isoformat(),
        }

class MoodEntry(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mood_score = db.Column(db.Integer, nullable=False)
    entry_date = db.Column(Date, default=date.today, nullable=False) # Date portion for history chart
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) # Full timestamp for click logging
    
    def to_dict(self):
        return {
            'id': self.id,
            'mood_score': self.mood_score,
            'entry_date': self.entry_date.isoformat(),
            'timestamp': self.timestamp.isoformat(),
        }

class FinancialEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    month_year = db.Column(db.String(7), nullable=False)
    
    # Note: Using month_year and category ensures only one entry per category per month per user
    __table_args__ = (db.UniqueConstraint('user_id', 'category', 'month_year', name='_user_category_month_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'amount': self.amount,
            'month_year': self.month_year
        }

class Notification(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'timestamp': self.timestamp.isoformat(),
            'is_read': self.is_read
        }

class TimetableEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_title = db.Column(db.String(100), nullable=False)
    day_of_week = db.Column(db.String(10), nullable=False) # e.g., 'Monday', 'Tuesday'
    start_time = db.Column(db.String(5), nullable=False) # e.g., '09:00'
    end_time = db.Column(db.String(5), nullable=False)   # e.g., '10:30'
    location = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_title': self.course_title,
            'day_of_week': self.day_of_week,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'location': self.location,
        }

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_title = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False) # e.g., 'Midterm', 'Assignment'
    due_date = db.Column(db.DateTime, nullable=False)
    details = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_title': self.course_title,
            'type': self.type,
            'due_date': self.due_date.isoformat(),
            'details': self.details,
        }

class StudySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic = db.Column(db.String(100), nullable=True)
    duration_seconds = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    end_time = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'duration_seconds': self.duration_seconds,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat() if self.end_time else None,
        }

# NEW: Community Models
class CommunityPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    comments = db.relationship('CommunityComment', backref='post', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.author.username,
            'title': self.title,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'comment_count': len(self.comments)
        }

class CommunityComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('community_post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'username': self.author.username,
            'content': self.content,
            'timestamp': self.timestamp.isoformat()
        }

class DirectMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content_encrypted = db.Column(db.Text, nullable=False) # Simulated E2EE: Stores encrypted message
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'sender_username': self.sender.username,
            'content_encrypted': self.content_encrypted,
            'timestamp': self.timestamp.isoformat()
        }
# END NEW COMMUNITY MODELS

# --- HELPER FUNCTIONS & DECORATORS ---

def calculate_gpa(user_id):
    """Calculates and updates the user's GPA based on current courses."""
    with Session(db.engine) as session_obj:
        user = session_obj.get(User, user_id)
        if not user:
            return 0.0

        courses = Course.query.filter_by(user_id=user_id).all()
            
        total_quality_points = 0.0
        total_credits = 0.0

        def score_to_gpa_point(score):
            # Standard 4.0 scale conversion (A=4, B=3, C=2, D=1, F=0)
            if score >= 90: return 4.0
            if score >= 80: return 3.0
            if score >= 70: return 2.0
            if score >= 60: return 1.0
            return 0.0

        for course in courses:
            gpa_point = score_to_gpa_point(course.score)
            total_quality_points += gpa_point * course.credits
            total_credits += course.credits

        if total_credits == 0:
            user.gpa = 0.0
        else:
            gpa = total_quality_points / total_credits
            user.gpa = round(gpa, 2)
            
        session_obj.commit()
        return user.gpa


def setup_database(app):
    """Creates tables and initial demo users WITH SAMPLE DATA if they don't exist."""
    with app.app_context():
        # --- FIX: Delete existing database file to apply new MoodEntry schema ---
        if os.path.exists(DB_PATH):
            try:
                os.remove(DB_PATH)
                print("Old database file removed due to schema change.")
            except PermissionError:
                # Handle the case where the previous process still holds a lock on the DB file
                print("WARNING: Could not remove old database file due to file lock. Schema changes may not be applied.")
        # -----------------------------------------------------------------------

        db.create_all()
        if not User.query.first():
            # Create essential accounts for testing login
            student = User(username='student', password_hash='studentpass', is_admin=False, id=1, gpa=0.0)
            admin = User(username='admin', password_hash='adminpass', is_admin=True, id=2, gpa=0.0)
            user3 = User(username='user3', password_hash='pass3', is_admin=False, id=3, gpa=0.0)
            user4 = User(username='user4', password_hash='pass4', is_admin=False, id=4, gpa=0.0)
            db.session.add_all([student, admin, user3, user4])
            db.session.commit()

            # --- ADD SAMPLE DATA FOR STUDENT (ID 1) ---
            student_id = 1
            user3_id = 3
            user4_id = 4
            
            # 1. Courses
            courses = [
                Course(user_id=student_id, title='Calculus I', score=85, credits=4.0),
                Course(user_id=student_id, title='Computer Science Basics', score=92, credits=3.0),
                Course(user_id=student_id, title='Academic Writing', score=78, credits=3.0)
            ]
            db.session.add_all(courses)
            db.session.commit()
            calculate_gpa(student_id) # Calculate initial GPA
            
            # 2. Timetable
            timetable = [
                TimetableEntry(user_id=student_id, course_title='Calculus I', day_of_week='Monday', start_time='09:00', end_time='10:30', location='Math Hall 101'),
                TimetableEntry(user_id=student_id, course_title='Computer Science Basics', day_of_week='Tuesday', start_time='14:00', end_time='15:30', location='CS Lab A'),
                TimetableEntry(user_id=student_id, course_title='Academic Writing', day_of_week='Wednesday', start_time='11:00', end_time='12:00', location='Library Rm 3'),
                TimetableEntry(user_id=student_id, course_title='Calculus I', day_of_week='Friday', start_time='09:00', end_time='10:30', location='Math Hall 101'),
            ]
            db.session.add_all(timetable)
            
            # 3. Study Sessions (Sample Data)
            db.session.add(StudySession(user_id=student_id, topic="Calculus Derivatives", duration_seconds=3600, start_time=datetime.now(timezone.utc)-timedelta(days=1), end_time=datetime.now(timezone.utc)-timedelta(days=1, hours=1)))
            
            # 4. Mood Entries (Sample Data)
            db.session.add_all([
                MoodEntry(user_id=student_id, mood_score=7, entry_date=date.today() - timedelta(days=2)),
                MoodEntry(user_id=student_id, mood_score=9, entry_date=date.today() - timedelta(days=1)),
                MoodEntry(user_id=student_id, mood_score=5, entry_date=date.today(), timestamp=datetime.now(timezone.utc) - timedelta(hours=3)),
            ])


            # 5. Tests
            next_week = datetime.now(timezone.utc) + timedelta(days=7)
            three_weeks = datetime.now(timezone.utc) + timedelta(days=21)
            
            tests = [
                Test(user_id=student_id, course_title='Computer Science Basics', type='Midterm', due_date=next_week, details='Covers Modules 1-5.'),
                Test(user_id=student_id, course_title='Academic Writing', type='Assignment', due_date=three_weeks, details='Research paper draft due.'),
            ]
            db.session.add_all(tests)
            
            # 6. Financial (Initial Budget)
            today_month = date.today().strftime('%Y-%m')
            finance = [
                FinancialEntry(user_id=student_id, category='income', amount=1500.00, month_year=today_month),
                FinancialEntry(user_id=student_id, category='rent', amount=600.00, month_year=today_month),
                FinancialEntry(user_id=student_id, category='food', amount=350.00, month_year=today_month),
                FinancialEntry(user_id=student_id, category='other', amount=200.00, month_year=today_month),
            ]
            db.session.add_all(finance)
            
            # 7. Notifications
            db.session.add(Notification(user_id=student_id, message="Welcome to UNISPHERE! Check your academic hub."))
            db.session.add(Notification(user_id=student_id, message="Calculus I GPA updated to B+."))

            # 8. Community Posts
            post1 = CommunityPost(user_id=student_id, title="Best study music?", content="What genres help you focus the most?")
            post2 = CommunityPost(user_id=user3_id, title="Trouble with Calculus I", content="Stuck on related rates problems. Any advice?")
            db.session.add_all([post1, post2])
            db.session.commit() # Need to commit posts before adding comments
            
            # 9. Community Comments
            db.session.add(CommunityComment(post_id=post2.id, user_id=student_id, content="Try drawing the problem setup first. Visual aids help a ton!"))
            db.session.add(CommunityComment(post_id=post1.id, user_id=user4_id, content="I listen to Lo-fi beats—super chill."))
            db.session.commit()
            
            # 10. Direct Messages (Simulated Encrypted)
            # Student (1) messages User3 (3)
            db.session.add(DirectMessage(sender_id=student_id, receiver_id=user3_id, content_encrypted="Encrypted: Hey, I saw your post. Want to study related rates together? [1]"))
            # User3 (3) replies to Student (1)
            db.session.add(DirectMessage(sender_id=user3_id, receiver_id=student_id, content_encrypted="Encrypted: That would be great! I'm free Tuesday afternoon. [3]"))
            db.session.commit()


            print("Initial users and sample data created.")

def login_required(f):
    """A decorator to restrict access to authenticated users."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401
        
        # Check if user exists
        with Session(db.engine) as session_obj:
            user = session_obj.get(User, session['user_id'])
            if not user:
                session.pop('user_id', None)
                return jsonify({'message': 'User not found, re-authentication required'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """A decorator to restrict access to admin users."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401
        
        # Check if user is admin
        with Session(db.engine) as session_obj:
            user = session_obj.get(User, session['user_id'])
            if not user or not user.is_admin:
                return jsonify({'message': 'Admin privilege required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

# --- ROUTES (Authentication and Navigation) ---

@app.route('/')
def home():
    """Serves the index.html page."""
    return render_template('index.html') 

@app.route('/admin/login', methods=['POST'])
def admin_login():
    """Handles admin login."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.is_admin and user.password_hash == password:
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        return jsonify({
            'success': True, 
            'message': 'Admin login successful', 
            'is_admin': user.is_admin,
        }), 200
    
    return jsonify({'success': False, 'message': 'Invalid admin credentials'}), 401

@app.route('/login', methods=['POST'])
def login():
    """Handles standard student login."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    
    if user and user.is_admin:
        return jsonify({'success': False, 'message': 'Use the dedicated Admin Login page'}), 403

    if user and user.password_hash == password:
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_admin'] = user.is_admin
        return jsonify({
            'success': True, 
            'message': 'Login successful', 
            'is_admin': user.is_admin,
        }), 200
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/signup', methods=['POST'])
def signup():
    """Registers a new standard user."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already taken'}), 409

    new_user = User(username=username, password_hash=password, is_admin=False, gpa=0.0)
    db.session.add(new_user)
    db.session.commit()
    
    # Log in the new user immediately
    session['user_id'] = new_user.id
    session['username'] = new_user.username
    session['is_admin'] = new_user.is_admin
    
    return jsonify({
        'success': True, 
        'message': 'Account created successfully! Logging you in...',
        'is_admin': new_user.is_admin,
    }), 201

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('is_admin', None)
    return redirect(url_for('home'))


# --- API ENDPOINTS (STUDENT DASHBOARD) ---

@app.route('/api/dashboard', methods=['GET'])
@login_required
def dashboard_data():
    """Fetches combined dashboard data for the logged-in user."""
    user_id = session['user_id']
    
    with Session(db.engine) as session_obj:
        user = session_obj.get(User, user_id)
    
        now = datetime.now(timezone.utc) 
        today = now.date()
        current_month_year = today.strftime('%Y-%m')

        # 1. Wellness Data
        hydration_today = db.session.query(func.sum(HydrationEntry.amount_ml)).filter(
            HydrationEntry.user_id == user_id,
            # Fix: Use isoformat on a date object, not a datetime object to match Python date object output
            func.date(HydrationEntry.timestamp) == today.isoformat() 
        ).scalar() or 0
        
        # Fetch all mood entries for charts and suggestions (last 30 days or so)
        # This query relies on the new 'timestamp' column being present.
        mood_history = MoodEntry.query.filter(
            MoodEntry.user_id == user_id,
            MoodEntry.timestamp >= now - timedelta(days=30)
        ).order_by(MoodEntry.timestamp.asc()).all()
        
        # 2. Academic Data
        courses = Course.query.filter_by(user_id=user_id).all()
        user_gpa = user.gpa
        
        # Study Session Data
        study_sessions = StudySession.query.filter_by(user_id=user_id).order_by(StudySession.start_time.desc()).limit(10).all()

        # 3. Scheduling Data
        timetable = TimetableEntry.query.filter_by(user_id=user_id).order_by(TimetableEntry.start_time.asc()).all()
        
        # Upcoming tests (filtered by due date >= now)
        upcoming_tests = Test.query.filter(Test.user_id == user_id, Test.due_date >= now).order_by(Test.due_date.asc()).all() 
        
        # Upcoming appointments (filtered by date_time >= now)
        upcoming_appointments = Appointment.query.filter(
            Appointment.user_id == user_id,
            Appointment.date_time >= now
        ).order_by(Appointment.date_time).limit(5).all()

        # 4. Financial Data
        financial_data = FinancialEntry.query.filter_by(user_id=user_id, month_year=current_month_year).all()
        
        # 5. Notifications
        unread_notifications_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
        
        return jsonify({
            'user': {'username': user.username, 'gpa': user_gpa, 'is_admin': user.is_admin, 'id': user_id},
            'wellness': {
                'hydration_ml': hydration_today, 
                'goal_ml': 2000, 
                'mood_history': [m.to_dict() for m in mood_history]
            },
            'courses': [c.to_dict() for c in courses],
            'appointments': [a.to_dict() for a in upcoming_appointments],
            'timetable': [t.to_dict() for t in timetable], 
            'upcoming_tests': [t.to_dict() for t in upcoming_tests], 
            'finance': [f.to_dict() for f in financial_data],
            'notifications': {'unread_count': unread_notifications_count},
            'study_sessions': [s.to_dict() for s in study_sessions]
        })

# --- APIS (Student Data Management) ---

@app.route('/api/hydration', methods=['POST'])
@login_required
def add_hydration():
    data = request.get_json()
    amount_ml = data.get('amount_ml')
    # FIX: Ensure user_id is retrieved from the session, not the request
    user_id = session.get('user_id') 
    
    if not user_id:
        return jsonify({'message': 'Authentication required for this action'}), 401
        
    if not amount_ml or not isinstance(amount_ml, int) or amount_ml <= 0:
        return jsonify({'message': 'Invalid amount_ml'}), 400
    
    new_entry = HydrationEntry(user_id=user_id, amount_ml=amount_ml) 
    db.session.add(new_entry)
    db.session.commit()
    
    # Recalculate hydration total to return the new amount to the frontend without a full refresh
    today = datetime.now(timezone.utc).date()
    hydration_today = db.session.query(func.sum(HydrationEntry.amount_ml)).filter(
        HydrationEntry.user_id == user_id,
        func.date(HydrationEntry.timestamp) == today.isoformat()
    ).scalar() or 0
    
    return jsonify({'success': True, 'message': f'Added {amount_ml}ml', 'total_today': hydration_today}), 201

# NEW: Study Session Endpoints
@app.route('/api/study_session', methods=['POST'])
@login_required
def log_study_session():
    data = request.get_json()
    topic = data.get('topic')
    duration_seconds = data.get('duration_seconds')
    
    if not isinstance(duration_seconds, int) or duration_seconds <= 0:
        return jsonify({'message': 'Invalid duration.'}), 400

    # Log the end time as now (when the POST is received)
    new_session = StudySession(
        user_id=session['user_id'],
        topic=topic,
        duration_seconds=duration_seconds,
        # Calculate approximate start time
        start_time=datetime.now(timezone.utc) - timedelta(seconds=duration_seconds),
        end_time=datetime.now(timezone.utc)
    )
    db.session.add(new_session)
    db.session.commit()
    
    return jsonify({'success': True, 'session': new_session.to_dict()}), 201

@app.route('/api/study_session', methods=['GET'])
@login_required
def get_study_sessions():
    sessions = StudySession.query.filter_by(user_id=session['user_id']).order_by(StudySession.end_time.desc()).limit(10).all()
    return jsonify([s.to_dict() for s in sessions])
    
@app.route('/api/mood', methods=['POST'])
@login_required
def log_mood():
    data = request.get_json()
    mood_score = data.get('mood_score')
    user_id = session['user_id']
    if not isinstance(mood_score, int) or not (1 <= mood_score <= 10):
        return jsonify({'message': 'Invalid mood score. Must be between 1 and 10.'}), 400
    
    # Log mood entry with full timestamp, allowing multiple entries per day
    new_entry = MoodEntry(
        user_id=user_id, 
        mood_score=mood_score, 
        entry_date=date.today(), # Uses today's date for daily summaries/charts
        timestamp=datetime.now(timezone.utc) # Uses full timestamp for individual click logging
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Mood logged successfully'}), 201

@app.route('/api/appointments', methods=['POST'])
@login_required
def book_appointment():
    data = request.get_json()
    app_type = data.get('type')
    date_str = data.get('date')
    time_str = data.get('time')
    details = data.get('details')
    
    try:
        # Combine date and time, and ensure it's timezone aware (UTC)
        date_time = datetime.strptime(f'{date_str} {time_str}', '%Y-%m-%d %H:%M').replace(tzinfo=timezone.utc) 
    except ValueError:
        return jsonify({'message': 'Invalid date or time format'}), 400
        
    # FIX: Ensure appointment date is not in the past
    if date_time < datetime.now(timezone.utc).replace(second=0, microsecond=0):
        # We allow booking for the current minute, but not before
        return jsonify({'message': 'Cannot book an appointment for a past date or time.'}), 400
        
    new_app = Appointment(user_id=session['user_id'], type=app_type, date_time=date_time, details=details)
    db.session.add(new_app)
    db.session.commit()
    return jsonify({'success': True, 'appointment': new_app.to_dict()}), 201

@app.route('/api/timetable', methods=['GET', 'POST', 'DELETE'])
@login_required
def student_manage_timetable():
    """Allows students to manage their own timetable entries."""
    user_id = session['user_id']

    if request.method == 'GET':
        entries = TimetableEntry.query.filter_by(user_id=user_id).order_by(asc(TimetableEntry.day_of_week), asc(TimetableEntry.start_time)).all()
        return jsonify([e.to_dict() for e in entries])

    data = request.get_json()

    if request.method == 'POST':
        course_title = data.get('course_title')
        day_of_week = data.get('day_of_week')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        location = data.get('location')

        if not all([course_title, day_of_week, start_time, end_time]):
            return jsonify({'message': 'Missing required fields'}), 400

        new_entry = TimetableEntry(user_id=user_id, course_title=course_title, day_of_week=day_of_week, start_time=start_time, end_time=end_time, location=location)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Timetable entry added.'}), 201

    if request.method == 'DELETE':
        entry_id = data.get('id')
        with Session(db.engine) as session_obj:
            entry = session_obj.query(TimetableEntry).filter(TimetableEntry.id == entry_id, TimetableEntry.user_id == user_id).first()
            if not entry:
                return jsonify({'message': 'Entry not found or unauthorized'}), 404
            session_obj.delete(entry)
            session_obj.commit()
            return jsonify({'success': True, 'message': 'Timetable entry deleted.'}), 200

@app.route('/api/notifications', methods=['GET', 'POST'])
@login_required
def manage_notifications():
    user_id = session['user_id']
    
    if request.method == 'GET':
        notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.timestamp.desc()).limit(20).all()
        return jsonify([n.to_dict() for n in notifications])

    if request.method == 'POST':
        data = request.get_json()
        action = data.get('action')
        
        if action == 'mark_read':
            notification_id = data.get('id')
            if notification_id:
                with Session(db.engine) as session_obj:
                    notif = session_obj.get(Notification, notification_id)
                    if notif and notif.user_id == user_id:
                        notif.is_read = True
                        session_obj.commit()
                        return jsonify({'success': True, 'message': 'Notification marked as read'}), 200
            
            # Mark all as read
            # Use synchronize_session='fetch' to ensure state is updated across different contexts
            Notification.query.filter_by(user_id=user_id, is_read=False).update(
                {Notification.is_read: True}, 
                synchronize_session='fetch'
            )
            db.session.commit()
            return jsonify({'success': True, 'message': 'All notifications marked as read'}), 200

    return jsonify({'message': 'Invalid action'}), 400

@app.route('/api/finance', methods=['GET', 'POST'])
@login_required
def manage_finance():
    user_id = session['user_id']
    current_month_year = date.today().strftime('%Y-%m')
    
    if request.method == 'GET':
        financial_data = FinancialEntry.query.filter_by(user_id=user_id, month_year=current_month_year).all()
        return jsonify([f.to_dict() for f in financial_data])
    
    if request.method == 'POST':
        data = request.get_json()
        entries = data.get('entries', [])

        # 1. Delete all existing entries for the current user and current month
        FinancialEntry.query.filter_by(user_id=user_id, month_year=current_month_year).delete()
        
        # 2. Add new entries
        new_entries = []
        for entry in entries:
            category = entry.get('category')
            amount = entry.get('amount')
            
            if category and amount is not None:
                try:
                    amount = float(amount)
                except ValueError:
                    return jsonify({'message': f'Invalid amount for category {category}'}), 400

                if amount < 0:
                    return jsonify({'message': f'Amount for {category} cannot be negative.'}), 400

                new_entry = FinancialEntry(
                    user_id=user_id, 
                    category=category, 
                    amount=amount, 
                    month_year=current_month_year
                )
                new_entries.append(new_entry)
        
        db.session.add_all(new_entries)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Monthly budget saved successfully!'}), 200


# --- ACADEMIC (COURSE) ENDPOINTS ---

@app.route('/api/courses', methods=['GET', 'POST', 'DELETE'])
@login_required
def manage_courses():
    user_id = session['user_id']
    
    if request.method == 'GET':
        courses = Course.query.filter_by(user_id=user_id).order_by(Course.title).all()
        return jsonify([c.to_dict() for c in courses])
    
    data = request.get_json()
    
    if request.method == 'POST':
        title = data.get('title')
        score = data.get('score', 0)
        credits = data.get('credits', 3.0)
        
        if not title or credits <= 0:
            return jsonify({'message': 'Course title and valid credits are required.'}), 400
        
        new_course = Course(user_id=user_id, title=title, score=score, credits=credits)
        db.session.add(new_course)
        db.session.commit()
        calculate_gpa(user_id)
        return jsonify({'success': True, 'message': 'Course added.'}), 201

    if request.method == 'DELETE':
        course_id = data.get('id')
        course = Course.query.filter_by(id=course_id, user_id=user_id).first() 
        
        if not course:
            return jsonify({'message': 'Course not found or unauthorized'}), 404
            
        db.session.delete(course)
        db.session.commit()
        calculate_gpa(user_id)
        return jsonify({'success': True, 'message': 'Course deleted.'}), 200
        
    # NOTE: PUT method for course update is not implemented as the current front-end only uses POST/DELETE/GET.

# --- COMMUNITY ENDPOINTS ---

@app.route('/api/community/posts', methods=['GET', 'POST'])
@login_required
def community_posts():
    user_id = session['user_id']
    if request.method == 'GET':
        posts = CommunityPost.query.order_by(CommunityPost.timestamp.desc()).all()
        return jsonify([p.to_dict() for p in posts])
    
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        if not title or not content:
            return jsonify({'message': 'Title and content are required'}), 400
            
        new_post = CommunityPost(user_id=user_id, title=title, content=content)
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'success': True, 'post': new_post.to_dict()}), 201

@app.route('/api/community/posts/<int:post_id>/comments', methods=['GET', 'POST'])
@login_required
def post_comments(post_id):
    user_id = session['user_id']
    if request.method == 'GET':
        comments = CommunityComment.query.filter_by(post_id=post_id).order_by(CommunityComment.timestamp.asc()).all()
        return jsonify([c.to_dict() for c in comments])
        
    if request.method == 'POST':
        data = request.get_json()
        content = data.get('content')
        if not content:
            return jsonify({'message': 'Comment content is required'}), 400
            
        post = CommunityPost.query.get(post_id)
        if not post:
            return jsonify({'message': 'Post not found'}), 404
            
        new_comment = CommunityComment(post_id=post_id, user_id=user_id, content=content)
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({'success': True, 'comment': new_comment.to_dict()}), 201

@app.route('/api/community/users', methods=['GET'])
@login_required
def community_users():
    # Only return users who are not the currently logged-in user
    users = User.query.filter(User.id != session['user_id']).all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

@app.route('/api/community/chat/<int:target_id>', methods=['GET', 'POST'])
@login_required
def direct_chat(target_id):
    user_id = session['user_id']
    
    if request.method == 'GET':
        # Fetch messages between the current user and the target user
        messages = DirectMessage.query.filter(
            (DirectMessage.sender_id == user_id) & (DirectMessage.receiver_id == target_id) |
            (DirectMessage.sender_id == target_id) & (DirectMessage.receiver_id == user_id)
        ).order_by(DirectMessage.timestamp.asc()).limit(50).all()
        
        return jsonify([m.to_dict() for m in messages])
        
    if request.method == 'POST':
        data = request.get_json()
        # NOTE: Frontend is responsible for encrypting the message content (simulated E2EE)
        content_encrypted = data.get('content_encrypted')
        
        target_user = User.query.get(target_id)
        if not target_user:
            return jsonify({'message': 'Target user not found'}), 404
            
        new_message = DirectMessage(
            sender_id=user_id,
            receiver_id=target_id,
            content_encrypted=content_encrypted
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'success': True, 'message': new_message.to_dict()}), 201

# --- ADMIN PANEL ENDPOINTS ---

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    users = User.query.all()
    user_list = [{
        'id': u.id,
        'username': u.username,
        'is_admin': u.is_admin,
        'gpa': u.gpa
    } for u in users]
    return jsonify(user_list)

@app.route('/api/admin/user/<int:user_id>', methods=['DELETE', 'PUT'])
@admin_required
def manage_user(user_id):
    with Session(db.engine) as session_obj:
        user = session_obj.get(User, user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if request.method == 'DELETE':
            session_obj.delete(user)
            session_obj.commit()
            return jsonify({'success': True, 'message': f'User {user_id} deleted'}), 200
            
        elif request.method == 'PUT':
            data = request.get_json()
            # Only allow GPA and is_admin modification
            if 'gpa' in data:
                user.gpa = data['gpa']
            if 'is_admin' in data:
                user.is_admin = data['is_admin']
            session_obj.commit()
            return jsonify({'success': True, 'message': f'User {user_id} updated'}), 200

@app.route('/api/admin/timetable', methods=['GET', 'POST', 'DELETE'])
@admin_required
def admin_manage_timetable():
    if request.method == 'GET':
        # Fetch all timetable entries and the associated student username
        timetable_data = db.session.query(TimetableEntry, User.username).join(User).order_by(asc(TimetableEntry.day_of_week), asc(TimetableEntry.start_time)).all()
        entries_list = []
        for entry, username in timetable_data:
            e_dict = entry.to_dict()
            e_dict['username'] = username
            entries_list.append(e_dict)
        return jsonify(entries_list)

    data = request.get_json()
    
    if request.method == 'POST':
        user_id = data.get('user_id')
        course_title = data.get('course_title')
        day_of_week = data.get('day_of_week')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        location = data.get('location')
        
        if not all([user_id, course_title, day_of_week, start_time, end_time]):
            return jsonify({'message': 'Missing required fields'}), 400
            
        new_entry = TimetableEntry(user_id=user_id, course_title=course_title, day_of_week=day_of_week, start_time=start_time, end_time=end_time, location=location)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Timetable entry added.'}), 201

    if request.method == 'DELETE':
        entry_id = data.get('id')
        with Session(db.engine) as session_obj:
            entry = session_obj.get(TimetableEntry, entry_id)
            if not entry: return jsonify({'message': 'Entry not found'}), 404
            session_obj.delete(entry)
            session_obj.commit()
            return jsonify({'success': True, 'message': 'Timetable entry deleted.'}), 200

@app.route('/api/admin/tests', methods=['GET', 'POST', 'DELETE'])
@admin_required
def admin_manage_tests():
    if request.method == 'GET':
        # Fetch all tests and the associated student username
        tests_data = db.session.query(Test, User.username).join(User).order_by(asc(Test.due_date)).all()
        tests_list = []
        for test, username in tests_data:
            t_dict = test.to_dict()
            t_dict['username'] = username
            tests_list.append(t_dict)
        return jsonify(tests_list)

    data = request.get_json()
    
    if request.method == 'POST':
        user_id = data.get('user_id')
        course_title = data.get('course_title')
        type = data.get('type')
        due_date_str = data.get('due_date')
        details = data.get('details')
        
        if not all([user_id, course_title, type, due_date_str]):
            return jsonify({'message': 'Missing required fields'}), 400

        try:
            # Parse and ensure timezone awareness
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '')).replace(tzinfo=timezone.utc)
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400

        new_test = Test(user_id=user_id, course_title=course_title, type=type, due_date=due_date, details=details)
        db.session.add(new_test)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Test added.'}), 201

    if request.method == 'DELETE':
        test_id = data.get('id')
        with Session(db.engine) as session_obj:
            test = session_obj.get(Test, test_id)
            if not test: return jsonify({'message': 'Test not found'}), 404
            session_obj.delete(test)
            session_obj.commit()
            return jsonify({'success': True, 'message': 'Test deleted.'}), 200

# --- RUN THE APP ---

if __name__ == '__main__':
    setup_database(app)
    app.run(debug=True, port=5000)