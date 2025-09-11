import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `Pitchchat - ${title}`;
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}