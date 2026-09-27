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

import { INITIAL_CLASSES, INITIAL_ASSIGNMENTS } from './data/mockData';

export default function App() {
  const [theme, setTheme] = useState('day'); // 'day' | 'night'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  const [selectedClassId, setSelectedClassId] = useState(INITIAL_CLASSES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

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

  const currentClass = INITIAL_CLASSES.find((c) => c.id === selectedClassId) || INITIAL_CLASSES[0];

  const pendingCount = INITIAL_ASSIGNMENTS.reduce((sum, a) => {
    if (a.classId === selectedClassId) {
      return sum + (a.submittedCount - a.gradedCount);
    }
    return sum;
  }, 0);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <TeacherDashboardScreen
            classes={INITIAL_CLASSES}
            assignments={INITIAL_ASSIGNMENTS}
            selectedClassId={selectedClassId}
            onOpenNewAssignment={() => setShowNewAssignment(true)}
            onNavigateToReport={() => setActiveTab('report')}
            onNavigateToLms={() => setActiveTab('lms')}
          />
        );
      case 'rubric':
        return <RubricBuilderScreen />;
      case 'submit':
        return (
          <EssaySubmissionScreen
            onSubmitted={() => setActiveTab('report')}
          />
        );
      case 'report':
        return (
          <FeedbackReportScreen
            onOpenQuiz={() => setShowQuizModal(true)}
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboardScreen
            onNavigateToReport={() => setActiveTab('report')}
          />
        );
      case 'lms':
        return <LmsSyncScreen />;
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
          classes={INITIAL_CLASSES}
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
        <GrammarQuizModal onClose={() => setShowQuizModal(false)} />
      )}

      {showNewAssignment && (
        <NewAssignmentModal
          classes={INITIAL_CLASSES}
          selectedClassId={selectedClassId}
          onClose={() => setShowNewAssignment(false)}
        />
      )}

      {showSpecsModal && (
        <DesignSpecsModal onClose={() => setShowSpecsModal(false)} />
      )}
    </div>
  );
}
