/**
 * Settings Index
 * 
 * This file exports all settings from the various settings files.
 * Import this file to access all settings in one place.
 */

// Export all settings from each file
export * from './app';
export * from './api';
export * from './llm';
export * from './search';
export * from './prompts';

// Default export for convenience
export default {
  // App settings
  app: require('./app'),
  
  // API settings
  api: require('./api'),
  
  // LLM settings
  llm: require('./llm'),
  
  // Search settings
  search: require('./search'),
  
  // Prompt settings
  prompts: require('./prompts')
};
