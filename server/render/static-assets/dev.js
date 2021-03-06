const createAnalyticsSnippet = id =>
	`<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', '${id}', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>`;

const createAppScript = () => '<script async type="text/javascript" charset="utf-8" src="/assets/app.js"></script>';
const createTrackingScript = () => process.env.GOOGLE_ANALYTICS_ID ? createAnalyticsSnippet(process.env.GOOGLE_ANALYTICS_ID) : '';

const createStylesheets = () => `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Condensed" />
<link rel="stylesheet" href="/css/main.css" />
<link rel="stylesheet" href="/css/media-queries.css" />
<link rel="stylesheet" href="/css/codeMirror.css" />
<link rel="stylesheet" href="/css/emoji-mart.css" />
`;

export { createAppScript, createTrackingScript, createStylesheets };

