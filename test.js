const l10n = require('./index');

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