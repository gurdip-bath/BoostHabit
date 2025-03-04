import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HabitCard from '../habitcard/HabitCard';
import Notification from '../notification/Notification';
import HabitForm from '../habitform/HabitForm';
import StatsOverview from './StatsOverview'; // Import the new component
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchHabits();
  }, []);

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
        message: `${updatedHabit.name} completed! +100 XP`,
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to complete habit',
        type: 'error'
      });
    }
  };

  const handleDelete = async (habitId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete habit');
      }

      setHabits(habits.filter(habit => habit.id !== habitId));
      setNotification({
        message: 'Habit deleted successfully',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to delete habit',
        type: 'error'
      });
    }
  };

  return (
    <div className="dashboard">
      <Notification {...notification} />
      <div className="dashboard-header">
        <h1 className="dashboard-title">BoostHabit</h1>
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <StatsOverview habits={habits} />
      
      <HabitForm onSubmit={handleHabitSubmit} />

      <div className="habit-list">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              handleComplete={handleComplete}
              handleDelete={handleDelete}
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