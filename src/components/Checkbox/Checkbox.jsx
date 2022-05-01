import styles from './Checkbox.module.css';

import React, { useState } from 'react';

export const Checkbox = ({ label, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = () => {
    setValue(!value);
    onChange(!value);
  };
  return (
    <div className={styles.container}>
      <div>{label}</div>
      <input type="checkbox" checked={value} onChange={() => handleChange()} />
    </div>
  );
};
