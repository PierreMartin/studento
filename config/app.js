export const isProduction = process.env.NODE_ENV === 'production';
export const isDebug = process.env.NODE_ENV === 'development';
export const isClient = typeof window !== 'undefined';
export const apiEndpoint = isDebug ? 'http://localhost:3000' : 'https://hubnote.app';

// url images:
export const pathImage = isDebug ? '/uploads/' : (process.env.URL_IMAGES || 'https://s3.eu-west-3.amazonaws.com/studento/');

// Replace with 'UA-########-#' or similar to enable tracking
export const trackingID = null;
