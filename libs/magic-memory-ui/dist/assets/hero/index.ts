// src/assets/hero/index.ts
// (это TS-модуль; НИКАКОГО Node-кода внутри)

declare function require(path: string): any;

export const ROBOT_SPRITES = [
  require("./hero1/anim.webp"),
  require("./hero2/anim.webp"),
  require("./hero3/anim.webp"),
  require("./hero4/anim.webp"),
  require("./hero5/anim.webp"),
  require("./hero6/anim.webp"),
] as const;

export const ROBOT_VOICES = [
  require("./hero1/hero.m4a"),
  require("./hero2/hero.m4a"),
  require("./hero3/hero.m4a"),
  require("./hero4/hero.m4a"),
  require("./hero5/hero.m4a"),
  require("./hero6/hero.m4a"),
] as const;

export const HERO_PLACEHOLDER = require("./hero.webp");
