// src/components/common/FormField.js
import React from 'react';

const FormField = ({ field, value, onChange, error }) => {
  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={error ? 'error' : ''}
          />
        );
        
      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={error ? 'error' : ''}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'number':
        return (
          <input
            id={field.id}
            type="number"
            min={field.min}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={error ? 'error' : ''}
          />
        );
        
      default:
        return (
          <input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={error ? 'error' : ''}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={field.id}>{field.label}</label>
      {renderField()}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormField;