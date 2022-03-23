import styles from './Slider.module.css';

export const Slider = ({ min, max, value, onChange }) => {
  return (
    <div className={styles.rangeContainer}>
      <input id="range" className={styles.range} type="range" min={min} max={max} value={value} onChange={onChange} />
      <label htmlFor="range">{value}</label>
    </div>
  );
};
