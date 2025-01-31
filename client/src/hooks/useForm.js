// src/hooks/useForm.js
import { useState } from 'react';

const useForm = (fields, initialValues = {}, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(formData[field.id]);
        if (error) newErrors[field.id] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Parse number fields
        const parsedData = {};
        fields.forEach(field => {
          parsedData[field.id] = field.type === 'number' 
            ? parseInt(formData[field.id], 10)
            : formData[field.id];
        });
        await onSubmit(parsedData);
        return true;
      } catch (error) {
        setErrors({ submit: 'Failed to save data' });
        return false;
      }
    }
    return false;
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData
  };
};

export default useForm;