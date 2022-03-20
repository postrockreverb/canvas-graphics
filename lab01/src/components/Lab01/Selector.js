import React from 'react';

const Selector = ({ onChange }) => {
  const options = {
    Diamond: 'Diamond',
    Cube: 'Cube',
    Pyramid: 'Pyramid',
  };

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <select name="Figure" onChange={(e) => handleChange(e)}>
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default Selector;
