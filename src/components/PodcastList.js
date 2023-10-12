// Import necessary dependencies from React and other modules
import React, { useEffect } from "react";
import { fetchPodcasts } from "../services/fetchPodcasts";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { textboxSlice } from "../podcastsStores/textboxSlice";
import {
  usePodcasts,
  usePodcastsDispatch,
} from "../podcastsStores/PodcastsContext";
import _ from "lodash"; // Import lodash for utility functions

// Destructure actions from textboxSlice
const { changeText } = textboxSlice.actions;

// Initialize a variable to hold the resource for fetching podcasts
let podcastsResource;

// Define the PodcastList component
const PodcastList = () => {
  // Lazy initialization of podcastsResource
  if (!podcastsResource) podcastsResource = fetchPodcasts();

  // Read the podcasts from the resource
  const podcasts = podcastsResource.read();

  // Select textbox text from Redux state
  const textboxText = useSelector((state) => {
    return state.textbox.text;
  });

  // Get the Redux dispatch function
  const reduxDispatch = useDispatch();

  // Get podcasts and dispatch function from context
  const contextPodcasts = usePodcasts();
  const contextPodcastsDispatch = usePodcastsDispatch();

  // useEffect to update contextPodcasts if it's empty
  useEffect(() => {
    if (!contextPodcasts.length) {
      contextPodcastsDispatch({ type: "retrieved", podcasts });
    }
  }, [podcasts, contextPodcastsDispatch, contextPodcasts]);

  // Criteria for filtering podcasts
  const criteria = _.toLower(_.trim(textboxText));

  // Filter podcasts based on criteria
  const filteredEntries = _.filter(podcasts, (p) =>
    _.includes(_.toLower(_.trim(p.title.label)), criteria)
  );

  // Render the component
  return (
    <div>
      {/* Input for filtering podcasts */}
      <input
        type="text"
        placeholder="Filter Podcasts"
        value={textboxText}
        onChange={(e) => {
          reduxDispatch(changeText(e.target.value));
        }}
      />
      {/* List of filtered podcasts */}
      <ol className="podcasts">
        {filteredEntries.map((podcast) => {
          const theKey = podcast.id;
          return (
            <li key={theKey} className="podcast">
              <div className="l1">
                <div className="l2">
                  {/* Link to navigate to the podcast detail page */}
                  <Link to={`/podcast/${theKey}`} className="podcast">
                    {podcast.title.label}
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// Export the PodcastList component
export default PodcastList;
