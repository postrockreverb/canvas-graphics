import styles from './Welcome.module.css';

import React from 'react';

import { Link } from 'react-router-dom';

export const Welcome = () => {
  return (
    <div className={styles.container}>
      <Link to="/Lab01">Lab01</Link>
      <Link to="/Lab02">Lab02</Link>
      <Link to="/Lab03">Lab03</Link>
      <Link to="/Lab04">Lab04</Link>
      <Link to="/Lab05">Lab05</Link>
      <Link to="/Lab06">Lab06</Link>
    </div>
  );
};
