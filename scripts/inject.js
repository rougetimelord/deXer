import * as helpers from '/scripts/helpers/index.js'

let theme, iconPath;

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
    fav.href = helpers.runtime.url(`${iconPath}.png`);
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
 * Main function
 */
export const main = async () => {
    //Add copy event listener
    helpers.clipboard.intercept();
    //Replace placeholder logo
    document.querySelector("#placeholder>svg").innerHTML = helpers.logos["2"];
    //Get theme and run initial replacements
    helpers.runtime.themeGetter({
        "theme": 1
    }).then(res => {
        theme = res.theme;
        iconPath = `/assets/logo${theme}`;
    }).then(() =>{//Wait for logo SVG elements to exist
        helpers.mutation.waitForElement(
            "a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg", logoRepl, document.getElementById("react-root")
        );
        iconRepl();
    }).finally(() => {
        console.info("First replacement done!");
    }).catch(err => {console.error(`Error: ${err}`)});

    //Watch the head for changes
    helpers.mutation.watchElement(
        document.head, titleRepl
    );

    //Watch for theme changes, and rerun replacements
    helpers.runtime.storageListener(
        async themeChange => {
            theme = themeChange,
            iconPath = `/assets/logo${theme}`;
            Promise.all([
                logoRepl(),
                iconRepl()
            ]).finally(() => {
                console.info(`Updated to theme: ${theme}`);
            }).catch(err => {console.error(`Error in theme update: ${err}`)});
    }, "theme");
}