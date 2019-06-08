import androidFavicon from '../../images_favicon/android-icon-192x192.png';
import apple57Favicon from '../../images_favicon/apple-icon-57x57.png';
import apple60Favicon from '../../images_favicon/apple-icon-60x60.png';
import apple72Favicon from '../../images_favicon/apple-icon-72x72.png';
import apple76Favicon from '../../images_favicon/apple-icon-76x76.png';
import apple114Favicon from '../../images_favicon/apple-icon-114x114.png';
import apple120Favicon from '../../images_favicon/apple-icon-120x120.png';
import apple144Favicon from '../../images_favicon/apple-icon-144x144.png';
import apple152Favicon from '../../images_favicon/apple-icon-152x152.png';
import apple180Favicon from '../../images_favicon/apple-icon-180x180.png';
import favicon16 from '../../images_favicon/favicon-16x16.png';
import favicon32 from '../../images_favicon/favicon-32x32.png';
import favicon96 from '../../images_favicon/favicon-96x96.png';
import ms144Favicon from '../../images_favicon/ms-icon-144x144.png';

const metaAssets = () => {
  return [
    { charset: 'utf-8' },
    { name: 'description', content: 'Hubnote' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=yes' },
    { name: 'msapplication-tap-highlight', content: 'no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'apple-mobile-web-app-title', content: 'HubNote' }
  ];
};

const linkAssets = () => {
  const links = [
		// Favicon:
		{ name: 'theme-color', content: '#dc3957' },
		{ name: 'msapplication-TileImage', content: ms144Favicon },
		{ name: 'msapplication-TileColor', content: '#dc3957' },
		{ rel: 'apple-touch-icon', sizes: '57x57', href: apple57Favicon },
		{ rel: 'apple-touch-icon', sizes: '60x60', href: apple60Favicon },
		{ rel: 'apple-touch-icon', sizes: '72x72', href: apple72Favicon },
		{ rel: 'apple-touch-icon', sizes: '76x76', href: apple76Favicon },
		{ rel: 'apple-touch-icon', sizes: '114x114', href: apple114Favicon },
		{ rel: 'apple-touch-icon', sizes: '120x120', href: apple120Favicon },
		{ rel: 'apple-touch-icon', sizes: '144x144', href: apple144Favicon },
		{ rel: 'apple-touch-icon', sizes: '152x152', href: apple152Favicon },
		{ rel: 'apple-touch-icon', sizes: '180x180', href: apple180Favicon },
		{ rel: 'icon', type: 'image/png', sizes: '192x192', href: androidFavicon },
		{ rel: 'icon', type: 'image/png', sizes: '32x32', href: favicon32 },
		{ rel: 'icon', type: 'image/png', sizes: '96x96', href: favicon96 },
		{ rel: 'icon', type: 'image/png', sizes: '16x16', href: favicon16 },

		// CCS:
    { rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css' }
  ];

  return links;
};

export const title = 'HubNote';
export const meta = metaAssets();
export const link = linkAssets();
