import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Welcome, Admin!</h2>
          <p className="text-gray-600">
            Use the sidebar to navigate and manage the different content sections of the website.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-gray-600">
            You can perform full CRUD operations (Create, Read, Update, Delete) for each module.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">API Status</h2>
          <p className="text-gray-600">
            The admin panel is connected to the backend at{' '}
            <code className="bg-gray-200 p-1 rounded">http://localhost:5000/api</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
