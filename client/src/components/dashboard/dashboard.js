import React, { useEffect, useState } from 'react';
import HabitCard from '../habitcard/HabitCard';

const Dashboard = () => {
  const [habits, setHabits] = useState([]); // State to store habits
  const [newHabit, setNewHabit] = useState(''); // State for new habit input
  const [progressData, setProgressData] = useState({}); // State for progress data

  // Fetch habits from the backend on component mount
  useEffect(() => {
    fetchHabits(); // Fetch habits initially
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habits');
      const data = await response.json();
      setHabits(data); // Update habits state
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = async () => {
    if (newHabit.trim() === '') {
      alert('Habit cannot be empty!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHabit,
          frequency: 'daily',
          target_completion: 5,
        }),
      });
      const data = await response.json();
      setHabits([...habits, data]); // Add new habit to state
      setNewHabit(''); // Clear input
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleComplete = async (habitId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedHabit = await response.json();

      // Update the specific habit in the state
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                complete: updatedHabit.complete, // Update complete status
                current_streak: updatedHabit.current_streak, // Update streak
                longest_streak: updatedHabit.longest_streak,
                experience_points: updatedHabit.experience_points,
              }
            : habit
        )
      );
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="add-habit-container">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)} // Update input state
          placeholder="Enter a new habit"
          className="add-habit-input"
        />
        <button onClick={addHabit} className="add-habit-button">
          Add Habit
        </button>
      </div>
      <div className="habit-list">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              handleComplete={handleComplete} // Pass handleComplete as a prop
            />
          ))
        ) : (
          <p className="no-habits-message">No habits to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
