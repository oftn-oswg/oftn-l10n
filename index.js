const path = require('path');

function ΩF_Ø(options) {
  const target = function () { };

  function apply_options(options) {
    options.data = require(options.path);
    if (!options.lang) {
      options.lang = '';
    }
    return options;
  }

  target.options = apply_options(options);

  return new Proxy(target, {
    get: (target, name) => {
      const data = target.options.data;
      const lang = target.options.lang;
      let translation;

      let strings = data[lang];
      if (!strings || typeof strings[name] == 'undefined') {
        strings = data[lang.split('-')[0]];
        if (!strings || typeof strings[name] == 'undefined') {
          strings = data[''];
          if (!strings || typeof strings[name] == 'undefined') {
            strings = {};
          }
        }
      }

      translation = strings[name];
      if (typeof translation === 'undefined') {
        translation = `#${name}`;
      }

      return "" + translation;
    },
    apply: (target, object, args) => {
      const fulloptions = Object.assign({}, target.options, args[0]);
      target.options = apply_options(fulloptions);
    }
  });
}

ΩF_Ø.format = function (format) {
  var args = Array.prototype.slice.call(arguments, 1);
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
      ;
  });
}

module.exports = ΩF_Ø;