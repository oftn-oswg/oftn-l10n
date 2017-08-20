"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const default_lang = '';
const default_path = './localizations/all.json';
class Localizer {
    constructor(options) {
        this.options = options;
        const localization = this.options.path || default_path;
        this.data = {};
        this.language_tag_map = {};
        this.load(localization, '.', false);
    }
    // Merge the options from the argument into the currently set options.
    apply(options) {
        Object.assign(this.options, options);
    }
    getLocalization(filename) {
        const data = fs.readFileSync(filename, { encoding: 'utf8' });
        return JSON.parse(data);
    }
    // Adds localizations given by the path.
    load(filename, from, recurse) {
        const current = path.resolve(from, filename);
        const localization = this.getLocalization(current);
        if (!localization) {
            return;
        }
        for (const tag in localization) {
            let source_object = localization[tag];
            let dest_object = this.data[tag];
            if (typeof source_object === 'undefined')
                continue;
            if (typeof source_object === 'string') {
                if (recurse) {
                    this.load(source_object, path.dirname(current), true);
                }
                else {
                    dest_object = this.data[tag] = source_object;
                }
            }
            else {
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
    get(name) {
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
exports.Localizer = Localizer;
function proxy(options_argument) {
    const options = Object.assign({
        lang: default_lang,
        path: default_path
    }, options_argument);
    const target = (() => { });
    const localizer = new Localizer(options);
    return new Proxy(target, {
        get: (target, name) => {
            return localizer.get(name);
        },
        apply: (target, object, args) => {
            localizer.apply(args[0]);
        }
    });
}
exports.proxy = proxy;
function format(format, ...args) {
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
}
exports.format = format;
