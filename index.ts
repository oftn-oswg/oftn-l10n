const path = require('path');
const util = require('util');

function look(obj: any, name: string) {
  console.log(name, util.inspect(obj, { colors: true }));
}

interface Dictionary {
  [key: string]: string | undefined;
}

interface Localization {
  [key: string]: {
    [key: string]: string | undefined;
  } | string | undefined;
}

interface LocalizationOptions {
  path?: string;
  lang?: string;
}

interface LocalizationTargetProxy {
  (options: LocalizationOptions): void;
  [key: string]: string;
}

interface LocalizationTarget {
  (): void;
  [key: string]: string | LocalizationOptions;
}

const default_lang = '';
const default_path = './localizations/all.json';

export class Localizer {
  options: LocalizationOptions;
  data: Localization;
  language_tag_map: Dictionary;

  constructor(options: LocalizationOptions) {
    this.options = options;

    const localization = this.options.path || default_path;

    this.data = {};
    this.language_tag_map = {};

    this.load(localization, '.', false);
  }

  // Merge the options from the argument into the currently set options.
  apply(options: LocalizationOptions) {
    Object.assign(this.options, options);
  }

  // Adds localizations given by the path.
  load(filename: string, from: string, recurse: boolean) {
    const current = path.resolve(from, filename);
    const localization = <Localization>require(current);

    for (const tag in localization) {
      let source_object = localization[tag];
      let dest_object = this.data[tag];

      if (typeof source_object === 'undefined') continue;

      if (typeof source_object === 'string') {
        if (recurse) {
          this.load(<string>source_object, path.dirname(current), true);
        } else {
          dest_object = this.data[tag] = source_object;
        }
      } else {
        if (typeof dest_object !== 'object') {
          dest_object = this.data[tag] = {};
        }
      }

      if (typeof source_object === 'object' && typeof dest_object === 'object') {
        for (const string in source_object) {
          dest_object[string] = source_object[string];
        }
      }
    }

    // Update canonicalizations of language tags from the data
    for (const tag in this.data) {
      const canonical_tag = tag.trim().toLowerCase();
      this.language_tag_map[canonical_tag] = tag;
    }
  }

  get(name: string): string {
    const options = this.options;
    options.lang = (options.lang || default_lang).toLowerCase();
    options.path = options.path || default_path;

    // Find the closest matching language tag from the data
    const language_subtags = options.lang.split('-');
    while (true) {
      const tag_attempt = language_subtags.join('-');

      const tag_match = this.language_tag_map[tag_attempt];
      if (typeof tag_match === 'string') {
        // We found the tag
        let language_data = this.data[tag_match];

        // External resource
        if (typeof language_data === 'string') {
          this.load(language_data, path.dirname(options.path), true);
          return this.get(name);
        }

        // Now check if the tag has the requested string
        if (typeof language_data === 'object') {
          const value = language_data[name];
          if (typeof value === 'string') {
            return value;
          }
        }
      }

      if (!language_subtags.length) {
        // We have looked everywhere
        return name;
      }

      language_subtags.pop();
    }
  }
}

export function proxy(options_argument: LocalizationOptions): LocalizationTargetProxy {
  const options = Object.assign(<LocalizationOptions>{
    lang: default_lang,
    path: default_path
  }, options_argument);

  const target = <LocalizationTarget>(() => { });
  const localizer = new Localizer(options);

  return <LocalizationTargetProxy>new Proxy(target, {
    get: (target: LocalizationTarget, name: string): string => {
      return localizer.get(name);
    },
    apply: (target: LocalizationTarget, object: object, args: IArguments) => {
      localizer.apply(args[0]);
    }
  });
}

export function format(format: string, ...args: string[]): string {
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
      ;
  });
}