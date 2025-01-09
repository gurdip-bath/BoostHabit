// Import React library to use JSX and create React components
import React from 'react';

// Import CSS file for styling the HabitCard component
import "../../styles/habit-card.css";

// Define the HabitCard functional component
// Accepts two props: `habit` (an object containing habit details) and `handleComplete` (a function to handle marking a habit as completed)
const HabitCard = ({ habit, handleComplete }) => {
  return (
    // Main container for the habit card with a class name for styling
    <div className={`habit-card ${habit.completed ? "completed" : ""}`}>


      {/* Display the name of the habit as a heading */}
      <h2 className="habit-title">{habit.name}</h2>

      {/* Display the description of the habit */}
      <p className="habit-description">{habit.description}</p>

      {/* Show the current streak of the habit */}
      <p className="current-streak">Current Streak: {habit.current_streak} days</p>

      {/* Show the longest streak of the habit */}
      <p className="longest-streak">Longest Streak: {habit.longest_streak} days</p>

      {/* Button to mark the habit as completed */}
      <button 
        // When the button is clicked, call the `handleComplete` function with the habit's ID as an argument
        onClick={() => handleComplete(habit.id)} 
        // Disable the button if the habit is already completed
        disabled={habit.completed}
        // Set the background color based on whether the habit is completed or not
        style={{ backgroundColor: habit.completed ? "grey" : "blue" }}
      >
        {/* Change the button text dynamically based on whether the habit is completed */}
        {habit.completed ? "Completed" : "Mark as Completed"}
      </button>
    </div>
  );
};




export default HabitCard;
