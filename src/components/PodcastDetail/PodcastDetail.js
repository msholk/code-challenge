// PodcastDetail.js

import React, { useState, useEffect } from "react";
import { fetchPodcastDetail } from "../../services/fetchPodcastDetail";
import { fetchPodcasts } from "../../services/fetchPodcasts";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styles from "./PodcastDetail.module.scss"; // Import the module
import _ from "lodash";
import {
  usePodcasts,
  usePodcastsDispatch,
} from "../../podcastsStores/PodcastsContext";
import { Loading } from "../Loading/Loading";

let podcastsResource;

const PodcastDetail = () => {
  // Function to render navigation buttons
  const getNavigator = () => {
    const currentPodcastIndex = _.findIndex(
      contextPodcasts,
      (p) => p.id === podcast.id
    );
    const prePodcast = contextPodcasts[currentPodcastIndex - 1];
    const nextPodcast = contextPodcasts[currentPodcastIndex + 1];

    return (
      <div>
        <div className={styles.nav}>
          {prePodcast ? (
            <a
              href="javascript:void(null)"
              onClick={() => {
                setPodcast({ id: prePodcast.id });
              }}
            >
              &#9664; Prev
            </a>
          ) : null}
          <Link to={`/`}>🏠 Back to Main List</Link>
          {nextPodcast ? (
            <a
              href="javascript:void(null)"
              onClick={() => {
                setPodcast({ id: nextPodcast.id });
              }}
            >
              Next &#9654;
            </a>
          ) : null}
        </div>
        <button
          onClick={() => {
            contextPodcastsDispatch({
              type: "changed",
              podcast: {
                ...podcast,
              },
            });
          }}
        >
          Save
        </button>
      </div>
    );
  };

  const usedParams = useParams();
  const [podcast, setPodcast] = useState(usedParams);
  const contextPodcasts = usePodcasts();
  let podcasts;

  // Fetch podcasts if context is empty
  if (!contextPodcasts.length) {
    if (!podcastsResource) podcastsResource = fetchPodcasts();
    podcasts = podcastsResource.read();
  }

  const contextPodcastsDispatch = usePodcastsDispatch();
  const contextPodcastsDic = _.keyBy(contextPodcasts, "id");
  const contextPodcastListEntry = contextPodcastsDic[podcast.id];
  let details = _.get(contextPodcastListEntry, "details");

  // Fetch podcast details on component mount
  useEffect(() => {
    if (!contextPodcasts.length) {
      contextPodcastsDispatch({ type: "retrieved", podcasts });
    }

    const fetchPodcastDetailData = async () => {
      try {
        console.log("PodcastDetail.useEffect", contextPodcastListEntry);

        if (details) {
          console.log("PodcastDetail.useEffect using details");
          setPodcast({ ...details, id: podcast.id });
          return;
        }

        console.log("PodcastDetail.useEffect getting details");
        details = await fetchPodcastDetail(podcast.id);
        details.loaded = true;
        setPodcast({ ...details, id: podcast.id });
        contextPodcastsDispatch({
          type: "changed",
          podcast: {
            ...contextPodcastListEntry,
            details,
          },
        });
      } catch (error) {
        console.error("Error fetching podcast detail", error);
        setPodcast({ error: true, id: podcast.id, loaded: true });
        contextPodcastsDispatch({
          type: "changed",
          podcast: {
            ...contextPodcastListEntry,
            details: { error: true, loaded: true },
          },
        });
      }
    };

    fetchPodcastDetailData();
  }, [contextPodcasts, usedParams, podcast.id]);

  // Render loading state if podcast details are not loaded
  if (!podcast.loaded) {
    return <Loading />;
  }

  console.log("PodcastDetail.podcast", podcast);

  return (
    <div className={styles.podCastDetail}>
      {podcast && (
        <div>
          <div>
            <span className={styles.artistName}>
              {contextPodcastListEntry["im:artist"].label}
            </span>
          </div>
          {podcast.error ? (
            <div className={styles.errorNote}>Error getting details</div>
          ) : (
            <div className={styles.collectionName}>
              <a href={podcast.collectionViewUrl}>{podcast.collectionName}</a>
            </div>
          )}

          <img
            src={contextPodcastListEntry["im:image"][2].label}
            alt="Podcast Cover"
          ></img>
          <div className={styles.summary}>
            {contextPodcastListEntry["summary"].label}
          </div>
          {getNavigator()}
        </div>
      )}
    </div>
  );
};

export default PodcastDetail;
