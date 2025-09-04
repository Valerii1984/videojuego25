"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
var resources = {
    en: {
        translation: {
            loading: 'Loading...',
            level4: '4 cards',
            level6: '6 cards',
            level8: '8 cards',
            back: 'Back',
            match: 'Match!',
            matchMessage: 'Great match!',
            changeLanguage: 'Change Language',
            friends: 'Friends',
            upgradePrompt: 'Upgrade to a harder level?',
            yes: 'Yes',
            no: 'No',
        },
    },
    es: {
        translation: {
            loading: 'Cargando...',
            level4: '4 cartas',
            level6: '6 cartas',
            level8: '8 cartas',
            back: 'Atrás',
            match: '¡Coincidencia!',
            matchMessage: '¡Gran coincidencia!',
            changeLanguage: 'Cambiar idioma',
            friends: 'Amigos',
            upgradePrompt: '¿Subir a un nivel más difícil?',
            yes: 'Sí',
            no: 'No',
        },
    },
};
i18next_1.default.use(react_i18next_1.initReactI18next).init({
    resources: resources,
    lng: 'en-US',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});
exports.default = i18next_1.default;
