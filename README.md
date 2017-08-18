# oftn-l10n

This project is a work-in-progress but it is a suitable demo.

## Localizing your app

```js
const l10n = require('oftn-l10n');

const R = l10n({
  path: './translations.json',
  lang: 'en-US'
});

const messages = [
  // R.welcome = "Welcome!"
  R.welcome,

  // R.hello_there = "Hello, there."
  R.hello_there,

  // R.how_are_you = "How are you?"
  R.how_are_you,

  // R.i_am_good = "I am good."
  R.i_am_good,

  // R.count_money = "I have {0} dollars."
  l10n.format(R.count_money, 3)
]

for (const message of messages) {
  console.log(message);
}

console.log('-- Switching to Spanish --')

R({lang: 'es'});

console.log(R.welcome);
```

## Demo

Run `node test.js` in the current directory.

Change the value of the `lang` option from `en-US` to `en-UK` and see the output change.

## String extraction

A working plugin for Webpack 2 is available as `webpack-extract-oftn-l10n.js` and an example of it is in `webpack.config.js`. The output format is documented as `application/vnd.oftn.l10n+json`.