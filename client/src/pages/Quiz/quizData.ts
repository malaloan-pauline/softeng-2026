export type QuizCategory = 
  | 'Mathematics'
  | 'Programming'
  | 'Data Analysis/Statistics'
  | 'Graphics'
  | 'Algorithms/Problem-solving'
  | 'Operating Systems/CS Fundamentals';

export interface QuizQuestion {
  id: number;
  text: string;
  category: QuizCategory;
}

export interface CategoryInfo {
  name: QuizCategory;
  description: string;
  relatedCourses: string[];
}

// All 30 questions : 
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Mathematics 
  { id: 1, text: "Calculating areas, volumes, and geometric shapes feels satisfying ?", category: "Mathematics" },
  { id: 2, text: "You like working with series, sequences, and abstract formulas ?", category: "Mathematics" },
  { id: 3, text: "Solving equations and finding unknown variables excites you ?", category: "Mathematics" },
  { id: 4, text: "You find working with matrices and vectors interesting ?", category: "Mathematics" },
  { id: 5, text: "Understanding calculus concepts like derivatives and integrals appeals to you ?", category: "Mathematics" },
  // Programming 
  { id: 6, text: "Building something that runs on a computer from scratch is thrilling ?", category: "Programming" },
  { id: 7, text: "You enjoy hunting down bugs and fixing broken code ?", category: "Programming" },
  { id: 8, text: "You like automating repetitive tasks with code ?", category: "Programming" },
  { id: 9, text: "Writing loops and conditions to solve logical problems is satisfying ?", category: "Programming" },
  { id: 10, text: "You enjoy learning new programming languages and frameworks ?", category: "Programming" },
  // Data Analysis/Statistics :
  { id: 11, text: "Organising information into neat, structured tables appeals to you ?", category: "Data Analysis/Statistics" },
  { id: 12, text: "You enjoy writing queries to search and filter large sets of data ?", category: "Data Analysis/Statistics" },
  { id: 13, text: "Designing the architecture of how data should be stored interests you ?", category: "Data Analysis/Statistics" },
  { id: 14, text: "Analysing trends in data charts feels exciting ?", category: "Data Analysis/Statistics" },
  { id: 15, text: "You love interpreting results from experiments or surveys ?", category: "Data Analysis/Statistics" },
  // Graphics :
  { id: 16, text: "You dream of building a video game or interactive visual experience ?", category: "Graphics" },
  { id: 17, text: "3D rendering and how pixels become images on screen fascinates you ?", category: "Graphics" },
  { id: 18, text: "Creating visual things (images, shapes, animations) is exciting ?", category: "Graphics" },
  { id: 19, text: "Designing user interfaces and visual layouts is fun for you ?", category: "Graphics" },
  { id: 20, text: "You're interested in animation and how movement is created digitally ?", category: "Graphics" },
  
  // Algorithms/Problem-solving (5)
  { id: 21, text: "You enjoy logical puzzles like Sudoku, chess, or riddles ?", category: "Algorithms/Problem-solving" },
  { id: 22, text: "Formal proof-writing and reasoning from first principles interests you ?", category: "Algorithms/Problem-solving" },
  { id: 23, text: "Figuring out the most efficient way to solve a problem satisfies you ?", category: "Algorithms/Problem-solving" },
  { id: 24, text: "Finding shortest paths or optimal routes in a network is interesting ?", category: "Algorithms/Problem-solving" },
  { id: 25, text: "You care about making a program run as fast as possible ?", category: "Algorithms/Problem-solving" },
  
  // Operating Systems/CS Fundamentals (5)
  { id: 26, text: "You enjoy assembling or configuring computer components ?", category: "Operating Systems/CS Fundamentals" },
  { id: 27, text: "The link between software code and physical hardware interests you ?", category: "Operating Systems/CS Fundamentals" },
  { id: 28, text: "Using the terminal and writing shell scripts is something you enjoy ?", category: "Operating Systems/CS Fundamentals" },
  { id: 29, text: "How the OS handles files, permissions, and security intrigues you ?", category: "Operating Systems/CS Fundamentals" },
  { id: 30, text: "Understanding how networks and the internet work fascinates you ?", category: "Operating Systems/CS Fundamentals" },
];

// Category details for the results page : 
export const CATEGORY_INFO: Record<QuizCategory, CategoryInfo> = {
  "Mathematics": {
    name: "Mathematics",
    description: "You enjoy mathematical thinking and problem-solving",
    relatedCourses: ["Calculus", "Discrete Mathematics", "Linear Algebra", "Statistics & Probability"]
  },
  "Programming": {
    name: "Programming",
    description: "You love building and creating with code",
    relatedCourses: ["Programming 1 (Java)", "Programming 2", "Object-Oriented Programming"]
  },
  "Data Analysis/Statistics": {
    name: "Data Analysis/Statistics",
    description: "You're interested in data, databases, and statistics",
    relatedCourses: ["Introduction to Data Analysis", "Statistics & Probability", "Database Systems"]
  },
  "Graphics": {
    name: "Graphics",
    description: "You're drawn to visual creation and design",
    relatedCourses: ["Introduction to Graphics", "Game Development", "UI/UX Design"]
  },
  "Algorithms/Problem-solving": {
    name: "Algorithms/Problem-solving",
    description: "You excel at logical thinking and optimization",
    relatedCourses: ["Algorithms 1", "Data Structures", "Computational Thinking"]
  },
  "Operating Systems/CS Fundamentals": {
    name: "Operating Systems/CS Fundamentals",
    description: "You're curious about how computers work under the hood",
    relatedCourses: ["Operating Systems", "Computer Architecture", "Networks & Security"]
  }
};