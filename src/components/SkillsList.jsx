import { memo } from 'react';
import { AddSkillRow } from './AddSkillRow';
import { SkillsListItem } from './SkillsListItem';
import styles from './SkillsList.module.css';

// This is memoized to avoid re-rendering the skills list when the skills are unchanged (f.e. if the user just makes an edit to the form)
export const SkillsList = memo(({ skills, onChange }) => {
  // Date.now is used to generate a unique id for the new skill. In a real-world application, I'd use a uuid.
  const addSkill = (name) => {
    onChange([...skills, { id: Date.now(), name }]);
  };

  const removeSkill = (id) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const moveToIndex = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= skills.length) return;
    const updatedSkills = [...skills];
    const temp = updatedSkills[toIndex];
    updatedSkills[toIndex] = updatedSkills[fromIndex];
    updatedSkills[fromIndex] = temp;
    onChange(updatedSkills);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Skillset</h2>
      <p className={styles.hint}>Use the Up/Down buttons to change item order.</p>
      {skills.length === 0 ? (
        <p className={styles.empty}>No skills added yet.</p>
      ) : (
        <div className={styles.listScroll}>
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
        </div>
      )}
      <AddSkillRow onAdd={addSkill} />
    </div>
  );
});
