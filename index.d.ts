declare module "oftn-l10n" {

  export interface LocalizationOptions {
    path?: string;
    lang?: string;
  }

  export interface Localization {
    [key: string]: {
      [key: string]: string | undefined;
    } | string | undefined;
  }

  export interface LocalizationTargetProxy {
    [key: string]: string;
  }

  export class Localizer {

    constructor(options: LocalizationOptions);

    apply(options: LocalizationOptions): void;
    getLocalization(filename: string): Localization;

    load(filename: string, from: string, recurse: boolean): void;

    get(name: string): string;
  }

  export function proxy(options_argument: LocalizationOptions): LocalizationTargetProxy;

  export function format(format: string, ...args: string[]): string;

}