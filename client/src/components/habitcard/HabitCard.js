import React from 'react';
import './habit-card.css';
import HabitLevel from '../habitlevel/HabitLevel';

const HabitCard = ({ habit, handleComplete, handleDelete }) => {
  return (
    <div className={`habit-card ${habit.complete ? 'completed' : ''}`}>
      {habit.current_streak > 0 && (
      <div className="streak-badge">
        <span className="streak-count">{habit.current_streak}</span>
        <span className="streak-label">day{habit.current_streak !== 1 ? 's' : ''}</span>
      </div>
        )}
      
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
      <button
        onClick={() => handleDelete(habit.id)}
        className="delete-button"
        aria-label="Delete habit"> Delete Habit
      </button>
    </div>
  );
};

export default HabitCard;