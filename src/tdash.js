/*! (c) Andrea Giammarchi - ISC */
const HTMLParsedElement = (() => { const e = "DOMContentLoaded", t = new WeakMap, n = [], s = e => { do { if (e.nextSibling) return !0 } while (e = e.parentNode); return !1 }, a = () => { n.splice(0).forEach(e => { !0 !== t.get(e[0]) && (t.set(e[0], !0), e[0][e[1]]()) }) }; document.addEventListener(e, a); class r extends HTMLElement { static withParsedCallback(r, i = "parsed") { const { prototype: c } = r, { connectedCallback: o } = c, l = i + "Callback", d = (t, n, s, a) => { n.disconnect(), s.removeEventListener(e, a), u(t) }, u = e => { n.length || requestAnimationFrame(a), n.push([e, l]) }; return Object.defineProperties(c, { connectedCallback: { configurable: !0, value() { if (o && o.apply(this, arguments), l in this && !t.has(this)) { const n = this, { ownerDocument: a } = n; if (t.set(n, !1), "complete" === a.readyState || s(n)) u(n); else { const t = () => d(n, r, a, t); a.addEventListener(e, t); const r = new MutationObserver(() => { s(n) && d(n, r, a, t) }); r.observe(n.parentNode, { childList: !0, subtree: !0 }) } } } }, [i]: { configurable: !0, get() { return !0 === t.get(this) } } }), r } } return r.withParsedCallback(r) })();

/*
 * tdash
 * A browser-translation library implemented using custom elements/web components.
 * (c) Jesse Pham, MIT License
 * https://phamiliarize.com
 */

const defSettings = {
    "fallback": "key"
}

class TDash {
    constructor(defaultLang = "en", settings = defSettings) {
        this.defaultLang = defaultLang;
        this.languages = {};
        this.currentLang = defaultLang;
        this.settings = settings;
    }

    async addLang(key, path) {
        let data = await fetch(path)
        this.languages[key] = await data.json()
    }

    translate(key) {
        if (key in this.languages[this.currentLang]) {
            return this.languages[this.currentLang][key]
        } else if (this.settings.fallback === 'default') {
            if (key in this.languages[this.defaultLang]) {
                console.warn(`'${key}' could not be found in translation files. Falling back to default language.`);
                return this.languages[this.defaultLang][key]
            }
        }
        console.warn(`'${key}' could not be found in translation files. Falling back to key.`);
        return key;
    }

    init() {
        var timer = setInterval(() => {
            if (Object.keys(this.languages).length > 0) {
                customElements.define('t-', TDashElement);
                clearInterval(timer);
                return;
            }
        }, 100);
    }

    updateLang(lang) {
        this.currentLang = lang;
        var event = new Event('updateLang')
        document.querySelectorAll("t-").forEach(t => t.dispatchEvent(event));
    }
}

class TDashElement extends HTMLParsedElement {
    constructor() {
        super();
        this.addEventListener('updateLang', function (event) {
            this.updateLang();
        });
    }
    parsedCallback() {
        this.key = this.innerHTML;
        this.updateLang();
    }

    updateLang() {
        this.innerHTML = tdash.translate(this.key);
    }
}