// RethoricalAI Mock Data Engine

export const FEEDBACK_TONES = [
  { id: 'standard', name: 'Standard Academic', icon: 'school', desc: 'Balanced, objective evaluation with clear improvement targets.' },
  { id: 'encouraging', name: 'Encouraging & Growth-Mindset', icon: 'favorite', desc: 'Supportive praise, constructive nudges, and confidence-building highlights.' },
  { id: 'rigorous', name: 'Rigorous AP & Honors', icon: 'workspace_premium', desc: 'High-level rhetorical critique, nuanced logic analysis, and college-ready standards.' },
  { id: 'multilingual', name: 'ELL & Language Learner Friendly', icon: 'translate', desc: 'Simplified explanations, clear grammar mechanics, and supportive vocabulary definitions.' }
];

export const ASSIGNMENT_TEMPLATES = [
  {
    id: 'ap_lit',
    name: 'Literature & Analytical Synthesis',
    category: 'Humanities & English',
    icon: 'menu_book',
    defaultWordLimit: 1500,
    criteria: [
      { id: 'c1', name: 'Thesis & Main Argument', description: 'Nuanced, defensible claim that addresses prompt tensions without formulaic phrasing.', weight: 25, maxScore: 25 },
      { id: 'c2', name: 'Textual Evidence & Quotes', description: 'Specific quotes smoothly integrated with active verbs to support analytical points.', weight: 35, maxScore: 35 },
      { id: 'c3', name: 'Organization & Structure', description: 'Cohesive paragraph progression with natural rhetorical transitions.', weight: 20, maxScore: 20 },
      { id: 'c4', name: 'Style, Voice & Grammar', description: 'Academic register, sentence rhythm, precise vocabulary, and accurate mechanics.', weight: 20, maxScore: 20 }
    ]
  },
  {
    id: 'stem_lab',
    name: 'STEM & Scientific Lab Report',
    category: 'Sciences & Engineering',
    icon: 'science',
    defaultWordLimit: 2000,
    criteria: [
      { id: 'c1', name: 'Hypothesis & Variable Control', description: 'Testable scientific hypothesis with clearly identified independent/dependent variables.', weight: 20, maxScore: 20 },
      { id: 'c2', name: 'Methodology & Experimental Procedure', description: 'Replicable experimental protocol, control groups, and systematic error minimisation.', weight: 25, maxScore: 25 },
      { id: 'c3', name: 'Data Analysis & Quantitative Evidence', description: 'Precise tabular/graphical representation, statistical error margins, and trend analysis.', weight: 30, maxScore: 30 },
      { id: 'c4', name: 'Scientific Conclusion & Discussion', description: 'Evidence-grounded hypothesis validation, limitation acknowledgment, and future research direction.', weight: 25, maxScore: 25 }
    ]
  },
  {
    id: 'history_dbq',
    name: 'History Document-Based Question (DBQ)',
    category: 'Social Studies & History',
    icon: 'account_balance',
    defaultWordLimit: 1800,
    criteria: [
      { id: 'c1', name: 'Historical Contextualization', description: 'Accurate broader historical context connecting events across time and geography.', weight: 20, maxScore: 20 },
      { id: 'c2', name: 'Primary Source Corroboration', description: 'Uses at least 4-6 primary source documents to support the central historical thesis.', weight: 30, maxScore: 30 },
      { id: 'c3', name: 'Historical Sourcing (HIPP)', description: 'Analyzes author Point of View, Purpose, Historical Situation, and Audience.', weight: 30, maxScore: 30 },
      { id: 'c4', name: 'Complex Understanding & Synthesis', description: 'Nuanced counter-perspectives, corroboration, and cross-era synthesis.', weight: 20, maxScore: 20 }
    ]
  },
  {
    id: 'business_case',
    name: 'Business Case Study & Strategy Brief',
    category: 'Business, Econ & Policy',
    icon: 'trending_up',
    defaultWordLimit: 1600,
    criteria: [
      { id: 'c1', name: 'Executive Summary & Problem Framing', description: 'Concise, high-impact identification of core business bottleneck or market challenge.', weight: 25, maxScore: 25 },
      { id: 'c2', name: 'Financial & Strategic Reasoning', description: 'Rigorous application of data, ROI models, competitive analysis, and market metrics.', weight: 35, maxScore: 35 },
      { id: 'c3', name: 'Actionable Implementation Roadmap', description: 'Phased operational timeline with resource allocation, risk mitigation, and KPI milestones.', weight: 25, maxScore: 25 },
      { id: 'c4', name: 'Clarity, Brevity & Professional Tone', description: 'Scannable headings, bulleted takeaways, and boardroom-ready executive communication.', weight: 15, maxScore: 15 }
    ]
  },
  {
    id: 'creative_writing',
    name: 'Creative Prose & Narrative Writing',
    category: 'Creative Arts & Writing',
    icon: 'auto_stories',
    defaultWordLimit: 2200,
    criteria: [
      { id: 'c1', name: 'Characterization & Dialogue Voice', description: 'Distinct, authentic dialogue and multi-dimensional character motivation.', weight: 25, maxScore: 25 },
      { id: 'c2', name: 'Sensory Imagery & World-Building', description: 'Evocative sensory details, immersive setting establishment, and "show-don\'t-tell" technique.', weight: 30, maxScore: 30 },
      { id: 'c3', name: 'Narrative Arc & Pacing', description: 'Compelling rising tension, climactic turning point, and intentional scene pacing.', weight: 25, maxScore: 25 },
      { id: 'c4', name: 'Thematic Resonance & Prose Polish', description: 'Subtle thematic subtext, stylistic cadence, and intentional syntactical choices.', weight: 20, maxScore: 20 }
    ]
  }
];

export const ORIGINALITY_METRICS = {
  originalityScore: 96,
  breakdown: [
    { label: 'Original Critical Synthesis', percentage: 78, color: '#137333', desc: 'Unique argumentation and personal prose' },
    { label: 'Cited Textual Passages', percentage: 18, color: '#1A73E8', desc: 'Verbatim quotes with proper MLA citations' },
    { label: 'Standard Academic Idioms', percentage: 4, color: '#F29900', desc: 'Common transitional & contextual phrases' },
    { label: 'Uncited Match / AI Paraphrase', percentage: 0, color: '#D93025', desc: 'Zero uncredited text detected' }
  ],
  citationHealth: 'Passed (MLA 9th Edition Standard)',
  sourceOverlapCount: 3
};

export const DRAFT_COMPARISON = {
  previousDraft: {
    version: 'v1.0 (Initial Draft)',
    submittedAt: 'Sept 18, 2026',
    score: 82,
    wordCount: 1240,
    weaknesses: [
      'Comma splices in paragraph 2 connecting independent clauses',
      'Floating quotation in paragraph 3 without analytical setup',
      'Abrupt transition between Gatsby’s economic status and tragic fate'
    ]
  },
  currentDraft: {
    version: 'v2.0 (Revised Submission)',
    submittedAt: 'Sept 24, 2026',
    score: 91,
    wordCount: 1420,
    scoreDelta: '+9 pts',
    resolvedCount: '3 of 3 Action Items Resolved',
    resolvedImprovements: [
      { item: 'Comma splice resolved using semicolon in paragraph 2', status: 'Fixed ✓' },
      { item: 'Signal verb introduced for Daisy quotation in paragraph 3', status: 'Fixed ✓' },
      { item: 'Smooth paragraph bridge added linking West Egg geography to Gatsby’s delusion', status: 'Fixed ✓' }
    ]
  }
};

export const BATCH_SUBMISSIONS_QUEUE = [
  { id: 'sub-01', studentName: 'Julian Vance', title: 'The Gilded Mirage: Fabricated Identity in West Egg', wordCount: 1420, score: 91, status: 'Graded', flag: 'High Originality', approved: true },
  { id: 'sub-02', studentName: 'Maya Lin', title: 'Spatial Stratification & Moral Decay in Gatsby', wordCount: 1380, score: 94, status: 'Graded', flag: 'Top Score', approved: true },
  { id: 'sub-03', studentName: 'Marcus Sterling', title: 'Romantic Idealism vs Economic Corruption', wordCount: 1120, score: 72, status: 'Needs Review', flag: 'Needs Quote Help', approved: false },
  { id: 'sub-04', studentName: 'Sofia Rodriguez', title: 'The Auditory Siren: Daisy’s Commodification', wordCount: 1510, score: 96, status: 'Graded', flag: 'Exemplary Synthesis', approved: true },
  { id: 'sub-05', studentName: 'Devon Carter', title: 'Nick Carraway as Uncredited Director', wordCount: 1290, score: 85, status: 'Graded', flag: 'Good Analysis', approved: true },
  { id: 'sub-06', studentName: 'Chloe Bennett', title: 'The Valley of Ashes: Industrial Purgatory', wordCount: 1340, score: 88, status: 'Graded', flag: 'Strong Voice', approved: true }
];

export const INITIAL_CLASSES = [
  { id: 'ap-lit', name: 'AP English Literature (Period 3)', students: 28, pending: 4, avgScore: 88.4 },
  { id: 'eng-101', name: 'College Composition 101 (Sec 04)', students: 32, pending: 0, avgScore: 84.1 },
  { id: 'hist-10', name: 'World History DBQ (10th Grade)', students: 24, pending: 6, avgScore: 79.5 }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    classId: 'ap-lit',
    title: "Gatsby's Green Light: Symbolism & American Disillusionment",
    dueDate: '2026-09-28',
    submittedCount: 28,
    gradedCount: 24,
    rubricName: 'AP Literary Analysis Rubric (2026)',
    status: 'Grading in Progress'
  },
  {
    id: 'asg-2',
    classId: 'eng-101',
    title: 'Ethics of Generative AI in Academic Prose',
    dueDate: '2026-09-22',
    submittedCount: 32,
    gradedCount: 32,
    rubricName: 'Argumentative & Research Standard',
    status: 'Completed'
  },
  {
    id: 'asg-3',
    classId: 'hist-10',
    title: 'Industrial Revolution Primary Source DBQ',
    dueDate: '2026-09-30',
    submittedCount: 18,
    gradedCount: 12,
    rubricName: 'DBQ Historical Synthesis Standard',
    status: 'Needs Review'
  }
];

export const DEFAULT_RUBRIC = {
  id: 'rubric-ap-lit',
  title: 'AP Literary Analysis & Synthesis Rubric',
  description: 'Custom evaluation scale for AP Senior English literature assignments focusing on thesis formulation, quote integration, and stylistic depth.',
  criteria: [
    {
      id: 'c1',
      name: 'Thesis & Claims',
      description: 'Presents a defensible, nuanced thesis statement that establishes a clear line of reasoning.',
      weight: 25,
      maxScore: 25
    },
    {
      id: 'c2',
      name: 'Textual Evidence & Citation',
      description: 'Selects specific, relevant evidence to support line of reasoning and embeds quotes seamlessly with correct MLA format.',
      weight: 25,
      maxScore: 25
    },
    {
      id: 'c3',
      name: 'Rhetorical Analysis & Synthesis',
      description: 'Explains how the evidence supports reasoning, analyzing literary devices, symbolism, and historical context.',
      weight: 30,
      maxScore: 30
    },
    {
      id: 'c4',
      name: 'Mechanics & Prose Style',
      description: 'Demonstrates control of grammar, syntax, varied sentence structures, and academic tone.',
      weight: 20,
      maxScore: 20
    }
  ]
};

export const SAMPLE_ESSAY_REPORT = {
  id: 'sub-101',
  studentName: 'Maya Lin',
  studentEmail: 'maya.lin@student.prep.edu',
  assignmentTitle: "Gatsby's Green Light: Symbolism & American Disillusionment",
  className: 'AP English Literature (Period 3)',
  submittedAt: 'Sept 24, 2026 • 11:42 PM',
  wordCount: 1420,
  overallScore: 92,
  letterGrade: 'A-',
  statusBadge: 'Proficient / Advanced',
  
  criteriaScores: [
    { criterionId: 'c1', name: 'Thesis & Claims', score: 24, maxScore: 25, comment: 'Nuanced thesis statement linking Gatsby’s green light to socio-economic mobility.' },
    { criterionId: 'c2', name: 'Textual Evidence & Citation', score: 23, maxScore: 25, comment: 'Strong primary quote integration; keep block quotes trimmed.' },
    { criterionId: 'c3', name: 'Rhetorical Analysis & Synthesis', score: 27, maxScore: 30, comment: 'Brilliant metaphor comparison connecting Nick Carraway to an uncredited director.' },
    { criterionId: 'c4', name: 'Mechanics & Prose Style', score: 18, maxScore: 20, comment: 'Elevated academic vocabulary; watch out for comma splices in complex sentences.' }
  ],

  strengths: [
    'Sophisticated rhetorical vocabulary (e.g., "ephemeral illusion", "stratified opulence").',
    'Seamless transition between literal setting description and thematic symbolic analysis.',
    'Strong contextual understanding of 1920s American economic optimism.'
  ],

  improvements: [
    'Resolve comma splices when connecting two independent clauses with transitional adverbs.',
    'Deepen the counter-perspective in Paragraph 4 regarding Gatsby\'s self-constructed identity.',
    'Ensure all block citations follow strict 4-line MLA indentation rules.'
  ],

  pedagogicalInsight: {
    title: 'Teacher Feedback & In-Depth Insight',
    content: `Maya demonstrates remarkable maturity in examining spatial symbolism in Fitzgerald's prose. Her insight regarding the physical distance across the bay mirroring the class divide between West and East Egg elevates this paper beyond standard literary analysis.

Teaching Recommendation: To help Maya progress from an A- to a publication-ready assignment, encourage her to explore Fitzgerald's subtle rhythm choices—specifically how short, truncated sentences in Chapter 5 mirror Gatsby's anxiety before Daisy's arrival.`
  },

  essayParagraphs: [
    {
      id: 'p1',
      text: `In F. Scott Fitzgerald's 1925 masterpiece The Great Gatsby, spatial geography functions as a physical manifestation of American socio-economic stratification. Standing at the dock of his West Egg mansion, Jay Gatsby gazes across the dark expanse of Long Island Sound toward a single, luminous green beacon. {{note-1}}The green light at the end of Daisy Buchanan's dock is not merely an object of romantic yearning; it embodies the haunting illusion of the American Dream, attainable in sight yet forever out of reach.{{/note-1}} Fitzgerald uses this central motif to critique the post-WWI illusion that wealth can overcome aristocratic pedigree.`
    },
    {
      id: 'p2',
      text: `Gatsby's pursuit of Daisy is inextricably linked to his desire for validation within the established upper class. {{note-2}}Nick Carraway acts almost as an uncredited theater director, observing Gatsby's elaborate stage set—his ostentatious parties, imported shirts, and library of uncut books—designed entirely to lure Daisy across the bay.{{/note-2}} However, the green light remains physically separated from Gatsby by water, symbolising the impassable gulf between West Egg's "new money" and East Egg's inherited aristocracy.`
    },
    {
      id: 'p3',
      text: `Furthermore, the color green itself carries a dual thematic charge throughout the novel. On one hand, green represents economic vitality, growth, and the fresh green breast of the new world that Dutch sailors first beheld. On the other hand, it signifies decay and envy. {{note-3}}Notice how the transition between Chapter 1 and Chapter 5 shifts the green light from a distant enigma into a collapsed symbol.{{/note-3}} Once Daisy actually steps foot inside Gatsby's mansion, Nick notes that "the colossal significance of that light had now gone forever."`
    },
    {
      id: 'p4',
      text: `{{note-4}}The green light shimmered across the misty bay, Gatsby stretched his arms toward it with trembling reverence.{{/note-4}} {{note-5}}This gesture underscores the tragedy of Gatsby’s existence: his relentless romantic readiness blinds him to the corruption of the very world he seeks to enter.{{/note-5}} When Tom Buchanan casually dismangles Gatsby’s fabricated past, Daisy’s retreat into Tom’s "careless" wealth confirms that the green light was an illusion all along.`
    },
    {
      id: 'p5',
      text: `Ultimately, Fitzgerald leaves the reader with a sobering reflection on human ambition. {{note-6}}By anchoring Gatsby's tragic trajectory to a glowing beacon across the water, the narrative demonstrates how idealized dreams consume the individual.{{/note-6}} We are left beating on against the current, endlessly borne back into the past.`
    }
  ],

  marginNotes: [
    {
      id: 'note-1',
      type: 'praise', // gold
      author: 'AI Assistant & Teacher',
      tag: 'Thesis Strength',
      text: 'Exemplary thesis statement! It clearly connects the literal object (green light) to broader socio-economic critique.',
      quoteExcerpt: 'The green light at the end of Daisy Buchanan\'s dock is not merely an object of romantic yearning...'
    },
    {
      id: 'note-2',
      type: 'insight', // blue
      author: 'Teacher Insight',
      tag: 'Metaphoric Depth',
      text: 'Brilliant analytical metaphor comparing Nick to a theater director. This demonstrates deep engagement with narrative perspective.',
      quoteExcerpt: 'Nick Carraway acts almost as an uncredited theater director...'
    },
    {
      id: 'note-3',
      type: 'insight', // blue
      author: 'Structure & Flow',
      tag: 'Transition Logic',
      text: 'Great observation connecting Chapter 1 and Chapter 5. Consider linking this directly to the collapse of the illusion.',
      quoteExcerpt: 'Notice how the transition between Chapter 1 and Chapter 5 shifts...'
    },
    {
      id: 'note-4',
      type: 'correction', // red
      author: 'Grammar & Syntax',
      tag: 'Comma Splice',
      text: 'Comma Splice Error: Two independent clauses are joined only with a comma. Fix with a semicolon or add a coordinating conjunction ("and").',
      suggestion: 'The green light shimmered across the misty bay; Gatsby stretched his arms toward it...',
      quoteExcerpt: 'The green light shimmered across the misty bay, Gatsby stretched his arms...'
    },
    {
      id: 'note-5',
      type: 'praise', // gold
      author: 'Prof. Miller',
      tag: 'Insightful Commentary',
      text: 'Spot-on description of Gatsby’s "romantic readiness." Excellent choice of vocabulary.',
      quoteExcerpt: 'This gesture underscores the tragedy of Gatsby’s existence...'
    },
    {
      id: 'note-6',
      type: 'insight', // blue
      author: 'Conclusion',
      tag: 'Synthesis',
      text: 'Strong concluding synthesis. Beautifully ties back to the introductory thesis.',
      quoteExcerpt: 'By anchoring Gatsby\'s tragic trajectory to a glowing beacon...'
    }
  ],

  grammarQuiz: [
    {
      id: 'q1',
      rule: 'Comma Splice Resolution',
      prompt: 'Which of the following correctly fixes the comma splice in paragraph 4?',
      options: [
        { text: 'The green light shimmered across the misty bay, Gatsby stretched his arms toward it.', correct: false, reason: 'This retains the original comma splice.' },
        { text: 'The green light shimmered across the misty bay; Gatsby stretched his arms toward it.', correct: true, reason: 'Correct! A semicolon properly separates two independent clauses.' },
        { text: 'The green light shimmered across the misty bay Gatsby stretched his arms toward it.', correct: false, reason: 'This creates a run-on sentence without punctuation.' },
        { text: 'The green light shimmering across the misty bay, Gatsby stretching arms.', correct: false, reason: 'This creates a sentence fragment.' }
      ]
    },
    {
      id: 'q2',
      rule: 'MLA In-Text Citation',
      prompt: 'How should a direct quote from Fitzgerald on page 110 be cited in MLA format?',
      options: [
        { text: '"The green light had gone forever" (Fitzgerald, p. 110).', correct: false, reason: 'MLA does not use "p." or a comma between author and page.' },
        { text: '"The green light had gone forever" (Fitzgerald 110).', correct: true, reason: 'Correct! Standard MLA format requires author name and page number without comma.' },
        { text: '"The green light had gone forever" (Fitzgerald: 110).', correct: false, reason: 'Colon is not standard MLA in-text style.' }
      ]
    },
    {
      id: 'q3',
      rule: 'Active vs Passive Voice in Literary Analysis',
      prompt: 'Which revision replaces passive voice with active literary commentary?',
      options: [
        { text: 'The tragedy of Gatsby is demonstrated by Fitzgerald through spatial distance.', correct: false, reason: 'Passive voice phrasing.' },
        { text: 'Fitzgerald demonstrates Gatsby’s tragedy through spatial distance.', correct: true, reason: 'Correct! Direct subject-verb active prose.' }
      ]
    }
  ]
};

export const CLASS_ANALYTICS = {
  classId: 'ap-lit',
  className: 'AP English Literature (Period 3)',
  totalEssays: 28,
  avgScore: 88.4,
  criteriaAverages: [
    { name: 'Thesis & Argumentative Claims', average: 23.4, max: 25, percentage: 94 },
    { name: 'Textual Evidence & Synthesis', average: 26.6, max: 35, percentage: 76 },
    { name: 'Organization & Section Flow', average: 17.6, max: 20, percentage: 88 },
    { name: 'Voice, Style & Mechanics', average: 18.2, max: 20, percentage: 91 }
  ],
  scoreDistribution: [
    { grade: 'A (90-100)', count: 12, percentage: 43 },
    { grade: 'B (80-89)', count: 10, percentage: 36 },
    { grade: 'C (70-79)', count: 4, percentage: 14 },
    { grade: 'D/F (<70)', count: 2, percentage: 7 }
  ],
  conceptGaps: [
    { title: 'Thesis Specificity & Scope', percentage: 42, severity: 'High', affectCount: 12, category: 'Argumentation' },
    { title: 'Quote Embedding & Signal Verbs', percentage: 38, severity: 'High', affectCount: 11, category: 'Evidence' },
    { title: 'Comma Splices in Compound Sentences', percentage: 32, severity: 'Medium', affectCount: 9, category: 'Mechanics' },
    { title: 'Counter-Argument Integration', percentage: 25, severity: 'Medium', affectCount: 7, category: 'Synthesis' },
    { title: 'Passive Voice in Analytical Prose', percentage: 18, severity: 'Low', affectCount: 5, category: 'Style' }
  ],
  rankedReteachTopics: [
    {
      rank: 1,
      topic: 'Building Defensible & Specific Thesis Statements',
      gapPercentage: 42,
      description: '42% of essays used overly broad thesis claims ("Fitzgerald uses green light to show wealth") instead of specifying exact socio-economic consequences.',
      suggestedAction: '15-Minute Mini-Lesson: "The Although... Because... Model" for thesis formulation.',
      lessonPlan: '1. Project 3 anonymous student thesis statements on board.\n2. Ask students to identify vague terms (e.g. "society", "feelings").\n3. Rewrite using specific literary device + author purpose template.'
    },
    {
      rank: 2,
      topic: 'Seamless Quote Integration (Avoiding Floating Quotes)',
      gapPercentage: 38,
      description: '11 students dropped direct quotes as standalone sentences without introductory signal phrases.',
      suggestedAction: 'Practice Activity: "Quote Blending Challenge" with peer feedback.',
      lessonPlan: '1. Teach 4 quote integration techniques (Colon, Comma with Signal Verb, Embedded Clause, Paraphrase-quote hybrid).\n2. Have students revise 2 quotes in their draft.'
    },
    {
      rank: 3,
      topic: 'Eliminating Comma Splices with Semicolons & Conjunctions',
      gapPercentage: 32,
      description: '9 papers contained comma splices when connecting analytical statements.',
      suggestedAction: 'Quick Quiz & Warmup: 5-Sentence Diagnostic.',
      lessonPlan: '1. Review independent clause definition.\n2. Practice 3 fixes: Semicolon, Coordinating Conjunction (FANBOYS), or Subordinating Conjunction.'
    }
  ],
  studentDrilldown: [
    { id: 's1', name: 'Maya Lin', grade: 92, status: 'Graded', struggle: 'Comma Splices', trend: '+4%', keyStrength: 'Rhetorical depth' },
    { id: 's2', name: 'Julian Vance', grade: 89, status: 'Graded', struggle: 'Quote Integration', trend: '+2%', keyStrength: 'Clear thesis' },
    { id: 's3', name: 'Devon Carter', grade: 76, status: 'Graded', struggle: 'Thesis Scope', trend: '-3%', keyStrength: 'Vivid prose' },
    { id: 's4', name: 'Sofia Rodriguez', grade: 95, status: 'Graded', struggle: 'None (Advanced)', trend: '+5%', keyStrength: 'Flawless synthesis' },
    { id: 's5', name: 'Ethan Hawke', grade: 71, status: 'Graded', struggle: 'Counter-argument', trend: '0%', keyStrength: 'Good quotes' },
    { id: 's6', name: 'Chloe Bennett', grade: 84, status: 'Graded', struggle: 'Passive voice', trend: '+3%', keyStrength: 'Organized layout' },
    { id: 's7', name: 'Marcus Sterling', grade: 68, status: 'Needs Review', struggle: 'Thesis & Evidence', trend: '-5%', keyStrength: 'Engaging topic' },
    { id: 's8', name: 'Amara Okafor', grade: 94, status: 'Graded', struggle: 'Minor MLA spacing', trend: '+1%', keyStrength: 'Sophisticated voice' }
  ]
};

export const LMS_SYNC_DATA = {
  connectedLms: {
    name: 'Google Classroom',
    status: 'Connected',
    account: 'miller.j@prepacademy.edu',
    lastSync: '2026-09-26 14:19:02',
    activeCourses: 3,
    autoSync: true
  },
  otherLms: [
    { name: 'Canvas LMS', status: 'Coming Soon', provider: 'Instructure' },
    { name: 'Moodle', status: 'Coming Soon', provider: 'Moodle HQ' },
    { name: 'Schoology / PowerSchool', status: 'Coming Soon', provider: 'PowerSchool' },
    { name: 'Blackboard Learn', status: 'Coming Soon', provider: 'Anthology' }
  ],
  syncLogs: [
    { id: 'l1', timestamp: '2026-09-26 14:19:02', course: 'AP English Literature (Period 3)', assignment: 'Gatsby Green Light Essay', itemsSynced: 24, status: 'Success' },
    { id: 'l2', timestamp: '2026-09-25 18:30:11', course: 'College Composition 101 (Sec 04)', assignment: 'Ethics of AI Essay', itemsSynced: 32, status: 'Success' },
    { id: 'l3', timestamp: '2026-09-24 09:12:44', course: 'World History DBQ (10th Grade)', assignment: 'Industrial Rev Source Analysis', itemsSynced: 18, status: 'Success' },
    { id: 'l4', timestamp: '2026-09-22 11:05:00', course: 'AP English Literature (Period 3)', assignment: 'Diagnostic Essay #1', itemsSynced: 28, status: 'Success' }
  ]
};

export const QUICK_FEEDBACK_SNIPPETS = [
  {
    id: 'snip-1',
    category: 'Evidence & Citations',
    tag: 'Signal Phrases',
    text: "Integrate an active signal phrase (e.g., 'Fitzgerald illustrates...') before introducing this quotation to frame your analytical point.",
    shortcut: '@signal'
  },
  {
    id: 'snip-2',
    category: 'Grammar & Mechanics',
    tag: 'Comma Splice',
    text: "Comma splice detected: separate these two independent clauses with a semicolon or coordinating conjunction (FANBOYS).",
    shortcut: '@splice'
  },
  {
    id: 'snip-3',
    category: 'Analytical Depth',
    tag: 'Unpack Claim',
    text: "Unpack this observation further: how does this specific textual motif connect back to your broader thesis on class disillusionment?",
    shortcut: '@unpack'
  },
  {
    id: 'snip-4',
    category: 'Organization & Flow',
    tag: 'Transitions',
    text: "Smooth the transition between these paragraphs with a conjunctive bridge that contrasts the previous point with this new finding.",
    shortcut: '@bridge'
  },
  {
    id: 'snip-5',
    category: 'Praise & Voice',
    tag: 'Distinct Voice',
    text: "Exemplary critical synthesis! Your sentence rhythm and analytical register elevate this entire paragraph.",
    shortcut: '@praise'
  },
  {
    id: 'snip-6',
    category: 'Evidence & Citations',
    tag: 'MLA 9th Edition',
    text: "Parenthetical citation check: ensure page number follows author surname with no internal comma, e.g. (Fitzgerald 115).",
    shortcut: '@mla'
  }
];

export const KEYBOARD_SHORTCUTS = [
  { key: '[', action: 'Previous Student Submission' },
  { key: ']', action: 'Next Student Submission' },
  { key: 'Space / A', action: 'Approve Submission & Advance' },
  { key: '1 - 5', action: 'Apply Quick-Stamp (🌟 Evidence, ⚠️ Citation, 🔍 Deepen)' },
  { key: 'S', action: 'Open Quick-Feedback Snippets Library' },
  { key: 'C', action: 'Toggle Split-Screen Source Comparison' },
  { key: 'D', action: 'Toggle Draft 1 vs Draft 2 Revision Diff' },
  { key: 'M', action: 'Toggle Tactile Paper Sound Effects (Mute/Unmute)' },
  { key: '?', action: 'Toggle Flight Control Speed-Grading Cheatsheet' }
];
