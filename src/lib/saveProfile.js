export async function saveProfile(profile, signal) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to save profile');
  }

  return response.json();
}
