import styles from './SkillsListItem.module.css';

export const SkillsListItem = ({ name, index, onMove, onRemove }) => {
  return (
    <li className={styles.item}>
      <span className={styles.name}>{name}</span>
      <div className={styles.actions}>
        <button type="button" onClick={() => onMove(index, index - 1)} aria-label="Move skill up">
          ↑
        </button>
        <button type="button" onClick={() => onMove(index, index + 1)} aria-label="Move skill down">
          ↓
        </button>
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label="Remove skill"
        >
          ×
        </button>
      </div>
    </li>
  );
};
