import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, GraduationCap, Code2, Search, BriefcaseIcon, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const InternshipSearch = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        // User not logged in, show alert and redirect to auth
        alert('Please login first to search for internships');
        navigate('/auth');
      } else {
        setUser(authUser);
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const [formData, setFormData] = useState({
    city: '',
    qualification: '',
    skills: '',
    query: '',
    rural: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.city || !formData.qualification || !formData.skills || !formData.query || !formData.rural || !formData.category) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const payload = {
        city: formData.city,
        query: formData.query,
        user: {
          qualification: formData.qualification,
          skills: formData.skills,
          rural: formData.rural === 'true',
          category: formData.category,
        },
      };

      // Update this URL with your actual backend API endpoint
      const API_URL = "https://d59362c7eb0d.ngrok-free.app/find-internships";
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 200) {
        setResults(data);
      } else {
        setError(data.detail || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please check the backend URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-700 border-b-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section id="about" className="relative   bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors"
          >
            CareerAI
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all duration-300 border border-white hover:border-black hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-indigo-900/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Search
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">Perfect</span> Internship
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Our AI engine analyzes thousands of opportunities to find roles perfectly matched to your unique skills and career goals.
          </p>
        </header>

        {/* Search Form */}
        <main>
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300">
            {/* Location & Qualification Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="city"
                  placeholder="City (e.g., Mumbai)"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="qualification"
                  placeholder="Qualification (e.g., B.Tech)"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Code2 className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                name="skills"
                placeholder="Skills (e.g., Python, React, Marketing)"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Desired Role */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                name="query"
                placeholder="Desired Role (e.g., Software Engineer Intern)"
                value={formData.query}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-6">
              <select
                name="rural"
                value={formData.rural}
                onChange={handleInputChange}
                className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all cursor-pointer hover:bg-indigo-900/30"
                required
              >
                <option value="">Rural District?</option>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all cursor-pointer hover:bg-indigo-900/30"
                required
              >
                <option value="">Category</option>
                <option value="GEN">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Find My Internship'}
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-16 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-700 border-b-indigo-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="mt-5 text-slate-300 font-medium text-lg tracking-wide">AI is analyzing opportunities...</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="mt-20 space-y-12">
              {/* Message */}
              {results.message && (
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl shadow-lg">
                  <h2 className="font-bold text-indigo-300 text-xl flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6" /> Message from CareerAI
                  </h2>
                  <p className="leading-relaxed text-indigo-100/90 text-lg">{results.message}</p>
                </div>
              )}

              {/* Main Internships */}
              {results.main_internships && results.main_internships.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 flex items-center justify-center gap-3 mb-10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    Top Matches For You
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.main_internships.map((internship: any, idx: number) => (
                      <div key={idx} className="bg-slate-800/40 rounded-2xl p-7 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-lg shadow-md flex flex-col justify-between h-full">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-bold text-xl text-white leading-tight">{internship.role}</h3>
                            <div className="p-2 bg-slate-700/50 rounded-lg text-emerald-400">
                              <BriefcaseIcon className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 text-slate-400 text-sm font-medium pb-4 border-b border-slate-700/50">
                            <div className="flex items-center gap-2">
                              <BriefcaseIcon className="w-4 h-4" /> {internship.company_name}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> {internship.location}
                            </div>
                          </div>

                          <ul className="space-y-3 text-slate-300 text-sm mt-4">
                            <li className="flex items-start gap-3">
                              <GraduationCap className="text-slate-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div><span className="font-semibold text-slate-200">Qualification:</span> {internship.qualification || 'N/A'}</div>
                            </li>
                            <li className="flex items-start gap-3">
                              <Code2 className="text-slate-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div><span className="font-semibold text-slate-200">Skills:</span> {internship.skills_required || 'N/A'}</div>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-400">Score: <span className="text-white font-bold">{internship.eligibility_score ?? 'N/A'}</span></span>
                          {internship.is_eligible ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✅ Eligible</span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">❌ Not Eligible</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {results.advice && (
                <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700 shadow-xl">
                  <h2 className="font-bold text-slate-100 text-xl flex items-center gap-3 mb-4">
                    💡 Career Advice
                  </h2>
                  <p className="leading-relaxed text-slate-300">{results.advice}</p>
                </div>
              )}

              {/* No Results */}
              {(!results.main_internships || results.main_internships.length === 0) && !results.message && !results.advice && (
                <div className="text-center bg-slate-800/50 p-10 rounded-2xl border border-slate-700">
                  <BriefcaseIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-200">No internships found</h3>
                  <p className="mt-2 text-slate-400">Try broadening your search or adjusting your criteria.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-800 bg-slate-900/50 mt-20">
        <p className="text-slate-500 text-sm">Powered by <span className="text-slate-300 font-medium">CareerAI</span></p>
      </footer>
    
    </section>
  );
};

export default InternshipSearch;
