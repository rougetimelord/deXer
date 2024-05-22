import * as utils from './utils/index.js';

/**
 * Replaces the word "post" in notifications as they load in
 * @type {import('./utils/mutation.js').ExtendedMutationCallBack}
 */
const newNotifications = async (mutations, observer, target, options) => {
    observer.disconnect();
    mutations.forEach(async mutation => {
        mutation.addedNodes.forEach(async node => {
            node.querySelectorAll('div>span>span').forEach(async text => {
                text.replaceText(/post/i, utils.notificationTweet);
            });
        });
    });
    observer.observe(target, options);
    console.debug('[deXer] notification text(s) changed');
};

/**
 * Starts watching the notification page
 * @returns {Promise<MutationObserver>}
 */
export const notifications = async () => {
    return utils.mutation
        .resolveOnElement("div[tabindex='0']>div>section>div")
        .then(es => es[0])
        .then(timeline => {
            timeline
                .querySelectorAll('div>span>span')
                .forEach(e => e.replaceText(/post/i, utils.notificationTweet));
            return utils.mutation.watchElement(timeline, newNotifications, {
                childList: true,
                subtree: true,
            });
        });
};

/**
 * Starts watching the home timeline
 * @returns {Promise<MutationObserver>}
 */
export const timeline = async () => {
    let orig,
        showPosts = await utils.mutation.waitForElement(
            "div[role='button']>div>div:nth-child(1)>span",
            async es => {
                if (!es[0].classList.contains('dxd')) {
                    es[0].replaceText(/post/i, 'tweet');
                    es[0].classList.add('dxd');
                    console.debug('[deXer] Changed show more posts ribbon');
                }
            },
            {once: false, target: document},
        );
    return utils.mutation
        .waitForElement(
            "span[data-testid='socialContext']",
            async es => {
                es.forEach(async element => {
                    if (!element.classList.contains('dxd')) {
                        element.replaceText(/post/i, 'tweet');
                        element.classList.add('dxd');
                        console.debug('[deXer] Changed social context text');
                    }
                });
            },
            {once: false},
        )
        .then(obs => {
            orig = obs.disconnect;
            obs.disconnect = () => {
                showPosts.disconnect();
                orig();
            };
            return obs;
        });
};

/**
 * Starts watching the ribbon on profiles
 * @returns {Promise<MutationObserver>}
 */
export const profile = async () => {
    return utils.mutation.waitForElement(
        `a[href='/${
            window.location.pathname.split('/')[1]
        }'][role='tab']>div>div>span`,
        async (es, obs) => {
            if (!es[0].classList.contains('dxd')) {
                es[0].replaceText(/Post/, 'Tweet');
                es[0].classList.add('dxd');
                console.debug('[deXer] replaced posts text on profile');
            }
        },
        {once: false},
    );
};
