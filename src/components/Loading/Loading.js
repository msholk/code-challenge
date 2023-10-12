import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import styles from "./Loading.module.scss";

function Loading({ message }) {
  message = message || "Loading... ";
  return (
    <div className={styles.loadingBody}>
      <div className={styles.loading}>
        <div>{message}</div>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}

// Define PropTypes for type checking
Loading.propTypes = {
  message: PropTypes.string,
};

export { Loading };
