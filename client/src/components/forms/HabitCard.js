import React from 'react';

const HabitCard = ({ habit }) => { 
  return (
    <div className="habit-card">
      <h2>{habit.name}</h2>
      <p>{habit.description}</p>
      <p>Current Streak: {habit.current_streak} days</p>
      <p>Longest Streak: {habit.longest_streak} days</p>
    </div>
  );
};

export default HabitCard;
