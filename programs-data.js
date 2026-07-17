/* ===========================================================================
   Terrain — UCLA programs & environmental data science internships
   Loaded by programs.html

   Accuracy note: every internship below is a real, verifiable program. Links
   point to the actual application / program page (not a generic company site).
   Deadlines shift slightly year to year — each card says to verify on the
   official page, and the "deadlineSort" date is the next expected window.
   =========================================================================== */

window.PROGRAM_IMAGES = {
  'B.S. in Environmental Science': 'assets/programs/ucla-seal.png',
  'Minor in Environmental Systems and Society': 'assets/programs/ess-minor.jpg',
  'Programming with Big Environmental Datasets (ENVIRON 175)': 'assets/programs/programming.jpg',
  'IoES Senior Practicum': 'assets/programs/teamwork.jpg',
  'Ph.D. in Environment and Sustainability': 'assets/programs/research-lab.jpg',
  'D.Env. in Environmental Science & Engineering': 'assets/programs/env-science.jpg',
  'Leaders in Sustainability Graduate Certificate': 'assets/programs/seedling.jpg',
  'Field Fellowship for Environmental Justice': 'assets/programs/water.jpg',
  'NASA EarthRISE Developers Academy (DEVELOP)': 'assets/programs/logos/nasa.png',
  'Sustainable LA Grand Challenge': 'assets/programs/la-skyline.jpg',
  'IoES Impact Fellows': 'assets/programs/logos/ucla-ioes.png',
  'California Center for Sustainable Communities (CCSC)': 'assets/programs/solar-energy.jpg',
  'UCLA La Kretz Center for California Conservation': 'assets/programs/conservation.jpg',
  'UCLA Undergraduate Research Centers': 'assets/programs/logos/ucla-research.png',
  'B.S. Statistics & Data Science': 'assets/programs/data-analytics.jpg',
  'UCLA DataX': 'assets/programs/logos/ucla-datax.png',
  'Emmett Institute on Climate Change & the Environment': 'assets/programs/courthouse.jpg'
};

window.INTERNSHIP_IMAGES = {
  'nasa-earthrise': 'assets/programs/logos/nasa.png',
  'jpl-intern': 'assets/programs/logos/nasa.png',
  'noaa-hollings': 'assets/programs/logos/noaa.png',
  'epa-orise': 'assets/programs/logos/orise.png',
  'usgs-pathways': 'assets/programs/logos/usgs.png',
  'doe-suli': 'assets/programs/logos/doe.png',
  'edf-climate-corps': 'assets/programs/logos/edf.png',
  'rmi-intern': 'assets/programs/logos/rmi.png',
  'wri-intern': 'assets/programs/logos/wri.png',
  'ceres-intern': 'assets/programs/logos/ceres.svg',
  'esri-intern': 'assets/programs/logos/esri.png',
  'nrdc-intern': 'assets/programs/logos/nrdc.png',
  'datakind': 'assets/programs/logos/datakind.png',
  'carbon-plan': 'assets/programs/logos/carbonplan.png',
  'climate-trace': 'assets/programs/logos/climatetrace.png',
  'ucla-ursp': 'assets/programs/logos/ucla-research.png',
  'luskin-ej-fellowship': 'assets/programs/ucla-seal.png'
};

window.APPLICATION_GUIDE = {
  title: 'How to land an environmental data internship',
  sections: [
    {
      heading: 'Start 6\u20139 months early',
      body: 'The most competitive programs recruit a full season ahead. NASA EarthRISE/DEVELOP, NOAA Hollings, and DOE SULI all close months before the start date \u2014 Hollings in late January, SULI in early January for summer, EDF Climate Corps in December. Put every deadline on your calendar the day you find it.'
    },
    {
      heading: 'Build a one-page portfolio',
      body: 'Link two Terrain projects (or your own notebooks) that show you can load real environmental data, clean it, chart it, and write a takeaway. Recruiters skim fast; a GitHub repo with a short README beats a generic resume line.'
    },
    {
      heading: 'Match skills to the posting',
      body: 'If they want Python + GIS, open with a map you made. If they want R + policy, lead with a CalEnviroScreen or emissions analysis. Mirror their vocabulary in your cover letter.'
    },
    {
      heading: 'Ask UCLA faculty for warm intros',
      body: 'Many lab and center placements never hit a public job board. Email one paragraph: your year, skills, a link to work, and the kind of data you want to work on. See the <a href="index.html#faculty">faculty directory</a>.'
    }
  ],
  universalPrompts: [
    'Describe a time you turned a messy environmental dataset into a clear chart or map. What decisions did you make?',
    'Why does this organization\u2019s mission matter to you personally \u2014 and how do your data skills help?',
    'What is one environmental question you would answer with the tools this role uses (Python, R, GIS, remote sensing)?',
    'Tell us about a project where you communicated technical results to a non-technical audience.',
    'What would you want to learn in the first 30 days of this internship?'
  ],
  coverLetterOutline: [
    'Paragraph 1: Hook with a specific environmental problem + your relevant skill (one sentence each).',
    'Paragraph 2: One project example with a link \u2014 what data, what you did, what you found.',
    'Paragraph 3: Why this organization and team (cite a report, dataset, or initiative they run).',
    'Paragraph 4: What you will contribute in week 1\u20134 and how it connects to your longer goals.'
  ]
};

window.PROGRAMS = [
  {
    title: 'B.S. in Environmental Science',
    host: 'Institute of the Environment & Sustainability (IoES)',
    type: 'degree', audience: 'undergrad',
    desc: 'UCLA\u2019s main environmental undergraduate degree. It combines science, policy, and data skills with a required concentration (for example Earth and Environmental Science, GIS, or Conservation Biology) and the year-long Senior Practicum capstone.',
    who: 'First-years through seniors considering a full environmental science major.',
    time: '4 years \u00b7 180+ units',
    gain: 'Research methods, policy literacy, GIS/data options and a client-facing capstone portfolio.',
    apply: 'Declare via Letters & Science; see IoES handbook for prep courses and practicum timing.',
    tags: ['IoES', 'major', 'undergraduate'],
    links: [
      { label: 'Program overview', url: 'https://www.ioes.ucla.edu/envisci/program/', primary: true },
      { label: 'Course requirements', url: 'https://www.ioes.ucla.edu/envisci/course-requirements/' },
      { label: 'Student handbook (PDF)', url: 'https://www.ioes.ucla.edu/wp-content/uploads/2021/02/handbookrev0221.pdf' }
    ],
    keywords: 'bachelor bs environmental science major ioes envisci undergraduate degree'
  },
  {
    title: 'Minor in Environmental Systems and Society',
    host: 'IoES',
    type: 'degree', audience: 'undergrad',
    desc: 'Seven courses chosen from 40+ options, including air pollution, water, environmental justice, business and the environment, and programming with environmental data. Pairs well with Statistics, Engineering, or Public Affairs.',
    who: 'Any UCLA undergrad who wants environmental literacy alongside their primary major.',
    time: '7 courses \u00b7 flexible pacing',
    gain: 'Breadth across science, policy and justice; strong complement to data science or engineering.',
    apply: 'Declare through your college; see the minor course schedule each quarter.',
    tags: ['minor', 'cross-disciplinary', 'ESS'],
    links: [
      { label: 'Minor overview', url: 'https://www.ioes.ucla.edu/envisci/minor/', primary: true },
      { label: 'B.S. program (for comparison)', url: 'https://www.ioes.ucla.edu/envisci/program/' }
    ],
    keywords: 'minor ess environmental systems society cross major elective'
  },
  {
    title: 'Programming with Big Environmental Datasets (ENVIRON 175)',
    host: 'IoES \u00b7 Alan Barreca',
    type: 'capstone', audience: 'undergrad',
    desc: 'Hands-on course using real environmental datasets in code. Connects statistics and programming to environmental science. Required for the B.S. and counts toward the ESS minor.',
    who: 'Environmental science majors and minors; also useful for Statistics and Data Science students.',
    time: '1 quarter',
    gain: 'Practical data wrangling, analysis and visualization on environmental problems at scale.',
    apply: 'Enroll during registration. Offered in fall and spring; check the IoES course schedule.',
    tags: ['coursework', 'Python/R', 'data science'],
    links: [
      { label: 'B.S. course list', url: 'https://www.ioes.ucla.edu/envisci/course-requirements/', primary: true },
      { label: 'Minor course schedule', url: 'https://www.ioes.ucla.edu/envisci/minor/' }
    ],
    keywords: 'environ 175 programming big data barreca python r course'
  },
  {
    title: 'IoES Senior Practicum',
    host: 'IoES \u00b7 ENVIRON 180A/B/C',
    type: 'capstone', audience: 'undergrad',
    desc: 'A full academic year on a real client project. Teams of 5\u20137 seniors partner with agencies, NGOs, or companies to deliver science-based recommendations. Many alumni describe it as their most valuable UCLA experience.',
    who: 'Environmental Science B.S. seniors (required capstone).',
    time: 'Full academic year \u00b7 14 units',
    gain: 'Client management, interdisciplinary teamwork, original data collection, professional presentations.',
    apply: 'Automatic as a senior major; client projects selected spring/summer for the following year.',
    tags: ['capstone', 'client work', 'required'],
    links: [
      { label: 'Practicum overview', url: 'https://www.ioes.ucla.edu/envisci/senior-practicum/', primary: true },
      { label: 'Past projects', url: 'https://www.ioes.ucla.edu/projects/' },
      { label: 'Partner with IoES (clients)', url: 'https://www.ioes.ucla.edu/partner-with-ucla/' }
    ],
    keywords: 'senior practicum capstone 180a 180b 180c client team environmental science'
  },
  {
    title: 'Ph.D. in Environment and Sustainability',
    host: 'IoES',
    type: 'degree', audience: 'grad',
    desc: 'Research-oriented doctorate training students to study sustainability challenges across disciplines. Graduates go on to academia, government, NGOs, and industry.',
    who: 'Applicants with a strong research background seeking an academic or research career path.',
    time: '5\u20136 years typical',
    gain: 'Deep interdisciplinary research training, IoES faculty mentorship, dissertation in env/sustainability science.',
    apply: 'Annual application cycle; see IoES Ph.D. page for deadlines (typically December).',
    tags: ['Ph.D.', 'research', 'graduate'],
    links: [
      { label: 'Ph.D. overview', url: 'https://www.ioes.ucla.edu/phd/', primary: true },
      { label: 'Compare Ph.D. vs. D.Env.', url: 'https://www.ioes.ucla.edu/ese/program/' }
    ],
    keywords: 'phd doctorate environment sustainability graduate research ioes'
  },
  {
    title: 'D.Env. in Environmental Science & Engineering',
    host: 'IoES \u00b7 founded 1973',
    type: 'degree', audience: 'grad',
    desc: 'The nation\u2019s only professional environmental doctorate. Two years of interdisciplinary coursework, then two years in an off-campus residency while completing an applied dissertation.',
    who: 'Graduate applicants who want environmental practice: consulting, agencies, industry, or nonprofits.',
    time: '4 years \u00b7 2 yrs coursework + 2 yrs residency',
    gain: 'Science + engineering + policy + law integration; real-world residency; practitioner network.',
    apply: 'Separate application from the Ph.D.; see ESE program page (deadline typically January).',
    tags: ['D.Env.', 'professional', 'residency'],
    links: [
      { label: 'D.Env. overview', url: 'https://www.ioes.ucla.edu/ese/', primary: true },
      { label: 'Why enroll?', url: 'https://www.ioes.ucla.edu/ese/why-enroll/' },
      { label: 'Program manual (PDF)', url: 'https://www.ioes.ucla.edu/wp-content/uploads/2025/10/ESE-Program-Manual-2025-26.pdf' }
    ],
    keywords: 'denv doctorate professional environmental science engineering residency practitioner'
  },
  {
    title: 'Leaders in Sustainability Graduate Certificate',
    host: 'IoES \u00b7 Magali Delmas, director',
    type: 'certificate', audience: 'grad',
    desc: 'Free certificate for UCLA graduate students in any department. Includes ENV 277, three sustainability electives, and a Leadership Project with measurable impact.',
    who: 'Any enrolled UCLA graduate student in any department.',
    time: '16 units \u00b7 flexible over your degree',
    gain: 'Cross-disciplinary sustainability network, leadership project portfolio, career edge at no extra tuition.',
    apply: 'Rolling applications; apply in fall to take ENV 277 the same year.',
    tags: ['LiS', 'certificate', 'free'],
    links: [
      { label: 'Certificate overview', url: 'https://www.ioes.ucla.edu/lis/', primary: true },
      { label: 'How to apply', url: 'https://www.ioes.ucla.edu/lis/how-to-apply/' },
      { label: 'Course requirements', url: 'https://www.ioes.ucla.edu/lis/course-requirements/' }
    ],
    keywords: 'leaders sustainability lis certificate graduate env 277 delmas'
  },
  {
    title: 'Field Fellowship for Environmental Justice',
    host: 'UCLA Luskin Center for Innovation',
    type: 'fellowship', audience: 'grad',
    desc: 'Paid placements with environmental justice organizations. Fellows work on action-oriented projects with mentorship. Stipend amounts vary by year and student level \u2014 check the current call.',
    who: 'UCLA students completing capstone or internship requirements with an environmental justice focus.',
    time: 'One quarter to summer \u00b7 ~220 hours',
    gain: 'EJ field experience, community partnerships, stipend, mentor network, potential capstone launchpad.',
    apply: 'Applications typically open late fall for the following year; check Luskin CFI student opportunities page.',
    tags: ['environmental justice', 'stipend', 'Luskin'],
    links: [
      { label: 'Student opportunities', url: 'https://innovation.luskin.ucla.edu/opportunities-for-students/', primary: true },
      { label: 'Luskin fellowships hub', url: 'https://luskin.ucla.edu/student-affairs/fellowships' }
    ],
    keywords: 'luskin environmental justice fellowship field stipend e j capstone internship'
  },
  {
    title: 'NASA EarthRISE Developers Academy (DEVELOP)',
    host: 'NASA Earth Science \u00b7 JPL node (Pasadena)',
    type: 'fellowship', audience: 'any',
    desc: '10-week projects using NASA Earth observation data for partner organizations. Topics include wildfire, water, agriculture, and air quality. JPL (Pasadena) is the LA-area host center.',
    who: 'Students with backgrounds in earth science, GIS, stats, CS, or related fields; interdisciplinary teams.',
    time: '10 weeks \u00b7 spring, summer, or fall terms',
    gain: 'Remote sensing, GIS, technical reports, partner presentations, NASA network.',
    apply: 'Application windows posted per term; U.S. citizen or permanent resident required for all roles.',
    tags: ['NASA', 'remote sensing', 'JPL', 'internship'],
    links: [
      { label: 'EarthRISE / DEVELOP \u2014 apply', url: 'https://appliedsciences.nasa.gov/what-we-do/capacity-building/develop/apply', primary: true },
      { label: 'IoES alumni spotlight', url: 'https://www.ioes.ucla.edu/article/alumni-spotlight-from-ucla-to-nasa-danielle-sonobe-23/' }
    ],
    keywords: 'nasa develop earthrise jpl internship remote sensing satellite pasadena'
  },
  {
    title: 'Sustainable LA Grand Challenge',
    host: 'UCLA Grand Challenges \u00b7 Alex Hall, director',
    type: 'initiative', audience: 'any',
    desc: 'Campus-wide initiative to transition LA County to 100% renewable energy, local water, and enhanced ecosystem health by 2050. Funds interdisciplinary research and student programs including its own Undergraduate Research Scholars Program.',
    who: 'Researchers, students and community partners working on LA sustainability.',
    time: 'Ongoing \u00b7 project-based involvement',
    gain: 'Access to LA-focused research network, policy-relevant projects, wildfire/climate initiatives.',
    apply: 'Subscribe to the newsletter, email SLAGC, or apply to the SLA Grand Challenge URSP when cycles open.',
    tags: ['Los Angeles', 'policy', 'grand challenge'],
    links: [
      { label: 'SLAGC home', url: 'https://grandchallenges.ucla.edu/sustainable-la/', primary: true },
      { label: 'Undergraduate Research Scholars Program', url: 'https://sustainablela.ucla.edu/for-students/apply-now-undergraduate-research-scholars-program' }
    ],
    keywords: 'sustainable la grand challenge slagc alex hall los angeles 2050 renewable water ursp'
  },
  {
    title: 'IoES Impact Fellows',
    host: 'IoES \u00b7 Ph.D. & D.Env. students',
    type: 'fellowship', audience: 'grad',
    desc: 'Graduate fellows placed with external partners for ~100 hours over 10 weeks to advance real organizational missions: data analysis, policy research, sustainability strategy.',
    who: 'IoES Ph.D. and D.Env. students matched to partner needs.',
    time: '10 weeks per cycle \u00b7 up to 300 hours total',
    gain: 'Professional consulting experience, partner network, applied dissertation connections.',
    apply: 'Contact IoES partner office; organizations can also propose projects via Partner with UCLA.',
    tags: ['graduate', 'consulting', 'impact'],
    links: [
      { label: 'Partner with IoES', url: 'https://www.ioes.ucla.edu/partner-with-ucla/', primary: true },
      { label: 'Ph.D. program', url: 'https://www.ioes.ucla.edu/phd/' }
    ],
    keywords: 'impact fellows graduate phd denv consulting partner ioes'
  },
  {
    title: 'California Center for Sustainable Communities (CCSC)',
    host: 'IoES \u00b7 Stephanie Pincetl, founding director',
    type: 'research', audience: 'any',
    desc: 'Research center building data-driven tools for LA and California urban sustainability: energy, water, electrification, environmental justice, building decarbonization.',
    who: 'Students interested in urban energy, water, infrastructure data and California policy.',
    time: 'Varies by project \u00b7 often multi-quarter',
    gain: 'Real policy-facing research, data tool development, connections to LA agencies and communities.',
    apply: 'Reach out to CCSC faculty or watch for project postings on IoES.',
    tags: ['urban', 'energy', 'California', 'data tools'],
    links: [
      { label: 'CCSC at IoES', url: 'https://www.ioes.ucla.edu/ccsc/', primary: true },
      { label: 'IoES projects', url: 'https://www.ioes.ucla.edu/projects/' }
    ],
    keywords: 'ccsc california center sustainable communities pincetl urban energy water la'
  },
  {
    title: 'UCLA La Kretz Center for California Conservation',
    host: 'IoES \u00b7 Brad Shaffer, director',
    type: 'research', audience: 'any',
    desc: 'Conservation science hub supporting California biodiversity, genomics, wildfire ecology, urban wildlife, endangered species. Offers lectures, postdoc fellowships and undergraduate research awards.',
    who: 'Students interested in conservation biology, genomics, California ecosystems and field research.',
    time: 'Varies \u00b7 grants, lectures and research projects',
    gain: 'Conservation genomics experience, California field sites, public science communication.',
    apply: 'Watch for undergraduate award cycles and faculty-led project opportunities on IoES.',
    tags: ['conservation', 'biodiversity', 'California'],
    links: [
      { label: 'La Kretz Center', url: 'https://lakretz.ucla.edu/', primary: true },
      { label: 'IoES projects', url: 'https://www.ioes.ucla.edu/projects/' }
    ],
    keywords: 'la kretz conservation california biodiversity shaffer genomics wildlife'
  },
  {
    title: 'UCLA Undergraduate Research Centers',
    host: 'UCLA Division of Undergraduate Education',
    type: 'research', audience: 'undergrad',
    desc: 'Central hub for faculty labs, research scholarships, symposiums, and workshops. The Undergraduate Research Scholars Program (URSP) funds year-long faculty-mentored projects \u2014 a natural home for IoES, Stats, Geography, or Engineering environmental data work.',
    who: 'Any UCLA undergraduate seeking research experience, including first-years.',
    time: 'Quarterly or multi-quarter commitments',
    gain: 'Lab placement, research presentation skills, and scholarship funding (up to $6,000/yr via URSP).',
    apply: 'Browse faculty research, attend URC info sessions, and apply to URSP each spring (STEM via URC\u2013Sciences, HASS via URC\u2013HASS).',
    tags: ['undergraduate research', 'URSP', 'labs'],
    links: [
      { label: 'URC \u2013 Sciences', url: 'https://sciences.ugresearch.ucla.edu/', primary: true },
      { label: 'URC \u2013 Humanities & Social Sciences', url: 'https://hass.ugresearch.ucla.edu/' },
      { label: 'Faculty directory (Terrain)', url: 'index.html#faculty' }
    ],
    keywords: 'undergraduate research urc ursp lab faculty symposium scholars program'
  },
  {
    title: 'B.S. Statistics & Data Science',
    host: 'UCLA Department of Statistics & Data Science',
    type: 'degree', audience: 'undergrad',
    desc: 'Quantitative foundation for environmental data work: probability, inference, machine learning and computing. Pairs with the ESS minor, ENVIRON 175 and climate/spatial stats faculty.',
    who: 'Students who want the math/stats core behind climate, air quality and spatial environmental analysis.',
    time: '4 years',
    gain: 'Rigorous stats/ML training, research opportunities, path to MASDS or Ph.D.',
    apply: 'Declare through Physical Sciences; see department for prep and major requirements.',
    tags: ['statistics', 'data science', 'quantitative'],
    links: [
      { label: 'Stats & Data Science', url: 'https://stats.ucla.edu/', primary: true },
      { label: 'MASDS graduate program', url: 'https://master.stat.ucla.edu/' }
    ],
    keywords: 'statistics data science major stats undergraduate quantitative machine learning'
  },
  {
    title: 'UCLA DataX',
    host: 'UCLA \u00b7 student & research initiative',
    type: 'initiative', audience: 'any',
    desc: 'UCLA\u2019s data science community and campus partner for Terrain \u2014 connecting students, faculty, and projects across UCLA.',
    who: 'Anyone at UCLA interested in data science applied to real-world problems.',
    time: 'Ongoing community and project opportunities',
    gain: 'Campus data science network, project visibility, connection to interdisciplinary work.',
    apply: 'Visit the DataX site; reach out via Terrain to contribute datasets or projects.',
    tags: ['DataX', 'community', 'Terrain'],
    links: [
      { label: 'UCLA DataX', url: 'https://datax.ucla.edu/', primary: true },
      { label: 'Terrain team', url: 'team.html' }
    ],
    keywords: 'datax ucla data science community initiative terrain student'
  },
  {
    title: 'Emmett Institute on Climate Change & the Environment',
    host: 'UCLA School of Law',
    type: 'research', audience: 'any',
    desc: 'Climate law and policy research center. Faculty study climate regulation, litigation, and governance. The environmental law clinic pairs student teams with justice-focused nonprofits.',
    who: 'Students interested in climate policy, environmental law and regulation.',
    time: 'Clinic runs Jan\u2013Apr; research ongoing',
    gain: 'Climate law exposure, policy analysis, clinic experience with EJ clients.',
    apply: 'Law clinic projects proposed each December; research roles via faculty outreach.',
    tags: ['climate law', 'policy', 'Emmett'],
    links: [
      { label: 'Emmett Institute', url: 'https://law.ucla.edu/emmett-institute-on-climate-change-and-the-environment', primary: true },
      { label: 'Partner with IoES (law clinic)', url: 'https://www.ioes.ucla.edu/partner-with-ucla/' }
    ],
    keywords: 'emmett institute climate law policy carlson parson environmental justice clinic'
  }
];

/* ---------------------------------------------------------------------------
   Internships & fellowships — environmental data science focus
   acceptanceTier: highly_competitive | competitive | moderate | not_reported
   deadlineSort: ISO date for nearest upcoming cycle (for sorting); null if rolling
   --------------------------------------------------------------------------- */

window.INTERNSHIPS = [
  {
    id: 'nasa-earthrise',
    title: 'NASA EarthRISE Developers Academy (DEVELOP)',
    organization: 'NASA Earth Science \u00b7 JPL & other NASA centers',
    sector: 'government',
    audience: 'any',
    paid: true,
    payNote: 'Paid stipend \u00b7 25\u201329 hrs/week for a 10-week term',
    location: 'Pasadena (JPL) + other NASA centers; some virtual',
    remote: 'hybrid',
    duration: '10 weeks \u00b7 three terms per year',
    seasons: ['spring', 'summer', 'fall'],
    deadlineLabel: 'Three cycles per year',
    deadlines: [
      { cycle: 'Spring', monthDay: 'late Sept', note: 'Typical close; verify on the NASA application guide' },
      { cycle: 'Summer', monthDay: 'late Feb', note: 'Typical close; verify each year' },
      { cycle: 'Fall', monthDay: 'late June', note: 'Fall 2026 window ran May 25\u2013Jun 26' }
    ],
    deadlineSort: '2026-09-25',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Selective national program; a few hundred participants are accepted per year across NASA centers from a much larger applicant pool. Requires a 3.0+ GPA and U.S. citizenship or permanent residency (for both in-person and virtual roles).',
    skills: ['Python', 'GIS', 'Remote sensing', 'Technical writing'],
    desc: 'Short-cycle applied remote-sensing projects for partner organizations (cities, NGOs, agencies). Interdisciplinary teams deliver maps, analyses, and presentations using NASA Earth observation data. The JPL (Pasadena) node makes this commutable from LA \u2014 a strong bridge from coursework to professional geospatial work.',
    responsibilities: [
      'Process satellite and aerial imagery for partner-defined questions',
      'Build maps and summary statistics in Python or GIS',
      'Present findings to partners and NASA science advisors',
      'Document methods in a technical report'
    ],
    qualifications: [
      'At least 18; enrolled student, recent grad, or early-career professional',
      '3.0+ GPA and skills in Earth/environmental science, GIS, remote sensing, or CS',
      'U.S. citizenship or Legal Permanent Resident status (required for all roles)',
      'Able to commit ~25\u201329 hrs/week for the full term'
    ],
    tips: [
      'Lead your application with a map or notebook from a Terrain project (air quality, heat, emissions).',
      'Name the JPL/Pasadena center explicitly if you can work in LA.',
      'DEVELOP values teamwork \u2014 mention group projects and your specific role.',
      'Line up two recommenders (one academic, one professional) before the window closes.'
    ],
    prompts: [
      'Which NASA Earth observation dataset would you use to answer a question about Los Angeles air quality or heat, and why?',
      'Describe a time you explained a technical map to someone without a science background.',
      'What environmental problem in your community would you tackle with 10 weeks of satellite data?'
    ],
    howToApply: [
      'Read the EarthRISE Application Guide in full and review the term\u2019s project list.',
      'Open the application portal and complete the eligibility questions first.',
      'Submit your profile, essay responses, and resume; request 2 recommendations.',
      'Watch for a notification window after the term closes.'
    ],
    links: [
      { label: 'Apply (DEVELOP)', url: 'https://appliedsciences.nasa.gov/what-we-do/capacity-building/develop/apply', primary: true },
      { label: 'Application guide', url: 'https://science.nasa.gov/earth-science/earthrise-developers-academy/application-guide/' },
      { label: 'IoES alumni story', url: 'https://www.ioes.ucla.edu/article/alumni-spotlight-from-ucla-to-nasa-danielle-sonobe-23/' }
    ],
    keywords: 'nasa develop earthrise jpl remote sensing gis satellite pasadena internship fellowship'
  },
  {
    id: 'noaa-hollings',
    title: 'NOAA Ernest F. Hollings Undergraduate Scholarship',
    organization: 'NOAA Office of Education',
    sector: 'government',
    audience: 'undergrad',
    paid: true,
    payNote: 'Up to $9,500/yr academic award + paid 10-week summer NOAA internship',
    location: 'A NOAA facility nationwide (preferences considered)',
    remote: 'on-site',
    duration: '2-year award + a paid summer internship',
    seasons: ['summer'],
    deadlineLabel: 'Annual \u00b7 Jan 31',
    deadlines: [
      { cycle: 'Annual', monthDay: 'Jan 31', note: 'Portal opens Oct 1; all materials due Jan 31, 11:59 pm ET' }
    ],
    deadlineSort: '2027-01-31',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'About 120+ scholars are selected nationally each year. You must be a U.S. citizen, a full-time sophomore (or 3rd-year in a 5-year program) at the time of application, with a 3.0+ GPA in a NOAA-mission field.',
    skills: ['Python', 'R', 'Statistics', 'Climate science', 'Policy writing'],
    desc: 'The premier federal pathway for undergraduates interested in oceans, atmosphere, and climate. Recipients get tuition support plus a summer of paid NOAA research \u2014 often involving data analysis, modeling, or field instrumentation.',
    responsibilities: [
      'Conduct supervised research at a NOAA lab or program office',
      'Analyze climate, ocean, or weather datasets',
      'Present at the NOAA scholarship symposium in Silver Spring',
      'Maintain strong academic standing'
    ],
    qualifications: [
      'U.S. citizen',
      'Full-time sophomore (second year) at time of application',
      '3.0+ GPA',
      'Majoring in a NOAA mission-aligned field (STEM, education, policy, etc.)'
    ],
    tips: [
      'Start your personal statement with a specific NOAA dataset or mission (NCEI, NWS, fisheries).',
      'Ask a professor who knows your quantitative skills for a recommendation \u2014 submit early.',
      'Connect Hollings to a long-term goal (graduate school, public service, climate data).',
      'References are due at the same deadline \u2014 give recommenders 3+ weeks.'
    ],
    prompts: [
      'What NOAA mission area (weather, climate, oceans, fisheries) fits your career goals, and what data would you want to work with?',
      'Describe a quantitative project where you handled messy real-world environmental data.',
      'How would you communicate uncertainty in a climate or weather forecast to the public?'
    ],
    howToApply: [
      'Confirm eligibility (sophomore, U.S. citizen, GPA, accredited institution).',
      'Complete the online Hollings application (essay, resume, transcript) starting Oct 1.',
      'Request two academic references before the Jan 31 deadline.',
      'If awarded, attend NOAA orientation and choose a summer placement.'
    ],
    links: [
      { label: 'Hollings Scholarship', url: 'https://www.noaa.gov/office-education/hollings-scholarship', primary: true },
      { label: 'Prospective scholars / how to apply', url: 'https://www.noaa.gov/office-education/hollings-scholarship/prospective' }
    ],
    keywords: 'noaa hollings scholarship internship climate ocean atmosphere undergraduate federal'
  },
  {
    id: 'epa-orise',
    title: 'EPA Research Participation Program (ORISE)',
    organization: 'U.S. EPA \u00b7 administered by ORISE / ORAU',
    sector: 'government',
    audience: 'any',
    paid: true,
    payNote: 'Monthly stipend based on education level (not an employee role)',
    location: 'EPA offices and labs nationwide',
    remote: 'hybrid',
    duration: 'A few months to 1+ year (renewable)',
    seasons: ['spring', 'summer', 'fall'],
    deadlineLabel: 'Rolling \u00b7 by posting',
    deadlines: [
      { cycle: 'Rolling', monthDay: null, note: 'New projects post year-round on Zintellect; reviewed on a rolling basis, so apply early' }
    ],
    deadlineSort: null,
    acceptanceTier: 'competitive',
    acceptanceNote: 'Selection is per-project by the EPA mentor. Niche skills (air-quality modeling, R/Python, exposure science) reduce competition. Most EPA postings require U.S. citizenship; ORISE has other agency posts open to LPRs and foreign nationals.',
    skills: ['Python', 'R', 'Air quality', 'Statistics', 'Policy analysis'],
    desc: 'Research appointments at EPA offices and labs. Projects often involve air quality data, exposure modeling, environmental-justice screening tools, or regulatory support \u2014 a strong fit for environmental data science students.',
    responsibilities: [
      'Analyze regulatory or monitoring datasets',
      'Support epidemiology or exposure modeling teams',
      'Document QA/QC for data products',
      'Contribute to reports and briefings'
    ],
    qualifications: [
      'Current student, recent graduate, or faculty in a relevant field',
      'Programming in R or Python preferred for data-heavy roles',
      'U.S. citizenship required for most EPA opportunities',
      'Proof of health insurance required to participate'
    ],
    tips: [
      'Filter Zintellect for "air quality", "GIS", or "data science".',
      'Postings can be reviewed before the deadline \u2014 apply within days of listing.',
      'Mention experience with EPA tools (AirNow, EJSCREEN, CMAQ) if you have it.',
      'Recommendations submit through Zintellect \u2014 set them up early.'
    ],
    prompts: [
      'How would you assess whether a community faces disproportionate pollution burden using public data?',
      'Describe your experience documenting data quality issues before analysis.',
      'Which EPA dataset or tool have you used, and what did you learn from it?'
    ],
    howToApply: [
      'Create a profile on Zintellect (the ORISE application system).',
      'Browse current EPA opportunities and read each project\u2019s requirements.',
      'Apply per posting with a resume/CV, transcript, and two recommendations.'
    ],
    links: [
      { label: 'EPA opportunities (ORISE)', url: 'https://orise.orau.gov/epa/current-research-opportunities.html', primary: true },
      { label: 'Apply on Zintellect', url: 'https://www.zintellect.com/' }
    ],
    keywords: 'epa orise oraU research participation air quality environmental justice zintellect internship'
  },
  {
    id: 'usgs-pathways',
    title: 'USGS Pathways Internship Program',
    organization: 'U.S. Geological Survey',
    sector: 'government',
    audience: 'undergrad',
    paid: true,
    payNote: 'Paid federal internship (GS hourly scale)',
    location: 'USGS science centers nationwide (incl. California)',
    remote: 'on-site',
    duration: 'Summer or year-round, part- or full-time',
    seasons: ['summer', 'fall', 'spring'],
    deadlineLabel: 'Posted on USAJOBS \u00b7 Dec\u2013Feb for summer',
    deadlines: [
      { cycle: 'Summer', monthDay: 'Dec\u2013Feb', note: 'Summer roles usually post on USAJOBS in winter; set a saved search + alerts' }
    ],
    deadlineSort: '2026-12-15',
    acceptanceTier: 'competitive',
    acceptanceNote: 'Paid Pathways internships require U.S. citizenship and current enrollment in an accredited program. Successful interns may be eligible for non-competitive conversion to a federal job.',
    skills: ['Python', 'R', 'Hydrology', 'GIS', 'Statistics'],
    desc: 'Work with USGS on streamflow, groundwater, land change, and natural hazards. Students build pipelines for USGS water data (NWIS), remote sensing, and geospatial products at science centers across the country.',
    responsibilities: [
      'Download and analyze USGS water or land-cover data',
      'Build scripts for reproducible hydrology workflows',
      'Assist with field data collection and QA',
      'Contribute to USGS publications or data releases'
    ],
    qualifications: [
      'U.S. citizen, currently enrolled at an accredited institution',
      'STEM background (hydrology, geography, CS, stats common)',
      'Programming experience valued over a perfect GPA'
    ],
    tips: [
      'Practice with the USGS NWIS API first (the Terrain watershed project is great prep).',
      'Email scientists at the California Water Science Center with a specific interest.',
      'Use USAJOBS filters: select "Students & recent graduates" and search "USGS".',
      'Build a USAJOBS profile and saved search so you catch postings early.'
    ],
    prompts: [
      'What water or land-change question would you answer with USGS NWIS or NLCD data?',
      'Walk through how you would handle missing values in a streamflow time series.',
      'How would you make a hydrology analysis reproducible for a colleague?'
    ],
    howToApply: [
      'Create a USAJOBS profile and upload a federal-style resume and transcripts.',
      'Filter by the Student / Pathways categories and search "USGS".',
      'Apply to each announcement before it closes (federal postings close fast).'
    ],
    links: [
      { label: 'USGS students & recent grads', url: 'https://www.usgs.gov/human-capital/students-and-recent-graduates', primary: true },
      { label: 'Search USAJOBS', url: 'https://www.usajobs.gov/Search/Results?k=USGS&hp=student' }
    ],
    keywords: 'usgs pathways intern hydrology water gis nwis streamflow federal usajobs'
  },
  {
    id: 'doe-suli',
    title: 'DOE Science Undergraduate Laboratory Internships (SULI)',
    organization: 'U.S. Department of Energy \u00b7 17 national labs',
    sector: 'government',
    audience: 'undergrad',
    paid: true,
    payNote: '~$700/week stipend + possible travel/housing (varies by lab)',
    location: 'Berkeley Lab (LBNL) + 16 other DOE national labs',
    remote: 'on-site',
    duration: '10 weeks (summer) or 16 weeks (semester)',
    seasons: ['summer', 'fall', 'spring'],
    deadlineLabel: 'Three cycles per year',
    deadlines: [
      { cycle: 'Summer', monthDay: 'early Jan', note: 'Apply Oct\u2013Jan via the WARS portal' },
      { cycle: 'Fall', monthDay: 'late May', note: 'Apply Mar\u2013May' },
      { cycle: 'Spring', monthDay: 'early Oct', note: 'Apply Jul\u2013Oct' }
    ],
    deadlineSort: '2026-10-01',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Several hundred interns are placed each summer nationally from a large applicant pool. Requires U.S. citizenship or permanent residency and (typically) a 3.0+ GPA.',
    skills: ['Python', 'Machine learning', 'Climate modeling', 'Statistics', 'HPC'],
    desc: 'Paid research at DOE national labs. Environmental data students often land in Earth sciences, climate modeling, energy systems, or building-efficiency groups \u2014 Lawrence Berkeley National Lab is the closest to California.',
    responsibilities: [
      'Contribute to lab research codes and datasets',
      'Run simulations or analyze instrument output',
      'Present at an end-of-term symposium',
      'Document workflows for reproducibility'
    ],
    qualifications: [
      'U.S. citizen or permanent resident',
      'Full-time undergrad (2- or 4-year) or recent grad/early grad student',
      'STEM major; programming coursework expected for data roles'
    ],
    tips: [
      'Rank Berkeley Lab or SLAC if you want California.',
      'Reference specific research groups (e.g., climate modeling, building energy data).',
      'One strong recommender who knows your coding beats three generic letters.',
      'Apply to more than one term \u2014 fall/spring cycles are less crowded than summer.'
    ],
    prompts: [
      'Which DOE national lab research area aligns with your interest in climate or energy data?',
      'Describe a computational project where reproducibility mattered.',
      'How would you approach analyzing a large gridded climate dataset you have never seen?'
    ],
    howToApply: [
      'Apply via the DOE SULI portal (WARS) when your cycle opens.',
      'Select preferred labs and research areas.',
      'Submit essays, transcript, and two recommendations by the deadline.'
    ],
    links: [
      { label: 'SULI \u2014 how to apply', url: 'https://science.osti.gov/wdts/suli/How-to-Apply', primary: true },
      { label: 'SULI program overview', url: 'https://science.osti.gov/wdts/suli' },
      { label: 'Berkeley Lab SULI', url: 'https://education.lbl.gov/internships/suli/' }
    ],
    keywords: 'doe suli berkeley lab lbnl national lab internship climate energy undergraduate'
  },
  {
    id: 'jpl-intern',
    title: 'NASA JPL Internship Program',
    organization: 'NASA Jet Propulsion Laboratory (Caltech)',
    sector: 'government',
    audience: 'any',
    paid: true,
    payNote: 'Paid; rate depends on education level',
    location: 'Pasadena, CA',
    remote: 'on-site',
    duration: '10 weeks (summer) or year-round',
    seasons: ['summer', 'fall', 'spring'],
    deadlineLabel: 'Rolling \u00b7 summer recruiting opens in fall',
    deadlines: [
      { cycle: 'Summer', monthDay: 'apply Sept\u2013Jan', note: 'Reviewed on a rolling basis; popular mentors fill early' }
    ],
    deadlineSort: '2026-12-01',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'JPL receives far more applicants than slots. U.S. citizenship or permanent residency is required for most positions; check each posting. A 3.0+ GPA is typical.',
    skills: ['Python', 'Remote sensing', 'GIS', 'Machine learning', 'MATLAB'],
    desc: 'Research internships at JPL spanning Earth science, climate, hydrology, and machine learning for environmental applications. Many projects use satellite data and high-performance computing \u2014 and JPL is in Pasadena, commutable from UCLA.',
    responsibilities: [
      'Develop algorithms for Earth science missions',
      'Process satellite imagery and validation datasets',
      'Present results to JPL mentors and peers'
    ],
    qualifications: [
      'U.S. citizen or permanent resident for most positions',
      'STEM major with a 3.0+ GPA typical',
      'Programming and math through linear algebra'
    ],
    tips: [
      'Apply early when the portal opens \u2014 mentors review on a rolling basis.',
      'List specific JPL groups (Carbon Cycle, Water & Ecosystems, ML).',
      'EarthRISE/DEVELOP alumni often have an edge for JPL projects.'
    ],
    prompts: [
      'Which JPL Earth science mission data would you use to study California wildfires or drought?',
      'Describe a coding project where you validated results against ground truth.'
    ],
    howToApply: [
      'Browse the JPL internships site and create an application profile.',
      'Upload resume, transcripts, and short essays; select research areas.',
      'Reach out to specific JPL mentors whose work matches yours.'
    ],
    links: [
      { label: 'JPL internships', url: 'https://www.jpl.nasa.gov/edu/intern/', primary: true },
      { label: 'JPL careers', url: 'https://www.jpl.nasa.gov/careers/' }
    ],
    keywords: 'jpl nasa jet propulsion laboratory pasadena internship remote sensing earth science caltech'
  },
  {
    id: 'edf-climate-corps',
    title: 'EDF Climate Corps Fellowship',
    organization: 'Environmental Defense Fund',
    sector: 'nonprofit',
    audience: 'grad',
    paid: true,
    payNote: 'Minimum $1,400/week for 10\u201312 weeks + $1,400 for training week',
    location: 'Host organization nationwide (remote, hybrid, or on-site)',
    remote: 'hybrid',
    duration: '10\u201312 weeks (summer) + Foundations Week',
    seasons: ['summer'],
    deadlineLabel: 'Annual \u00b7 Dec 22',
    deadlines: [
      { cycle: 'Summer', monthDay: 'Dec 22', note: 'Apply by Dec 22, 11:59 pm PT (apply by Nov 30 for a bonus network event)' }
    ],
    deadlineSort: '2026-12-22',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Competitive graduate fellowship. You must be enrolled in a graduate certificate or degree program for at least one term of the academic year and eligible to work in the U.S. for the summer.',
    skills: ['Data analysis', 'Energy/GHG accounting', 'Sustainability', 'Excel', 'Python'],
    desc: 'Places graduate fellows inside companies, cities, and institutions to find energy and emissions reductions. Heavy on data, finance, and stakeholder communication \u2014 a top-tier program for sustainability analytics (graduate students only).',
    responsibilities: [
      'Audit energy and emissions data for a host organization',
      'Build business cases for efficiency, renewables, and electrification',
      'Present recommendations to executives',
      'Track metrics and estimate savings'
    ],
    qualifications: [
      'Enrolled in a graduate certificate/degree program (one term of the academic year)',
      'Eligible to work in the U.S. during the summer',
      'Quantitative + communication skills; available for Foundations Week in May'
    ],
    tips: [
      'Undergrads: bookmark this for grad school \u2014 it is graduate-only.',
      'Quantify impact in your resume (kWh saved, tons CO\u2082 estimated).',
      'You rank preferences but cannot apply to a specific host \u2014 show range.',
      'Watch a recorded info session before writing your essays.'
    ],
    prompts: [
      'How would you prioritize emissions-reduction projects with a limited budget?',
      'Describe a time you used data to influence a decision-maker.',
      'What sustainability metric do you think organizations most often get wrong?'
    ],
    howToApply: [
      'Complete the fellow application on the EDF Climate Corps site by Dec 22.',
      'Submit resume and essay responses; indicate sector/location preferences.',
      'Interview virtually between February and late March if matched.'
    ],
    links: [
      { label: 'Climate Corps \u2014 US fellows', url: 'https://business.edf.org/climate-corps/fellows/us/', primary: true },
      { label: 'Program overview', url: 'https://business.edf.org/climate-corps/' }
    ],
    keywords: 'edf environmental defense fund climate corps fellowship energy emissions graduate'
  },
  {
    id: 'rmi-intern',
    title: 'RMI Summer Internship Program',
    organization: 'RMI (Rocky Mountain Institute)',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: '$20/hr \u00b7 ~12 weeks (3-month summer program)',
    location: 'Remote or hybrid (offices in NYC, Oakland, DC, Boulder/Basalt CO)',
    remote: 'hybrid',
    duration: '~12 weeks (summer)',
    seasons: ['summer'],
    deadlineLabel: 'Winter recruiting for summer',
    deadlines: [
      { cycle: 'Summer', monthDay: 'winter (varies)', note: 'Timeline updated yearly on the RMI internships page' }
    ],
    deadlineSort: '2026-12-15',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Very competitive \u2014 RMI has received 3,500+ applications for ~48 summer interns. Strong preference for juniors, seniors, master\u2019s students, and recent grads, across many majors.',
    skills: ['Python', 'Energy modeling', 'Excel', 'Data visualization', 'Policy'],
    desc: 'RMI accelerates the clean-energy transition. Interns embed on a team and analyze building electrification, grid data, and corporate decarbonization \u2014 heavy on spreadsheets, models, and clear charts, with an end-of-summer presentation.',
    responsibilities: [
      'Model energy and emissions scenarios',
      'Analyze utility and building performance data',
      'Support reports on electrification and renewables',
      'Create visuals for technical and executive audiences'
    ],
    qualifications: [
      'Junior, senior, master\u2019s student, or recent grad preferred (most majors welcome)',
      'Well-rounded technical + interpersonal skills',
      'Genuine interest in the energy transition'
    ],
    tips: [
      'Read RMI\u2019s recent building-decarbonization reports and reference one.',
      'Show a chart you made that changed how someone understood data.',
      'Know your energy units \u2014 kWh, therms, and tons CO\u2082e.',
      'Internships are remote/hybrid; you are not required to relocate.'
    ],
    prompts: [
      'How would you estimate emissions savings from a building electrification program?',
      'What data would you need to compare rooftop solar vs. community solar for a city?',
      'Tell us about a project where your analysis informed a real decision.'
    ],
    howToApply: [
      'Apply via the RMI internships page when summer postings open.',
      'Submit a 1\u20132 page resume and the short application questions.',
      'Highlight quantitative projects and your clean-energy interest.'
    ],
    links: [
      { label: 'RMI internships', url: 'https://rmi.org/internships/', primary: true },
      { label: 'RMI research & insights', url: 'https://rmi.org/insights/' }
    ],
    keywords: 'rmi rocky mountain institute clean energy internship decarbonization data modeling'
  },
  {
    id: 'wri-intern',
    title: 'World Resources Institute Internship',
    organization: 'World Resources Institute (WRI)',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: '$20/hr undergrad \u00b7 $22/hr grad \u00b7 $24/hr PhD \u00b7 ~3 months',
    location: 'Washington, DC (hybrid; must reside in DC, MD, or VA) + some remote',
    remote: 'hybrid',
    duration: '~3 months',
    seasons: ['summer', 'fall', 'spring'],
    deadlineLabel: 'By posting (each program is separate)',
    deadlines: [
      { cycle: 'By posting', monthDay: 'varies', note: 'Each team (Climate, Energy, Cities, Forests\u2026) posts its own intern role and deadline on WRI Careers' }
    ],
    deadlineSort: '2027-02-23',
    acceptanceTier: 'competitive',
    acceptanceNote: 'Applied per posting on WRI Careers. Most U.S. roles require residency in DC/MD/VA and existing U.S. work authorization (WRI does not sponsor intern visas).',
    skills: ['Python', 'R', 'GIS', 'Policy analysis', 'Data visualization'],
    desc: 'WRI turns environmental data into global policy insights. Interns support open-data platforms (Climate Watch, Resource Watch, Global Forest Watch), climate dashboards, and research on emissions, forests, and urban sustainability.',
    responsibilities: [
      'Analyze global emissions and land-use datasets',
      'Support open-data tools and visualization products',
      'Draft research notes and metadata documentation',
      'Assist with stakeholder workshops'
    ],
    qualifications: [
      'Current student or recent graduate in a relevant field',
      'Excel plus Python or R',
      'U.S. work authorization; DC/MD/VA residency for most roles'
    ],
    tips: [
      'Explore WRI data platforms (Climate Watch, Resource Watch) before applying.',
      'Emphasize reproducible analysis and open-source habits.',
      'Apply to the specific team whose data products you actually use.'
    ],
    prompts: [
      'Which WRI dataset would you use to compare national emissions trends, and why?',
      'How do you ensure an international dataset is comparable across countries?'
    ],
    howToApply: [
      'Search WRI Careers for intern roles by program (Climate, Forests, etc.).',
      'Tailor your cover letter to that team\u2019s data products.',
      'Submit resume + cover letter; include GitHub or portfolio links.'
    ],
    links: [
      { label: 'WRI Careers', url: 'https://www.wri.org/careers', primary: true },
      { label: 'Climate Watch data', url: 'https://www.climatewatchdata.org/' }
    ],
    keywords: 'wri world resources institute climate data policy internship think tank'
  },
  {
    id: 'ceres-intern',
    title: 'Ceres Internship & Co-op',
    organization: 'Ceres',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: '$18/hr \u00b7 summer internship (10 wks) or spring co-op (20 wks)',
    location: 'Boston, MA (remote or hybrid for summer interns)',
    remote: 'hybrid',
    duration: '10-week summer internship or 6-month co-op',
    seasons: ['summer', 'spring'],
    deadlineLabel: 'Summer roles advertised in February',
    deadlines: [
      { cycle: 'Summer', monthDay: 'Feb\u2013Mar', note: 'Summer internships post in February; next cohort opportunity posts in 2027' },
      { cycle: 'Spring co-op', monthDay: 'fall', note: 'Six-month Boston-area co-op; posted ahead of a January start' }
    ],
    deadlineSort: '2027-02-15',
    acceptanceTier: 'competitive',
    acceptanceNote: 'A national sustainability nonprofit working with investors and companies on climate risk and disclosure. Existing U.S. work authorization is required (no visa sponsorship).',
    skills: ['Excel', 'Python', 'ESG data', 'Research', 'Writing'],
    desc: 'Ceres mobilizes investors and companies on climate risk and sustainability reporting. Interns and co-ops analyze corporate emissions disclosures, water risk, and ESG datasets, and support investor briefings.',
    responsibilities: [
      'Compile and analyze corporate climate-disclosure data',
      'Support investor briefings and benchmark reports',
      'Research sectoral emissions trends',
      'Fact-check quantitative claims in publications'
    ],
    qualifications: [
      'Current undergrad/grad student or within ~6 months of graduation',
      'Comfort with large spreadsheets; Python a plus',
      'Interest in finance and corporate sustainability'
    ],
    tips: [
      'Read a Ceres benchmark report and reference it in your cover letter.',
      'Understand Scope 1/2/3 emissions basics before interviewing.',
      'In your cover letter, rank the project teams you\u2019d most like to join.'
    ],
    prompts: [
      'How would you compare climate-risk disclosure across two companies in the same sector?',
      'Why do investors care about emissions-data quality?'
    ],
    howToApply: [
      'Open the Ceres internships & co-ops page and review the posted roles.',
      'Submit a resume and a cover letter ranking your preferred projects.',
      'Be ready to share professional references during selection.'
    ],
    links: [
      { label: 'Ceres internships & co-ops', url: 'https://www.ceres.org/careers/internships', primary: true },
      { label: 'Ceres careers', url: 'https://www.ceres.org/about-us/career-opportunities' }
    ],
    keywords: 'ceres esg corporate sustainability climate disclosure internship co-op research data'
  },
  {
    id: 'esri-intern',
    title: 'Esri Summer Internship',
    organization: 'Esri',
    sector: 'private',
    audience: 'any',
    paid: true,
    payNote: 'Full-time, paid 12-week summer internship',
    location: 'Redlands, CA (HQ) + select regional US offices',
    remote: 'on-site',
    duration: '12 weeks (summer)',
    seasons: ['summer'],
    deadlineLabel: 'Apply Sept 1 \u2013 Dec 31',
    deadlines: [
      { cycle: 'Summer', monthDay: 'Sep 1 \u2013 Dec 31', note: 'Filled on a rolling basis \u2014 apply early; interviews in Dec\u2013Jan' }
    ],
    deadlineSort: '2026-12-31',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Esri hires 100+ interns each summer, but the program is very competitive. Open to 3rd/4th-year undergrads, graduate, and PhD students; you must be authorized to work in the U.S. (visa support via your university only).',
    skills: ['GIS', 'Python', 'ArcGIS', 'JavaScript', 'Data visualization'],
    desc: 'Esri builds the GIS software behind most government and NGO environmental maps. Interns work on product teams, developer relations, or solutions engineering \u2014 ideal for students who love maps and code, at the Redlands HQ (~70 miles from UCLA).',
    responsibilities: [
      'Develop GIS workflows, scripts, or web map apps',
      'Test environmental use cases for ArcGIS products',
      'Document tutorials for spatial data science users',
      'Collaborate with cross-functional product teams'
    ],
    qualifications: [
      'Third/fourth-year undergrad, grad, or PhD student',
      'ArcGIS Online or Pro experience; Python with arcpy a plus',
      'A portfolio of map projects'
    ],
    tips: [
      'Build a public Story Map or Folium/Leaflet project before applying.',
      'A strong cover letter that names the team you want sets you apart.',
      'Apply early \u2014 positions close once a student accepts an offer.',
      'Redlands is ~70 miles from UCLA; plan housing if selected.'
    ],
    prompts: [
      'How would you design a web map for community members tracking local air quality?',
      'Describe a GIS project where coordinate systems or projections caused a problem you fixed.'
    ],
    howToApply: [
      'Open Esri\u2019s student jobs page during the Sep\u2013Dec window.',
      'Submit resume, a tailored cover letter, and portfolio links.',
      'Prepare for a technical interview on GIS concepts and coding.'
    ],
    links: [
      { label: 'Esri student jobs', url: 'https://www.esri.com/en-us/about/careers/student-jobs', primary: true },
      { label: 'ArcGIS for developers', url: 'https://developers.arcgis.com/' }
    ],
    keywords: 'esri gis arcgis redlands internship maps spatial data california'
  },
  {
    id: 'nrdc-intern',
    title: 'NRDC Internship Programs',
    organization: 'Natural Resources Defense Council',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: 'Paid (undergrad summer up to ~$10k for 10 weeks; legal interns separate)',
    location: 'Santa Monica, CA + Chicago, NY, SF, DC',
    remote: 'hybrid',
    duration: '10 weeks (summer) or semester-based',
    seasons: ['summer', 'fall', 'spring'],
    deadlineLabel: 'Posted on NRDC Careers (term-specific)',
    deadlines: [
      { cycle: 'Summer (undergrad)', monthDay: 'winter', note: 'Undergraduate summer roles post in winter on NRDC Careers' },
      { cycle: 'Legal (2L)', monthDay: 'Nov 28', note: 'Summer Legal Internship 2L deadline; a separate 1L posting opens later' }
    ],
    deadlineSort: '2026-11-28',
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'A highly competitive public-interest NGO. Roles exist for undergraduates, graduate, and law students across U.S. offices, including Santa Monica \u2014 strong writing plus data skills stand out.',
    skills: ['Policy research', 'Python', 'Data visualization', 'Writing', 'GIS'],
    desc: 'NRDC works on clean air, clean water, and climate policy \u2014 with a Santa Monica office focused on California. Interns research regulations, analyze environmental data, and support advocacy campaigns and litigation teams.',
    responsibilities: [
      'Research environmental policy and compile evidence',
      'Analyze datasets for reports and comment letters',
      'Support attorneys and scientists on active campaigns',
      'Draft blog posts or public-facing materials'
    ],
    qualifications: [
      'Enrolled undergraduate, graduate, or law student (varies by role)',
      'Strong writing; a writing sample is often required',
      'Data skills are a differentiator for science teams'
    ],
    tips: [
      'Submit a writing sample that cites data clearly.',
      'Follow NRDC\u2019s recent California work and reference it.',
      'In your cover letter, list which offices you\u2019re applying to and your order of preference.',
      'Apply only through NRDC\u2019s iCIMS portal \u2014 no emails or drop-offs.'
    ],
    prompts: [
      'How would you use data to support stronger clean-air policy in Southern California?',
      'Write a one-paragraph summary of an environmental issue for a general audience.'
    ],
    howToApply: [
      'Watch the NRDC Careers page for the role and office you want.',
      'Submit resume, cover letter, and (for legal) a writing sample via iCIMS.',
      'Prepare to discuss policy interests and quantitative skills.'
    ],
    links: [
      { label: 'NRDC Careers', url: 'https://www.nrdc.org/careers', primary: true },
      { label: 'Law-student internships', url: 'https://www.nrdc.org/opportunities-law-students-nrdc-summer-and-semester-based-legal-internships' }
    ],
    keywords: 'nrdc natural resources defense council los angeles santa monica internship policy advocacy nonprofit'
  },
  {
    id: 'datakind',
    title: 'DataKind Volunteer (DataCorps)',
    organization: 'DataKind',
    sector: 'nonprofit',
    audience: 'any',
    paid: false,
    payNote: 'Volunteer / pro bono \u2014 not a paid internship or job',
    location: 'Remote (global) + chapter events',
    remote: 'remote',
    duration: 'Project-based \u00b7 DataCorps runs 6\u20139 months, ~5\u201310 hrs/week',
    seasons: ['spring', 'summer', 'fall'],
    deadlineLabel: 'Rolling \u00b7 project open calls',
    deadlines: [
      { cycle: 'Rolling', monthDay: null, note: 'Create a profile, then watch the newsletter for DataCorps open calls' }
    ],
    deadlineSort: null,
    acceptanceTier: 'moderate',
    acceptanceNote: 'An open volunteer program (not a paid internship). DataKind pairs data scientists with social-impact organizations; projects have included climate risk, conservation, and access to services. Great for building a portfolio.',
    skills: ['Python', 'R', 'Machine learning', 'Data visualization', 'Project management'],
    desc: 'DataKind connects volunteer data scientists with mission-driven organizations on long-term DataCorps projects and shorter DataDive events. If unpaid, portfolio-building work fits your goals, it is one of the most accessible ways to do real impact data science.',
    responsibilities: [
      'Scope data problems with nonprofit partners',
      'Build analysis pipelines and dashboards',
      'Document work for handoff to partners',
      'Present findings to non-technical stakeholders'
    ],
    qualifications: [
      'Working knowledge of Python or R; 18+',
      'Commitment to ethical, impact-oriented data science',
      'Ability to volunteer ~5\u201310 hrs/week during a project'
    ],
    tips: [
      'Great follow-up after Terrain projects \u2014 you already have environmental examples.',
      'Keep your Rosterfy profile current so you\u2019re matched to new projects.',
      'Treat volunteer work like a job: weekly updates and clean READMEs.'
    ],
    prompts: [
      'How would you scope a data project when a nonprofit has messy spreadsheets and urgent deadlines?',
      'What ethical considerations apply when analyzing community environmental data?'
    ],
    howToApply: [
      'Create a volunteer profile at datakind.rosterfy.com.',
      'Subscribe to the newsletter and follow DataKind for project open calls.',
      'Apply to a DataCorps project that matches your skills and share your portfolio.'
    ],
    links: [
      { label: 'Volunteer with DataKind', url: 'https://www.datakind.org/join-us/volunteer/', primary: true },
      { label: 'DataKind projects', url: 'https://www.datakind.org/our-work/' }
    ],
    keywords: 'datakind volunteer datacorps data science nonprofit environmental impact portfolio'
  },
  {
    id: 'carbon-plan',
    title: 'CarbonPlan \u2014 open-source & roles',
    organization: 'CarbonPlan \u00b7 climate-data nonprofit',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: 'No formal internship \u2014 occasional full-time roles + open-source contribution',
    location: 'Remote (US)',
    remote: 'remote',
    duration: 'Varies (roles) \u00b7 ongoing (open-source)',
    seasons: ['spring', 'summer', 'fall'],
    deadlineLabel: 'No internship \u00b7 watch jobs + GitHub',
    deadlines: [
      { cycle: 'Rolling', monthDay: null, note: 'A ~10-person team; openings are rare but high-impact. Contributing on GitHub is the realistic way in.' }
    ],
    deadlineSort: null,
    acceptanceTier: 'highly_competitive',
    acceptanceNote: 'Important: CarbonPlan does NOT run a student internship. It is a small (~10-person) nonprofit that posts occasional full-time roles and does all of its analysis in the open \u2014 contributing to its public tools is a genuine way for students to engage and get noticed.',
    skills: ['Python', 'Climate data', 'Open source', 'Statistics', 'Writing'],
    desc: 'CarbonPlan analyzes carbon removal, offsets, and climate risk with radical transparency. There is no internship program, but everything is open-source on GitHub \u2014 contributing analysis, reviews, or fixes is a realistic, portfolio-building way to work alongside their team.',
    responsibilities: [
      'Read and reproduce CarbonPlan\u2019s open notebooks and articles',
      'Contribute fixes or analysis to their public GitHub repositories',
      'Engage thoughtfully with their methods and data',
      'Watch for and apply to occasional full-time openings'
    ],
    qualifications: [
      'Strong Python and statistical thinking',
      'Clear technical writing',
      'Comfort questioning hype with data'
    ],
    tips: [
      'Read CarbonPlan\u2019s published notebooks and reference one insight.',
      'Open a small, well-scoped pull request on their GitHub to start a relationship.',
      'They value intellectual honesty over cheerleading \u2014 show your reasoning.'
    ],
    prompts: [
      'How would you evaluate whether a carbon-offset project delivers a real climate benefit?',
      'Describe an analysis where you changed your mind after seeing the data.'
    ],
    howToApply: [
      'Explore the open-source repositories and pick a small contribution.',
      'Check the careers page for any current full-time roles.',
      'If you contribute meaningfully, introduce yourself with links to your work.'
    ],
    links: [
      { label: 'Open roles', url: 'https://apply.workable.com/carbonplan/', primary: true },
      { label: 'GitHub (contribute)', url: 'https://github.com/carbonplan' },
      { label: 'CarbonPlan', url: 'https://carbonplan.org/' }
    ],
    keywords: 'carbonplan carbon removal offsets climate data open source github roles no internship remote'
  },
  {
    id: 'climate-trace',
    title: 'Climate TRACE \u2014 coalition roles',
    organization: 'Climate TRACE coalition \u00b7 secretariat WattTime',
    sector: 'nonprofit',
    audience: 'any',
    paid: true,
    payNote: 'No standalone internship \u2014 paid roles via member orgs (e.g., WattTime)',
    location: 'Remote / distributed',
    remote: 'remote',
    duration: 'Varies by member organization',
    seasons: ['spring', 'summer', 'fall'],
    deadlineLabel: 'No internship \u00b7 roles via member orgs',
    deadlines: [
      { cycle: 'Rolling', monthDay: null, note: 'WattTime (the secretariat) posts roles year-round; follow them on LinkedIn' }
    ],
    deadlineSort: null,
    acceptanceTier: 'competitive',
    acceptanceNote: 'Important: Climate TRACE is a coalition (RMI, WattTime, TransitionZero, CTrees, Johns Hopkins APL, and others) \u2014 not a single employer \u2014 so it does not hire interns directly. WattTime, the secretariat, hires in Data Science, Research, Engineering, and Analysis; you can also engage by building on the open emissions data.',
    skills: ['Python', 'GIS', 'Remote sensing', 'Emissions data', 'QA/QC'],
    desc: 'Climate TRACE publishes facility-level greenhouse-gas emissions using satellites, AI, and public data. The way to get involved is through a member organization (WattTime hires most directly) or by analyzing and building on the open global inventory.',
    responsibilities: [
      'Explore and build on the open Climate TRACE emissions dataset',
      'Apply to data/research/engineering roles at coalition members',
      'Validate or compare emissions estimates in a portfolio project',
      'Document data provenance and uncertainty in your analysis'
    ],
    qualifications: [
      'Python and pandas/geopandas proficiency',
      'Interest in emissions accounting and open data',
      'Remote sensing or GIS coursework a plus'
    ],
    tips: [
      'Complete Terrain\u2019s California emitters project, then build on the Climate TRACE data.',
      'Read the methodology docs and cite them when you apply to a member org.',
      'Follow WattTime on LinkedIn \u2014 that is where roles are announced.'
    ],
    prompts: [
      'How would you detect an outlier facility in a global emissions inventory?',
      'Why is transparency in emissions data important for climate accountability?'
    ],
    howToApply: [
      'Download the open data and build a small analysis as proof of skill.',
      'Apply to roles at WattTime or another coalition member organization.',
      'Reach out via the Climate TRACE "get involved" channels to contribute.'
    ],
    links: [
      { label: 'Get involved', url: 'https://climatetrace.org/support-us', primary: true },
      { label: 'WattTime careers', url: 'https://watttime.org/careers/' },
      { label: 'Open emissions data', url: 'https://climatetrace.org/data' }
    ],
    keywords: 'climate trace watttime coalition emissions satellite inventory open data remote python gis'
  },
  {
    id: 'ucla-ursp',
    title: 'UCLA Undergraduate Research Scholars Program (URSP)',
    organization: 'UCLA Undergraduate Research Centers',
    sector: 'ucla',
    audience: 'undergrad',
    paid: true,
    payNote: 'Scholarship up to $4,500 (juniors) / $6,000 (seniors) for the year',
    location: 'UCLA campus',
    remote: 'on-site',
    duration: 'Three quarters (academic year)',
    seasons: ['fall', 'winter', 'spring'],
    deadlineLabel: 'Annual \u00b7 mid-June',
    deadlines: [
      { cycle: 'Annual', monthDay: 'Jun 16', note: 'Application opens ~May 15 and closes Jun 16 (11:59 pm) on MyUCLA' }
    ],
    deadlineSort: '2027-06-16',
    acceptanceTier: 'moderate',
    acceptanceNote: 'Open to UCLA undergrads who will be juniors or seniors in fall and who are doing a research project with a UCLA faculty mentor. STEM students apply through URC\u2013Sciences; humanities, arts, and social-science students through URC\u2013HASS.',
    skills: ['Python', 'R', 'Research', 'GIS', 'Statistics'],
    desc: 'The most accessible way for UCLA students to get funded, faculty-mentored environmental data research on campus. Match with IoES, Geography, Stats, or Engineering faculty running climate, conservation, or environmental-justice projects, then apply with a research proposal.',
    responsibilities: [
      'Carry out a year-long research project with a faculty mentor',
      'Clean and analyze research datasets; keep reproducible code',
      'Write a research proposal and progress reports',
      'Present at UCLA Undergraduate Research Week'
    ],
    qualifications: [
      'UCLA undergraduate with junior or senior standing in fall',
      'A confirmed UCLA faculty research mentor (required for the recommendation)',
      'A clear, feasible research proposal'
    ],
    tips: [
      'Secure your faculty mentor first \u2014 the application needs their letter.',
      'Browse the Terrain faculty directory and read recent papers before emailing.',
      'Attend a URC proposal-writing workshop; the proposal is the core of the application.',
      'Start the MyUCLA application early \u2014 it cannot be submitted after the deadline.'
    ],
    prompts: [
      'What environmental data question in this lab\u2019s recent work interests you most?',
      'Describe your experience with Python/R and a project you can show in week one.',
      'What would your research contribute, and what is your quarter-by-quarter plan?'
    ],
    howToApply: [
      'Find and confirm a UCLA faculty research mentor.',
      'Open the URSP application on MyUCLA (Campus Life \u2192 Survey) in spring.',
      'Submit your proposal and have your mentor send the recommendation by Jun 16.'
    ],
    links: [
      { label: 'URSP \u2013 Sciences', url: 'https://sciences.ugresearch.ucla.edu/programs-and-scholarships/ursp/', primary: true },
      { label: 'URSP \u2013 Humanities & Social Sciences', url: 'https://hass.ugresearch.ucla.edu/scholarships/ursp/' },
      { label: 'Terrain faculty directory', url: 'index.html#faculty' }
    ],
    keywords: 'ucla ursp undergraduate research scholars program ioes faculty lab campus scholarship'
  },
  {
    id: 'luskin-ej-fellowship',
    title: 'Luskin Center Field Fellowship (Environmental Justice)',
    organization: 'UCLA Luskin Center for Innovation',
    sector: 'ucla',
    audience: 'grad',
    paid: true,
    payNote: 'Paid stipend (amount varies by year and student level)',
    location: 'Los Angeles area partner organizations',
    remote: 'hybrid',
    duration: '~220 hours (quarter or summer)',
    seasons: ['summer', 'fall'],
    deadlineLabel: 'Late fall application',
    deadlines: [
      { cycle: 'Following year', monthDay: 'late fall', note: 'Applications typically open in fall; check the Luskin CFI student opportunities page' }
    ],
    deadlineSort: '2026-11-15',
    acceptanceTier: 'competitive',
    acceptanceNote: 'A limited UCLA fellowship placing students with environmental-justice organizations. Strong community-centered interest is expected alongside data or policy skills. Confirm current eligibility and stipend on the Luskin page.',
    skills: ['Policy analysis', 'GIS', 'Community engagement', 'Python', 'Writing'],
    desc: 'A paid UCLA fellowship that places students with Los Angeles environmental-justice organizations (e.g., Community Water Center, Communities for a Better Environment, PSR-LA). Combine data and policy skills with community-centered work.',
    responsibilities: [
      'Support a partner org\u2019s data and policy projects',
      'Attend community meetings and document findings',
      'Produce maps, briefs, or dashboards as needed',
      'Reflect on equity-centered research practices'
    ],
    qualifications: [
      'UCLA student (confirm undergrad vs. graduate eligibility for the current cycle)',
      'Commitment to environmental justice',
      'Quantitative or GIS skills valued'
    ],
    tips: [
      'Lead with community connection, not just technical skills.',
      'Reference CalEnviroScreen or local EJ mapping you have done.',
      'Ask Luskin CFI advisors about fit before applying.'
    ],
    prompts: [
      'How do you ensure community priorities lead your data analysis?',
      'Describe an environmental-justice issue in LA you want to address with data.'
    ],
    howToApply: [
      'Watch the Luskin CFI student opportunities page for the fellowship call.',
      'Submit the application materials when the cycle opens.',
      'Interview with CFI and partner organizations.'
    ],
    links: [
      { label: 'Luskin student opportunities', url: 'https://innovation.luskin.ucla.edu/opportunities-for-students/', primary: true },
      { label: 'Luskin fellowships hub', url: 'https://luskin.ucla.edu/student-affairs/fellowships' }
    ],
    keywords: 'luskin ucla environmental justice fellowship field stipend e j community'
  }
];
