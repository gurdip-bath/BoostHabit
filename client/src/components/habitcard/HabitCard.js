import React from 'react';
import "../../styles/habit-card.css"

const HabitCard = ({ habit }) => { 
  return (
    <div className="habit-card">
      <h2 className='habit-title'>{habit.name}</h2>
      <p className="habit-description">{habit.description}</p>
      <p className= "current-streak">Current Streak: {habit.current_streak} days</p>
      <p className= "longest-streak">Longest Streak: {habit.longest_streak} days</p>
    </div>
  );
};

export default HabitCard;
