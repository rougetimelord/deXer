import {i18nGetter, url} from './runtime.js';

//Overwrite history.pushState
const script = document.createElement('script');
script.src = url('src/utils/historyOverwrite.js');
script.id = 'dex';
document.head.insertBefore(script, document.head.firstChild);

export const blueBlockerInstalled = !!document.getElementById(
    'injected-blue-block-xhr',
);

export const notificationTweet = i18nGetter('notificationTweet');

/**
 * Asynchronous delay function
 * @param {number} ms
 * @returns A promise that resolves after a `ms` wait
 */
export const delay = async ms =>
    new Promise(res => {
        setTimeout(res, ms);
    });

/**
 * @type {Object} logos
 * @type {string} logos.1 Blue logo svg
 * @type {string} logos.2 Black logo svg
 * @type {string} logos.3 White logo svg
 */
export const logos = {
    1: `<style type="text/css">#dl1{fill:#1D9BF0;}</style><g id="dl1" transform="matrix(.097502 0 0 .097502 -.097501 2.1032)"><path d="m221.95 51.29c0.15 2.17 0.15 4.34 0.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-0.04c-27.44 0.04-54.31-7.82-77.41-22.64 3.99 0.48 8 0.72 12.02 0.73 22.74 0.02 44.83-7.61 62.72-21.66-21.61-0.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-0.87-23.56-4.76-40.51-25.46-40.51-49.5v-0.64c7.02 3.91 14.88 6.08 22.92 6.32-22.19-14.83-29.03-44.35-15.63-67.43 25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/></g>`,
    2: `<style type="text/css">#dl2{fill:#000000}</style><g id="dl2" transform="matrix(.097502 0 0 .097502 -.097501 2.1032)"><path d="m221.95 51.29c0.15 2.17 0.15 4.34 0.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-0.04c-27.44 0.04-54.31-7.82-77.41-22.64 3.99 0.48 8 0.72 12.02 0.73 22.74 0.02 44.83-7.61 62.72-21.66-21.61-0.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-0.87-23.56-4.76-40.51-25.46-40.51-49.5v-0.64c7.02 3.91 14.88 6.08 22.92 6.32-22.19-14.83-29.03-44.35-15.63-67.43 25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/></g>`,
    3: `<style type="text/css">#dl3{fill:#FFFFFF;}</style><g id="dl3" transform="matrix(.097502 0 0 .097502 -.097501 2.1032)"><path d="m221.95 51.29c0.15 2.17 0.15 4.34 0.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-0.04c-27.44 0.04-54.31-7.82-77.41-22.64 3.99 0.48 8 0.72 12.02 0.73 22.74 0.02 44.83-7.61 62.72-21.66-21.61-0.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-0.87-23.56-4.76-40.51-25.46-40.51-49.5v-0.64c7.02 3.91 14.88 6.08 22.92 6.32-22.19-14.83-29.03-44.35-15.63-67.43 25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/></g>`,
};

export * as runtime from './runtime.js';
export * as mutation from './mutation.js';
export {default as clipboard} from './clipboard.js';
