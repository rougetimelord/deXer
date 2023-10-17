import * as helpers from './helpers/index.js'
import * as pages from './pages.js'

let theme, observers = {};

//Watch for theme changes, and rerun replacements
helpers.runtime.storageListener(
    async newTheme => {
        theme = newTheme;
        Promise.all([
            logoRepl(),
            iconRepl()
        ]).finally(() => {
            console.debug(`[Dexer] updated to theme: ${theme}`);
        }).catch(err => {console.error(`[Dexer] error in theme update:`, err)});
});

/**
 * Replaces the page title
 * 
 * @type {import('./helpers/mutation').ExtendedMutationCallBack}
 * @param {HTMLElement} target
 */
const titleRepl = async (...[,,target]) =>{
    if(target.innerText.match(/X$/)){
        target.replaceText(/X$/, "Twitter")
        console.debug("[Dexer] changed title")
    }
}

/**
 * Replaces the tab icon
 */
const iconRepl = async () => {
    document.head.removeChild(document.querySelector("link[rel~='icon']"));
    let fav = document.createElement("link");
    fav.rel = "icon";
    fav.href = helpers.runtime.url(`/assets/logo${theme}.png`);
    fav.type = "image/png";
    document.head.appendChild(fav);
    console.debug("[Dexer] icon replaced");
}

/**
 * Replaces logos on page
 */
const logoRepl = async () => {
    document.querySelector("a[href~='/home']>div>svg").innerHTML = helpers.logos[theme]
    document.querySelector("a[href~='/i/verified-choose']>div>div>svg").innerHTML = helpers.logos[(theme != 3) ? 2 : 3];
    console.debug("[Dexer] logos replaced")
}

/**
 * Intercepts the dropdown menu
 * 
 * @param {NodeListOf<HTMLElement>} es
 */
const interceptRetweetMenu = async es => {
    if(!es[0].classList.contains("dxd")){
        es[0].replaceText(/post/i, "tweet");
        es[0].classList.add("dxd");
        console.debug("[Dexer] retweet popup replaced")
    }
}

/**
 * Starts the process of hooking repost menus
 * 
 */
const retweetMenuStart = async () => {
     helpers.mutation.waitForElement("#layers", async es => {
        observers.retweetMenu = await helpers.mutation.waitForElement(
            "div[data-testid~='Dropdown']>div>div:nth-child(2)>div>span",
            interceptRetweetMenu, es[0], false
        )
    });
}

/**
 * Fires functions that depend on what the current page is
 * 
 * @param {PopStateEvent | PushStateEvent} event
 */
const locationHandler = async event => {
    const state = (event.state != undefined) ? event.state : (event.detail != undefined) ? event.detail.state : undefined;

    if(!!state && state.state.previousPath == "/i/communitynotes"){
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg", logoRepl, document.getElementById("react-root")
        );
        console.debug("[Dexer] left community notes, logo replaced")
    }

    let location = window.location.pathname;
    while(!!state && location == state.state.previousPath){
        //This sucks!! :( don't know any better ways though
        await helpers.delay(5);
        location = window.location.pathname;
    }

    if(location.match(/\/notifications/)){
        observers.notifications = await pages.notifications();
    } else if ("notifications" in observers) {
        observers.notifications.abort();
        delete observers.notifications;
    }
    
    if (location.match(/\/home/)){
        observers.home = await pages.home();
    } else if ("home" in observers) {
        observers.home.abort();
        delete observers.home;
    }

    const links = /(\/explore)|(\/compose\/)|(\/messages)|(\/lists)|(\/\w+\/(?!with_replies|highlights|media|likes))/;
    if(!location.match(links)){
        observers.profile = await pages.profile();
    } else if ("profile" in observers) {
        observers.profile.abort()
        delete observers.profile;
    }
}

/**
 * Main function
 */
export const main = async () => {
    //Add copy event listener
    helpers.clipboard();
    // //Replace placeholder logo
    helpers.mutation.waitForElement("#placeholder>svg",
        /**
         * @param {NodeListOf<Element>} es 
         */
        es => {
            es[0].innerHTML = helpers.logos[2];
    })
    //Get theme and run initial replacements
    helpers.runtime.themeGetter().then(res => {
        theme = res.theme;
    }).then(() =>{
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg", logoRepl, (!!document.getElementById("react-root")) ? document.getElementById("react-root") : document
        );
        iconRepl();
    }).finally(() => {
        console.debug("[Dexer] first logo and icon replacement executed");
    }).catch(err => {console.error(`[Dexer] error in main:`, err)});
    locationHandler({});
    //Start hunting for retweet dropdowns
    retweetMenuStart();
    //Add title element and watch it
    let e = document.createElement("title");
    e.innerText = "Twitter";
    document.head.append(e)
    observers.title = await helpers.mutation.watchElement(
        e, titleRepl
    )
    //Add location change listeners
    window.addEventListener("pushstate", locationHandler, {passive: true});
    window.addEventListener("popstate", locationHandler, {passive: true});
}