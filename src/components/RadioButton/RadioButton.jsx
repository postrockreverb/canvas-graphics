import styles from './RadioButton.module.css';

import React, { useState } from 'react';

export const RadioButton = ({ legend, labels, onChange }) => {
  const radioHandler = (e) => {
    onChange(e.target.value);
  };

  return (
    <fieldset className={styles.container}>
      <legend>{legend}</legend>
      {labels.map((e, i) => (
        <div className={styles.radio} key={i}>
          <label>{e}</label>
          <input type="radio" name={legend} value={e} onChange={radioHandler} defaultChecked={i === 0} />
        </div>
      ))}
    </fieldset>
  );
};
