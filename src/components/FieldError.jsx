import styles from './FieldError.module.css';

export const FieldError = ({ id, message }) => {
  return (
    <p id={id} className={styles.error}>
      {message}
    </p>
  );
};
