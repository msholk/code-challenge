// Import axios for making HTTP requests and lodash for utility functions
import axios from "axios";
import _ from "lodash";

// Define the base URL for fetching podcasts
const API_BASE_URL =
  "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";

// Define a function for fetching data with suspense support
const fetcher = (url) => {
  // Initialize variables for status, result, and a suspender promise
  let status = "pending";
  let result;
  let suspender = axios(url)
    .then(
      // On successful response
      (r) => {
        // Set status to success and transform the data
        status = "success";
        result = _.map(r.data.feed.entry, (e) => {
          const attributes = _.get(e, "id.attributes");
          return {
            ...e,
            id: attributes["im:id"],
          };
        });
        // Additional actions can be performed here if needed
        // e.g., usePodcastsDispatch(result);
      },
      // On error response
      (e) => {
        // Set status to error and store the error result
        status = "error";
        result = e;
      }
    )
    .then(() => {
      // Introduce an artificial delay using a Promise for demo purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    });

  // Return an object with a read method for suspense support
  return {
    read() {
      // If data is still pending, throw the suspender promise
      if (status === "pending") {
        throw suspender;
      }
      // If there was an error, throw the error result
      else if (status === "error") {
        throw result;
      }
      // If the request was successful, return the result
      else if (status === "success") {
        return result;
      }
    },
  };
};

// Export a function for fetching podcasts using the fetcher
export const fetchPodcasts = () => {
  // Log a message indicating the start of the fetch operation
  console.log(`Fetching podcasts at ${API_BASE_URL}`);

  // Return the result of calling fetcher with the API_BASE_URL
  return fetcher(API_BASE_URL);
};
