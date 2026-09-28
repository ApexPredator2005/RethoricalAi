import React, { useState, useEffect } from 'react';
import './index.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GrammarQuizModal from './components/GrammarQuizModal';
import NewAssignmentModal from './components/NewAssignmentModal';
import DesignSpecsModal from './components/DesignSpecsModal';
import TeacherProfileModal from './components/TeacherProfileModal';
import StudentProfileModal from './components/StudentProfileModal';
import SubmissionReceiptModal from './components/SubmissionReceiptModal';

import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import RubricBuilderScreen from './screens/RubricBuilderScreen';
import EssaySubmissionScreen from './screens/EssaySubmissionScreen';
import FeedbackReportScreen from './screens/FeedbackReportScreen';
import AnalyticsDashboardScreen from './screens/AnalyticsDashboardScreen';
import LmsSyncScreen from './screens/LmsSyncScreen';
import StudentSubmissionsScreen from './screens/StudentSubmissionsScreen';

const DEFAULT_CLASSES = [
  {
    id: 'cls-101',
    name: 'Grade 11 - Section A',
    subject: 'AP English Literature & Rhetoric',
    period: 'Period 2 (09:15 - 10:05 AM)',
    room: 'Hall 304',
    studentRoster: [
      { id: 'stu-101', name: 'Aria Montgomery', rollNo: '11A-01', email: 'aria.m@oakridge.edu' },
      { id: 'stu-102', name: 'Liam Gallagher', rollNo: '11A-02', email: 'liam.g@oakridge.edu' },
      { id: 'stu-103', name: 'Sophia Patel', rollNo: '11A-03', email: 'sophia.p@oakridge.edu' },
      { id: 'stu-104', name: 'Ethan Zhang', rollNo: '11A-04', email: 'ethan.z@oakridge.edu' },
      { id: 'stu-105', name: 'Maya Lin', rollNo: '11A-05', email: 'maya.l@oakridge.edu' },
      { id: 'stu-106', name: 'Noah Al-Mansoor', rollNo: '11A-06', email: 'noah.a@oakridge.edu' },
      { id: 'stu-107', name: 'Zoe Deschanel', rollNo: '11A-07', email: 'zoe.d@oakridge.edu' },
      { id: 'stu-108', name: 'Lucas Vance', rollNo: '11A-08', email: 'lucas.v@oakridge.edu' }
    ]
  },
  {
    id: 'cls-102',
    name: 'Grade 12 - Advanced Honours',
    subject: 'Comparative World Literature & Criticism',
    period: 'Period 4 (11:20 - 12:10 PM)',
    room: 'Seminar Room B',
    studentRoster: [
      { id: 'stu-201', name: 'Hannah Abbott', rollNo: '12H-01', email: 'hannah.a@oakridge.edu' },
      { id: 'stu-202', name: 'Cedric Diggory', rollNo: '12H-02', email: 'cedric.d@oakridge.edu' },
      { id: 'stu-203', name: 'Cho Chang', rollNo: '12H-03', email: 'cho.c@oakridge.edu' },
      { id: 'stu-204', name: 'Dean Thomas', rollNo: '12H-04', email: 'dean.t@oakridge.edu' },
      { id: 'stu-205', name: 'Padma Patil', rollNo: '12H-05', email: 'padma.p@oakridge.edu' },
      { id: 'stu-206', name: 'Seamus Finnigan', rollNo: '12H-06', email: 'seamus.f@oakridge.edu' }
    ]
  },
  {
    id: 'cls-103',
    name: 'Grade 10 - Section C',
    subject: 'Academic Writing & Critical Reasoning',
    period: 'Period 6 (02:00 - 02:50 PM)',
    room: 'Hall 208',
    studentRoster: [
      { id: 'stu-301', name: 'Benjamin Sisko', rollNo: '10C-01', email: 'ben.s@oakridge.edu' },
      { id: 'stu-302', name: 'Kira Nerys', rollNo: '10C-02', email: 'kira.n@oakridge.edu' },
      { id: 'stu-303', name: 'Julian Bashir', rollNo: '10C-03', email: 'julian.b@oakridge.edu' },
      { id: 'stu-304', name: 'Jadzia Dax', rollNo: '10C-04', email: 'jadzia.d@oakridge.edu' },
      { id: 'stu-305', name: 'Miles O\'Brien', rollNo: '10C-05', email: 'miles.o@oakridge.edu' }
    ]
  }
];

export default function App() {
  const [theme, setTheme] = useState('day'); // 'day' | 'night'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState(DEFAULT_CLASSES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Teacher & Institution Profile
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Dr. Eleanor Vance',
    title: 'Senior Faculty & Rhetoric Chair',
    institution: 'Oakridge International Collegiate Academy',
    department: 'Department of Humanities & Rhetoric',
    academicYear: '2026–2027 Academic Session',
    email: 'e.vance@oakridge.edu'
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [prefillStudentName, setPrefillStudentName] = useState('');

  // Student Scholar Profile (Aria Montgomery default)
  const [studentProfile, setStudentProfile] = useState({
    id: 'stu-101',
    name: 'Aria Montgomery',
    rollNo: '11A-01',
    email: 'aria.m@oakridge.edu',
    grade: 'Grade 11 - Section A',
    institution: 'Oakridge International Collegiate Academy'
  });
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [receiptModalSub, setReceiptModalSub] = useState(null);

  // Live dynamic data state (starts completely clean — no synthetic mock submissions)
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [batchQueue, setBatchQueue] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  // Modal states
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

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
  const handleToggleRole = () => {
    setRole((r) => {
      const nextRole = r === 'teacher' ? 'student' : 'teacher';
      setActiveTab(nextRole === 'student' ? 'submit' : 'dashboard');
      return nextRole;
    });
  };

  const handleCreateAssignment = (newAsg) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleAssignmentSubmitted = (subData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      studentId: subData.studentId || (role === 'student' ? studentProfile.id : 'sub-usr'),
      studentName: (subData.studentName || '').trim() || (role === 'student' ? studentProfile.name : 'Student Submission'),
      rollNo: subData.rollNo || (role === 'student' ? studentProfile.rollNo : '11A-01'),
      classId: subData.classId || selectedClassId,
      className: subData.className || currentClass.name,
      subject: subData.subject || currentClass.subject,
      teacherName: subData.teacherName || teacherProfile.name,
      institution: subData.institution || teacherProfile.institution,
      receiptCode: subData.receiptCode || `OAK-${Math.floor(100000 + Math.random() * 900000)}`,
      isLocked: true,
      submittedAt: subData.submittedAt || (new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })),
      title: (subData.title || '').trim() || `${subData.rubric || 'Assignment'} Draft`,
      text: subData.text || '',
      referenceText: subData.referenceText || '',
      rubric: subData.rubric || 'Standard Criteria',
      wordCount: subData.wordCount || 0,
      overallScore: subData.overallScore || 89,
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
            studentProfile={studentProfile}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToSubmit={() => setActiveTab('submit')}
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
            onNavigateToSubmit={() => setActiveTab('submit')}
            onOpenQuiz={() => setShowQuizModal(true)}
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

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Stitch Fixed Navigation Sidebar (260px) */}
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

      {/* Main Container offset by Sidebar width */}
      <div className="pl-[260px]">
        {/* Stitch Fixed Top Header */}
        <Header
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          role={role}
          onToggleRole={handleToggleRole}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenSpecsModal={() => setShowSpecsModal(true)}
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
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectStudent={(scholar) => setStudentProfile(scholar)}
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

      {showSpecsModal && (
        <DesignSpecsModal onClose={() => setShowSpecsModal(false)} />
      )}
    </div>
  );
}
