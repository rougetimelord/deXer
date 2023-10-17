import * as helpers from './helpers/index.js'

/**
 * Replaces the word "post" in notifications as they load in
 * 
 * @type {import('./helpers/mutation.js').ExtendedMutationCallBack}
 */
const newNotifications = async (mutations, observer, target, options) => {
    observer.disconnect()
    mutations.forEach(async mutation => {
        mutation.addedNodes.forEach(
            async node => {
                node.querySelectorAll("div>span>span").forEach(
                    async text => {
                        text.replaceText(/post/i, helpers.notificationTweet);
                    }
                )
            });
    });
    observer.observe(target, options);
    console.debug("[Dexer] notification text(s) changed")
}

/**
 * Starts watching the notification page
 */
export const notifications = async () => {
    let abort;
    helpers.mutation.waitForElement(
        "div[tabindex='0']>div>section>div",
        async es => {
            const timeline = es[0];
            //Replace first batch of notifications
            timeline.querySelectorAll("div>span>span").forEach(
                text => {
                    text.replaceText(/post/i, helpers.notificationTweet);
                }
            )
            abort = helpers.mutation.watchElement(timeline, newNotifications, {childList: true, subtree: true});
        }
    );
}

/**
 * Starts watching the home timeline
 */
export const home = async () => {
    return helpers.mutation.waitForElement(
        "span[data-testid='socialContext']",
        async es => {
            es.forEach(async element => {
                if(!element.classList.contains('dxd')){
                    element.replaceText(/post/i, "tweet");
                    element.classList.add('dxd');
                }
            });
        }, {once: false}
    );
}

export const profile = async () => {
    return helpers.mutation.waitForElement(
        `a[href='/${window.location.pathname.split("/")[1]}'][role='tab']>div>div>span`, async (es, obs) => {
            if(!es[0].classList.contains("dxd")){
                es[0].innerText = "Tweets";
                es[0].classList.add("dxd");
                console.debug("[Dexer] replaced posts text on profile")
            }
        }, {target: document.getElementsByTagName("main")[0], once: false});
}