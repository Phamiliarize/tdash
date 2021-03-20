# tdash
tdash is a simple, intuitive solution for front-end translations on websites. Simply provide a JSON file with translations and tag any text you wish to translate...

```
<t->my text</t->
<t->my_key</t->
```
and voila- your text will be translated. i18n couldn't get any simpler.

tdash itself is implemented in JavaScript and utilizes Web Component & Custom Element APIs. It is small weighing in at **~2KB**.

## Detailed Usage
### Dependencies
[Web Component & Cusotm Element APIs](https://caniuse.com/?search=custom%20element) are supported on most modern browsers out of the box now. If you need to target older browsers, you will need a [polyfill](https://github.com/ungap/custom-elements) or similar solution. If you wind up using a polyfill make sure it is the absolute first thing in your head tag.

### Initialize tdash
Import tdash before **all** other scripts (or if using polyfill, directly after the polyfill.)

```
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/phamiliarize/tdash@latest/tdash.min.js"></script> 
```

Next you must initialize an instance of the TDash class as a variable named `tdash`. 


```
  <script>
        var tdash = new TDash("en", { fallback: "key" })
        tdash.addLang("en", "en.json")
        tdash.init()
  </script>
```
  
 Currently settings has the following options:

| Setting  | Accepts            | Default | Explanation                                                                                                                    |
|----------|--------------------|---------|--------------------------------------------------------------------------------------------------------------------------------|
| fallback | "default" or "key" | "key"   | When the key is not found in the current language fallback to either the default language first, or fall back directly to key. |

### Language Changing/Switching
The tdash object exposes an `updateLang` method that takes a string of the language you wish to switch to, like so:

```
tdash.updateLang("en");
```

This will change the language to en, then cause a re-render on all tdash tags with an attempt to pull from the defined English translations. 

### Current Language
`tdash.currentLang` exposes the current language being used. See the sample for one way this can be used!

## Contributing
Contributors always welcome. Let's see how much we can push web components and custom elements!

Particularly SEO optimization should be considered for Bing/Duckgo etc.

This should work fine with Google/ASK however, as they render JavaScript.


