export const FREQUENCY_OPTIONS = [
    { value: 1, label: 'Daily' },
    { value: 7, label: 'Weekly' },
    { value: 30, label: 'Monthly' }
  ];
  
  export const HABIT_FORM_FIELDS = [
    {
      id: 'name',
      label: 'Habit Name*',
      type: 'text',
      required: true,
      validation: (value) => !value.trim() ? 'Name is required' : null
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      required: false
    },
    {
      id: 'frequency',
      label: 'Frequency*',
      type: 'select',
      options: FREQUENCY_OPTIONS,
      required: true,
      validation: (value) => !value ? 'Frequency is required' : null
    },
    {
      id: 'target_completion',
      label: 'Target Completion (times)*',
      type: 'number',
      required: true,
      min: 1,
      validation: (value) => (!value || value < 1) ? 'Target must be at least 1' : null
    }
  ];