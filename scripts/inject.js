import * as helpers from '/scripts/helpers/index.js'

let theme;

//Watch for theme changes, and rerun replacements
helpers.runtime.storageListener(
    async themeChange => {
        theme = themeChange;
        Promise.all([
            logoRepl(),
            iconRepl()
        ]).finally(() => {
            console.debug(`[Dexer] updated to theme: ${theme}`);
        }).catch(err => {console.error(`[Dexer] error in theme update:`, err)});
}, "theme");

/**
 * Replaces the page title
 */
const titleRepl = async () =>{
    if(document.querySelector("title").innerText.match(/X$/)){
        document.title = document.title.replace(
        /X$/,"Twitter");
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
    let mainLogo = document.querySelector(
        "a[href~='/home']>div>svg"),
    accentLogo = document.querySelector(
        "a[href~='/i/verified-choose']>div>div>svg");
    mainLogo.innerHTML = helpers.logos[theme];
    accentLogo.innerHTML = helpers.logos[(theme != 3) ? 2 : 3];
    console.debug("[Dexer] logos replaced")
}

/**
 * Intercepts the dropdown menu
 * 
 * @param {NodeListOf<Element>} es
 */
const interceptRetweetMenu = async es => {
    if(!es[0].classList.contains("dxd")){
        es[0].innerText = es[0].innerText.replace("post", "tweet");
        es[0].classList.add("dxd");
        console.debug("[Dexer] retweet popup replaced")
    }
}

/**
 * Starts the process of hooking repost menus
 * 
 */
const retweetMenuStart = async () => {
    helpers.mutation.waitForElement("#layers", async e => {
        helpers.mutation.waitForElement(
            "div[data-testid~='Dropdown']>div>div:nth-child(2)>div>span",
            interceptRetweetMenu, e[0], false
        )
    });
}

let profileWatcher;
/**
 * Event handler for events that change the location
 * 
 * @param {PopStateEvent | PushStateEvent} event 
 */
const locationChange = async event => {
    const state = (event.state != undefined) ? event.state : (event.detail != undefined) ? event.detail.state : undefined;
    if(!!state && state.state.previousPath == "/i/communitynotes"){
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg", logoRepl, document.getElementById("react-root")
        );
        console.debug("[Dexer] left community notes, logo replaced")
        return;
    }

    const location = window.location.pathname;
    const links = /(\/home)|(\/explore)|(\/notifications)|(\/compose\/)|(\/messages)|(\/lists)|(\/\w+\/(?!with_replies|highlights|media|likes))/;
    if(location.match(links)){
        if(!!profileWatcher){
            profileWatcher.disconnect();
            profileWatcher = undefined;
        }
        return;
    }

    helpers.mutation.waitForElement(
        `a[href='/${window.location.pathname.split("/")[1]}'][role='tab']>div>div>span`, async (es, obs) => {
            profileWatcher = obs;
            if(!es[0].classList.contains("dxd")){
                es[0].innerText = "Tweets";
                es[0].classList.add("dxd");
                console.debug("[Dexer] replaced posts text on profile")
            }
        }, document.getElementsByTagName("main")[0], false);
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
    helpers.runtime.themeGetter({
        "theme": 1
    }).then(res => {
        theme = res.theme;
    }).then(() =>{
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg", logoRepl, document.getElementById("react-root")
        );
        iconRepl();
    }).finally(() => {
        console.debug("[Dexer] first logo and icon replacement done!");
    }).catch(err => {console.error(`[Dexer] error: err`, err)});
    //Start hunting for retweet dropdowns
    retweetMenuStart();
    //Add title element and watch it
    let e = document.createElement("title");
    e.innerText = "Twitter";
    document.head.append(e)
    helpers.mutation.watchElement(
        e, titleRepl
    )
    //Add location change listeners
    window.addEventListener("pushstate", locationChange, {passive: true});
    window.addEventListener("popstate", locationChange, {passive: true});
}
