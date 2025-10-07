import mongoose from 'mongoose';
import Subject from '../models/Subject';
import dotenv from 'dotenv';

dotenv.config();

const subjectsData = [
  // CSE 1st Year
  { name: 'Mathematics I', code: 'MATH101', department: 'cse', year: '1st', description: 'Calculus and Linear Algebra' },
  { name: 'Physics I', code: 'PHY101', department: 'cse', year: '1st', description: 'Mechanics and Thermodynamics' },
  { name: 'Chemistry I', code: 'CHEM101', department: 'cse', year: '1st', description: 'General Chemistry' },
  { name: 'English Communication', code: 'ENG101', department: 'cse', year: '1st', description: 'Technical Communication' },
  { name: 'Programming Fundamentals', code: 'CS101', department: 'cse', year: '1st', description: 'Introduction to Programming' },
  { name: 'Engineering Mechanics', code: 'ME101', department: 'cse', year: '1st', description: 'Statics and Dynamics' },

  // CSE 2nd Year
  { name: 'Mathematics II', code: 'MATH201', department: 'cse', year: '2nd', description: 'Differential Equations and Complex Analysis' },
  { name: 'Data Structures & Algorithms', code: 'CS201', department: 'cse', year: '2nd', description: 'Core CS concepts' },
  { name: 'Object Oriented Programming', code: 'CS202', department: 'cse', year: '2nd', description: 'OOP principles and design' },
  { name: 'Database Management Systems', code: 'CS203', department: 'cse', year: '2nd', description: 'Database design and SQL' },
  { name: 'Computer Organization & Architecture', code: 'CS204', department: 'cse', year: '2nd', description: 'Computer hardware fundamentals' },
  { name: 'Discrete Mathematics', code: 'MATH202', department: 'cse', year: '2nd', description: 'Mathematical foundations for CS' },

  // CSE 3rd Year
  { name: 'Operating Systems', code: 'CS301', department: 'cse', year: '3rd', description: 'OS concepts and implementation' },
  { name: 'Computer Networks', code: 'CS302', department: 'cse', year: '3rd', description: 'Network protocols and architecture' },
  { name: 'Software Engineering', code: 'CS303', department: 'cse', year: '3rd', description: 'Software development lifecycle' },
  { name: 'Artificial Intelligence', code: 'CS304', department: 'cse', year: '3rd', description: 'AI algorithms and applications' },
  { name: 'Web Technologies', code: 'CS305', department: 'cse', year: '3rd', description: 'Frontend and backend development' },
  { name: 'Advanced Algorithms', code: 'CS306', department: 'cse', year: '3rd', description: 'Advanced algorithmic techniques' },

  // CSE 4th Year
  { name: 'Machine Learning', code: 'CS401', department: 'cse', year: '4th', description: 'ML algorithms and applications' },
  { name: 'Cybersecurity', code: 'CS402', department: 'cse', year: '4th', description: 'Information security principles' },
  { name: 'Cloud Computing', code: 'CS403', department: 'cse', year: '4th', description: 'Cloud platforms and services' },
  { name: 'Mobile Application Development', code: 'CS404', department: 'cse', year: '4th', description: 'Mobile app development' },
  { name: 'Final Year Project', code: 'CS405', department: 'cse', year: '4th', description: 'Capstone project' },
  { name: 'Industrial Training', code: 'CS406', department: 'cse', year: '4th', description: 'Industry internship' },

  // Mechanical 1st Year
  { name: 'Mathematics I', code: 'MATH101', department: 'mechanical', year: '1st', description: 'Calculus and Linear Algebra' },
  { name: 'Physics I', code: 'PHY101', department: 'mechanical', year: '1st', description: 'Mechanics and Thermodynamics' },
  { name: 'Chemistry I', code: 'CHEM101', department: 'mechanical', year: '1st', description: 'General Chemistry' },
  { name: 'English Communication', code: 'ENG101', department: 'mechanical', year: '1st', description: 'Technical Communication' },
  { name: 'Engineering Mechanics', code: 'ME101', department: 'mechanical', year: '1st', description: 'Statics and Dynamics' },
  { name: 'Engineering Drawing', code: 'ME102', department: 'mechanical', year: '1st', description: 'Technical drawing and CAD' },

  // Mechanical 2nd Year
  { name: 'Mathematics II', code: 'MATH201', department: 'mechanical', year: '2nd', description: 'Differential Equations and Complex Analysis' },
  { name: 'Thermodynamics', code: 'ME201', department: 'mechanical', year: '2nd', description: 'Heat and energy transfer' },
  { name: 'Materials Science', code: 'ME202', department: 'mechanical', year: '2nd', description: 'Properties of engineering materials' },
  { name: 'Manufacturing Processes', code: 'ME203', department: 'mechanical', year: '2nd', description: 'Production methods and techniques' },
  { name: 'Fluid Mechanics', code: 'ME204', department: 'mechanical', year: '2nd', description: 'Fluid behavior and applications' },
  { name: 'Theory of Machines', code: 'ME205', department: 'mechanical', year: '2nd', description: 'Machine design principles' },

  // Add more subjects for other departments as needed...
];

const populateSubjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hap-flashcards');
    console.log('Connected to MongoDB');

    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');

    // Insert new subjects
    await Subject.insertMany(subjectsData);
    console.log(`Inserted ${subjectsData.length} subjects`);

    console.log('Subjects populated successfully!');
  } catch (error) {
    console.error('Error populating subjects:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

populateSubjects();
