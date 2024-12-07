import React, { useEffect, useState } from 'react';
import HabitCard from '../forms/HabitCard';


const Dashboard = () => {
  const [habits, setHabits] = useState([]); // State to store habits
  const [newHabit, setNewHabit] = useState(''); // State to manage input value for a new habit

  // Fetch habits from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/habits')
      .then(response => response.json())
      .then(data => setHabits(data))
      .catch(error => console.error('Error fetching habits:', error));
  }, []);

  // Function to handle text input change
  const handleInputChange = (e) => {
    setNewHabit(e.target.value); // Update newHabit state with the value typed in the text box
  };

  // Function to handle adding a new habit
  const addHabit = () => {
    if (newHabit.trim() === '') {
      alert('Habit cannot be empty!'); // Prevent adding empty habits
      return;
    }

    // POST new habit to the backend
    fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newHabit,
        frequency: "daily",
        target_completion: 5, // Example additional field
      }),
    })
      .then(response => response.json())
      .then(data => {
        setHabits([...habits, data]); // Add the new habit to the existing list
        setNewHabit(''); // Clear the input field
      })
      .catch(error => console.error('Error adding habit:', error));
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="add-habit-container">
        <input
          type="text"
          value={newHabit}
          onChange={handleInputChange}
          placeholder="Enter a new habit"
          className="add-habit-input"
        />
        <button onClick={addHabit} className="add-habit-button">
          Add Habit
        </button>
      </div>
      <div className="habit-list">
        {habits.length > 0 ? (
          habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} className="habit-card" />
          ))
        ) : (
          <p className="no-habits-message">No habits to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
