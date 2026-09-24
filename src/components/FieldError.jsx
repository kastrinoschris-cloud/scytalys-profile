import styles from './FieldError.module.css';

export const FieldError = ({ message }) => {
  return (
    <p className={styles.error}>
      {message}
    </p>
  );
}
