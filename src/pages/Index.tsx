import { Button } from "@/components/ui/button";
import { Sparkles, Briefcase, BookOpen, TrendingUp, Target, ArrowRight, Star, Zap, CheckCircle2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [learnOpen, setLearnOpen] = useState(false);
  const [startedOpen, setStartedOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", skills: "" });
  const [chatMessages, setChatMessages] = useState<any>([{ type: "bot", text: "Hello! How can I help you today?" }]);
  const [currentMenu, setCurrentMenu] = useState("main");
  const [userInput, setUserInput] = useState("");

  const knowledgeBase = {
    main: {
      text: "What would you like to know?",
      options: [
        { text: "General Information", id: "general" },
        { text: "Registration & Profile Issues", id: "registration" },
        { text: "Career Tips", id: "career" },
        { text: "Contact Support", id: "contact" }
      ]
    },
    general: {
      text: "General Information",
      options: [
        { text: "What is an internship?", answer: "An internship is a short-term work experience that helps you gain practical skills, industry knowledge, and build professional networks. It's a great way to explore career paths!" },
        { text: "What kind of internships are available?", answer: "We offer internships in technology, marketing, data science, HR, finance, content creation, and more. You can filter by your skills and interests!" },
        { text: "Will I get paid?", answer: "Some internships include stipends. CareerAI shows both paid and unpaid opportunities so you can choose what works best for you." },
        { text: "How long is an internship?", answer: "Typical internships last 1-6 months. The duration varies by company and role. You can see the exact timeline for each listing." },
        { text: "Back", id: "main" }
      ]
    },
    registration: {
      text: "Registration & Profile Issues",
      options: [
        { text: "I can't log in to my account", answer: "Please check your email and password. If you forgot your password, use the 'Forgot Password' option to reset it. If issues persist, contact our support team." },
        { text: "My registration is pending", answer: "Verification typically takes 24-48 hours. We'll send you an email once your profile is verified. You can log in during this time." },
        { text: "How do I update my profile?", answer: "Go to 'My Profile' after logging in. You can edit your skills, interests, resume, and other details anytime." },
        { text: "I can't upload my resume", answer: "Make sure your file is in PDF or JPEG format and under 5MB. Try refreshing the page and uploading again." },
        { text: "Back", id: "main" }
      ]
    },
    career: {
      text: "Career Tips",
      options: [
        { text: "How do I improve my profile?", answer: "Add relevant skills, write a compelling bio, upload a professional photo, and keep your resume updated. Take our free courses to boost your qualifications!" },
        { text: "How are internships matched to me?", answer: "Our AI analyzes your skills, interests, and career goals to recommend the best opportunities. The more complete your profile, the better the matches!" },
        { text: "What should I do to prepare?", answer: "Review the job description, practice common interview questions, prepare questions for the company, and ensure your resume is up to date." },
        { text: "Can I apply to multiple internships?", answer: "Absolutely! We encourage you to apply to multiple opportunities that match your interests. This increases your chances of getting selected." },
        { text: "Back", id: "main" }
      ]
    },
    contact: {
      text: "Contact Support",
      options: [
        { text: "Email: support@careerai.com", answer: "You can reach our support team at support@careerai.com. We typically respond within 24 hours." },
        { text: "Live Chat Hours: 10 AM - 6 PM IST", answer: "Our support team is available for live chat during business hours. We'll be happy to help!" },
        { text: "Back", id: "main" }
      ]
    }
  };

  const handleChatOption = (option) => {
    if (option.id) {
      setCurrentMenu(option.id);
      setChatMessages(prev => [...prev, { type: "user", text: option.text }, { type: "bot", text: knowledgeBase[option.id].text, options: knowledgeBase[option.id].options }]);
    } else if (option.answer) {
      setChatMessages(prev => [...prev, { type: "user", text: option.text }, { type: "bot", text: option.answer, options: knowledgeBase[currentMenu].options }]);
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatMessages(prev => [...prev, { type: "user", text: userInput }]);
      setUserInput("");
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: "bot", text: "Thanks for your message! Please choose an option above or contact our support team for more help.", options: knowledgeBase.main.options }]);
        setCurrentMenu("main");
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Gradient - Applied to entire page */}
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
      </div>
       <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 left-1/2 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
    </div>
      {/* Navigation Bar */}
      <nav className="relative z-50 bg-gradient-to-r from-black via-slate-900 to-blue-900 shadow-lg">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            {/* Left: CareerAI brand */}
            <div className="flex items-center">
              <span className="text-white text-2xl font-bold tracking-wide">CareerAI</span>
            </div>

            {/* Center: nav links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-12">
              <a href="#" className="text-white/80 hover:text-white transition text-lg font-semibold">Home</a>
              <a href="#about" className="text-white/80 hover:text-white transition text-lg font-semibold">About</a>
              <a href="#faq" className="text-white/80 hover:text-white transition text-lg font-semibold">FAQ</a>
              <a href="#footer-contact" className="text-white/80 hover:text-white transition text-lg font-semibold" onClick={e => {e.preventDefault(); document.getElementById('footer-contact')?.scrollIntoView({behavior:'smooth'});}}>Contact</a>
              <button onClick={() => setLearnOpen(v => !v)} className="text-white/80 hover:text-white transition text-lg font-semibold">Learning</button>
              {learnOpen && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-64 bg-black/80 border border-white/5 rounded-lg p-4 text-left z-50">
                  <div className="text-sm font-semibold text-white mb-2">Recommended</div>
                  <ul className="text-sm text-white space-y-2">
                    <li>
    <a
      href="https://course.fast.ai/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 hover:bg-white/5 p-2 rounded-lg transition"
    >
      <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white">F</div>
      <div>
        <div className="font-medium">Foundations of Machine Learning</div>
        <div className="text-xs text-white/80">Free · 6 weeks</div>
      </div>
    </a>
  </li>
                    <li>
    <a
      href="https://www.coursera.org/specializations/deep-learning"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 hover:bg-white/5 p-2 rounded-lg transition"
    >
      <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white">P</div>
      <div>
        <div className="font-medium">Practical Deep Learning</div>
        <div className="text-xs text-white/80">Paid · self-paced</div>
      </div>
    </a>
  </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Right: CTA */}
            <div className="hidden md:flex items-center justify-end" style={{ minWidth: '180px' }}>
              <Button 
              onClick={() => navigate('/search')}
              className="bg-white text-black px-8 py-3 rounded-lg text-lg font-semibold border border-gray-300 shadow-md hover:scale-105 hover:shadow-xl hover:border-black focus:ring-2 focus:ring-black">Get Started</Button>
            </div>
          </div>
        </div>
        {/* Whitish faded line under navbar */}
        <div className="w-full h-1 bg-gradient-to-r from-white/40 via-white/10 to-white/40 blur-sm"></div>
      </nav>
      
      <section id="about" className="relative py-20 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-50 pb-20">
        {/* Animated background blobs for Hero */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/4 left-1/2 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
        </div>

        

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          {/* Badge */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm"
          >
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">NEW</span>
            <span className="text-white/80 text-sm">No.1 Career Platform of 2025 - CareerAI</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight space-y-2">
              <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">Internships , Skills &</div>
              <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">Career Growth !</div>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            From discovery to execution—we guide, match, and empower your journey with AI-powered career insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold text-base transition-all shadow-lg border border-gray-300 hover:scale-105 hover:shadow-xl hover:border-black focus:ring-2 focus:ring-black"
            >
              Connect With Us
            </Button>
            <Button 
              onClick={() => navigate('/search')}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold text-base transition-all shadow-lg border border-gray-300 hover:scale-105 hover:shadow-xl hover:border-black focus:ring-2 focus:ring-black"
            >
              Get Started
            </Button>
          </motion.div>
         
          {/* Guidance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="!mt-24 max-w-3xl mx-auto bg-gradient-to-br from-indigo-900/30 to-blue-900/20 border border-indigo-500/30 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Target className="w-6 h-6 text-indigo-400" />
                How to Get Started
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">1</div>
                  <h4 className="font-semibold text-white">Create Account</h4>
                  <p className="text-sm text-slate-300">Click "Connect With Us" to sign up with your email and create your profile</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">2</div>
                  <h4 className="font-semibold text-white">Complete Profile</h4>
                  <p className="text-sm text-slate-300">Add your skills, qualifications, and preferences to improve matching</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg">3</div>
                  <h4 className="font-semibold text-white">Start Searching</h4>
                  <p className="text-sm text-slate-300">Click "Get Started" to search for internships matched to you</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clients section removed per request - kept layout cleaner */}
      </div></section>

      {/* About Section - Full width with gradient background */}
      <section id="about" className="relative py-20 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Visual - Large gradient box with content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center order-2 lg:order-1"
            >
              <div className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl">
                <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                  
                  {/* Content inside the visual */}
                  <div className="z-10 text-center space-y-8 px-8">
                    {/* Stat card 1 */}
                    <div className="space-y-3">
                      <div className="inline-block px-6 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full backdrop-blur-sm">
                        <p className="text-blue-300 text-sm font-semibold">Career Ready</p>
                      </div>
                      <h3 className="text-4xl font-bold text-white">5000+</h3>
                      <p className="text-white/70 text-sm">Active Opportunities</p>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>

                    {/* Stat card 2 */}
                    <div className="space-y-3">
                      <div className="inline-block px-6 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-full backdrop-blur-sm">
                        <p className="text-indigo-300 text-sm font-semibold">Success Rate</p>
                      </div>
                      <h3 className="text-4xl font-bold text-white">98%</h3>
                      <p className="text-white/70 text-sm">Student Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 order-1 lg:order-2"
            >
              {/* About Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/40 border border-slate-600 text-white/80 text-sm">
              
                About Us
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-white leading-tight">
                Smarter Internship Search & Career Growth
              </h2>

              {/* Description */}
              <p className="text-white/70 text-lg leading-relaxed">
                We help students discover the right internships with AI-powered recommendations, tailored learning paths, and curated free & paid courses to boost skills and prepare for real-world careers.
              </p>

              {/* Feature List */}
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-white/80">
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span className="text-lg">AI-powered internship matching</span>
                </li>
                <li className="flex items-center gap-4 text-white/80">
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span className="text-lg">Suggestions based on skills & interests</span>
                </li>
                <li className="flex items-center gap-4 text-white/80">
                  <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                  <span className="text-lg">Free + paid courses to upskill</span>
                </li>
              </ul>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button 
                  onClick={() => navigate('/search')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

  {/* FAQ - two column layout with animations */}
  <section id="faq" className="relative py-20 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
    {/* Animated background blobs */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>

    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-white/80 text-sm mb-6">FAQ</div>
          
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight space-y-2">
            <div>Frequently Asked Questions</div>
          </h2>
          <p className="text-white/80 max-w-lg">Have questions? Our FAQ section covers quick and helpful answers to the most common internship inquiries.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4"
        >
          <details className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/60 transition-all cursor-pointer">
  <summary className="cursor-pointer text-lg font-medium text-white/80 hover:text-white">
    What is an internship? Why should I do one?
  </summary>
  <p className="mt-3 text-white/80">
    An internship is a short-term work experience…
  </p>
</details>

          <details className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/60 transition-all cursor-pointer">
  <summary className="cursor-pointer text-lg font-medium text-white/80 hover:text-white">
   What kind of internships are available through CareerAI?
  </summary>
  <p className="mt-3 text-white/80">
    CareerAI suggests internships in technology, marketing, data science, HR, finance, content, and more depending on your skillset and interests
  </p>
</details>
<details className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/60 transition-all cursor-pointer">
  <summary className="cursor-pointer text-lg font-medium text-white/80 hover:text-white">
   Will I get financial assistance?
  </summary>
  <p className="mt-3 text-white/80">
    Some internships include stipends; CareerAI will surface paid and unpaid opportunities and let you filter accordingly.
  </p>
</details>
<details className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/60 transition-all cursor-pointer">
  <summary className="cursor-pointer text-lg font-medium text-white/80 hover:text-white">
   What is the duration of the internship?
  </summary>
  <p className="mt-3 text-white/80">
   Durations vary — typical internships last 1–6 months. CareerAI shows the duration on each listing.
  </p>
</details>
<details className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:bg-slate-800/60 transition-all cursor-pointer">
  <summary className="cursor-pointer text-lg font-medium text-white/80 hover:text-white">
   Will I get a job after my internship?
  </summary>
  <p className="mt-3 text-white/80">
  Some internships lead to full-time roles. CareerAI highlights opportunities with conversion potential.
  </p>
</details>
        </motion.div>
      </div>
    </div>
  </section>

      {/* Footer - developer credit + bottom bar */}
      <footer id="footer-contact" className="pt-12">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
              <button onClick={() => navigate('/search')} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-white/80 text-sm">Contact</button>
          </div>
          <div className="text-white text-xl font-semibold mb-4">Developed By Khushi Nain ✨</div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <a href="mailto:khushinain78@gmail.com" className="w-12 h-12 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition" aria-label="Email Khushi">
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8.5v7A2.5 2.5 0 005.5 18h13a2.5 2.5 0 002.5-2.5v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5l-9 6-9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/khushi-nain17/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition" aria-label="Khushi's LinkedIn">
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-12h4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="8" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8">
          <div className="container mx-auto px-6 py-6 flex items-center justify-between text-white/80 text-sm">
            <div>© {new Date().getFullYear()} CareerAI. All Rights Reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Terms & Conditions</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Get Started Modal */}
      {startedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Get Started — Quick Profile</h4>
              <button className="text-white/80 hover:text-white" onClick={() => setStartedOpen(false)}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert(`Thanks ${form.name}! We'll analyze your profile and recommend next steps.`); setStartedOpen(false); setForm({name:'', email:'', skills:''}) }} className="space-y-4">
              <div>
                <label className="text-sm text-white/80">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded" />
              </div>
              <div>
                <label className="text-sm text-white/80">Email</label>
                <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required type="email" className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded" />
              </div>
              <div>
                <label className="text-sm text-white/80">Skills / Interests</label>
                <input value={form.skills} onChange={e => setForm(f => ({...f, skills: e.target.value}))} placeholder="e.g. Python, ML, Frontend" className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="px-4 py-2 rounded border border-slate-700 text-white/80" onClick={() => setStartedOpen(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Toggle & Panel */}
      <div className="fixed right-6 bottom-6 z-50">
        <button onClick={() => setChatOpen(v => !v)} className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-2xl flex items-center justify-center hover:scale-110 transition">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
        {chatOpen && (
          <div className="mt-4 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col" style={{ height: '500px' }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-t-xl">
              <div className="font-semibold text-white">CareerAI Support</div>
              <button className="text-white hover:text-gray-200 text-lg font-bold" onClick={() => setChatOpen(false)}>×</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-white/80"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Options */}
              {chatMessages[chatMessages.length - 1]?.options && (
                <div className="space-y-2 mt-4">
                  {chatMessages[chatMessages.length - 1].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChatOption(opt)}
                      className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white/80 hover:text-white rounded text-sm transition"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 p-4 border-t border-slate-700 rounded-b-xl">
              <input 
                placeholder="Type a message..." 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500" 
              />
              <button onClick={handleSendMessage} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;