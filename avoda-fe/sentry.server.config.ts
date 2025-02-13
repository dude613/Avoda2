import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://854ee7ab9cbe570d0564d6f9cc4be7b9@o4508813244366848.ingest.us.sentry.io/4508813245743104",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
