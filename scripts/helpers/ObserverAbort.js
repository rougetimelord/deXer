import { delay } from "./index.js";

/**
 * Class representing an Abort Object
 */
export class ObserverAbort {
    /** @type {boolean} */
    #aborted = false;
    /** @type {string | undefined} */
    #reason;
    /** @type {MutationObserver} */
    #target;

    /**
     * Constructs the abort object
     * @param {MutationObserver} _observer The mutation observer to abort
     */
    constructor(_observer) {
        this.#target = _observer;
    }

    get aborted() {return this.#aborted}
    get reason() {return this.#reason}
    set target(_observer) {this.#target = _observer}

    /**
     * Aborts the targeted MutationObserver
     * @param {string | undefined} reason 
     */
    async abort(reason=undefined) {
        try {
            this.#target.disconnect();
            this.#reason = reason;
            this.#aborted = true;
        } catch{}
    }

    /**
     * Aborts the targeted MutationObserver after specified wait
     * @param {number} ms The amount of time to wait
     * @param {string | undefined} reason 
     */
    async timeout(ms, reason=undefined) {
        await delay(ms);
        this.abort(reason);
    }
}