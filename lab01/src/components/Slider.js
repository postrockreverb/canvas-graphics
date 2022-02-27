import React, { useState } from 'react';

const Slider = ({ label, min, max, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => handleChange(e)} className="slider" />
    </div>
  );
};

export { Slider };
