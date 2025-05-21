/**
 * Themes Config
 */
export const THEME_DEFINITIONS = [
  { dir: 'alaska', name: 'Alaska', code: 'as' },
  { dir: 'alaska-classic', name: 'Alaska Classic', code: 'asc' },
  { dir: 'auro-1', name: 'Auro 1', code: 'a1' },
  { dir: 'auro-2', name: 'Auro 2', code: 'a2' },
  { dir: 'hawaiian', name: 'Hawaiian', code: 'ha' }
];

/**
 * Helper functions
 */
export const getThemeByCode = (code) => 
  THEME_DEFINITIONS.find(theme => theme.code === code);

export const getThemeByDir = (dir) => 
  THEME_DEFINITIONS.find(theme => theme.dir === dir);

export const getThemeAttribute = (code) => 
  `data-aag-theme="aag-theme-${code}"`;
