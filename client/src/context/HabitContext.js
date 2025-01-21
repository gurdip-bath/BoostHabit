import React, { createContext, useState } from 'react';

// creates a new context object

export const HabitContext = createContext ();

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]); // Local state to store habits
}

const fetchHabits = async () => {
    try {
        const response = await fetch ('http://localhost:5000/api/habits'); // fetch habits from backend 
        const data = await response.json(); // convert response into JSON
        setHabits(data); // Update the habits state with the fetched data
    } catch (error){
        console.error('Error fetching habits;', error); // Log errors for debugging
    }
}