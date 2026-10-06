import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Edit, Trash2, Eye } from 'lucide-react';

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const categories = ['Artificial Intelligence', 'Machine Learning', 'Explainable AI', 'Computer Vision', 'NLP', 'Data Mining', 'Other'];
  const statuses = ['To Read', 'Reading', 'Completed'];
  const priorities = ['Low', 'Medium', 'High'];

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [papers, search, category, status, priority]);

  const fetchPapers = async () => {
    try {
      const res = await api.get('/papers');
      setPapers(res.data);
    } catch (error) {
      console.error('Failed to fetch papers', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = papers;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        (p.authors && p.authors.toLowerCase().includes(s))
      );
    }
    if (category) {
      result = result.filter(p => p.category === category);
    }
    if (status) {
      result = result.filter(p => p.status === status);
    }
    if (priority) {
      result = result.filter(p => p.priority === priority);
    }
    setFilteredPapers(result);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        await api.delete(`/papers/${id}`);
        setPapers(papers.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete paper');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/papers/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto">
            Add Paper
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
        <div className="flex-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" placeholder="Search by title or authors..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
        </div>
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border">
          <option value="">All Priorities</option>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
        <ul className="divide-y divide-gray-200">
          {filteredPapers.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500">No papers match your filters.</li>
          ) : (
            filteredPapers.map(paper => (
              <li key={paper.id}>
                <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-primary-600 truncate">{paper.title}</p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          {paper.authors} {paper.year && `• ${paper.year}`}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {paper.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${paper.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          paper.status === 'Reading' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {paper.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${paper.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          paper.priority === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                        {paper.priority}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex items-center space-x-3">
                    <button onClick={() => navigate(`/papers/${paper.id}`)} className="text-gray-400 hover:text-primary-600">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => navigate(`/papers/${paper.id}/edit`)} className="text-gray-400 hover:text-blue-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(paper.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
