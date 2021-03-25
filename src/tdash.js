/*! HTMLParsedElement - (c) Andrea Giammarchi - ISC */
const HTMLParsedElement = (() => { const e = "DOMContentLoaded", t = new WeakMap, n = [], s = e => { do { if (e.nextSibling) return !0 } while (e = e.parentNode); return !1 }, a = () => { n.splice(0).forEach(e => { !0 !== t.get(e[0]) && (t.set(e[0], !0), e[0][e[1]]()) }) }; document.addEventListener(e, a); class r extends HTMLElement { static withParsedCallback(r, i = "parsed") { const { prototype: c } = r, { connectedCallback: o } = c, l = i + "Callback", d = (t, n, s, a) => { n.disconnect(), s.removeEventListener(e, a), u(t) }, u = e => { n.length || requestAnimationFrame(a), n.push([e, l]) }; return Object.defineProperties(c, { connectedCallback: { configurable: !0, value() { if (o && o.apply(this, arguments), l in this && !t.has(this)) { const n = this, { ownerDocument: a } = n; if (t.set(n, !1), "complete" === a.readyState || s(n)) u(n); else { const t = () => d(n, r, a, t); a.addEventListener(e, t); const r = new MutationObserver(() => { s(n) && d(n, r, a, t) }); r.observe(n.parentNode, { childList: !0, subtree: !0 }) } } } }, [i]: { configurable: !0, get() { return !0 === t.get(this) } } }), r } } return r.withParsedCallback(r) })();

const variablePattern = /{([^}]+)}/g

/*
 * tdash
 * A browser-translation library implemented using custom elements/web components.
 * (c) Jesse Pham, MIT License
 * https://phamiliarize.com
 */

class TDash {
    constructor({ defaultLang, fallback, warn }) {
        this.languages = {}
        this.defaultLang = defaultLang || "en"
        this.fallback = fallback || "key"
        this.warn = warn || false
        document.documentElement.lang = this.defaultLang
        // The Mutation Observer that watches for attribute changes
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "lang") {
                    // Ensure update is only triggered if the value is new
                    if (mutation.oldValue !== document.documentElement.lang) {
                        this.updateLang()
                    }
                }
            })
        })
    }

    async addLang(key, path) {
        let data = await fetch(path)
        this.languages[key] = await data.json()
    }

    async interpolation(raw) {
        let text = raw
        let vars = text.match(variablePattern) || []
        for (let i = 0; i < vars.length; i++) {
            text = text.replace(vars[i], window[vars[i].substring(1, vars[i].length - 1)])
        }
        return text
    }

    async translate(key) {
        if (key in this.languages[document.documentElement.lang]) {
           return await this.interpolation(this.languages[document.documentElement.lang][key])
        } else if (this.fallback === 'default') {
            if (key in this.languages[this.defaultLang]) {
                if (this.warn) {
                    console.warn(`'${key}' could not be found in translation files. Falling back to default language.`)
                }
                return await this.interpolation(this.languages[this.defaultLang][key])
            }
        }
        if (this.warn) {
            console.warn(`'${key}' could not be found in translation files. Falling back to key.`)
        }
        return key
    }

    init() {
        var timer = setInterval(() => {
            if (Object.keys(this.languages).length > 0) {
                customElements.define('t-', TDashElement)
                clearInterval(timer)
                this.observer.observe(document.documentElement, { attributes: true, attributeOldValue: true })
                return
            }
        }, 100)
    }

    updateLang() {
        var event = new Event('updateLang')
        document.querySelectorAll("t-").forEach(t => t.dispatchEvent(event))
    }
}

class TDashElement extends HTMLParsedElement {
    constructor() {
        super()
        this.addEventListener('updateLang', function (event) {
            this.updateLang()
        })
    }
    parsedCallback() {
        this.key = this.innerHTML
        this.updateLang()
    }

    async updateLang() {
        this.innerHTML = await tdash.translate(this.key)
    }
}