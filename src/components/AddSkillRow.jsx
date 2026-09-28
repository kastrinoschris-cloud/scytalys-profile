import { useState } from 'react';
import styles from './AddSkillRow.module.css';

// Component for adding a new skill to the skills list, without causing list rerenders while the user types.
export const AddSkillRow = ({ onAdd }) => {
  const [draft, setDraft] = useState('');

  const addSkill = () => {
    const name = draft.trim();
    if (!name) return;

    onAdd(name);
    setDraft('');
  };

  const handleDraftKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <div className={styles.addRow}>
      <input
        className={styles.input}
        type="text"
        value={draft}
        placeholder="e.g. React"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleDraftKeyDown}
      />
      <button type="button" onClick={addSkill} aria-label="Add skill">
        Add Skill
      </button>
    </div>
  );
};
