import * as yup from 'yup';

const PHONE_PATTERN = /^\+?[0-9][0-9\s().-]*$/;

export function calculateBirthdayThreshold() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// Might be overkill for a simple form, but I like schema validation, since it's easy to read and understand and is extendable if needed.
export const profileSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Full name is required.')
    .min(2, 'Enter at least 2 characters.'),
  email: yup
    .string()
    .trim()
    .required('Email is required.')
    .email('Enter a valid email address.'),
  phone: yup
    .string()
    .trim()
    .test('phone', 'Enter a valid phone number (7–15 digits).', (value) => {
      if (!value) return true;
      if (!PHONE_PATTERN.test(value)) return false;

      const digits = value.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    }),
  country: yup.string().required('Country is required.'),
  bio: yup.string().max(500, 'Bio must not exceed 500 characters.'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required.')
    .test('valid-date', 'Enter a valid date of birth.', isValidDate)
    .test('adult', 'You must be at least 18 years old.', (value) => {
      if (!isValidDate(value)) return true;
      return value <= calculateBirthdayThreshold();
    }),
  newsletter: yup.boolean(),
  skills: yup.array(),
});

export function validateProfile(values) {
  try {
    profileSchema.validateSync(values, { abortEarly: false });
    return {};
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      throw error;
    }

    const errors = {};
    error?.inner?.forEach((issue) => {
      if (issue.path && !errors[issue.path]) {
        errors[issue.path] = issue.message;
      }
    });
    return errors;
  }
}
