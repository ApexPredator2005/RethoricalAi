import React, { useState } from 'react';

export default function AuthScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('teacher'); // 'teacher' | 'student'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Simulated JWT Token Generator
  const generateJWT = (userPayload) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      ...userPayload,
      iss: 'marginalia-auth-service',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days expiration
    }));
    const signature = btoa('marginalia_secret_key_2026_signature');
    return `${header}.${payload}.${signature}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError('Please fill in both email address and password.');
      return;
    }

    if (authMode === 'register' && !fullName) {
      setAuthError('Please enter your full name to register.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const userProfile = {
        id: selectedRole === 'teacher' ? 'tch-101' : 'std-202',
        name: fullName || (selectedRole === 'teacher' ? 'Ms. Claire Holloway' : 'Maya Lin'),
        email: email,
        role: selectedRole,
        institution: institution || (selectedRole === 'teacher' ? 'Westlake High School' : 'Prep Academy'),
        avatarInitials: (fullName || (selectedRole === 'teacher' ? 'Claire Holloway' : 'Maya Lin'))
          .split(' ')
          .map(n => n[0])
          .join('')
      };

      const token = generateJWT(userProfile);

      // Store in localStorage & document.cookie for persistent Auth
      try {
        localStorage.setItem('marginalia_jwt_token', token);
        localStorage.setItem('marginalia_user', JSON.stringify(userProfile));
        document.cookie = `marginalia_jwt=${token}; path=/; max-age=604800; SameSite=Lax`;
      } catch (err) {
        console.error('Storage error:', err);
      }

      onLogin(userProfile, token);
    }, 1000);
  };

  const handleQuickDemoLogin = (roleType) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userProfile = roleType === 'teacher' ? {
        id: 'tch-101',
        name: 'Ms. Claire Holloway',
        email: 'holloway.c@westlake.edu',
        role: 'teacher',
        institution: 'Westlake High School',
        avatarInitials: 'CH'
      } : {
        id: 'std-202',
        name: 'Maya Lin',
        email: 'maya.lin@student.prep.edu',
        role: 'student',
        institution: 'Prep Academy Senior High',
        avatarInitials: 'ML'
      };

      const token = generateJWT(userProfile);
      localStorage.setItem('marginalia_jwt_token', token);
      localStorage.setItem('marginalia_user', JSON.stringify(userProfile));
      document.cookie = `marginalia_jwt=${token}; path=/; max-age=604800; SameSite=Lax`;

      onLogin(userProfile, token);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Ink Graphics */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container overflow-hidden z-10 animate-fade-in">
        
        {/* Top Editorial Banner */}
        <div className="bg-surface-container-low p-space-lg border-b border-surface-container text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">ink_pen</span>
            <span className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Marginalia</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto">
            Rubric-Anchored Essay Evaluation &amp; Cohort Intelligence Platform
          </p>
        </div>

        {/* Role Selector Segmented Cards */}
        <div className="p-space-lg space-y-space-md">
          <div className="space-y-1">
            <label className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider block">
              1. Select Workspace Role
            </label>
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`p-space-sm rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  selectedRole === 'teacher'
                    ? 'border-primary bg-primary-container/20 text-on-surface shadow-sm font-semibold'
                    : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${selectedRole === 'teacher' ? 'text-primary' : ''}`}>
                  school
                </span>
                <span className="font-label-md text-label-md">Educator / Teacher</span>
                <span className="font-annotation-note text-[10px] text-on-surface-variant">Classroom grading &amp; rubrics</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`p-space-sm rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  selectedRole === 'student'
                    ? 'border-secondary bg-secondary-container/20 text-on-surface shadow-sm font-semibold'
                    : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${selectedRole === 'student' ? 'text-secondary' : ''}`}>
                  edit_note
                </span>
                <span className="font-label-md text-label-md">Scholar / Student</span>
                <span className="font-annotation-note text-[10px] text-on-surface-variant">Submit drafts &amp; review feedback</span>
              </button>
            </div>
          </div>

          {/* Quick Demo 1-Click Login Shortcuts */}
          <div className="p-space-sm rounded-xl bg-surface-container-low border border-surface-container space-y-2">
            <div className="flex items-center justify-between font-label-sm text-xs font-bold text-on-surface-variant">
              <span>⚡ Fast Demo Access:</span>
              <span className="text-secondary font-mono text-[11px]">JWT Preset Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('teacher')}
                disabled={isLoading}
                className="py-1.5 px-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-xs hover:bg-primary-container hover:text-on-primary transition-all border border-surface-container font-medium flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">school</span>
                <span>Demo Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                disabled={isLoading}
                className="py-1.5 px-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-xs hover:bg-secondary-container hover:text-on-secondary-container transition-all border border-surface-container font-medium flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">person</span>
                <span>Demo Student</span>
              </button>
            </div>
          </div>

          {/* Auth Tab Switch: Login vs Register */}
          <div className="flex border-b border-surface-container font-label-md text-label-md font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                authMode === 'login'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`flex-1 py-2 text-center transition-colors border-b-2 ${
                authMode === 'register'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Register New Profile
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="p-space-sm rounded-lg bg-error/10 text-error border border-error/20 font-label-sm text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{authError}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleFormSubmit} className="space-y-space-md">
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="font-label-sm text-xs font-semibold text-on-surface-variant block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'teacher' ? 'e.g. Ms. Claire Holloway' : 'e.g. Maya Lin'}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-sm text-xs font-semibold text-on-surface-variant block">Institution / School Name</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Westlake High School"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-label-sm text-xs font-semibold text-on-surface-variant block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'teacher' ? 'teacher@school.edu' : 'student@prep.edu'}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-xs font-semibold text-on-surface-variant block">Password</label>
                {authMode === 'login' && (
                  <button type="button" onClick={() => alert('Password reset link sent to your email.')} className="font-label-sm text-xs text-primary hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-surface-container-low border border-surface-container font-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Remember Session (Cookie / JWT)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-label-lg font-semibold shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Verifying Credentials &amp; Signing JWT...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {authMode === 'login' ? 'login' : 'how_to_reg'}
                  </span>
                  <span>
                    {authMode === 'login' 
                      ? `Sign In as ${selectedRole === 'teacher' ? 'Educator' : 'Scholar'}`
                      : 'Create Account & Issue JWT Token'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social SSO Button */}
          <div className="pt-2 border-t border-surface-container space-y-2 text-center">
            <span className="font-annotation-note text-[11px] text-on-surface-variant uppercase tracking-wider block">
              Or Authenticate via Educational Directory
            </span>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="w-full py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md font-medium border border-surface-container flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">cloud_sync</span>
              <span>Sign in with Google Classroom / OAuth2</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="bg-surface-container-low px-space-lg py-2.5 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-annotation-note text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
            256-bit JWT Encrypted
          </span>
          <span>FERPA &amp; GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}
