export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Good Night';
}

export function formatPersonalGreeting(givenName?: string | null): {
  salutation: string;
  name: string;
} {
  const salutation = `${getTimeGreeting()},`;
  const name = givenName && givenName.trim() ? givenName.trim() : 'User';
  return { salutation, name };
}
