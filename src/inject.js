import * as utils from "./utils/index.js";
import * as pages from "./pages.js";

let theme = 1,
  /**@type {MutationObserver[]}*/ observers = [];

//Watch for theme changes, and rerun replacements
utils.runtime.storageListener(async (newTheme) => {
  theme = newTheme;
  Promise.all([sidebarMods(), iconReplace()])
    .then(() => {
      console.debug(`[deXer] updated to theme: ${theme}`);
    })
    .catch((err) => {
      console.error(`[deXer] error in theme update:`, err);
    });
});

/**
 * Replaces the page title
 *
 * @type {import('./utils/mutation.js').ExtendedMutationCallBack}
 * @param {HTMLElement} target
 */
const titleReplace = async (_, __, target) => {
  if (target.innerText.match(/X$/)) {
    target.replaceText(/X$|(?=on )X/, "Twitter");
    console.debug("[deXer] changed title");
  }
};

/**
 * Replaces the tab icon
 */
const iconReplace = async () => {
  document.head.removeChild(document.querySelector("link[rel~='icon']"));
  let fav = document.createElement("link");
  fav.rel = "icon";
  fav.href = utils.runtime.url(`/assets/logo${theme}.png`);
  fav.type = "image/png";
  document.head.appendChild(fav);
  console.debug("[deXer] icon replaced");
};

/**
 * Replaces sidebar tweet button
 */
const sidebarButton = async () => {
  utils.mutation
    .resolveOnElement("a[href='/compose/tweet']", 1000)
    .then((es) => {
      es[0].deepestChild().replaceText(/Post/i, "Tweet");
      console.debug("[deXer] Sidebar button replaced");
    })
    .catch((err) => {
      if (err.message != "timeout") {
        console.error("[deXer] Error in sidebarButton:", err);
      }
    });
};

/**
 * Replaces logos on page
 */
const sidebarMods = async () => {
  utils.mutation
    .resolveOnElement("a[href~='/home']>div>svg")
    .then((es) => {
      es[0].innerHTML = utils.logos[theme];
      console.debug("[deXer] logos replaced");
    })
    .then(() =>
      utils.mutation.resolveOnElement(
        "a[href~='/i/grok'], a[href~='/i/verified-choose']",
      ),
    )
    .then((es) => {
      es[0].parentElement.removeChild(es[0]);
      es[1].parentElement.removeChild(es[1]);
      console.debug("[deXer] Grok and premeium removed");
    })
    .catch((err) => console.error(`[deXer] error in sidebarMods`, err));
};

/**
 * Intercepts the dropdown menu
 *
 * @param {NodeListOf<HTMLElement>} es
 */
const interceptRetweetMenu = async (es) => {
  if (!es[0].classList.contains("dxd")) {
    es[0].replaceText(/post/i, "tweet");
    es[0].classList.add("dxd");
    console.debug("[deXer] retweet popup replaced");
  }
};

/**
 * Starts the process of hooking repost menus
 *
 */
const retweetMenuStart = async () => {
  utils.mutation
    .resolveOnElement("#layers")
    .then((es) =>
      utils.mutation.waitForElement(
        "div[data-testid~='Dropdown']>div>div:nth-child(2)>div>span",
        interceptRetweetMenu,
        { target: es[0], once: false },
      ),
    );
};

/**
 * Replaces the text in tooltips
 */
const toolTip = async () => {
  utils.mutation.waitForElement(
    "div[role='tooltip']",
    (es) => {
      let e = es[0].deepestChild();
      if (!e.classList.contains("dxd")) {
        e.replaceText(/Post/i, "Tweet");
        e.classList.add("dxd");
      }
    },
    { once: false, target: document },
  );
};

/**
 * Fires functions that depend on what the current page is
 *
 * @param {PopStateEvent | PushStateEvent} event
 */
const locationHandler = async (event) => {
  const state =
    (event?.detail?.state || event?.state)?.state;
  let location = window.location.pathname;
  if (
    state?.previousPath.match("/i/communitynotes") ||
    state?.previousPath.match("/i/birdwatch")
  ) {
    Promise.all([sidebarMods(), sidebarButton()]).then(() =>
      console.debug("[deXer] Left community notes, sidebar rerun"),
    );
  }

  for (let tries = 0;
    tries < 10 &&
    location == state?.previousPath; tries++
  ) {
    //This sucks!! :( don't know any better ways though
    await utils.delay(5);
    location = window.location.pathname;
  }
  try {
    observers.forEach((obs) => obs?.disconnect());
  } catch {
  } finally {
    observers = [];
  }

  if (location.match(/(\/i\/timeline)|(\/status\/)/)) {
    utils.mutation
      .resolveOnElement("div:nth-child(2)>div>h2>span")
      .then((es) => {
        es[0].replaceText("Post", "Tweet");
      })
      .then(() => console.debug("[deXer] Header text updated"));
  }

  if (location.match(/^\/notifications/)) {
    pages.notifications().then((ob) => {
      observers.push(ob);
      console.debug("[deXer] Notifications observer attached");
    });
    return;
  }

  const links =
    /(\/explore)|(\/compose\/)|(\/messages)|(\/lists)|(\/i\/)|(\/status\/)|(\/home)/;
  if (!location.match(links)) {
    pages.profile().then((ob) => {
      observers.push(ob);
      console.debug("[deXer] Profile observer attached");
    });
  }

  if (location.match(/\/home$|\/i\/timeline/) || !location.match(links)) {
    pages.timeline().then((ob) => {
      observers.push(ob);
      console.debug("[deXer] Timeline observer attached");
    });
    if (location.match(/\/home/)) {
      utils.mutation
        .resolveOnElement("div[data-testid='tweetButtonInline']")
        .then((es) => es[0].replaceText("Post", "Tweet"));
    }
    return;
  }
};

/**
 * Main function
 */
const main = async () => {
  //Add copy event listener
  utils.clipboard();
  // //Replace placeholder logo
  utils.mutation
    .resolveOnElement("#placeholder>svg")
    .then((es) => (es[0].innerHTML = utils.logos[2]));
  //Get theme and run initial replacements
  utils.runtime
    .storageGetter()
    .then((res) => {
      theme = res.theme;
    })
    .then(() => Promise.all([sidebarMods(), iconReplace(), sidebarButton()]))
    .then(() =>
      console.debug("[deXer] first logo and icon replacement executed"),
    )
    .catch((err) => {
      console.error(`[deXer] error in main:`, err);
    });
  //Fire location specific stuff, then add listeners
  locationHandler({}).then(() => {
    window.addEventListener("pushstate", locationHandler, { passive: true });
    window.addEventListener("popstate", locationHandler, { passive: true });
  });
  //Start hunting for retweet dropdowns
  retweetMenuStart();
  toolTip();
  //Add title element and watch it
  const createTitle = async () => document.createElement("title");
  createTitle().then((e) => {
    e.innerText = "Twitter";
    document.head.append(e);
    utils.mutation.watchElement(e, titleReplace);
  });
};


(async () => {
  /**
   * Replaces the inner text of an HTMLElement
   *
   * @param {string | RegExp} searchValue The value to search for
   * @param {string} replaceValue The value to replace with
   */
  HTMLElement.prototype.replaceText = function (searchValue, replaceValue) {
    this.innerHTML = this.innerHTML.replace(searchValue, replaceValue);
  };
  /**
   * Finds the deepest child of an element
   *
   * Only traverses first children so no guarantees that it will be the deepest child overall.
   * @returns {HTMLElement}
   */
  HTMLElement.prototype.deepestChild = function () {
    let e = this;
    for (
      ;
      e.hasChildNodes() && e.firstChild instanceof HTMLElement;
      e = e.firstChild
    ) {}
    return e;
  };
  main();
})()