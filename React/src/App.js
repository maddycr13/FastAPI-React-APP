import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from './api';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    id: null,  // Add id to identify transaction to be updated
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: new Date(),
  });

  const [isEditing, setIsEditing] = useState(false); // Flag for edit mode

  const fetchTransactions = async () => {
    const response = await api.get('/transactions/');
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      // Update an existing transaction
      await api.put(`/transactions/${formData.id}`, formData);  // Use PUT for updates
      setIsEditing(false);  // Reset editing mode
    } else {
      // Create a new transaction
      await api.post('/transactions/', formData);
    }

    fetchTransactions();  // Refresh the list after submission
    resetForm();  // Reset the form after submission
  };

  const handleEdit = (transaction) => {
    setFormData({
      id: transaction.id,  // Set id for the transaction to be edited
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      is_income: transaction.is_income,
      date: new Date(transaction.date),  // Convert date to Date object for DatePicker
    });
    setIsEditing(true);  // Set editing mode to true
  };

  const handleDelete = async (transaction) => {
    await api.delete('/transactions/', { data: { id: transaction.id } });
    fetchTransactions();  // Refresh the list after deletion
  };

  const resetForm = () => {
    setFormData({
      id: null,
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: new Date(),
    });
    setIsEditing(false);  // Cancel edit mode if in editing
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Finance App</a>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input type="text" className="form-control" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input type="text" className="form-control" id="category" name="category" onChange={handleInputChange} value={formData.category} />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name="description" onChange={handleInputChange} value={formData.description} />
          </div>
          <div className="mb-3">
            <label htmlFor="is_income" className="form-label">Income?</label>
            <input type="checkbox" id="is_income" name="is_income" onChange={handleInputChange} checked={formData.is_income} />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <DatePicker selected={formData.date} onChange={handleDateChange} className="form-control" id="date" name="date" />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            {isEditing ? 'Update Transaction' : 'Submit Transaction'}
          </button>

          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <table className="table table-striped table-bordered table-hover mt-3">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(transaction)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(transaction)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
