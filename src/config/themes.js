/**
 * Themes Config
 */

export const THEME_DIRECTORIES = [
  { dir: 'alaska', name: 'Alaska', code: 'as' },
  { dir: 'alaska-classic', name: 'Alaska Classic', code: 'asc' },
  { dir: 'hawaiian', name: 'Hawaiian', code: 'ha' }
];

/**
 * Helper functions
 */
export const getThemeByCode = (code) => 
  THEME_DIRECTORIES.find(theme => theme.code === code);

export const getThemeByDir = (dir) => 
  THEME_DIRECTORIES.find(theme => theme.dir === dir);

export const getThemeAttribute = (code) => 
  `data-aag-theme="aag-theme-${code}"`;
