import React from 'react';
import '../../styles/habit-card.css';
import HabitLevel from '../habitlevel/HabitLevel';

const HabitCard = ({ habit, handleComplete }) => {
  return (
    <div className={`habit-card ${habit.complete ? 'completed' : ''}`}>
      <h2 className="habit-title">{habit.name}</h2>
      <p className="habit-description">{habit.description}</p>
      <div className="streak-info">
        <p className="current-streak">Current Streak: {habit.current_streak} days</p>
        <p className="longest-streak">Longest Streak: {habit.longest_streak} days</p>
      </div>
      <HabitLevel experiencePoints={habit.experience_points} />
      <button 
        onClick={() => handleComplete(habit.id)}
        className="complete-button"
      >
        Mark as Completed
      </button>
    </div>
  );
};

export default HabitCard;