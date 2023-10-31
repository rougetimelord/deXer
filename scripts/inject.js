import * as helpers from './helpers/index.js'
import * as pages from './pages.js'

let theme = 1, /**@type {MutationObserver[]}*/ observers = [];

//Watch for theme changes, and rerun replacements
helpers.runtime.storageListener(
    async newTheme => {
        theme = newTheme;
        Promise.all([logoReplace(), iconReplace()]).then(() => {
            console.debug(`[Dexer] updated to theme: ${theme}`);
        }).catch(err => {console.error(`[Dexer] error in theme update:`, err)});
});

/**
 * Replaces the page title
 * 
 * @type {import('./helpers/mutation').ExtendedMutationCallBack}
 * @param {HTMLElement} target
 */
const titleReplace = async (_, __, target) => {
    if(target.innerText.match(/X$/)){
        target.replaceText(/X$/, "Twitter")
        console.debug("[Dexer] changed title")
    }
}

/**
 * Replaces the tab icon
 */
const iconReplace = async () => {
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
const logoReplace = async () => {
    helpers.mutation.resolveOnElement("a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg").then(() => {
        document.querySelector("a[href~='/home']>div>svg").innerHTML = helpers.logos[theme];
        document.querySelector("a[href~='/i/verified-choose']>div>div>svg").innerHTML = helpers.logos[(theme != 3) ? 2 : 3];
        console.debug("[Dexer] logos replaced");
    }).catch(err => console.error(`[Dexer] error in logoReplace`, err))
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
    helpers.mutation.resolveOnElement("#layers")
    .then(es => helpers.mutation.waitForElement(
        "div[data-testid~='Dropdown']>div>div:nth-child(2)>div>span",
        interceptRetweetMenu, {target: es[0], once:false}
    ));
}

/**
 * Fires functions that depend on what the current page is
 * 
 * @param {PopStateEvent | PushStateEvent} event
 */
const locationHandler = async event => {
    const state = (event.state != undefined) ? event.state : (event.detail != undefined) ? event.detail.state : undefined;
    if(state !== undefined && "state" in state && state.state.previousPath == "/i/communitynotes"){
        logoReplace().then(() => console.debug("[Dexer] left community notes, logo replaced"))
    }

    let location = window.location.pathname;
    while(state !== undefined && "state" in state && location == state.state.previousPath){
        //This sucks!! :( don't know any better ways though
        await helpers.delay(5);
        location = window.location.pathname;
    }
    observers.forEach(obs => obs.disconnect())
    observers = [];

    if(location.match(/(\/i\/timeline)|(\/status\/)/)){
        helpers.mutation.resolveOnElement("h2>span")
        .then(es => es[0].replaceText("Post", "Tweet"))
        .then(() => console.debug("[Dexer] Header text updated"))
    }

    if(location.match(/\/notifications/)){
        pages.notifications().then(ob => {observers.push(ob); console.debug("[Dexer] Notifications observer attached")});
        return;
    }

    const links = /(\/explore)|(\/compose\/)|(\/messages)|(\/lists)|(\/i\/)|(\/status\/)/;
    if(!location.match(links)){
        pages.profile().then(ob => {observers.push(ob); console.debug("[Dexer] Profile observer attached")})
    }

    if (location.match(/\/home|\/i\/timeline/) || !location.match(links)){
        pages.timeline().then(ob => {observers.push(ob); console.debug("[Dexer] Timeline observer attached")});
        if (location.match(/\/home/)) {
            helpers.mutation.resolveOnElement("div[data-testid='tweetButtonInline']").then(es => es[0].replaceText("Post", "Tweet"));
        }
        return;
    }
}

/**
 * Main function
 */
export const main = async () => {
    //Add copy event listener
    helpers.clipboard();
    // //Replace placeholder logo
    helpers.mutation.resolveOnElement("#placeholder>svg").then(es => es[0].innerHTML = helpers.logos[2]);
    //Get theme and run initial replacements
    helpers.runtime.themeGetter().then(res => {theme = res.theme})
    .then(() => Promise.all([logoReplace(), iconReplace()]))
    .then(() => console.debug("[Dexer] first logo and icon replacement executed"))
    .catch(err => {console.error(`[Dexer] error in main:`, err)});
    //Fire location specific stuff, then add listeners
    locationHandler({}).then(() => {
        window.addEventListener("pushstate", locationHandler, {passive: true});
        window.addEventListener("popstate", locationHandler, {passive: true});
    });
    //Start hunting for retweet dropdowns
    retweetMenuStart();
    //Add title element and watch it
    const createTitle = async () => document.createElement("title")
    createTitle().then(e => {
        e.innerText = "Twitter";
        document.head.append(e);
        helpers.mutation.watchElement(e, titleReplace);
    });
}