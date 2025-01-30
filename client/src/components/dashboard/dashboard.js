import React, { useEffect, useState } from 'react';
import HabitCard from '../habitcard/HabitCard';
import Notification from '../notification/Notification';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchHabits();
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      setNotification({
        message: 'Failed to load habits',
        type: 'error'
      });
    }
  };

  const addHabit = async () => {
    if (newHabit.trim() === '') {
      setNotification({
        message: 'Habit name cannot be empty',
        type: 'error'
      });
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
      setHabits([...habits, data]);
      setNewHabit('');
      setNotification({
        message: 'New habit added successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to add habit',
        type: 'error'
      });
    }
  };

  const handleComplete = async (habitId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedHabit = await response.json();

      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId
            ? {
                ...habit,
                complete: updatedHabit.complete,
                current_streak: updatedHabit.current_streak,
                longest_streak: updatedHabit.longest_streak,
                experience_points: updatedHabit.experience_points,
              }
            : habit
        )
      );
      setNotification({
        message: `${updatedHabit.name} completed! +5 XP`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to complete habit',
        type: 'error'
      });
    }
  };

  return (
    <div className="dashboard">
      <Notification {...notification} />
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="add-habit-container">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
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
              handleComplete={handleComplete}
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