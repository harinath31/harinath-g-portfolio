export interface Job {
  role: string;
  period: string;
  current?: boolean;
  points: string[];
}

export interface SkillGroup {
  key: string;
  items: string[];
}

export interface Project {
  name: string;
  tags: string[];
  points: string[];
}

export const PROFILE = {
  name: 'Harinath G',
  title: 'Senior Software Engineer',
  currentRole: 'Team Lead',
  company: 'Syncfusion',
  location: 'Bengaluru, Karnataka',
  experienceYears: 4.5,
  email: 'harinathgunasekaran@gmail.com',
  phone: '+91 8012926377',
  github: 'https://github.com/harinath31',
  linkedin: 'https://www.linkedin.com/in/harinath-g-363295233',
  resume: 'Harinath_G_Resume.pdf',
  summary:
    'Senior Software Engineer with 4.5 years of experience in .NET and Angular full stack development and Android/iOS mobile application development using Flutter. Strong expertise in building scalable applications, developing RESTful APIs, and delivering end-to-end software solutions.',
};

export const JOBS: Job[] = [
  {
    role: 'Team Lead',
    period: 'Jul 2025 — Present',
    current: true,
    points: [
      'Improved quality and consistency across the team through structured reviews and shared development standards.',
      'Lead full stack development for a team of 4 developers and manage end-to-end project delivery, from requirements to release.',
      'Mentor team members, conduct code reviews, resolve technical challenges, and promote development best practices.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    period: 'Jul 2023 — Jul 2025',
    points: [
      'Resolved critical production issues in owned modules, reducing customer-reported bugs.',
      'Built end-to-end features spanning .NET APIs, Angular web UI, and Flutter mobile screens.',
      'Developed and enhanced 15+ application features across web and mobile platforms.',
      'Wrote unit tests for backend APIs and Flutter features, improving release reliability.',
    ],
  },
  {
    role: 'Software Engineer',
    period: 'May 2022 — Jul 2023',
    points: [
      'Delivered mobile features that brought key BoldDesk web functionality to Android and iOS users.',
      'Developed 10+ mobile application features using Flutter and Dart.',
      'Implemented ticket management features, push notifications, and customizable forms.',
      'Released and maintained app builds on Google Play Store and Apple App Store.',
    ],
  },
];

export const SKILLS: SkillGroup[] = [
  { key: 'backend', items: ['C#', '.NET Core', 'ASP.NET Web API', 'ASP.NET MVC', 'Entity Framework / EF Core', 'LINQ', 'RESTful APIs'] },
  { key: 'frontend', items: ['Angular', 'TypeScript', 'JavaScript', 'RxJS', 'HTML5', 'CSS3', 'Syncfusion Essential JS 2'] },
  { key: 'mobile', items: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'Android', 'iOS', 'Play Store / App Store'] },
  { key: 'database', items: ['SQL Server', 'PostgreSQL', 'SQL'] },
  { key: 'toolsAndPractices', items: ['Git', 'Visual Studio', 'Postman', 'Swagger', 'Azure DevOps', 'Agile/Scrum', 'Code Review', 'Unit Testing'] },
];

export const PROJECTS: Project[] = [
  {
    name: 'BoldDesk — Ticket Management System',
    tags: ['ASP.NET Web API', 'EF Core', 'SQL Server', 'Angular', 'Flutter'],
    points: [
      'Developed and optimized 30+ RESTful APIs for ticket management and activity tracking, with CRUD operations and improved backend performance and reliability.',
      'Optimized database queries and data access using indexing and Entity Framework tuning, while validating authentication flows and documenting security findings.',
      'Integrated backend APIs with Angular web and Flutter mobile applications, ensuring consistent data synchronization across platforms.',
    ],
  },
];

export const ACHIEVEMENTS = ['Promoted twice in three years at Syncfusion, progressing from Software Engineer to Team Lead.'];

export const SECTIONS = [
  { id: 'hero', file: 'Harinath.cs', badge: 'C#', kind: 'cs' },
  { id: 'experience', file: 'experience.sql', badge: 'SQL', kind: 'sql' },
  { id: 'skills', file: 'skills.json', badge: '{ }', kind: 'json' },
  { id: 'projects', file: 'projects.ts', badge: 'TS', kind: 'ts' },
  { id: 'mobile', file: 'main.dart', badge: 'DART', kind: 'dart' },
  { id: 'api', file: 'api.http', badge: 'GET', kind: 'get' },
  { id: 'contact', file: 'contact.http', badge: 'POST', kind: 'post' },
] as const;
