import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCountries } from '../lib/countries';
import { validateProfile } from '../lib/validateProfile';
import { FieldError } from './FieldError';
import { SkillsList } from './SkillsList';
import styles from './ProfileForm.module.css';

const AUTOSAVE_DELAY_MS = 500;

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  bio: '',
  dateOfBirth: '',
  newsletter: false,
  skills: [],
};

export const ProfileForm = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  // hasEdited is used to prevent form validation on initial load. Without it, errors would be immediately displayed, without any user interaction.
  const [hasEdited, setHasEdited] = useState(false);
  const countries = useMemo(() => getCountries(), []);

  // Debouncing to prevent unnecessary saves.
  // Form validation could be moved outside the setTimeout for instant display of errors but I find it a bit weird looking and it would also re-validate the entire form on every keystroke.
  useEffect(() => {
    if (!hasEdited) {
      return undefined;
    }
    
    const timeoutId = setTimeout(() => {
      const nextErrors = validateProfile(values);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        return;
      }

      // TODO: Actual save functionality to be added here
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [values, hasEdited]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setHasEdited(true);
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  const handleSkillsChange = useCallback((skills) => {
    setHasEdited(true);
    setValues((current) => ({ ...current, skills }));
  }, []);

  // Just prevent default (form refresh) if the user tries to submit the form by pressing "Enter" on their keyboard.
  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1 className={styles.title}>Profile Information</h1>
        <p className={styles.intro}>Fields marked with * are required.</p>
      </header>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="fullName">Full name *</label>
        <input
          id="fullName"
          name="fullName"
          className={errors.fullName ? `${styles.control} ${styles.controlInvalid}` : styles.control}
          type="text"
          value={values.fullName}
          onChange={handleChange}
        />
        <FieldError message={errors.fullName} />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          className={errors.email ? `${styles.control} ${styles.controlInvalid}` : styles.control}
          type="email"
          inputMode="email"
          value={values.email}
          onChange={handleChange}
        />
        <FieldError message={errors.email} />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          className={errors.phone ? `${styles.control} ${styles.controlInvalid}` : styles.control}
          type="tel"
          inputMode="tel"
          placeholder="+30 698 123 4567"
          value={values.phone}
          onChange={handleChange}
        />
        <FieldError message={errors.phone} />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="country">Country *</label>
        <select
          id="country"
          name="country"
          className={
            errors.country
              ? `${styles.control} ${styles.select} ${styles.controlInvalid}`
              : `${styles.control} ${styles.select}`
          }
          value={values.country}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.country} />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          className={errors.bio ? `${styles.control} ${styles.textarea} ${styles.controlInvalid}` : `${styles.control} ${styles.textarea}`}
          maxLength={500}
          rows={5}
          value={values.bio}
          onChange={handleChange}
        />
        <div className={styles.fieldMeta}>
          <p id="bio-count" className={styles.counter}>{values.bio.length}/500</p>
        </div>
        <FieldError message={errors.bio} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Date of birth *</label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          className={errors.dateOfBirth ? `${styles.control} ${styles.controlInvalid}` : styles.control}
          type="date"
          min="1900-01-01"
          value={values.dateOfBirth}
          onChange={handleChange}
        />
        <FieldError message={errors.dateOfBirth} />
      </div>
      <div className={styles.field}>
        <label className={styles.checkbox}>
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            checked={values.newsletter}
            onChange={handleChange}
          />
          Subscribe to our newsletter
        </label>
      </div>
      <SkillsList skills={values.skills} onChange={handleSkillsChange} />
    </form>
  );
};
