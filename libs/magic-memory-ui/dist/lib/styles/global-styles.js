"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buttons_1 = require("./components/buttons");
const containers_1 = __importDefault(require("./components/containers"));
const progressBar_1 = __importDefault(require("./components/progressBar"));
// Добавляем типизацию для globalStyles
const globalStyles = {
    roundButton: buttons_1.roundButtonStyles,
    progressBar: progressBar_1.default,
    containers: containers_1.default, // Убедимся, что containers ссылается на containerStyles
};
exports.default = globalStyles;
