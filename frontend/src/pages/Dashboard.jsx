import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [stats, setStats] = useState({ total: 0, reading: 0, completed: 0, important: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await api.get('/papers');
      const data = res.data;
      setPapers(data.slice(0, 5)); // Recent 5

      setStats({
        total: data.length,
        reading: data.filter(p => p.status === 'Reading').length,
        completed: data.filter(p => p.status === 'Completed').length,
        important: data.filter(p => p.priority === 'High').length,
      });
    } catch (error) {
      console.error('Failed to fetch papers', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Papers</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Reading</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.reading}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Important</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.important}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Papers</h3>
          <Link to="/papers" className="text-sm font-medium text-primary-600 hover:text-primary-500">View all</Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {papers.length === 0 ? (
            <li className="px-4 py-4 text-sm text-gray-500 text-center">No papers found. Add some!</li>
          ) : (
            papers.map(paper => (
              <li key={paper.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                <Link to={`/papers/${paper.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-primary-600 truncate">{paper.title}</div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${paper.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          paper.status === 'Reading' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {paper.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {paper.authors} {paper.year && `(${paper.year})`}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{paper.category}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
