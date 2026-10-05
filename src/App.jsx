import React, { useState, useEffect } from 'react';
import './index.css';
import { fireCelebrationConfetti } from './utils/confetti';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GrammarQuizModal from './components/GrammarQuizModal';
import NewAssignmentModal from './components/NewAssignmentModal';
import TeacherProfileModal from './components/TeacherProfileModal';
import StudentProfileModal from './components/StudentProfileModal';
import SubmissionReceiptModal from './components/SubmissionReceiptModal';
import RoleSelectionGateway from './components/RoleSelectionGateway';

import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import RubricBuilderScreen from './screens/RubricBuilderScreen';
import EssaySubmissionScreen from './screens/EssaySubmissionScreen';
import FeedbackReportScreen from './screens/FeedbackReportScreen';
import AnalyticsDashboardScreen from './screens/AnalyticsDashboardScreen';
import LmsSyncScreen from './screens/LmsSyncScreen';
import StudentSubmissionsScreen, { DEFAULT_CSBS_PENDING_ASSIGNMENTS } from './screens/StudentSubmissionsScreen';

// Official III Sem CSBS 'A' Department of Information Science & Engineering Curriculum Data
const DEFAULT_CLASSES = [
  {
    id: 'cls-cb330',
    name: "III Sem CSBS 'A'",
    subject: '24CB330: Object Oriented Programming',
    courseCode: '24CB330',
    instructor: 'Dr. D S Vinod (DSV)',
    credits: 4,
    period: 'Mon/Wed/Fri (09:15 - 10:05 AM)',
    room: 'IS103 / IS101',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' },
      { id: 'stu-01', name: 'Aarav Sharma', rollNo: '01', usn: '01JST25UCB001', email: 'aarav.s@jssstuniv.in' },
      { id: 'stu-12', name: 'Ananya Deshmukh', rollNo: '12', usn: '01JST25UCB012', email: 'ananya.d@jssstuniv.in' },
      { id: 'stu-24', name: 'Karthik Raja', rollNo: '24', usn: '01JST25UCB024', email: 'karthik.r@jssstuniv.in' },
      { id: 'stu-45', name: 'Rohan Varma', rollNo: '45', usn: '01JST25UCB045', email: 'rohan.v@jssstuniv.in' },
      { id: 'stu-58', name: 'Sneha Kulkarni', rollNo: '58', usn: '01JST25UCB058', email: 'sneha.k@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-cb310',
    name: "III Sem CSBS 'A'",
    subject: '24CB310: Formal Language & Automata Theory',
    courseCode: '24CB310',
    instructor: 'Ms. Sindhu G (SG)',
    credits: 4,
    period: 'Tue/Thu (10:15 - 11:05 AM)',
    room: 'IS103 / IS102',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' },
      { id: 'stu-01', name: 'Aarav Sharma', rollNo: '01', usn: '01JST25UCB001', email: 'aarav.s@jssstuniv.in' },
      { id: 'stu-12', name: 'Ananya Deshmukh', rollNo: '12', usn: '01JST25UCB012', email: 'ananya.d@jssstuniv.in' },
      { id: 'stu-24', name: 'Karthik Raja', rollNo: '24', usn: '01JST25UCB024', email: 'karthik.r@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-cb320',
    name: "III Sem CSBS 'A'",
    subject: '24CB320: Computer Organization & Architecture',
    courseCode: '24CB320',
    instructor: 'Ms. Malapriya S (MPS)',
    credits: 4,
    period: 'Mon/Wed (11:20 - 12:10 PM)',
    room: 'IS103 / IS102',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' },
      { id: 'stu-12', name: 'Ananya Deshmukh', rollNo: '12', usn: '01JST25UCB012', email: 'ananya.d@jssstuniv.in' },
      { id: 'stu-45', name: 'Rohan Varma', rollNo: '45', usn: '01JST25UCB045', email: 'rohan.v@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-cb340',
    name: "III Sem CSBS 'A'",
    subject: '24CB340: Computational Statistics',
    courseCode: '24CB340',
    instructor: 'Ms. Lavanya M S (LMS)',
    credits: 4,
    period: 'Tue/Fri (02:00 - 02:50 PM)',
    room: 'IS103 / IS101',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' },
      { id: 'stu-24', name: 'Karthik Raja', rollNo: '24', usn: '01JST25UCB024', email: 'karthik.r@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-cb350',
    name: "III Sem CSBS 'A'",
    subject: '24CB350: Software Engineering',
    courseCode: '24CB350',
    instructor: 'Ms. Shruthi N (SN)',
    credits: 4,
    period: 'Thu/Fri (03:00 - 03:50 PM)',
    room: 'IS103 / IS101',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' },
      { id: 'stu-01', name: 'Aarav Sharma', rollNo: '01', usn: '01JST25UCB001', email: 'aarav.s@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-cb360',
    name: "III Sem CSBS 'A'",
    subject: '24CB360: Financial & Cost Accounting',
    courseCode: '24CB360',
    instructor: 'Prof. Kaveri D (KD)',
    credits: 4,
    period: 'Mon/Wed (03:00 - 03:50 PM)',
    room: 'IS102 / IS103',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' }
    ]
  },
  {
    id: 'cls-hu311',
    name: "III Sem CSBS 'A'",
    subject: '24HU311: Universal Human Values (UHV) - II',
    courseCode: '24HU311',
    instructor: 'Ms. Vyshali Rao K P (VRK)',
    credits: 2,
    period: 'Sat (10:00 - 11:40 AM)',
    room: 'IS103',
    studentRoster: [
      { id: 'stu-33', name: 'Pratyush Raj', rollNo: '33', usn: '01JST25UCBO65', email: '01jst25ucbo65@jssstuniv.in' }
    ]
  }
];

export default function App() {
  const [theme, setTheme] = useState('day'); // 'day' | 'night'
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('rethorical_academic_role') || null;
  });
  const [activeTab, setActiveTab] = useState(() => {
    const savedRole = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('rethorical_academic_role') : null;
    return savedRole === 'student' ? 'student_submissions' : 'dashboard';
  });
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState(DEFAULT_CLASSES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetAssignment, setSelectedTargetAssignment] = useState(null);

  // Handle role selection (Student lands directly on Pending Assignments)
  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    try {
      sessionStorage.setItem('rethorical_academic_role', selectedRole);
    } catch (e) {
      console.warn('Session storage note:', e);
    }
    setActiveTab(selectedRole === 'student' ? 'student_submissions' : 'dashboard');
  };

  // Faculty Coordinator Profile (Dr. D S Vinod default)
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Dr. D S Vinod',
    title: 'Professor & Course Coordinator',
    institution: 'JSS Science and Technology University',
    department: 'Department of Information Science & Engineering',
    academicYear: '2026–2027 Academic Session (Sem III)',
    email: 'dsvinod@jssstuniv.in'
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [prefillStudentName, setPrefillStudentName] = useState('');

  // Student Scholar Profile (Pratyush Raj default)
  const [studentProfile, setStudentProfile] = useState({
    id: 'stu-33',
    name: 'Pratyush Raj',
    rollNo: '33',
    usn: '01JST25UCBO65',
    email: '01jst25ucbo65@jssstuniv.in',
    grade: "III Sem CSBS 'A'",
    department: 'Department of Information Science & Engineering',
    institution: 'JSS Science and Technology University'
  });
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [receiptModalSub, setReceiptModalSub] = useState(null);

  // Dynamic assignments & submissions
  const [assignments, setAssignments] = useState(DEFAULT_CSBS_PENDING_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState([]);
  const [batchQueue, setBatchQueue] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  // Modal states
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);

  // Apply theme attribute to <html>
  useEffect(() => {
    if (theme === 'night') {
      document.documentElement.setAttribute('data-theme', 'night');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => setTheme((t) => (t === 'day' ? 'night' : 'day'));

  const handleCreateAssignment = (newAsg) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleAssignmentSubmitted = (subData) => {
    fireCelebrationConfetti();
    const newSub = {
      id: `sub-${Date.now()}`,
      assignmentId: subData.assignmentId || null,
      submissionMode: subData.submissionMode || 'coursework',
      studentId: subData.studentId || (role === 'student' ? studentProfile.id : 'stu-33'),
      studentName: (subData.studentName || '').trim() || (role === 'student' ? studentProfile.name : 'Pratyush Raj'),
      rollNo: subData.rollNo || (role === 'student' ? studentProfile.rollNo : '33'),
      usn: subData.usn || (role === 'student' ? studentProfile.usn : '01JST25UCBO65'),
      classId: subData.classId || selectedClassId,
      className: subData.className || currentClass.name,
      subject: subData.subject || currentClass.subject,
      teacherName: subData.teacherName || teacherProfile.name,
      institution: subData.institution || teacherProfile.institution,
      receiptCode: subData.receiptCode || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      isLocked: true,
      submittedAt: subData.submittedAt || (new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })),
      title: (subData.title || '').trim() || `${subData.rubric || 'Assignment'} Draft`,
      text: subData.text || '',
      referenceText: subData.referenceText || '',
      rubric: subData.rubric || 'STEM & Scientific Lab Report Standard',
      wordCount: subData.wordCount || 0,
      latePolicyStatus: subData.latePolicyStatus || 'on_time',
      lateStatusText: subData.lateStatusText || 'Submitted On-Time',
      lateDeduction: subData.lateDeduction || 0,
      rawScore: subData.rawScore || 91,
      overallScore: subData.overallScore || 91,
      status: 'Needs Review',
      approved: false,
      timestamp: 'Just now',
      flag: (subData.wordCount || 0) > 300 ? 'Original Work' : 'Initial Draft'
    };
    setSubmissions((prev) => [newSub, ...prev]);
    setBatchQueue((prev) => [newSub, ...prev]);
    setCurrentSubmission(newSub);
    setPrefillStudentName('');
    setReceiptModalSub(newSub);
    if (role === 'student') {
      setActiveTab('student_submissions');
    } else {
      setActiveTab('report');
    }
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const pendingCount = batchQueue.filter((q) => !q.approved).length;
  const currentStudentSubsCount = submissions.filter(s => 
    s.studentId === studentProfile.id || 
    (s.studentName && s.studentName.toLowerCase().trim() === studentProfile.name.toLowerCase().trim())
  ).length;

  const renderScreen = () => {
    // Role-based protection: Students should never see teacher dashboard or teacher-only analytics/sync
    if (role === 'student' && (activeTab === 'dashboard' || activeTab === 'analytics' || activeTab === 'lms')) {
      return (
        <StudentSubmissionsScreen
          submissions={submissions}
          assignments={assignments}
          studentProfile={studentProfile}
          onNavigateToReport={(studentSub) => {
            if (studentSub) setCurrentSubmission(studentSub);
            setActiveTab('report');
          }}
          onNavigateToSubmit={(asg) => {
            if (asg) {
              setSelectedTargetAssignment(asg);
              const matchedClass = classes.find(c => c.courseCode === asg.courseCode || c.id === asg.classId);
              if (matchedClass) setSelectedClassId(matchedClass.id);
            } else {
              setSelectedTargetAssignment(null);
            }
            setActiveTab('submit');
          }}
          onOpenReceiptModal={(sub) => setReceiptModalSub(sub)}
          onOpenQuiz={(sub) => {
            if (sub) setCurrentSubmission(sub);
            setShowQuizModal(true);
          }}
          onOpenProfileModal={() => setShowStudentProfileModal(true)}
        />
      );
    }

    // Role-based protection: Teachers should not submit assignments; route to dashboard
    if (role === 'teacher' && (activeTab === 'submit' || activeTab === 'student_submissions')) {
      return (
        <TeacherDashboardScreen
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          assignments={assignments}
          submissions={submissions}
          queue={batchQueue}
          setQueue={setBatchQueue}
          teacherProfile={teacherProfile}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenNewAssignment={() => setShowNewAssignment(true)}
          onNavigateToReport={(studentSub) => {
            if (studentSub) setCurrentSubmission(studentSub);
            setActiveTab('report');
          }}
          onNavigateToLms={() => setActiveTab('lms')}
          onNavigateToSubmit={() => setActiveTab('dashboard')}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <TeacherDashboardScreen
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            assignments={assignments}
            submissions={submissions}
            queue={batchQueue}
            setQueue={setBatchQueue}
            teacherProfile={teacherProfile}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onOpenNewAssignment={() => setShowNewAssignment(true)}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToLms={() => setActiveTab('lms')}
            onNavigateToSubmit={(studentName) => {
              if (typeof studentName === 'string') {
                setPrefillStudentName(studentName);
              }
              setActiveTab('submit');
            }}
          />
        );
      case 'student_submissions':
        return (
          <StudentSubmissionsScreen
            submissions={submissions}
            assignments={assignments}
            studentProfile={studentProfile}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToSubmit={(asg) => {
              if (asg) {
                setSelectedTargetAssignment(asg);
                const matchedClass = classes.find(c => c.courseCode === asg.courseCode || c.id === asg.classId);
                if (matchedClass) setSelectedClassId(matchedClass.id);
              } else {
                setSelectedTargetAssignment(null);
              }
              setActiveTab('submit');
            }}
            onOpenReceiptModal={(sub) => setReceiptModalSub(sub)}
            onOpenQuiz={(sub) => {
              if (sub) setCurrentSubmission(sub);
              setShowQuizModal(true);
            }}
            onOpenProfileModal={() => setShowStudentProfileModal(true)}
          />
        );
      case 'rubric':
        return <RubricBuilderScreen />;
      case 'submit':
        return (
          <EssaySubmissionScreen
            initialStudentName={prefillStudentName}
            targetAssignment={selectedTargetAssignment}
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            teacherProfile={teacherProfile}
            studentProfile={studentProfile}
            role={role}
            submissions={submissions}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToHistory={() => setActiveTab('student_submissions')}
            onOpenReceiptModal={(sub) => setReceiptModalSub(sub)}
            onSubmitted={handleAssignmentSubmitted}
          />
        );
      case 'report':
        return (
          <FeedbackReportScreen
            submission={currentSubmission}
            submissions={submissions}
            onSelectSubmission={(sub) => setCurrentSubmission(sub)}
            onNavigateToSubmit={() => setActiveTab('submit')}
            onOpenQuiz={() => setShowQuizModal(true)}
            onNavigateToDashboard={() => setActiveTab(role === 'student' ? 'student_submissions' : 'dashboard')}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboardScreen
            submissions={submissions}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToSubmit={() => setActiveTab('submit')}
          />
        );
      case 'lms':
        return <LmsSyncScreen submissions={submissions} />;
      default:
        return null;
    }
  };

  // One-time Initial Gateway: User must choose between Teacher and Student
  if (!role) {
    return (
      <RoleSelectionGateway
        onSelectRole={handleSelectRole}
        teacherProfile={teacherProfile}
        institutionName={teacherProfile?.institution}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Stitch Fixed Navigation Sidebar (225px) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
        syncStatus="Synced"
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentClassName={currentClass.name}
        currentSubject={currentClass.subject}
        teacherProfile={teacherProfile}
        studentProfile={studentProfile}
        role={role}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenStudentProfileModal={() => setShowStudentProfileModal(true)}
        studentSubmissionsCount={currentStudentSubsCount}
      />

      {/* Main Container offset by Sidebar width (225px) */}
      <div className="pl-[225px]">
        {/* Stitch Fixed Top Header */}
        <Header
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          role={role}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenNewAssignment={() => setShowNewAssignment(true)}
          teacherProfile={teacherProfile}
          studentProfile={studentProfile}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenStudentProfileModal={() => setShowStudentProfileModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Viewport Area */}
        <main className="relative pt-16 w-full min-h-screen bg-surface">
          {renderScreen()}
        </main>
      </div>

      {/* ──── INTERACTIVE MODALS ──── */}
      {showProfileModal && (
        <TeacherProfileModal
          teacherProfile={teacherProfile}
          onSave={setTeacherProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showStudentProfileModal && (
        <StudentProfileModal
          studentProfile={studentProfile}
          onSave={setStudentProfile}
          onClose={() => setShowStudentProfileModal(false)}
        />
      )}

      {receiptModalSub && (
        <SubmissionReceiptModal
          submission={receiptModalSub}
          onClose={() => setReceiptModalSub(null)}
          onNavigateToReport={(sub) => {
            setCurrentSubmission(sub);
            setActiveTab('report');
          }}
          onNavigateToHistory={() => setActiveTab('student_submissions')}
        />
      )}

      {showQuizModal && (
        <GrammarQuizModal
          submission={currentSubmission}
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {showNewAssignment && (
        <NewAssignmentModal
          classes={classes}
          selectedClassId={selectedClassId}
          onCreateAssignment={handleCreateAssignment}
          onClose={() => setShowNewAssignment(false)}
        />
      )}
    </div>
  );
}
