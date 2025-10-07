// src/data/subjects.ts
export const SUBJECTS_BY_DEPT_YEAR = {
  cse: {
    '1st-year': [
      { id: 'civil-fund', name: 'Fundamentals of Civil Engineering', code: 'CE101' },
      { id: 'material-sci', name: 'Material Science', code: 'MS101' },
      { id: 'applied-physics1', name: 'Applied Physics - 1', code: 'PHY101' },
      { id: 'applied-maths1', name: 'Applied Maths - 1', code: 'MATH101' },
      { id: 'engg-drawing', name: 'Engineering Drawing', code: 'ED101' },
      { id: 'programming-c-cpp', name: 'Programming in C and C++', code: 'CS101' },
      { id: 'applied-physics2', name: 'Applied Physics - 2', code: 'PHY102' },
      { id: 'applied-maths2', name: 'Applied Maths - 2', code: 'MATH102' },
      { id: 'engg-mechanics', name: 'Engineering Mechanics', code: 'EM101' },
      { id: 'electrical-machines', name: 'Electrical Engineering and Machines', code: 'EE101' }
    ],
    '2nd-year': [
      { id: 'oops-java', name: 'OoPS in JAVA', code: 'CS201' },
      { id: 'data-structure', name: 'Data Structure', code: 'CS202' },
      { id: 'applied-maths3', name: 'Applied Maths-3', code: 'MATH201' },
      { id: 'electronic-engg', name: 'Electronic Engineering', code: 'EE201' },
      { id: 'communication-skills', name: 'Communication Skills', code: 'COM201' },
      { id: 'combinatorial-method', name: 'Combinatorial Method', code: 'MATH202' },
      { id: 'dbms', name: 'Database and Management System', code: 'CS203' },
      { id: 'daa', name: 'Design and Analysis of Algorithms', code: 'CS204' },
      { id: 'analog-digital-comm', name: 'Analog and Digital Communication', code: 'EE202' }
    ],
    '3rd-year': [
      { id: 'theory-computation', name: 'Theory of Computation', code: 'CS301' },
      { id: 'computer-graphics', name: 'Computer Graphics', code: 'CS302' },
      { id: 'computer-organization', name: 'Computer Organization', code: 'CS303' },
      { id: 'web-programming', name: 'Basic of Web Programming', code: 'CS304' },
      { id: 'engg-economics', name: 'Engineering Economics', code: 'ECO301' },
      { id: 'computer-network', name: 'Computer Network', code: 'CS305' },
      { id: 'dotnet-tech', name: '.NET Technology', code: 'CS306' },
      { id: 'advanced-java', name: 'Advanced JAVA', code: 'CS307' },
      { id: 'operating-system', name: 'Operating System', code: 'CS308' },
      { id: 'software-engineer', name: 'Software Engineer', code: 'CS309' },
      { id: 'compiler-design', name: 'Compiler Design', code: 'CS310' }
    ],
    '4th-year': [
      { id: 'ml', name: 'Machine Learning', code: 'CS401' },
      { id: 'cyber', name: 'Cybersecurity', code: 'CS402' },
      { id: 'cloud', name: 'Cloud Computing', code: 'CS403' },
      { id: 'mobile', name: 'Mobile Application Development', code: 'CS404' },
      { id: 'project', name: 'Final Year Project', code: 'CS405' },
      { id: 'internship', name: 'Industrial Training', code: 'CS406' }
    ]
  },
  mechanical: {
    '1st-year': [
      { id: 'math1', name: 'Mathematics I', code: 'MATH101' },
      { id: 'physics1', name: 'Physics I', code: 'PHY101' },
      { id: 'chemistry1', name: 'Chemistry I', code: 'CHEM101' },
      { id: 'english1', name: 'English Communication', code: 'ENG101' },
      { id: 'mechanics', name: 'Engineering Mechanics', code: 'ME101' },
      { id: 'drawing', name: 'Engineering Drawing', code: 'ME102' }
    ],
    '2nd-year': [
      { id: 'math2', name: 'Mathematics II', code: 'MATH201' },
      { id: 'thermo', name: 'Thermodynamics', code: 'ME201' },
      { id: 'materials', name: 'Materials Science', code: 'ME202' },
      { id: 'manufacturing', name: 'Manufacturing Processes', code: 'ME203' },
      { id: 'fluids', name: 'Fluid Mechanics', code: 'ME204' },
      { id: 'machines', name: 'Theory of Machines', code: 'ME205' }
    ],
    '3rd-year': [
      { id: 'heat', name: 'Heat Transfer', code: 'ME301' },
      { id: 'design', name: 'Machine Design', code: 'ME302' },
      { id: 'control', name: 'Control Systems', code: 'ME303' },
      { id: 'production', name: 'Production Engineering', code: 'ME304' },
      { id: 'automotive', name: 'Automotive Engineering', code: 'ME305' },
      { id: 'cad', name: 'CAD/CAM', code: 'ME306' }
    ],
    '4th-year': [
      { id: 'project', name: 'Final Year Project', code: 'ME401' },
      { id: 'internship', name: 'Industrial Training', code: 'ME402' },
      { id: 'robotics', name: 'Robotics', code: 'ME403' },
      { id: 'renewable', name: 'Renewable Energy', code: 'ME404' },
      { id: 'quality', name: 'Quality Control', code: 'ME405' },
      { id: 'management', name: 'Project Management', code: 'ME406' }
    ]
  },
  electrical: {
    '1st-year': [
      { id: 'math1', name: 'Mathematics I', code: 'MATH101' },
      { id: 'physics1', name: 'Physics I', code: 'PHY101' },
      { id: 'chemistry1', name: 'Chemistry I', code: 'CHEM101' },
      { id: 'english1', name: 'English Communication', code: 'ENG101' },
      { id: 'circuits', name: 'Basic Electrical Circuits', code: 'EE101' },
      { id: 'mechanics', name: 'Engineering Mechanics', code: 'ME101' }
    ],
    '2nd-year': [
      { id: 'math2', name: 'Mathematics II', code: 'MATH201' },
      { id: 'electronics', name: 'Electronics I', code: 'EE201' },
      { id: 'machines', name: 'Electrical Machines', code: 'EE202' },
      { id: 'power', name: 'Power Systems', code: 'EE203' },
      { id: 'signals', name: 'Signals & Systems', code: 'EE204' },
      { id: 'control', name: 'Control Systems', code: 'EE205' }
    ],
    '3rd-year': [
      { id: 'power2', name: 'Advanced Power Systems', code: 'EE301' },
      { id: 'electronics2', name: 'Electronics II', code: 'EE302' },
      { id: 'communication', name: 'Communication Systems', code: 'EE303' },
      { id: 'microprocessor', name: 'Microprocessors', code: 'EE304' },
      { id: 'instrumentation', name: 'Instrumentation', code: 'EE305' },
      { id: 'renewable', name: 'Renewable Energy', code: 'EE306' }
    ],
    '4th-year': [
      { id: 'project', name: 'Final Year Project', code: 'EE401' },
      { id: 'internship', name: 'Industrial Training', code: 'EE402' },
      { id: 'smart', name: 'Smart Grid', code: 'EE403' },
      { id: 'automation', name: 'Industrial Automation', code: 'EE404' },
      { id: 'protection', name: 'Power System Protection', code: 'EE405' },
      { id: 'management', name: 'Project Management', code: 'EE406' }
    ]
  },
  chemical: {
    '1st-year': [
      { id: 'math1', name: 'Mathematics I', code: 'MATH101' },
      { id: 'physics1', name: 'Physics I', code: 'PHY101' },
      { id: 'chemistry1', name: 'Chemistry I', code: 'CHEM101' },
      { id: 'english1', name: 'English Communication', code: 'ENG101' },
      { id: 'organic', name: 'Organic Chemistry', code: 'CH101' },
      { id: 'mechanics', name: 'Engineering Mechanics', code: 'ME101' }
    ],
    '2nd-year': [
      { id: 'math2', name: 'Mathematics II', code: 'MATH201' },
      { id: 'thermo', name: 'Chemical Thermodynamics', code: 'CH201' },
      { id: 'kinetics', name: 'Chemical Kinetics', code: 'CH202' },
      { id: 'process', name: 'Process Calculations', code: 'CH203' },
      { id: 'materials', name: 'Materials Science', code: 'CH204' },
      { id: 'fluids', name: 'Fluid Mechanics', code: 'CH205' }
    ],
    '3rd-year': [
      { id: 'reactors', name: 'Chemical Reactors', code: 'CH301' },
      { id: 'separation', name: 'Separation Processes', code: 'CH302' },
      { id: 'heat', name: 'Heat Transfer', code: 'CH303' },
      { id: 'mass', name: 'Mass Transfer', code: 'CH304' },
      { id: 'process2', name: 'Process Design', code: 'CH305' },
      { id: 'safety', name: 'Process Safety', code: 'CH306' }
    ],
    '4th-year': [
      { id: 'project', name: 'Final Year Project', code: 'CH401' },
      { id: 'internship', name: 'Industrial Training', code: 'CH402' },
      { id: 'environmental', name: 'Environmental Engineering', code: 'CH403' },
      { id: 'biotech', name: 'Biotechnology', code: 'CH404' },
      { id: 'petroleum', name: 'Petroleum Engineering', code: 'CH405' },
      { id: 'management', name: 'Project Management', code: 'CH406' }
    ]
  },
  civil: {
    '1st-year': [
      { id: 'math1', name: 'Mathematics I', code: 'MATH101' },
      { id: 'physics1', name: 'Physics I', code: 'PHY101' },
      { id: 'chemistry1', name: 'Chemistry I', code: 'CHEM101' },
      { id: 'english1', name: 'English Communication', code: 'ENG101' },
      { id: 'mechanics', name: 'Engineering Mechanics', code: 'CE101' },
      { id: 'drawing', name: 'Engineering Drawing', code: 'CE102' }
    ],
    '2nd-year': [
      { id: 'math2', name: 'Mathematics II', code: 'MATH201' },
      { id: 'structures', name: 'Structural Analysis', code: 'CE201' },
      { id: 'materials', name: 'Construction Materials', code: 'CE202' },
      { id: 'surveying', name: 'Surveying', code: 'CE203' },
      { id: 'geotech', name: 'Geotechnical Engineering', code: 'CE204' },
      { id: 'fluids', name: 'Fluid Mechanics', code: 'CE205' }
    ],
    '3rd-year': [
      { id: 'concrete', name: 'Concrete Technology', code: 'CE301' },
      { id: 'steel', name: 'Steel Structures', code: 'CE302' },
      { id: 'transportation', name: 'Transportation Engineering', code: 'CE303' },
      { id: 'environmental', name: 'Environmental Engineering', code: 'CE304' },
      { id: 'construction', name: 'Construction Management', code: 'CE305' },
      { id: 'hydraulics', name: 'Hydraulics', code: 'CE306' }
    ],
    '4th-year': [
      { id: 'project', name: 'Final Year Project', code: 'CE401' },
      { id: 'internship', name: 'Industrial Training', code: 'CE402' },
      { id: 'earthquake', name: 'Earthquake Engineering', code: 'CE403' },
      { id: 'water', name: 'Water Resources', code: 'CE404' },
      { id: 'urban', name: 'Urban Planning', code: 'CE405' },
      { id: 'management', name: 'Project Management', code: 'CE406' }
    ]
  },
  other: {
    '1st-year': [
      { id: 'math1', name: 'Mathematics I', code: 'MATH101' },
      { id: 'physics1', name: 'Physics I', code: 'PHY101' },
      { id: 'chemistry1', name: 'Chemistry I', code: 'CHEM101' },
      { id: 'english1', name: 'English Communication', code: 'ENG101' },
      { id: 'basics', name: 'Engineering Basics', code: 'EN101' },
      { id: 'mechanics', name: 'Engineering Mechanics', code: 'ME101' }
    ],
    '2nd-year': [
      { id: 'math2', name: 'Mathematics II', code: 'MATH201' },
      { id: 'specialized1', name: 'Specialized Subject I', code: 'EN201' },
      { id: 'specialized2', name: 'Specialized Subject II', code: 'EN202' },
      { id: 'specialized3', name: 'Specialized Subject III', code: 'EN203' },
      { id: 'specialized4', name: 'Specialized Subject IV', code: 'EN204' },
      { id: 'specialized5', name: 'Specialized Subject V', code: 'EN205' }
    ],
    '3rd-year': [
      { id: 'advanced1', name: 'Advanced Subject I', code: 'EN301' },
      { id: 'advanced2', name: 'Advanced Subject II', code: 'EN302' },
      { id: 'advanced3', name: 'Advanced Subject III', code: 'EN303' },
      { id: 'advanced4', name: 'Advanced Subject IV', code: 'EN304' },
      { id: 'advanced5', name: 'Advanced Subject V', code: 'EN305' },
      { id: 'advanced6', name: 'Advanced Subject VI', code: 'EN306' }
    ],
    '4th-year': [
      { id: 'project', name: 'Final Year Project', code: 'EN401' },
      { id: 'internship', name: 'Industrial Training', code: 'EN402' },
      { id: 'elective1', name: 'Elective I', code: 'EN403' },
      { id: 'elective2', name: 'Elective II', code: 'EN404' },
      { id: 'elective3', name: 'Elective III', code: 'EN405' },
      { id: 'management', name: 'Project Management', code: 'EN406' }
    ]
  }
};

export const DEPARTMENTS = [
  { id: "cse", label: "Computer Science" },
  { id: "mechanical", label: "Mechanical" },
  { id: "electrical", label: "Electrical" },
  { id: "chemical", label: "Chemical" },
  { id: "civil", label: "Civil" },
  { id: "other", label: "Other" },
];

export const YEARS = [
  { id: "1st-year", label: "1st Year" },
  { id: "2nd-year", label: "2nd Year" },
  { id: "3rd-year", label: "3rd Year" },
  { id: "4th-year", label: "4th Year" },
];

export const getSubjectsByDeptYear = (department: string, year: string) => {
  return SUBJECTS_BY_DEPT_YEAR[department as keyof typeof SUBJECTS_BY_DEPT_YEAR]?.[year as keyof typeof SUBJECTS_BY_DEPT_YEAR.cse] || [];
};
