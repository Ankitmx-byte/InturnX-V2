import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const LearningHub = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [selectedPath, setSelectedPath] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const learningPaths = [
    { id: 'all', name: 'All Courses', color: '#14A44D' },
    { id: 'frontend', name: 'Frontend Development', color: '#5F2EEA' },
    { id: 'backend', name: 'Backend Development', color: '#FF4B2B' },
    { id: 'fullstack', name: 'Full Stack', color: '#14A44D' },
    { id: 'ai', name: 'AI & Machine Learning', color: '#5F2EEA' },
    { id: 'data', name: 'Data Science', color: '#FF4B2B' },
    { id: 'opensource', name: 'Open Source', color: '#FF8E53' }
  ];

  const openSourceCourses = [
    {
      id: 'os-1',
      title: 'React Fundamentals',
      description: 'Master React.js with hands-on projects and modern hooks',
      level: 'Beginner',
      duration: '8 weeks',
      path: 'opensource',
      instructor: 'Open Source Community',
      rating: 4.8,
      students: 15420,
      tags: ['React', 'JavaScript', 'Frontend'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      isOpenSource: true,
      repository: 'https://github.com/facebook/react'
    },
    {
      id: 'os-2',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      level: 'Intermediate',
      duration: '10 weeks',
      path: 'opensource',
      instructor: 'Node.js Foundation',
      rating: 4.7,
      students: 12890,
      tags: ['Node.js', 'Express', 'Backend'],
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      isOpenSource: true,
      repository: 'https://github.com/nodejs/node'
    },
    {
      id: 'os-3',
      title: 'Python Data Science',
      description: 'Learn data analysis, visualization, and machine learning with Python',
      level: 'Intermediate',
      duration: '12 weeks',
      path: 'opensource',
      instructor: 'Python Software Foundation',
      rating: 4.9,
      students: 18750,
      tags: ['Python', 'Pandas', 'Machine Learning'],
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      isOpenSource: true,
      repository: 'https://github.com/python/cpython'
    },
    {
      id: 'os-4',
      title: 'Docker & Containerization',
      description: 'Master container technology and deployment strategies',
      level: 'Advanced',
      duration: '6 weeks',
      path: 'opensource',
      instructor: 'Docker Community',
      rating: 4.6,
      students: 9650,
      tags: ['Docker', 'Containers', 'DevOps'],
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400',
      isOpenSource: true,
      repository: 'https://github.com/docker/docker-ce'
    },
    {
      id: 'os-5',
      title: 'Git & Version Control',
      description: 'Master Git workflows and collaborative development',
      level: 'Beginner',
      duration: '4 weeks',
      path: 'opensource',
      instructor: 'Git Community',
      rating: 4.8,
      students: 22100,
      tags: ['Git', 'Version Control', 'Collaboration'],
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400',
      isOpenSource: true,
      repository: 'https://github.com/git/git'
    },
    {
      id: 'os-6',
      title: 'Linux System Administration',
      description: 'Learn Linux fundamentals and system administration',
      level: 'Intermediate',
      duration: '8 weeks',
      path: 'opensource',
      instructor: 'Linux Foundation',
      rating: 4.7,
      students: 14320,
      tags: ['Linux', 'System Admin', 'Shell'],
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400',
      isOpenSource: true,
      repository: 'https://github.com/torvalds/linux'
    },
    {
      id: 'os-7',
      title: 'TensorFlow Machine Learning',
      description: 'Build and deploy ML models with TensorFlow',
      level: 'Advanced',
      duration: '14 weeks',
      path: 'ai',
      instructor: 'TensorFlow Team',
      rating: 4.9,
      students: 8920,
      tags: ['TensorFlow', 'ML', 'AI'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      isOpenSource: true,
      repository: 'https://github.com/tensorflow/tensorflow'
    },
    {
      id: 'os-8',
      title: 'Kubernetes Orchestration',
      description: 'Master container orchestration with Kubernetes',
      level: 'Advanced',
      duration: '10 weeks',
      path: 'opensource',
      instructor: 'CNCF',
      rating: 4.8,
      students: 7680,
      tags: ['Kubernetes', 'Orchestration', 'Cloud'],
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
      isOpenSource: true,
      repository: 'https://github.com/kubernetes/kubernetes'
    }
  ];

  useEffect(() => {
    fetchCourses();
    fetchUserProgress();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      // Combine API courses with open source courses
      const allCourses = [...(response.data.courses || []), ...openSourceCourses];
      setCourses(allCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Fallback to open source courses if API fails
      setCourses(openSourceCourses);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setUserProgress(response.data.user.progress || {});
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesPath = selectedPath === 'all' || course.path === selectedPath;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesPath && matchesLevel && matchesSearch;
  });

  const getProgressPercentage = (courseId) => {
    return userProgress[courseId]?.percentage || 0;
  };

  const getCourseStatus = (courseId) => {
    const progress = getProgressPercentage(courseId);
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#14A44D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Learning Hub
              </h1>
              <p className="text-gray-400 mt-2">Master new skills with unlimited open source courses</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2">
                <span className="text-sm text-gray-400">XP: </span>
                <span className="text-[#14A44D] font-semibold">{user?.xp || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses, technologies, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14A44D] focus:border-transparent"
            />
            <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm text-gray-400 mr-2">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#14A44D]"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Learning Paths Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Learning Paths</h2>
          <div className="flex flex-wrap gap-3">
            {learningPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedPath === path.id
                    ? 'bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/15'
                }`}
              >
                {path.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Open Source Section */}
        {selectedPath === 'all' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF8E53] to-[#FF4B2B] bg-clip-text text-transparent">
                🔥 Featured Open Source Courses
              </h2>
              <span className="text-sm text-gray-400">Free & Unlimited Access</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {openSourceCourses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 right-3 bg-[#FF8E53] text-white px-2 py-1 rounded-full text-xs font-medium">
                      Open Source
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-[#FF8E53]">{course.instructor}</span>
                      <div className="flex items-center">
                        {renderStars(course.rating)}
                        <span className="text-gray-400 ml-1">({course.rating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{course.students.toLocaleString()} students</span>
                      <span>{course.duration}</span>
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="w-full bg-gradient-to-r from-[#FF8E53] to-[#FF4B2B] text-white py-2 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center block"
                    >
                      Start Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const progress = getProgressPercentage(course.id);
            const status = getCourseStatus(course.id);

            return (
              <div
                key={course.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                {course.image && (
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                    {course.isOpenSource && (
                      <div className="absolute top-2 right-2 bg-[#FF8E53] text-white px-2 py-1 rounded-full text-xs font-medium">
                        Open Source
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{course.description}</p>

                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="text-gray-400">Level: {course.level}</span>
                        <span className="text-gray-400">Duration: {course.duration}</span>
                      </div>

                      {course.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex mr-2">
                            {renderStars(course.rating)}
                          </div>
                          <span className="text-gray-400 text-sm">({course.rating})</span>
                          {course.students && (
                            <span className="text-gray-400 text-sm ml-2">• {course.students.toLocaleString()} students</span>
                          )}
                        </div>
                      )}

                      {course.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {course.tags.map((tag, index) => (
                            <span key={index} className="bg-white/10 text-gray-300 px-2 py-1 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      status === 'completed' ? 'bg-[#14A44D]/20' :
                      status === 'in-progress' ? 'bg-[#5F2EEA]/20' : 'bg-gray-600/20'
                    }`}>
                      {status === 'completed' ? (
                        <svg className="w-6 h-6 text-[#14A44D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : status === 'in-progress' ? (
                        <svg className="w-6 h-6 text-[#5F2EEA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {status !== 'not-started' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    to={`/course/${course.id}`}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center block ${
                      course.isOpenSource
                        ? 'bg-gradient-to-r from-[#FF8E53] to-[#FF4B2B] text-white hover:shadow-lg'
                        : status === 'completed'
                        ? 'bg-[#14A44D]/20 text-[#14A44D] border border-[#14A44D]/30 hover:bg-[#14A44D]/30'
                        : 'bg-gradient-to-r from-[#14A44D] to-[#5F2EEA] text-white hover:shadow-lg'
                    }`}
                  >
                    {course.isOpenSource ? 'Start Free Course' :
                     status === 'completed' ? 'Review Course' :
                     status === 'in-progress' ? 'Continue Learning' : 'Start Course'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;
