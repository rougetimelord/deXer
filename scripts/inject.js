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
    fav.rel = "icon";
    fav.href = helpers.runtime.url(`${iconPath}.png`);
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
    }).then(() => {
        console.info("First replacement done!");
    });

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
            ]).then(() => {
                console.info(`Updated to theme: ${theme}`)
            })
    }, "theme");
}