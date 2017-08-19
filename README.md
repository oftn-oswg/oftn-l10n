# oftn-l10n

oftn-l10n is a simple and straight-forward JavaScript library that enables localization through Android-style property accesses. Pair your accesses with the special comment syntax in order to define a default value. That way, it can simply be extracted from source with [webpack-extract-oftn-l10n](https://github.com/oftn-oswg/webpack-extract-oftn-l10n) and a base localization file can be automatically created. Don't duplicate effort!

If available, it is best used with the [EcmaScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Getting started

The first step is getting the user's current language. This can be done several ways. See [oftn-l10n-example](https://github.com/oftn-oswg/oftn-l10n-example) to view a more detailed example using this library.

### Node.js

```js
// You can use a package like os-locale to get the system locale.
const oslocale = require('os-locale');
// Convert from ISO 15897 format to IETF language tag
// Examples: en, en-US, es, zh, ru
const language_tag = oslocale.sync().replace(/_/g, '-');
```

### Browser / Electron Renderer

```js
// Get the current locale with the navigator object
const language_tag = navigator && (navigator.language || navigator.userLanguage) || "";
```

## Usage

### Example with proxying

```js
// Include the library
const l10n = require('oftn-l10n');

const R = l10n.proxy({
  // Location of root localizations object
  path: './localizations.json',
  lang: language_tag
});

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(R.welcome); // R.welcome = "Hello and welcome!"

// R.get_name = "Before we get started, what is your name, good sir? "
rl.question(R.get_name, (answer) => {
  // R.thank_you = "Very nice, {0}."
  console.log(l10n.format(R.thank_you, answer));
  // R.goodbye = "Have a wonderful day, goodbye!"
  console.log(R.goodbye);

  rl.close();
});
```

And of course, after generating the referenced `localizations.json`, the output is as expected:

```
Hello and welcome!
Before we get started, what is your name, good sir? None of your business
Very nice, None of your business.
Have a wonderful day, goodbye!
```

### Without proxying

```js
// Make convenience function
const _ = (() => {
  const strings = new l10n.Localizer({
    path: path.resolve(__dirname, 'localizations/all.json'),
    lang: 'es-MX'
  });
  return (name) => {
    return strings.get(name);
  }
})();

// _.welcome = "Hello, world!"
console.log(_('welcome'));
```

## String extraction

A working plugin for Webpack 2 is available called [webpack-extract-oftn-l10n](https://github.com/oftn-oswg/webpack-extract-oftn-l10n). Use it to generate your base localization files automatically.

It looks at every comment looking for `<identifier>.<property> = <string>`. If the identifier matches the one configured, it adds it to the list of translatable strings. Save the file as **default.json**. A Russian translator can create a new translation by copying this file to **ru.json** and changing the language tag from `""` to `"ru"`.

## The localization file and best practices

```js
Localization ::
  '{' LanguageDefinition+ '}'

LanguageDefinition ::
  LanguageTag ':' LanguageTagValue

LanguageTag ::
  StringLiteral // IETF Language Tag or "" for defaults

LanguageTagValue ::
  SymbolicLink
  '{' LanguageStringList '}'

SymbolicLink ::
  StringLiteral // Path to localization file to include

LanguageStringList ::
  LanguageString
  LanguageStringList ',' LanguageString
  
LanguageString ::
  StringLiteral ':' StringLiteral
}
```
You may split up your localizations into multiple files for translators. 

### localizations/all.json

```json
{
    "": "default.json",
    "bg": "bg.json",
    "ca": "ca.json",
    "cs": "cs.json",
    "da": "da.json",
    "de": "de.json",
    "en": "en.json",
    "es": "es.json",
    "fi": "fi.json",
    "fr": "fr.json",
    "he": "he.json",
    "hu": "hu.json",
    "it": "it.json",
    "ja": "ja.json",
    "jbo": "jbo.json",
    "la": "la.json",
    "nb": "nb.json",
    "nl": "nl.json",
    "no": "no.json",
    "pl": "pl.json",
    "pt": "pt.json",
    "ru": "ru.json",
    "se": "se.json",
    "tr": "tr.json",
    "vi": "vi.json",
    "zh": "zh.json"
}
```

### localizations/default.json (automatically generated)

```json
{
  "": {
    "app_name": "App.io",
    "welcome": "Welcome to {0}!",
    "localizations": "Localizations"
  }
}
```

### localizations/en.json

```json
{
  "en-UK": {
    "localizations": "Localisations"
  }
}
```

### localizations/es.json

```json
{
  "es": {
    "welcome": "Bienvenidos a {0}!",
    "localizations": "Localizaciónes"
  }
}
```