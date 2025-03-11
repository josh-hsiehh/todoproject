import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {initializeApp} from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signOut, signInWithPopup} from 'firebase/auth';
import './App.css';

//Firebase Component
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "buddyup-92a14.firebaseapp.com",
  projectId: "buddyup-92a14",
  storageBucket: "buddyup-92a14.firebasestorage.app",
  messagingSenderId: "508756983687",
  appId: "1:508756983687:web:b54afaa3816bb3b5e2dd22",
  measurementId: "G-K9H1S85E45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Firebase authentication
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();



// Main App Component
function App() {

    const [user, setUser] = useState(null);
    useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
    }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar user = {user}/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<GoalTracker />} />
          <Route path="/reflections" element={<Reflections />} />
          <Route path="/buddies" element={<AccountabilityBuddies />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Navigation Component
function Navbar() {

  const handleLogout = () => signOut(auth);

  return (
    <nav className="navbar">
      <div className="logo">BuddyUp</div>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/goals">Goals</Link></li>
        <li><Link to="/reflections">Reflections</Link></li>
        <li><Link to="/buddies">Buddies</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        
      </ul>
    </nav>
  );
}

// Dashboard Component
function Dashboard() {
  const [user, setUser] = useState({
    name: "Josh",
    dailyCheckIn: false,
    pendingGoals: 3,
    completedGoals: 2,
    buddyRequests: 1
  });

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      
      <div className="dashboard-summary">
        <div className="card">
          <h3>Daily Check-in</h3>
          {user.dailyCheckIn ? 
            <p>✅ Completed</p> : 
            <button className="primary-btn">Check In Now</button>
          }
        </div>
        
        <div className="card">
          <h3>Goal Status</h3>
          <p>{user.pendingGoals} goals in progress</p>
          <p>{user.completedGoals} goals completed</p>
          <Link to="/goals" className="link-btn">View All Goals</Link>
        </div>
        
        <div className="card">
          <h3>Purpose Reflection</h3>
          <p>Explore your values and purpose</p>
          <Link to="/reflections" className="link-btn">Start Reflection</Link>
        </div>
        
        <div className="card">
          <h3>Buddy Activity</h3>
          <p>{user.buddyRequests} new buddy request</p>
          <Link to="/buddies" className="link-btn">View Buddies</Link>
        </div>
      </div>
    </div>
  );
}

// Goal Tracker Component
function GoalTracker() {
  const [goals, setGoals] = useState([
    { id: 1, title: "Complete project research", category: "Academic", deadline: "2025-03-10", progress: 60, buddies: ["Jamie"] },
    { id: 2, title: "Exercise 3x this week", category: "Fitness", deadline: "2025-03-12", progress: 33, buddies: ["Taylor"] },
    { id: 3, title: "Read 20 pages daily", category: "Personal", deadline: "2025-03-15", progress: 45, buddies: [] }
  ]);
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "Academic",
    deadline: "",
    buddies: []
  });
  
  const handleAddGoal = (e) => {
    e.preventDefault();
    const goalToAdd = {
      id: goals.length + 1,
      ...newGoal,
      progress: 0
    };
    
    setGoals([...goals, goalToAdd]);
    setNewGoal({
      title: "",
      category: "Academic",
      deadline: "",
      buddies: []
    });
  };
  
  const updateProgress = (id, newProgress) => {
    setGoals(goals.map(goal => 
      goal.id === id ? {...goal, progress: newProgress} : goal
    ));
  };
  
  return (
    <div className="goal-tracker">
      <h1>Goal Tracker</h1>
      
      <div className="add-goal-form">
        <h3>Add New Goal</h3>
        <form onSubmit={handleAddGoal}>
          <input 
            type="text" 
            placeholder="Goal title" 
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            required
          />
          
          <select 
            value={newGoal.category}
            onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
          >
            <option value="Academic">Academic</option>
            <option value="Fitness">Fitness</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Purpose">Purpose & Meaning</option>
          </select>
          
          <input 
            type="date" 
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            required
          />
          
          <button type="submit" className="primary-btn">Add Goal</button>
        </form>
      </div>
      
      <div className="goals-list">
        <h3>Your Goals</h3>
        {goals.map(goal => (
          <div key={goal.id} className="goal-card">
            <div className="goal-info">
              <h4>{goal.title}</h4>
              <span className="category-badge">{goal.category}</span>
              <p>Deadline: {goal.deadline}</p>
              <div className="progress-container">
                <div className="progress-bar" style={{width: `${goal.progress}%`}}></div>
              </div>
              <p>{goal.progress}% Complete</p>
            </div>
            
            <div className="goal-actions">
              <button onClick={() => updateProgress(goal.id, Math.min(goal.progress + 10, 100))} className="action-btn">
                Update Progress
              </button>
              {goal.buddies.length > 0 ? (
                <div className="buddies-section">
                  <p>Accountability Buddies:</p>
                  <ul>
                    {goal.buddies.map(buddy => <li key={buddy}>{buddy}</li>)}
                  </ul>
                </div>
              ) : (
                <button className="action-btn">Add Buddy</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reflections Component for Self-Understanding and Purpose
function Reflections() {
  const [reflections, setReflections] = useState([
    { id: 1, date: "2025-03-04", topic: "Values", content: "I realized today that helping others is one of my core values." },
    { id: 2, date: "2025-03-02", topic: "Purpose", content: "I'm beginning to see that my education connects to my larger goals of environmental conservation." }
  ]);
  
  const [newReflection, setNewReflection] = useState({
    topic: "Values",
    content: ""
  });
  
  const purposePrompts = [
    "What activities make you lose track of time?",
    "What problems in the world are you drawn to solve?",
    "When do you feel most alive or energized?",
    "What are your unique strengths and how might they serve others?",
    "What would you do if you weren't afraid of failure?"
  ];
  
  const [currentPrompt, setCurrentPrompt] = useState(purposePrompts[0]);
  
  const handleAddReflection = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    const reflectionToAdd = {
      id: reflections.length + 1,
      date: today,
      ...newReflection
    };
    
    setReflections([reflectionToAdd, ...reflections]);
    setNewReflection({
      topic: "Values",
      content: ""
    });
    
    // Change prompt
    const randomIndex = Math.floor(Math.random() * purposePrompts.length);
    setCurrentPrompt(purposePrompts[randomIndex]);
  };
  
  return (
    <div className="reflections">
      <h1>Self-Reflection & Purpose</h1>
      
      <div className="reflection-form">
        <h3>Today's Reflection</h3>
        <div className="prompt-box">
          <p><strong>Prompt:</strong> {currentPrompt}</p>
        </div>
        
        <form onSubmit={handleAddReflection}>
          <select 
            value={newReflection.topic}
            onChange={(e) => setNewReflection({...newReflection, topic: e.target.value})}
          >
            <option value="Values">Values</option>
            <option value="Purpose">Purpose</option>
            <option value="Strengths">Strengths</option>
            <option value="Goals">Goals</option>
            <option value="Challenges">Challenges</option>
          </select>
          
          <textarea 
            placeholder="Write your reflection here..."
            value={newReflection.content}
            onChange={(e) => setNewReflection({...newReflection, content: e.target.value})}
            required
            rows={4}
          />
          
          <button type="submit" className="primary-btn">Save Reflection</button>
        </form>
      </div>
      
      <div className="reflection-insights">
        <h3>Purpose Insights</h3>
        <p>Based on your reflections, you seem to value connection, learning, and making a difference. 
           Consider exploring careers or projects that combine technology with environmental or social impact.</p>
      </div>
      
      <div className="reflections-list">
        <h3>Past Reflections</h3>
        {reflections.map(reflection => (
          <div key={reflection.id} className="reflection-card">
            <div className="reflection-header">
              <span className="date">{reflection.date}</span>
              <span className="topic-badge">{reflection.topic}</span>
            </div>
            <p>{reflection.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Accountability Buddies Component
function AccountabilityBuddies() {
  const [buddies, setBuddies] = useState([
    { id: 1, name: "Jamie", status: "active", sharedGoals: 2 },
    { id: 2, name: "Taylor", status: "active", sharedGoals: 1 }
  ]);
  
  const [requests, setRequests] = useState([
    { id: 1, name: "Morgan", message: "Would love to be accountability partners for our CS course!" }
  ]);
  
  const acceptRequest = (id) => {
    const requestToAccept = requests.find(req => req.id === id);
    setBuddies([...buddies, {
      id: buddies.length + 1,
      name: requestToAccept.name,
      status: "active",
      sharedGoals: 0
    }]);
    
    setRequests(requests.filter(req => req.id !== id));
  };
  
  return (
    <div className="accountability-buddies">
      <h1>Accountability Buddies</h1>
      
      {requests.length > 0 && (
        <div className="buddy-requests">
          <h3>Buddy Requests</h3>
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <p><strong>{request.name}</strong> wants to connect!</p>
              <p>"{request.message}"</p>
              <div className="request-actions">
                <button onClick={() => acceptRequest(request.id)} className="primary-btn">Accept</button>
                <button className="secondary-btn">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="buddies-list">
        <h3>Your Accountability Buddies</h3>
        {buddies.map(buddy => (
          <div key={buddy.id} className="buddy-card">
            <div className="buddy-info">
              <h4>{buddy.name}</h4>
              <p>{buddy.sharedGoals} shared goals</p>
            </div>
            <div className="buddy-actions">
              <button className="action-btn">Message</button>
              <button className="action-btn">Check Goals</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="find-buddies">
        <h3>Find New Buddies</h3>
        <div className="search-container">
          <input type="text" placeholder="Search by name or interest" />
          <button className="primary-btn">Search</button>
        </div>
        <p>Or invite friends via email:</p>
        <div className="invite-container">
          <input type="email" placeholder="friend@example.com" />
          <button className="primary-btn">Send Invite</button>
        </div>
      </div>
    </div>
  );
}

// User Profile Component
function Profile({ user }) {
  const [profile, setProfile] = useState({
    name: user ? user.displayName || "" : "",
    email: user ? user.email : "",
    bio: "Computer Science student interested in web development and AI. Looking to build better study habits.",
    values: ["Learning", "Connection", "Innovation"],
    purposeStatement: "To use technology to solve meaningful problems that impact people's daily lives."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleSaveProfile = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(e => setAuthError(e.message));
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .catch(e => setAuthError(e.message));
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .catch(e => setAuthError(e.message));
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="profile">
        <h1>Please sign in to view your profile.</h1>
        <div className="auth-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} className="primary-btn">Sign In</button>
          <button onClick={handleSignUp} className="secondary-btn">Sign Up</button>
          <button onClick = {handleGoogleSignIn} className="google-btn">Sign In with Google</button>
          {authError && <p style={{color: 'red'}}>{authError}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile">
      <h1>Your Profile</h1>
     
      
      {isEditing ? (
        <div className="edit-profile">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={editedProfile.name} 
              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={editedProfile.email} 
              onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={editedProfile.bio} 
              onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Purpose Statement</label>
            <textarea 
              value={editedProfile.purposeStatement} 
              onChange={(e) => setEditedProfile({...editedProfile, purposeStatement: e.target.value})}
              rows={3}
              placeholder="What gives your life meaning and direction?"
            />
          </div>
          
          <div className="profile-actions">
            <button onClick={handleSaveProfile} className="primary-btn">Save Profile</button>
            <button onClick={() => setIsEditing(false)} className="secondary-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-view">
          <div className="profile-card">
            <h3>{profile.name}</h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
            
            <div className="values-section">
              <h4>Core Values:</h4>
              <div className="values-list">
                {profile.values.map((value, index) => (
                  <span key={index} className="value-badge">{value}</span>
                ))}
              </div>
            </div>
            
            <div className="purpose-section">
              <h4>Purpose Statement:</h4>
              <p>{profile.purposeStatement}</p>
            </div>
            
            <button onClick={() => setIsEditing(true)} className="primary-btn">Edit Profile</button>
            <button onClick={handleSignOut} className="secondary-btn">Sign Out</button>
          </div>
          
          <div className="stats-section">
            <h3>Your Progress</h3>
            <div className="stats-container">
              <div className="stat-card">
                <h4>5</h4>
                <p>Goals Created</p>
              </div>
              <div className="stat-card">
                <h4>2</h4>
                <p>Goals Completed</p>
              </div>
              <div className="stat-card">
                <h4>8</h4>
                <p>Reflections</p>
              </div>
              <div className="stat-card">
                <h4>2</h4>
                <p>Accountability Buddies</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;