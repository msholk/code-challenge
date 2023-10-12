// Import createSlice from the Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Define a slice of the Redux store for managing textbox state
export const textboxSlice = createSlice({
  // Name of the slice, used as a prefix for action types
  name: "tb",

  // Initial state for the textbox slice
  initialState: {
    counter: 0, // Initial value for the counter
    text: "", // Initial value for the text
  },

  // Reducers define how the state can be updated in response to actions
  reducers: {
    // Increment the counter
    increment: (state) => {
      // Update the counter by adding 1 to its current value
      state.counter += 1;
    },

    // Decrement the counter, but ensure it doesn't go below 0
    decrement: (state) => {
      // Check if the counter is greater than 0 before decrementing
      if (state.counter > 0) {
        // Decrement the counter by 1
        state.counter -= 1;
      }
    },

    // Change the text to a new value
    changeText: (state, newText) => {
      // Update the text with the payload from the action
      state.text = newText.payload;
    },
  },
});
