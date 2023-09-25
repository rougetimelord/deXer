import * as helpers from '/scripts/helpers/index.js'

let theme, iconPath;

/**
 * Replaces the page title
 */
const titleRepl = async () =>{
    let title = document.title.replace(
        /(X$)|((?<=on )X(?=: "))/,
        "Twitter");
    document.title = title
}

/**
 * Replaces the tab icon
 */
const iconRepl = async () => {
    document.head.removeChild(document.querySelector("link[rel~='icon']"))
    let fav = document.createElement("link");
    fav.rel = "favicon";
    fav.href = browserRuntime.runtime.getURL(`${iconPath}.png`);
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

export const main = async () => {
    //Watch the head for changes
    helpers.mutation.watchElement(
        document.head, titleRepl
    );

    //Wait for logo SVG elements to exist
    helpers.mutation.waitForElement(
        "a[href~='/i/verified-choose']>div>div>svg, a[href~='/home']>div>svg",
        logoRepl,
        document.querySelector("nav[role='navigation']")
    );

    //Get theme and run initial replacements
    helpers.runtime.themeGetter({
        theme: 1
    }).then(themeRes =>{
        theme = themeRes,
        iconPath = `/assets/logo${theme}`;
    }).then(async () => {
        Promise.all([
            titleRepl(),
            iconRepl()
        ]).then(() => {
            console.info(`First replacement done!`)
        })
    });

    //Watch for theme changes, and rerun replacements
    helpers.runtime.storageListener(
        async themeChange => {
            theme = themeChange,
            iconPath = `/assets/logo${theme}`;
            Promise.all([
                logoRepl(),
                iconRepl()
            ]).then(() => {
                console.info(`Updated to theme: ${theme}`)
            })
    });
}