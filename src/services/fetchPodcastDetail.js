// Import axios for making HTTP requests
import axios from "axios";

// Define a function for fetching podcast details by ID
export const fetchPodcastDetail = async (podcastId) => {
  try {
    // Make a GET request to the iTunes API using the provided podcastId
    const response = await axios.get(
      `https://itunes.apple.com/lookup?id=${podcastId}`
    );

    // Introduce an artificial delay using a Promise for demo purposes
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Resolve the promise with the first result from the response
        resolve(response.data.results[0]);
      }, 1000);
    });
  } catch (error) {
    // If an error occurs during the request, throw the error
    throw error;
  }
};
