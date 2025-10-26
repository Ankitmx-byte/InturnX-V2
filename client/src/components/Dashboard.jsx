import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from './BackButton';
import axios from '../utils/axios';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    xp: 0,
    completedCourses: 0,
    badges: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats and recommendations
        const [statsResponse, recommendationsResponse] = await Promise.all([
          axios.get('/api/auth/profile'),
          axios.get('/api/ai/recommend')
        ]);

        setStats({
          xp: statsResponse.data.user.xp || 0,
          completedCourses: statsResponse.data.user.completedCourses?.length || 0,
          badges: statsResponse.data.user.badges || [],
          recommendations: recommendationsResponse.data.recommendations || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      <BackButton />
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.name}!</span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-[#FF4B2B] to-[#FF8E53] text-white px-6 py-2 rounded-full hover:shadow-[#FF4B2B]/40 transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#14A44D]/20 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#14A44D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">XP Points</dt>
                    <dd className="text-2xl font-bold text-white">{stats.xp}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#5F2EEA]/20 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#5F2EEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Completed Courses</dt>
                    <dd className="text-2xl font-bold text-white">{stats.completedCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#FF4B2B]/20 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#FF4B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Badges Earned</dt>
                    <dd className="text-2xl font-bold text-white">{stats.badges.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Link
            to="/learning"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#14A44D]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#14A44D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#14A44D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Continue Learning</h3>
              <p className="text-gray-400">Access your courses</p>
            </div>
          </Link>

          <Link
            to="/battle"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#5F2EEA]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5F2EEA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#5F2EEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Code Battle</h3>
              <p className="text-gray-400">Challenge others</p>
            </div>
          </Link>

          <Link
            to="/projects"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#FF4B2B]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF4B2B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#FF4B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">My Projects</h3>
              <p className="text-gray-400">View submissions</p>
            </div>
          </Link>

          <Link
            to="/internships"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#14A44D]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#14A44D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#14A44D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Internships</h3>
              <p className="text-gray-400">Find opportunities</p>
            </div>
          </Link>

          <Link
            to="/resume-analyzer"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#FF8E53]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF8E53]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#FF8E53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Resume Analyzer</h3>
              <p className="text-gray-400">Analyze your resume</p>
            </div>
          </Link>

          <Link
            to="/quiz"
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-[#5F2EEA]/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5F2EEA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-[#5F2EEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Programming Quiz</h3>
              <p className="text-gray-400">Test your skills</p>
            </div>
          </Link>
        </div>

        {/* AI Recommendations */}
        {stats.recommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="px-6 py-5">
              <h3 className="text-xl leading-6 font-medium text-white mb-4">
                Recommended for You
              </h3>
              <div className="space-y-4">
                {stats.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl">
                    <div>
                      <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                      <p className="text-sm text-gray-300">{rec.description}</p>
                    </div>
                    <Link
                      to={`/course/${rec.id}`}
                      className="bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white px-4 py-2 rounded-full hover:shadow-[#14A44D]/40 transition-all duration-300 transform hover:scale-105"
                    >
                      Start Course
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
