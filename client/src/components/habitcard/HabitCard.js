import React from 'react';
import '../../styles/habit-card.css';

const HabitCard = ({ habit, handleComplete }) => {
  return (
    <div className={`habit-card ${habit.complete ? 'completed' : ''}`}>
      <h2 className="habit-title">{habit.name}</h2>
      <p className="habit-description">{habit.description}</p>
      <p className="current-streak">Current Streak: {habit.current_streak} days</p>
      <p className="longest-streak">Longest Streak: {habit.longest_streak} days</p>
      <p className="experience-points">Experience: {habit.experience_points}</p>
      <button onClick={() => handleComplete(habit.id)}>
        Mark as Completed
      </button>
    </div>
  );
};

export default HabitCard;