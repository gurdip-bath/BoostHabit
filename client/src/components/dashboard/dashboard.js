import React, { useEffect, useState } from 'react';
import HabitCard from '../forms/HabitCard';


const Dashboard = () => {
 // Step 1: Initialize state
  const [habits, setHabits] = useState([]);

// Step 2: Fetch data using useEffect
  useEffect(() => {
    fetch('http://localhost:5000/api/habits') 
      .then(response => response.json())
      .then(data => setHabits(data))
      .catch(error => console.error('Error fetching habits:', error));
  }, []);

// Step 3: Render the Data
  return (
    <div>
      <h1>Dashboard</h1>
      {habits.length > 0 ? (
        habits.map(habit => <HabitCard key={habit.id} habit={habit} />)
      ) : (
        <p>No habits to display.</p>
      )}
    </div>
  );
};

export default Dashboard;