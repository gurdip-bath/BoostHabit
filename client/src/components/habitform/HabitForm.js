// src/components/habitform/HabitForm.js
import React from 'react';
import './HabitForm.css';

const HabitForm = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    frequency: 1,  // Note: integer value
    target_completion: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure data is properly formatted
    const submitData = {
      name: formData.name,
      description: formData.description,
      frequency: Number(formData.frequency), // Explicitly convert to number
      target_completion: Number(formData.target_completion) // Explicitly convert to number
    };

    console.log('Submitting data:', submitData); // Debug log
    
    try {
      await onSubmit(submitData);
      // Reset form on success
      setFormData({
        name: '',
        description: '',
        frequency: 1,
        target_completion: 1
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label>Habit Name*</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Frequency*</label>
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({...formData, frequency: Number(e.target.value)})}
          required
        >
          <option value={1}>Daily</option>
          <option value={7}>Weekly</option>
          <option value={30}>Monthly</option>
        </select>
      </div>

      <div className="form-group">
        <label>Target Completion*</label>
        <input
          type="number"
          min="1"
          value={formData.target_completion}
          onChange={(e) => setFormData({...formData, target_completion: Number(e.target.value)})}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Create Habit
      </button>
    </form>
  );
};

export default HabitForm;