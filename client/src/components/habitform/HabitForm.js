import React, { useState } from 'react';
import './HabitForm.css';

const HabitForm = ({ onSubmit, initialHabit = null }) => {
  const [formData, setFormData] = useState({
    name: initialHabit?.name || '',
    description: initialHabit?.description || '',
    frequency: initialHabit?.frequency || 'daily',
    target_completion: initialHabit?.target_completion || 1
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';
    if (formData.target_completion < 1) newErrors.target_completion = 'Target must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Reset form if it's not editing
        if (!initialHabit) {
          setFormData({
            name: '',
            description: '',
            frequency: 'daily',
            target_completion: 1
          });
        }
      } catch (error) {
        setErrors({ submit: 'Failed to save habit' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label htmlFor="name">Habit Name*</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Frequency*</label>
        <select
          id="frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({...formData, frequency: e.target.value})}
          className={errors.frequency ? 'error' : ''}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        {errors.frequency && <span className="error-text">{errors.frequency}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="target">Target Completion*</label>
        <input
          id="target"
          type="number"
          min="1"
          value={formData.target_completion}
          onChange={(e) => setFormData({...formData, target_completion: parseInt(e.target.value)})}
          className={errors.target_completion ? 'error' : ''}
        />
        {errors.target_completion && <span className="error-text">{errors.target_completion}</span>}
      </div>

      {errors.submit && <div className="error-text">{errors.submit}</div>}
      
      <button type="submit" className="submit-button">
        {initialHabit ? 'Update Habit' : 'Create Habit'}
      </button>
    </form>
  );
};

export default HabitForm;