interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  language?: string | null;
  pushed_at?: string;
  updated_at?: string;
  color?: string;
  [key: string]: unknown;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  } else {
    return `${Math.floor(diffDays / 365)} years ago`;
  }
};

export const filterRepos = (repos: Repo[], excludePatterns: string[] = ["roy-jin", "cloud", "learn"], showCount: number = 4) => {
  const excludeRegex = new RegExp(excludePatterns.join('|'), 'i');
  
  let filtered = repos.filter(repo => {
    return !excludeRegex.test(repo.name);
  });
  
  filtered.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    return new Date(b.pushed_at || b.updated_at || Date.now()).getTime() - new Date(a.pushed_at || a.updated_at || Date.now()).getTime();
  });
  
  return filtered.slice(0, showCount);
};
