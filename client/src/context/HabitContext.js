import React, { createContext, useState } from 'react';

// Create a new context object
export const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
    // Local state to store habits
    const [habits, setHabits] = useState([]);

    // Function to fetch habits from the backend
    const fetchHabits = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/habits'); // Fetch habits from backend
            const data = await response.json(); // Convert response into JSON
            setHabits(data); // Update the habits state with the fetched data
        } catch (error) {
            console.error('Error fetching habits:', error); // Log errors for debugging
        }
    };

    // Function to update habit progress
    const updateHabitProgress = async (habitID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/habits/${habitID}/complete`, {
                method: 'PATCH', // Use PATCH to update the habit
                headers: { 'Content-Type': 'application/json' }, // Set request headers
            });
            const updatedHabit = await response.json(); // Convert the response to JSON
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === habitID ? updatedHabit : habit
                )
            ); // Update the state with the updated habit
        } catch (error) {
            console.error('Error updating the habit progress:', error); // Log errors for debugging
        }
    };

    // Return the provider to wrap child components
    return (
        <HabitContext.Provider value={{ habits, fetchHabits, updateHabitProgress }}>
            {children} {/* Render child components */}
        </HabitContext.Provider>
    );
};
