export interface Feedback {
  name: string;
  anonymous: boolean;
  rating: number;
  opinion: string;
  liked: string;
  favSubject: string;
  challenge: string;
  advice: string;
}

export const feedbacks: Feedback[] = [
  { name: "Georgios A.", anonymous: false, rating: 4, opinion: "I like it! It's a very versatile program that focuses on many different subjects!", liked: "The variety of different projects (Blender, Gimp...)", favSubject: "Web Development: Front-End", challenge: "Detailed Programming exercises, especially Java", advice: "If you have the slightest interest in technology, BINFO is very much worth considering!" },
  { name: "Anon", anonymous: true, rating: 3, opinion: "Its good, but it lacks modern standards like Kotlin and Rust.", liked: "Some teachers. And the people.", favSubject: "All of math", challenge: "The math.", advice: "It's an ok introduction for CS, but do things outside of university too." },
  { name: "Josh S.", anonymous: true, rating: 3, opinion: "Better technical alternative to BiCS but not stable enough compared to BiCS.", liked: "The class atmosphere and the teachers.", favSubject: "IT Security, Cloud Application", challenge: "Lack of Erasmus choices, too much theory.", advice: "BINFO is great but comes with challenges, lack of teachers, too much theory." },
  { name: "Valentin D.", anonymous: false, rating: 4, opinion: "Great to have that many projects but some courses should stay optional.", liked: "Projects", favSubject: "Software Engineering Project", challenge: "Math courses in general", advice: "A lot of mathematical understanding is required. Learn how to present yourself properly." },
  { name: "Anonymous", anonymous: true, rating: 4, opinion: "The program is general enough and touches a little of everything so you can find what you like.", liked: "More practice than theory.", favSubject: "Algorithms", challenge: "Math.", advice: "Be ready to invest time outside of official lessons on personal and group projects." },
  { name: "Alex", anonymous: true, rating: 4, opinion: "Well-organised lessons. Small classes allowed professors to give targeted feedback.", liked: "Interactivity (Wooclap) and practical work (group projects, Graphic Design).", favSubject: "Programming 2", challenge: "Group projects, communication, compromises, deadlines.", advice: "Friendly towards students with different levels of experience." },
  { name: "Pauline A.M.", anonymous: false, rating: 4, opinion: "A good program that teaches you hands on, with lots of projects throughout the year.", liked: "Even for someone with no programming background, it does not feel overwhelming.", favSubject: "Subjects with lots of coding", challenge: "Time management and impostor syndrome.", advice: "Not knowing anything about Informatics should not deter you from choosing this bachelor!" },
  { name: "Pella Massarou", anonymous: false, rating: 4, opinion: "Very good, many interesting subjects, practical experience, however sometimes lacking organisation.", liked: "Opportunities to improve, supportive professors.", favSubject: "Cybersecurity (upcoming)", challenge: "Mathematical subjects at the beginning.", advice: "Prepare for group work and don't leave things last minute!" },
  { name: "Yasmine Z.", anonymous: false, rating: 4, opinion: "A challenging but rewarding program that gives you a solid foundation in both theory and practice. The variety of subjects lets you explore different areas of CS and find what you're passionate about.", liked: "The hands-on projects and working with real tools used in the industry. The friends and some teachers.", favSubject: "Droit de l'informatique, Software Engineering, Graphic Design", challenge: "Keeping up with all the projects, especially during the 4th semester.", advice: "Don't be afraid if you feel overwhelmed at first, everyone does. Stay curious, work on personal projects outside of class, and don't leave things to the last minute!" },
  { name: "Mauro P.Q.", anonymous: false, rating: 4, opinion: "A good study program with a nice mix of theoretical and practical modules. It has a bit of everything and allows students to discover different IT topics and find one that resonates with them.", liked: "Learning by doing, most modules use practical work to teach concepts.", favSubject: "Algorithms and OS", challenge: "3rd semester was tough due to issues with some professors.", advice: "A balanced program that should open a lot of doors. No IT background required to start." },
  { name: "Mick N.", anonymous: true, rating: 4, opinion: "Good program with some very good professors, but also a few bad ones.", liked: "Classical programming classes and algorithms.", favSubject: "OOP Programming", challenge: "Networks, the professor was not good.", advice: "Lots of projects. Do them with people as motivated as you. Don't drag others down or let yourself get dragged down." },
  { name: "Sandrya S.", anonymous: false, rating: 4, opinion: "A good program that touches a bit of everything about CS.", liked: "Professors availability, lots of practice (TPs) and group work that prepares you for the working environment.", favSubject: "Software Engineering Project, Graphic Design, Web Development", challenge: "Workload, time and deadlines management, group projects.", advice: "You may feel behind at first, but with motivation and work on your personal time you'll face all challenges. Consistency is key!" },
];

export const anonymousNames = [
  "Malicious Computer",
  "Segfault Steve",
  "Null Pointer",
  "Stack Overflow",
  "404 Student",
  "Infinite Loop",
  "Binary Ghost",
  "Root Access",
  "Kernel Panic",
  "Undefined Behavior",
];

export const randomAnonymousName = () =>
    anonymousNames[Math.floor(Math.random() * anonymousNames.length)];