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
  { name: "Josh S.", anonymous: true, rating: 3, opinion: "Better technical alternative to BiCS but not stable enough compared to BiCS.", liked: "The class atmosphere and the teachers.", favSubject: "IT Security, Cloud Application", challenge: "Lack of Erasmus choices, too much theory.", advice: "BINFO is great but comes with challenges — lack of teachers, too much theory." },
  { name: "Valentin D.", anonymous: false, rating: 4, opinion: "Great to have that many projects but some courses should stay optional.", liked: "Projects", favSubject: "Software Engineering Project", challenge: "Math courses in general", advice: "A lot of mathematical understanding is required. Learn how to present yourself properly." },
  { name: "Anonymous", anonymous: true, rating: 4, opinion: "The program is general enough and touches a little of everything so you can find what you like.", liked: "More practice than theory.", favSubject: "Algorithms", challenge: "Math.", advice: "Be ready to invest time outside of official lessons on personal and group projects." },
  { name: "Alex", anonymous: true, rating: 4, opinion: "Well-organised lessons. Small classes allowed professors to give targeted feedback.", liked: "Interactivity (Wooclap) and practical work (group projects, Graphic Design).", favSubject: "Programming 2", challenge: "Group projects — communication, compromises, deadlines.", advice: "Friendly towards students with different levels of experience." },
  { name: "Pauline A. Malalo-an", anonymous: false, rating: 4, opinion: "A good program that teaches you hands on, with lots of projects throughout the year.", liked: "Even for someone with no programming background, it does not feel overwhelming.", favSubject: "Subjects with lots of coding", challenge: "Time management and impostor syndrome.", advice: "Not knowing anything about Informatics should not deter you from choosing this bachelor!" },
  { name: "Pella Massarou", anonymous: false, rating: 4, opinion: "Very good, many interesting subjects, practical experience, however sometimes lacking organisation.", liked: "Opportunities to improve, supportive professors.", favSubject: "Cybersecurity (upcoming)", challenge: "Mathematical subjects at the beginning.", advice: "Prepare for group work and don't leave things last minute!" },
  { name: "Y.Z.", anonymous: false, rating: 4, opinion: "A challenging but rewarding program that gives you a solid foundation in both theory and practice. The variety of subjects lets you explore different areas of CS and find what you're passionate about.", liked: "The hands-on projects and working with real tools used in the industry. The friends and some teachers.", favSubject: "Droit de l'informatique, Software Engineering, Graphic Design", challenge: "Keeping up with all the projects, especially during the 5th semester.", advice: "Don't be afraid if you feel overwhelmed at first — everyone does. Stay curious, work on personal projects outside of class, and don't leave things to the last minute!" },
];