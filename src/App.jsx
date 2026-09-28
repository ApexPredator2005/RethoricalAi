import React, { useState, useEffect } from 'react';
import './index.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GrammarQuizModal from './components/GrammarQuizModal';
import NewAssignmentModal from './components/NewAssignmentModal';
import DesignSpecsModal from './components/DesignSpecsModal';

import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import RubricBuilderScreen from './screens/RubricBuilderScreen';
import EssaySubmissionScreen from './screens/EssaySubmissionScreen';
import FeedbackReportScreen from './screens/FeedbackReportScreen';
import AnalyticsDashboardScreen from './screens/AnalyticsDashboardScreen';
import LmsSyncScreen from './screens/LmsSyncScreen';

const DEFAULT_CLASSES = [
  { id: 'c1', name: 'Primary Classroom', studentCount: 0, pending: 0, avgScore: 0 }
];

export default function App() {
  const [theme, setTheme] = useState('day'); // 'day' | 'night'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState(DEFAULT_CLASSES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

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
      studentName: (subData.studentName || '').trim() || 'Student Submission',
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
    setActiveTab('report');
  };

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const pendingCount = batchQueue.filter((q) => !q.approved).length;

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <TeacherDashboardScreen
            classes={classes}
            assignments={assignments}
            submissions={submissions}
            queue={batchQueue}
            setQueue={setBatchQueue}
            selectedClassId={selectedClassId}
            onOpenNewAssignment={() => setShowNewAssignment(true)}
            onNavigateToReport={(studentSub) => {
              if (studentSub) setCurrentSubmission(studentSub);
              setActiveTab('report');
            }}
            onNavigateToLms={() => setActiveTab('lms')}
            onNavigateToSubmit={() => setActiveTab('submit')}
          />
        );
      case 'rubric':
        return <RubricBuilderScreen />;
      case 'submit':
        return (
          <EssaySubmissionScreen
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Viewport Area */}
        <main className="relative pt-16 w-full min-h-screen bg-surface">
          {renderScreen()}
        </main>
      </div>

      {/* ──── INTERACTIVE MODALS ──── */}
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
