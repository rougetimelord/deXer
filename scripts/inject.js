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
            console.info(`Updated to theme: ${theme}`);
        }).catch(err => {console.error(`Error in theme update: ${err}`)});
}, "theme");

/**
 * Replaces the page title
 */
const titleRepl = async () =>{
    document.title = document.title.replace(
        /(X$)|((?<=on )X(?=: "))/,
        "Twitter");
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
    accentLogo.innerHTML = helpers.logos[
        (theme != 3) ? 2 : 3
    ];
}

/**
 * Intercepts the dropdown menu
 * 
 * @param {NodeListOf<Element>} e
 */
const interceptRetweetMenu = async e => {
    const retweet = e[0];
    if(!retweet.classList.contains("dxd")){
        retweet.innerText = retweet.innerText.replace("post", "tweet");
        retweet.classList.add("dxd")
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
        )
    });
}

/**
 * Event handler for events that change the location
 * 
 * @param {PopStateEvent | PushStateEvent} event 
 */
const locationChange = async event => {
    const links = [/\/home/, /\/explore/, /\/notifications/, /\/compose\/tweet/, /\/messages/, /\/lists/, /\/*\/communities/, /\/i\//, /\/settings\/*/];
    const location = window.location.pathname;
    if(event.state.state.previousPath == "/i/communitynotes"){
        return logoRepl();
    }
}

/**
 * Main function
 */
export const main = async () => {
    //Add copy event listener
    helpers.clipboard();
    //Replace placeholder logo
    document.querySelector("#placeholder>svg").innerHTML = helpers.logos["2"];
    //Get theme and run initial replacements
    helpers.runtime.themeGetter({
        "theme": 1
    }).then(res => {
        theme = res.theme;
    }).then(() =>{//Wait for logo SVG elements to exist
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg", logoRepl, document.getElementById("react-root")
        );
        iconRepl();
    }).finally(() => {
        console.info("First replacement done!");
    }).catch(err => {console.error(`Error: ${err}`)});
    //Go hunt repost menus
    retweetMenuStart();
    //Watch the head for changes
    helpers.mutation.watchElement(
        document.head, titleRepl
    );
    //Add location change listeners
    window.addEventListener("pushstate", locationChange, {passive: true});
    window.addEventListener("popstate", locationChange, {passive: true});
}