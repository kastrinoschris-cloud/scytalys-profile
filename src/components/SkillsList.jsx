import { memo, useState } from 'react';
import { SkillsListItem } from './SkillsListItem';
import styles from './SkillsList.module.css';

// This is memoized to avoid re-rendering the skills list when the skills are unchanged (f.e. if the user just makes an edit to the form)
export const SkillsList = memo(({ skills, onChange }) => {
  const [draft, setDraft] = useState('');

  const addSkill = () => {
    const name = draft.trim();
    if (!name) return;

    onChange([...skills, { id: Date.now(), name }]);
    setDraft('');
  }

  const removeSkill = (id) => {
    onChange(skills.filter((skill) => skill.id !== id));
  }

  const moveToIndex = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= skills.length) return;
    const updatedSkills = [...skills];
    const temp = updatedSkills[toIndex];
    updatedSkills[toIndex] = updatedSkills[fromIndex];
    updatedSkills[fromIndex] = temp;
    onChange(updatedSkills);
  }

  const handleDraftKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Skillset</h2>
      <p className={styles.hint}>Use the Up/Down buttons to change item order.</p>
      {skills.length === 0 ? (
        <p className={styles.empty}>No skills added yet.</p>
      ) : (
        <ol className={styles.list}>
          {skills.map((skill, index) => (
            <SkillsListItem
              key={skill.id}
              name={skill.name}
              index={index}
              onMove={moveToIndex}
              onRemove={() => removeSkill(skill.id)}
            />
          ))}
        </ol>
      )}
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
    </div>
  );
});
