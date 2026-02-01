import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaChartLine, FaDatabase, FaCloudSun } from 'react-icons/fa';

const Home: FC = () => {
  // Fade-in animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Stats data
  const stats = [
    { label: 'Active Farms', value: '500+' },
    { label: 'Data Points', value: '1M+' },
    { label: 'Plant Species', value: '100+' },
    { label: 'Success Rate', value: '95%' },
  ];

  // Features data
  const features = [
    {
      icon: <FaLeaf className="w-8 h-8 text-green-500" />,
      title: 'Plant Monitoring',
      description: 'Real-time tracking of plant health and growth metrics'
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-green-500" />,
      title: 'Data Analytics',
      description: 'Advanced analytics and insights for optimal farming decisions'
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-green-500" />,
      title: 'Data Collection',
      description: 'Comprehensive data gathering from multiple sources'
    },
    {
      icon: <FaCloudSun className="w-8 h-8 text-green-500" />,
      title: 'Weather Integration',
      description: 'Environmental data correlation with plant health'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-4 pt-20 pb-32 text-center"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Plant Health Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Empower your farming decisions with comprehensive plant health monitoring and data-driven insights
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/learn-more"
            className="bg-white text-green-500 border border-green-500 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="bg-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-green-500">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plant Data Section */}
      <motion.section 
        className="bg-green-50 py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Plant Data Management
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Comprehensive Plant Monitoring
                </h3>
                <p className="text-gray-600 mb-6">
                  Track and analyze vital plant health metrics, soil conditions, and growth patterns
                  with our advanced monitoring system.
                </p>
                <Link
                  to="/plant-data"
                  className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  View Plant Data
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="/plant-monitoring.svg" 
                  alt="Plant Monitoring" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;