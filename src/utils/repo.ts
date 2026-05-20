import dayjs from "dayjs";

interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  description_zh?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  language?: string | null;
  pushed_at?: string;
  updated_at?: string;
  color?: string;
  [key: string]: unknown;
}

export const formatDate = (
  dateString: string,
  t: (key: string, named?: Record<string, unknown>) => string,
) => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");

  if (diffMinutes < 1) {
    return t("date.justNow");
  } else if (diffMinutes < 60) {
    return t("date.minutesAgo", { minutes: diffMinutes });
  } else if (diffHours < 24) {
    return t("date.hoursAgo", { hours: diffHours });
  } else if (diffDays === 1) {
    return t("date.yesterday");
  } else if (diffDays < 30) {
    return t("date.daysAgo", { days: diffDays });
  } else if (diffDays < 365) {
    return t("date.monthsAgo", { months: Math.floor(diffDays / 30) });
  } else {
    return t("date.yearsAgo", { years: Math.floor(diffDays / 365) });
  }
};

export const filterRepos = (repos: Repo[], excludePatterns: string[] = []) => {
  const excludeRegex = new RegExp(excludePatterns.join("|"), "i");

  let filtered = repos.filter((repo) => {
    return !excludeRegex.test(repo.name);
  });

  filtered.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    return new Date(b.pushed_at || b.updated_at || Date.now()).getTime() -
      new Date(a.pushed_at || a.updated_at || Date.now()).getTime();
  });

  return filtered;
};
