import styles from './Selector.module.css';

import React from 'react';

const Selector = ({ onChange }) => {
  const options = {
    fixed: 'закрепленные',
    loose: 'cлабые',
    periodic: 'цикличность',
    aperiodic: 'ацикличность',
  };

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

export default Selector;
