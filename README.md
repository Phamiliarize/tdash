# tdash
tdash is a simple, intuitive solution for front-end translations on websites. Simply provide a JSON file with translations and tag any text you wish to translate...

```
<t->my text</t->
<t->my_key</t->
```
and voila- your text will be translated. i18n couldn't get any simpler.

tdash itself is implemented in vanilla JavaScript and will work in any recent browsers with no polyfils or shims. Under the hood it uses Fetch, Mutation Observers, and the Web Component/CustomElement API. Because of this, it is small weighing in at around **~3KB**. If you require support for older browsers you may use polyfils.

## Detailed Usage
### Dependencies
[Web Component & Cusotm Element APIs](https://caniuse.com/?search=custom%20element) are supported on most recent browsers now. If you need to target older browsers, you will need a [polyfill](https://github.com/ungap/custom-elements) or similar solution. If you wind up using a polyfill make sure it is the absolute first thing in your head tag.

[Mutation Observer](https://caniuse.com/mutationobserver) has been supported for well over half a decade in most browsers. That said, if you need to support old browsers you will need a polyfill.

### Initialize tdash
Import tdash before **all** other scripts (or if using polyfill, directly after the polyfill.)

```
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/phamiliarize/tdash@latest/tdash.min.js"></script> 
```

Next you must initialize an instance of the TDash class as a variable named `tdash`, and add a language utilizing the `addLang("key", "path")` function. Internally, this uses fetch to get your language JSON file. It also means you get Fetch APIs caching goodness and subsequent requests will be from cache and *instant*.


```
  <script>
        var tdash = new TDash({ defaultLang: "en", fallback: "key" })
        tdash.addLang("en", "en.json")
        tdash.init()
  </script>
```

  
 Currently settings has the following options:

| Setting  | Accepts            | Default | Explanation                                                                                                                    |
|----------|--------------------|---------|--------------------------------------------------------------------------------------------------------------------------------|
| fallback | "default" or "key" | "key"   | When the key is not found in the current language fallback to either the default language first, or fall back directly to key. |
| defaultLang | string | "en" | The language that should be attempted first when rendering your app. Should match the key of one of your language JSON files. |
| warn | boolean | false | Setting true will show warnings when keys fail; this is great in development settings to find out what has not been translated yet. |

### Change/Switch language and get current language
The tdash object does not store the current language. Instead, the native HTML element's `lang` attribute is used as the single source of truth for what language tdash should pull translations from. On static sites, set this in your tag and you are done.

```
<html lang="en">
```

This also helps with our mission to provide as "intuitive" and "native" an experience as possible- also it is important for  SEO.

If your site needs to support dynamic, live language switching be aware of the SEO implications for not Google/not ASK. Otherwise, simply use standard vanilla javascript to change the attribute's value.

```
document.documentElement.lang = "en"
```

This would, for example, set the site to English and cause tdash to re-render all tdash tags, attempting to fetch translations to English.

### Current Language
tdash tries to be a "html native" as possible and uses the native document setting for language. The default HTML element attribute is used to hold the current language.

You can access it programmatically with `document.documentElement.lang` . See the docs as a sample for one way this can be used!

### Interpolation
Globally scopped variables, can be interoplated at translation runtime.

So the globaly scoped:

```
<script>
var name = "Jess"
</script>
```

Will be inserted into the following translation at runtime:

```
"mytranslationkey": "This has the variable "name" inserted here: {name}."
```

Resulting in:

```
This has the variable "name" inserted here: Jess
```

## Contributing
Contributors always welcome. Let's see how much we can push web components and custom elements!

Particularly SEO optimization should be considered for Bing/Duckgo etc.

This should work fine with Google/ASK however, as they render JavaScript.