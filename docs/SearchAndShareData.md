# Search and Share Data: Component Communication Patterns in React/Next.js

## Overview

When building search functionality with multiple components that need to share data (search input, results, selected items), you need to choose the right data-sharing pattern. This document outlines the best approaches for the TLG search feature.

## The Problem

In the TLG app, we have:
- `SearchRepository.tsx` - Component for searching repositories
- `RepoStatusPanel.tsx` - Component displaying search results
- `DisplayArticle.tsx` - Component showing selected repository details
- `page.tsx` - Parent container

**Challenge**: How do these sibling components share search state (query, results, selection)?

---

## Solution 1: Lifting State Up ⭐ **RECOMMENDED**

### Description
Move shared state to the closest common parent component and pass data/callbacks down via props.

### Implementation

```tsx
// app/search/page.tsx
'use client';
import { useState } from 'react';
import SearchRepository from './SearchRepository';
import RepoStatusPanel from './RepoStatusPanel';
import DisplayArticle from './DisplayArticle';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState({ user: '', repo: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (user: string, repo: string) => {
    setLoading(true);
    setSearchQuery({ user, repo });
    // Fetch results
    const results = await fetch(`/api/search?user=${user}&repo=${repo}`);
    const data = await results.json();
    setSearchResults(data);
    setLoading(false);
  };

  return (
    <div>
      <SearchRepository onSearch={handleSearch} loading={loading} />
      <RepoStatusPanel 
        results={searchResults} 
        onSelect={setSelectedRepo}
        query={searchQuery}
      />
      <DisplayArticle repo={selectedRepo} />
    </div>
  );
}
```

```tsx
// SearchRepository.tsx
interface Props {
  onSearch: (user: string, repo: string) => void;
  loading: boolean;
}

export default function SearchRepository({ onSearch, loading }: Props) {
  const [user, setUser] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(user, repo);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* inputs */}
      <button disabled={loading}>Search</button>
    </form>
  );
}
```

### Pros
✅ Simple and explicit data flow  
✅ Easy to debug and understand  
✅ No additional libraries needed  
✅ Type-safe with TypeScript  
✅ Best for components in the same tree/page  

### Cons
❌ Props drilling if components are deeply nested  
❌ Parent component grows larger with state logic  

### When to Use
- Components are on the same page (siblings or close relatives)
- State is only needed by a specific feature/page
- Simple to moderate complexity

---

## Solution 2: React Context API

### Description
Create a Context Provider that wraps components and provides shared state via `useContext` hook.

### Implementation

```tsx
// app/search/SearchContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: { user: string; repo: string };
  searchResults: any[];
  selectedRepo: any;
  loading: boolean;
  setSearchQuery: (query: { user: string; repo: string }) => void;
  setSearchResults: (results: any[]) => void;
  setSelectedRepo: (repo: any) => void;
  performSearch: (user: string, repo: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState({ user: '', repo: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);

  const performSearch = async (user: string, repo: string) => {
    setLoading(true);
    setSearchQuery({ user, repo });
    const response = await fetch(`/api/search?user=${user}&repo=${repo}`);
    const data = await response.json();
    setSearchResults(data);
    setLoading(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        selectedRepo,
        loading,
        setSearchQuery,
        setSearchResults,
        setSelectedRepo,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
```

```tsx
// page.tsx
export default function Page() {
  return (
    <SearchProvider>
      <SearchRepository />
      <RepoStatusPanel />
      <DisplayArticle />
    </SearchProvider>
  );
}
```

```tsx
// SearchRepository.tsx
import { useSearch } from './SearchContext';

export default function SearchRepository() {
  const { performSearch, loading } = useSearch();
  const [user, setUser] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(user, repo);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Pros
✅ No props drilling  
✅ Clean component APIs  
✅ Easy to add new consumers  
✅ Good for deeply nested components  
✅ Keeps related logic together  

### Cons
❌ More boilerplate code  
❌ Can cause unnecessary re-renders if not optimized  
❌ Harder to track data flow  
❌ Overkill for simple cases  

### When to Use
- State needed by many deeply nested components
- Want to avoid props drilling
- State is feature-specific but used across multiple levels
- Medium to high complexity

---

## Solution 3: URL State (Search Params)

### Description
Store search state in the URL query parameters, making searches shareable and bookmarkable.

### Implementation

```tsx
// SearchRepository.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchRepository() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(searchParams.get('user') || '');
  const [repo, setRepo] = useState(searchParams.get('repo') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    router.push(`/search?user=${user}&repo=${repo}`);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

```tsx
// RepoStatusPanel.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RepoStatusPanel() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  const repo = searchParams.get('repo');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (user && repo) {
      // Fetch results based on URL params
      fetch(`/api/search?user=${user}&repo=${repo}`)
        .then(res => res.json())
        .then(setResults);
    }
  }, [user, repo]);

  return <div>{/* Display results */}</div>;
}
```

### Pros
✅ Shareable/bookmarkable URLs  
✅ Browser back/forward works automatically  
✅ Server-side rendering friendly  
✅ No prop drilling  
✅ Persists across page refreshes  

### Cons
❌ Limited to serializable data (strings, numbers)  
❌ Exposed in URL (not suitable for sensitive data)  
❌ Requires URL encoding/decoding  

### When to Use
- Search results should be shareable
- Users need to bookmark searches
- SEO is important
- Building a public search interface

---

## Solution 4: State Management Library (Zustand/Redux)

### Description
Use a global state management library for complex state needs.

### Implementation (Zustand)

```tsx
// store/searchStore.ts
import { create } from 'zustand';

interface SearchState {
  searchQuery: { user: string; repo: string };
  searchResults: any[];
  selectedRepo: any;
  loading: boolean;
  setSearchQuery: (query: { user: string; repo: string }) => void;
  setSearchResults: (results: any[]) => void;
  setSelectedRepo: (repo: any) => void;
  performSearch: (user: string, repo: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: { user: '', repo: '' },
  searchResults: [],
  selectedRepo: null,
  loading: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  performSearch: async (user, repo) => {
    set({ loading: true, searchQuery: { user, repo } });
    const response = await fetch(`/api/search?user=${user}&repo=${repo}`);
    const data = await response.json();
    set({ searchResults: data, loading: false });
  },
}));
```

```tsx
// Any component
import { useSearchStore } from '@/store/searchStore';

export default function SearchRepository() {
  const { performSearch, loading } = useSearchStore();
  // Use directly, no providers needed
}
```

### Pros
✅ Global state accessible anywhere  
✅ Excellent developer tools  
✅ Built-in optimization  
✅ Middleware support (logging, persistence)  
✅ No provider boilerplate (Zustand)  

### Cons
❌ Additional dependency  
❌ Learning curve  
❌ Can be overkill for simple apps  
❌ Global state can lead to tight coupling  

### When to Use
- Multiple unrelated features need the same data
- Complex state interactions
- Need advanced features (time-travel debugging, persistence)
- Large application with many state consumers

---

## Comparison Table

| Approach | Complexity | Best For | Sharing Range | Type Safety | Performance |
|----------|-----------|----------|---------------|-------------|-------------|
| **Lifting State Up** | ⭐ Low | Same page components | Page-level | ✅ Excellent | ✅ Best |
| **Context API** | ⭐⭐ Medium | Feature modules | App section | ✅ Good | ⚠️ Good (with optimization) |
| **URL State** | ⭐⭐ Medium | Search/filters | Global (via URL) | ⚠️ Strings only | ✅ Good |
| **Zustand/Redux** | ⭐⭐⭐ High | Complex apps | Global | ✅ Excellent | ✅ Excellent |

---

## Recommendation for TLG Search Feature

### Primary: **Lifting State Up** ⭐

Use this as your starting point because:
1. All components are on the same page (`/search`)
2. State is only needed for search feature
3. Simple and maintainable
4. Easy to refactor later if needed

### Optional Enhancement: **URL State**

Consider adding URL params for:
- Shareable search results
- Better user experience (back button works)
- Direct links to specific searches

### Implementation Plan

```tsx
// Phase 1: Lift state up in page.tsx
export default function Page() {
  const [results, setResults] = useState([]);
  // Pass as props
}

// Phase 2 (Optional): Add URL params
router.push(`/search?user=${user}&repo=${repo}`);
```

---

## Code Example: Recommended Implementation

```tsx
// app/search/page.tsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchRepository from './SearchRepository';
import RepoStatusPanel from './RepoStatusPanel';
import DisplayArticle from './DisplayArticle';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (user: string, repo: string) => {
    setLoading(true);
    setError('');
    
    // Optional: Update URL
    router.push(`/search?user=${user}&repo=${repo}`);
    
    try {
      const response = await fetch(`/api/search?user=${user}&repo=${repo}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchRepository 
        onSearch={handleSearch} 
        loading={loading}
        error={error}
      />
      <RepoStatusPanel 
        results={searchResults}
        loading={loading}
        onSelectRepo={setSelectedRepo}
      />
      <DisplayArticle repo={selectedRepo} />
    </div>
  );
}
```

---

## Additional Resources

- [React Docs: Lifting State Up](https://react.dev/learn/sharing-state-between-components)
- [Next.js: useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

## Decision Guide

**Start with Lifting State Up if:**
- ✅ Components are on the same page
- ✅ Simple parent-child or sibling relationships
- ✅ State is feature-specific

**Use Context if:**
- ✅ Many nested components need the data
- ✅ Want to avoid props drilling
- ✅ State is feature-specific but deeply nested

**Use URL State if:**
- ✅ Need shareable/bookmarkable results
- ✅ Search/filter functionality
- ✅ SEO is important

**Use State Library if:**
- ✅ Multiple features share complex state
- ✅ Need advanced features (devtools, middleware)
- ✅ Large application

---

## Conclusion

For the TLG search feature, **start with Lifting State Up** in `page.tsx`. It's the simplest, most maintainable solution for your use case. You can always refactor to Context or URL state later if requirements change.

The key principle: **Use the simplest solution that meets your needs.** Don't over-engineer early.
