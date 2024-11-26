import React, { useEffect, useState } from 'react';


const Dashboard = () => {
 // Step 1: Initialize state
  const [habits, setHabits] = useState([]);

// Step 2: Fetch data using useEffect
  useEffect(() => {
    fetch('/api/habits') // Replace with your backend route
      .then(response => response.json())
      .then(data => setHabits(data))
      .catch(error => console.error('Error fetching habits:', error));
  }, []);

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