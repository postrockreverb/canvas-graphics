import React, { useState } from 'react';

const Slider = ({ label, min, max, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div style={styles.container}>
      <label>{label}</label>
      <input style={styles.slider} type="range" min={min} max={max} value={value} onChange={(e) => handleChange(e)} />
      <input type="number" min={min} max={max} value={value} size={max.toString().length} onChange={(e) => handleChange(e)} />
    </div>
  );
};

export { Slider };

const styles = {
  container: {
    width: '100%',
    margin: '0px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '7px',
  },
  slider: {
    margin: 'auto 0',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    width: '100%',
    height: '5px',
    background: 'white',
  },
};
