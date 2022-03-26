import styles from './Selector.module.css';

import React from 'react';

export const Selector = ({ onChange, options }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select className={styles.selector} name="Figure" onChange={(e) => handleChange(e)}>
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};
