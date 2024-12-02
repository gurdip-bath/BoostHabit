import React, { useEffect, useState } from 'react';
import HabitCard from '../forms/HabitCard';
import "../../styles/dashboard.css"


const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  useEffect(() => {
    fetch('http://localhost:5000/api/habits') 
      .then(response => response.json())
      .then(data => setHabits(data))
      .catch(error => console.error('Error fetching habits:', error));
  }, []);
  return (
    <div>
      <h1 className='dashboard-title'>Dashboard</h1>
      {habits.length > 0 ? (
        habits.map(habit => <HabitCard key={habit.id} habit={habit} />)
      ) : (
        <p>No habits to display.</p>
      )}
    </div>
  );
};

export default Dashboard;