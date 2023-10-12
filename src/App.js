// Import necessary dependencies from React and third-party libraries
import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { textboxSlice } from "./podcastsStores/textboxSlice";
import { PodcastsProvider } from "./podcastsStores/PodcastsContext";
import "./App.scss";
import { Loading } from "./components/Loading/Loading";

// Create the Redux store with the textboxSlice reducer
const store = configureStore({
  reducer: { textbox: textboxSlice.reducer },
});

// Expose the store globally for debugging purposes
window.myStore = () => store.getState();

// Use React.lazy to dynamically import PodcastList and PodcastDetail components
const PodcastList = React.lazy(() => import("./components/PodcastList"));
const PodcastDetail = React.lazy(() =>
  import("./components/PodcastDetail/PodcastDetail")
);

// Create a router using createBrowserRouter from react-router-dom
let router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    // Define a component for the "/" route
    Component() {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Code Challenge</h1>
          </header>

          {/* Use Suspense to handle lazy loading of PodcastList */}
          <Suspense fallback={<Loading />}>
            <PodcastList />
          </Suspense>
        </div>
      );
    },
  },
  {
    path: "/podcast/:id",
    loader: () => ({ message: "Hello Data Router!" }),
    // Define a component for the "/podcast/:id" route
    Component() {
      return (
        <Suspense fallback={<Loading message="Loading list..." />}>
          {/* Use Suspense to handle lazy loading of PodcastDetail */}
          <PodcastDetail />
        </Suspense>
      );
    },
  },
  {
    path: "*",
    loader: () => ({ message: "Hello Data Router!" }),
    // Define a component for unmatched routes
    Component() {
      return <div>No match</div>;
    },
  },
]);

// Define the main App component
const App = () => {
  return (
    <PodcastsProvider>
      {/* Wrap the entire app in the Redux Provider and RouterProvider */}
      <Provider store={store}>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </Provider>
    </PodcastsProvider>
  );
};

// Export the App component as the default export
export default App;
