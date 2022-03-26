import styles from './Slider.module.css';

import React, { useState } from 'react';

export const Slider = ({ label, min, max, defaultValue, onChange, width }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event);
  };

  return (
    <div className={styles.container}>
      <label>{label}</label>
      <input
        className={styles.slider}
        style={{ width: width + 'px' }}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(e)}
      />
      <input type="number" min={min} max={max} value={value} size={max.toString().length} onChange={(e) => handleChange(e)} />
    </div>
  );
};
