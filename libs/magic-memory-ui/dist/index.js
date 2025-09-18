"use strict";
/// <reference path="./lib/types/assets.d.ts" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroRobotSound = exports.heroRobot = exports.AppNavigator = exports.MagicMemory = void 0;
// Внешняя точка входа
var magic_memory_ui_1 = require("./lib/magic-memory-ui");
Object.defineProperty(exports, "MagicMemory", { enumerable: true, get: function () { return magic_memory_ui_1.MagicMemory; } });
// Навигация и i18n
var AppNavigator_1 = require("./lib/navigation/AppNavigator");
Object.defineProperty(exports, "AppNavigator", { enumerable: true, get: function () { return AppNavigator_1.AppNavigator; } });
__exportStar(require("./lib/navigation/AppNavigator"), exports);
__exportStar(require("./lib/i18n"), exports);
// ⬇️ ДОБАВЛЕНО: ассеты робота, чтобы удобно импортировать в приложении
exports.heroRobot = require("./lib/assets/hero/hero.webp");
exports.heroRobotSound = require("./lib/assets/hero/hero.m4a");
