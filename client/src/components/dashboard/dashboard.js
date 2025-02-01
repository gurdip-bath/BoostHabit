import React, { useEffect, useState } from 'react';
import HabitCard from '../habitcard/HabitCard';
import Notification from '../notification/Notification';
import HabitForm from '../habitform/HabitForm';
import './dashboard.css'

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
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

  const handleHabitSubmit = async (formData) => {
    try {
      console.log('Submitting habit data:', formData); // Debug log
      
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          frequency: Number(formData.frequency),
          target_completion: Number(formData.target_completion)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to create habit');
      }

      const data = await response.json();
      setHabits([...habits, data]);
      setNotification({
        message: 'New habit added successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating habit:', error);
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
      <h1 className="dashboard-title">BoostHabit</h1>
      
      <HabitForm onSubmit={handleHabitSubmit} />

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