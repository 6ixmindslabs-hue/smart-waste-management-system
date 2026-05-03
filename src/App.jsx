import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900 dark:selection:text-indigo-300 transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-950/30 -z-20"></div>

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -z-10 translate-x-[-50%] translate-y-[-50%]"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10 translate-x-[50%] translate-y-[-50%]"></div>

      <Dashboard />
    </div>
  );
}

export default App;
