const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inturnx');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Insert demo data after connection
    await insertDemoData();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Internship = require('./models/Internship');
const Project = require('./models/Project');

// Insert demo data
const insertDemoData = async () => {
  try {
    // Check if demo user exists
    const existingUser = await User.findOne({ email: 'demo@inturnx.com' });
    if (!existingUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('demo123', 12);

      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@inturnx.com',
        password: hashedPassword,
        role: 'student',
        xp: 150,
        badges: ['First Login', 'Explorer'],
        skills: ['JavaScript', 'React']
      });
      await demoUser.save();
      console.log('Demo user inserted');
    }

    // Check if courses exist
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const courses = [
        {
          title: 'Introduction to JavaScript',
          description: 'Learn the fundamentals of JavaScript programming',
          modules: ['Variables & Data Types', 'Functions', 'Objects & Arrays', 'DOM Manipulation'],
          category: 'Programming',
          difficulty: 'beginner',
          duration: '4 weeks',
          xpReward: 100
        },
        {
          title: 'React Fundamentals',
          description: 'Build modern web applications with React',
          modules: ['Components', 'State & Props', 'Hooks', 'Routing'],
          category: 'Frontend',
          difficulty: 'intermediate',
          duration: '6 weeks',
          xpReward: 150
        },
        {
          title: 'Data Structures & Algorithms',
          description: 'Master essential DSA concepts for coding interviews',
          modules: ['Arrays & Strings', 'Linked Lists', 'Trees', 'Dynamic Programming'],
          category: 'Computer Science',
          difficulty: 'advanced',
          duration: '8 weeks',
          xpReward: 200
        }
      ];

      await Course.insertMany(courses);
      console.log('Demo courses inserted');
    }

    // Check if internships exist
    const internshipCount = await Internship.countDocuments();
    if (internshipCount === 0) {
      const internships = [
        {
          company: 'Google',
          title: 'Software Engineering Intern',
          description: 'Work on cutting-edge projects with experienced engineers',
          skills: ['JavaScript', 'Python', 'Data Structures'],
          stipend: '$8000/month',
          location: 'Mountain View, CA',
          type: 'traditional'
        },
        {
          company: 'Microsoft',
          title: 'Frontend Developer Intern',
          description: 'Build user interfaces for Microsoft products',
          skills: ['React', 'TypeScript', 'CSS'],
          stipend: '$7500/month',
          location: 'Redmond, WA',
          type: 'traditional'
        },
        {
          company: 'Amazon',
          title: 'Full Stack Developer Intern',
          description: 'Develop scalable web applications',
          skills: ['Node.js', 'React', 'AWS'],
          stipend: '$7000/month',
          location: 'Seattle, WA',
          type: 'project-based',
          collaborationWithCompany: true,
          projectDetails: 'Build an internal dashboard for team productivity',
          collaborationFeatures: ['Mentorship', 'Code Reviews', 'Team Collaboration']
        }
      ];

      await Internship.insertMany(internships);
      console.log('Demo internships inserted');
    }
  } catch (error) {
    console.error('Error inserting demo data:', error);
  }
};

module.exports = { connectDB, User, Course, Internship, Project };