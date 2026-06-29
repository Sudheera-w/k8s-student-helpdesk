import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function App() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ studentName: '', category: 'Academic', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/requests`);
      setRequests(response.data);
      setError('');
    } catch (err) {
      setError('Cannot connect to backend. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createRequest = async (e) => {
    e.preventDefault();
    if (!form.studentName || !form.description) {
      setError('Please fill student name and description.');
      return;
    }
    await axios.post(`${API_BASE_URL}/requests`, form);
    setForm({ studentName: '', category: 'Academic', description: '' });
    loadRequests();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_BASE_URL}/requests/${id}/status`, { status });
    loadRequests();
  };

  const deleteRequest = async (id) => {
    await axios.delete(`${API_BASE_URL}/requests/${id}`);
    loadRequests();
  };

  return (
    <div className="page">
      <header>
        <p className="eyebrow">Kubernetes Project</p>
        <h1>Student Help Desk</h1>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Create Help Request</h2>
          <form onSubmit={createRequest}>
            <label>Student Name</label>
            <input name="studentName" value={form.studentName} onChange={handleChange} placeholder="Example: Sudheera" />

            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Academic</option>
              <option>Technical</option>
              <option>Library</option>
              <option>Finance</option>
            </select>

            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the problem..." />

            <button type="submit">Submit Request</button>
          </form>
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2>Requests</h2>
            <button className="secondary" onClick={loadRequests}>Refresh</button>
          </div>

          {error && <div className="error">{error}</div>}
          {loading && <p>Loading...</p>}

          <div className="requests">
            {requests.length === 0 && !loading ? <p className="empty">No requests yet.</p> : null}
            {requests.map((request) => (
              <article key={request.id} className="request">
                <div>
                  <h3>{request.studentName}</h3>
                  <p>{request.description}</p>
                  <span>{request.category}</span>
                  <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span>
                </div>
                <div className="actions">
                  <button className="secondary" onClick={() => updateStatus(request.id, 'IN_PROGRESS')}>In Progress</button>
                  <button className="secondary" onClick={() => updateStatus(request.id, 'DONE')}>Done</button>
                  <button className="danger" onClick={() => deleteRequest(request.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
