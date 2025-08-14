import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';

const FacultyManagement = () => {
  const { faculty, updateFaculty } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    experience: '',
    subjects: [],
    joinDate: '',
    status: 'Active'
  });

  const filteredFaculty = faculty.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFaculty = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      qualification: '',
      experience: '',
      subjects: [],
      joinDate: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleEditFaculty = (member) => {
    setEditingFaculty(member);
    setFormData(member);
    setShowModal(true);
  };

  const handleDeleteFaculty = (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const updatedFaculty = faculty.filter(member => member.id !== facultyId);
      updateFaculty(updatedFaculty);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const subjectsArray = typeof formData.subjects === 'string' 
      ? formData.subjects.split(',').map(s => s.trim())
      : formData.subjects;
    
    if (editingFaculty) {
      const updatedFaculty = faculty.map(member => 
        member.id === editingFaculty.id 
          ? { ...formData, id: editingFaculty.id, subjects: subjectsArray }
          : member
      );
      updateFaculty(updatedFaculty);
    } else {
      const newFaculty = {
        ...formData,
        id: Date.now(),
        facultyId: `FAC${String(faculty.length + 1).padStart(3, '0')}`,
        subjects: subjectsArray
      };
      updateFaculty([...faculty, newFaculty]);
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="faculty-management">
      <div className="section-header">
        <h2>Faculty Management</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleAddFaculty}
            className="btn btn-primary"
          >
            Add New Faculty
          </button>
        </div>
      </div>

      <div className="faculty-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Subjects</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculty.map(member => (
              <tr key={member.id}>
                <td>{member.facultyId}</td>
                <td>{member.name}</td>
                <td>{member.department}</td>
                <td>{member.qualification}</td>
                <td>{member.experience}</td>
                <td>
                  <div className="subjects-list">
                    {member.subjects?.map((subject, index) => (
                      <span key={index} className="subject-tag">
                        {subject}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${member.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {member.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditFaculty(member)}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFaculty(member.id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 5 years"
                />
              </div>
              
              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label>Subjects (comma separated)</label>
                <input
                  type="text"
                  name="subjects"
                  value={Array.isArray(formData.subjects) ? formData.subjects.join(', ') : formData.subjects}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style jsx>{`
        .subjects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .subject-tag {
          background: #e9ecef;
          color: #495057;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          white-space: nowrap;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 250px;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .btn-small {
          padding: 5px 10px;
          font-size: 12px;
        }
        
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .search-input {
            width: 100%;
          }
          
          .table {
            font-size: 12px;
          }
          
          .subjects-list {
            max-width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyManagement;
