import {defineManifest} from '@crxjs/vite-plugin';

export default defineManifest({
    name: 'deXer',
    description: '__MSG_extensionDescription__',
    version: '0.13.0',
    author: 'r0uge',
    manifest_version: 3,
    default_locale: 'en',
    icons: {
        48: 'icons/icon.png',
        96: 'icons/icon@2.png',
    },
    browser_specific_settings: {
        gecko: {
            id: 'deXer@r0uge.org',
        },
    },
    web_accessible_resources: [
        {
            resources: ['assets/*.png', 'src/utils/historyOverwrite.js'],
            matches: ['*://twitter.com/*', '*://x.com/*'],
        },
    ],
    content_scripts: [
        {
            matches: ['*://twitter.com/*', '*://x.com/*'],
            js: ['./src/content.js'],
            run_at: 'document_start',
        },
    ],
    action: {
        default_popup: 'src/popup/index.html',
    },
    permissions: ['storage'],
});
