import { ENV, URL_IMAGES } from './env';

export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';

export const apiEndpoint = isDebug ? 'http://localhost:3000' : 'https://shielded-headland-62294.herokuapp.com';

// url images:
export const pathImage = isDebug ? '/uploads' : URL_IMAGES;

// Replace with 'UA-########-#' or similar to enable tracking
export const trackingID = null;
