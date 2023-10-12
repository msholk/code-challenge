// Import necessary dependencies from React
import { createContext, useContext, useReducer } from "react";
import _ from "lodash";

// Create a context for storing and accessing podcasts
const PodcastsContext = createContext(null);

// Create a context for dispatching actions related to podcasts
const PodcastsDispatchContext = createContext(null);

// Define the initial state for podcasts
const initialPodcasts = [];

// Define the reducer function for handling podcast-related actions
function podcastsReducer(podcasts, action) {
  switch (action.type) {
    // Action type for when podcasts are retrieved
    case "retrieved": {
      // Clone the action's podcasts and set it as the new state
      return _.cloneDeep(action.podcasts);
    }

    // Action type for when a podcast is changed
    case "changed": {
      // Clone the current state
      const cpy = _.cloneDeep(podcasts);

      // Find the index of the podcast to be changed
      const podcast2Change = _.findIndex(
        cpy,
        (p) => p.id === action.podcast.id
      );

      // Update the podcast at the found index with the new data
      cpy[podcast2Change] = { ...cpy[podcast2Change], ...action.podcast };

      // Return the updated state
      return cpy;
    }

    // Default case for unknown action types
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

// Define the PodcastsProvider component
export function PodcastsProvider({ children }) {
  // Use the useReducer hook to manage state and actions
  const [podcasts, dispatch] = useReducer(podcastsReducer, initialPodcasts);

  // Provide the podcasts state and dispatch function through contexts
  return (
    <PodcastsContext.Provider value={podcasts}>
      <PodcastsDispatchContext.Provider value={dispatch}>
        {children}
      </PodcastsDispatchContext.Provider>
    </PodcastsContext.Provider>
  );
}

// Define a custom hook for accessing the podcasts state
export function usePodcasts() {
  return useContext(PodcastsContext);
}

// Define a custom hook for accessing the podcasts dispatch function
export function usePodcastsDispatch() {
  return useContext(PodcastsDispatchContext);
}
