export const mapToSupported = (raw) => {
    if (!raw)
        return "en-US";
    const s = String(raw).toLowerCase().replace("_", "-");
    if (s.startsWith("en"))
        return "en-US";
    if (s.startsWith("de"))
        return "de-DE";
    if (s.startsWith("pt-br"))
        return "pt-BR";
    if (s.startsWith("pt"))
        return "pt-BR";
    if (s.startsWith("it"))
        return "it-IT";
    if (s.startsWith("fr"))
        return "fr-FR";
    if (s.startsWith("es-419"))
        return "es-419";
    if (s.startsWith("es-mx"))
        return "es-419";
    if (s.startsWith("es-ar"))
        return "es-419";
    if (s.startsWith("es-cl"))
        return "es-419";
    if (s.startsWith("es-co"))
        return "es-419";
    if (s.startsWith("es-pe"))
        return "es-419";
    if (s.startsWith("es-ve"))
        return "es-419";
    if (s.startsWith("es"))
        return "es-ES";
    return "en-US";
};
export const STRINGS = {
    "en-US": {
        loading: "Loading...",
        level4: "4 cards",
        level6: "6 cards",
        level8: "8 cards",
        back: "Back",
        match: "Match!",
        matchMessage: "Great match!",
        changeLanguage: "Change Language",
        friends: "Friends",
        upgradePrompt: "Upgrade to a harder level?",
        yes: "Yes",
        no: "No",
        time: "Time",
        moves: "Moves",
        stars: "Stars",
        congrats: "Great job!",
        playAgain: "Play again",
    },
    "de-DE": {
        loading: "Lädt...",
        level4: "4 Karten",
        level6: "6 Karten",
        level8: "8 Karten",
        back: "Zurück",
        match: "Treffer!",
        matchMessage: "Toller Treffer!",
        changeLanguage: "Sprache ändern",
        friends: "Freunde",
        upgradePrompt: "Auf einen schwierigeren Level wechseln?",
        yes: "Ja",
        no: "Nein",
        time: "Zeit",
        moves: "Züge",
        stars: "Sterne",
        congrats: "Gut gemacht!",
        playAgain: "Nochmal spielen",
    },
    "es-ES": {
        loading: "Cargando...",
        level4: "4 cartas",
        level6: "6 cartas",
        level8: "8 cartas",
        back: "Atrás",
        match: "¡Coincidencia!",
        matchMessage: "¡Gran coincidencia!",
        changeLanguage: "Cambiar idioma",
        friends: "Amigos",
        upgradePrompt: "¿Subir a un nivel más difícil?",
        yes: "Sí",
        no: "No",
        time: "Tiempo",
        moves: "Movimientos",
        stars: "Estrellas",
        congrats: "¡Buen trabajo!",
        playAgain: "Jugar de nuevo",
    },
    "es-419": {
        loading: "Cargando...",
        level4: "4 cartas",
        level6: "6 cartas",
        level8: "8 cartas",
        back: "Atrás",
        match: "¡Acierto!",
        matchMessage: "¡Buen acierto!",
        changeLanguage: "Cambiar idioma",
        friends: "Amigos",
        upgradePrompt: "¿Pasar a un nivel más difícil?",
        yes: "Sí",
        no: "No",
        time: "Tiempo",
        moves: "Movimientos",
        stars: "Estrellas",
        congrats: "¡Buen trabajo!",
        playAgain: "Jugar otra vez",
    },
    "fr-FR": {
        loading: "Chargement...",
        level4: "4 cartes",
        level6: "6 cartes",
        level8: "8 cartes",
        back: "Retour",
        match: "Paire !",
        matchMessage: "Super paire !",
        changeLanguage: "Changer de langue",
        friends: "Amis",
        upgradePrompt: "Passer à un niveau plus difficile ?",
        yes: "Oui",
        no: "Non",
        time: "Temps",
        moves: "Coups",
        stars: "Étoiles",
        congrats: "Bravo !",
        playAgain: "Rejouer",
    },
    "it-IT": {
        loading: "Caricamento...",
        level4: "4 carte",
        level6: "6 carte",
        level8: "8 carte",
        back: "Indietro",
        match: "Coppia!",
        matchMessage: "Ottima coppia!",
        changeLanguage: "Cambia lingua",
        friends: "Amici",
        upgradePrompt: "Passare a un livello più difficile?",
        yes: "Sì",
        no: "No",
        time: "Tempo",
        moves: "Mosse",
        stars: "Stelle",
        congrats: "Ben fatto!",
        playAgain: "Gioca ancora",
    },
    "pt-BR": {
        loading: "Carregando...",
        level4: "4 cartas",
        level6: "6 cartas",
        level8: "8 cartas",
        back: "Voltar",
        match: "Par!",
        matchMessage: "Ótimo par!",
        changeLanguage: "Mudar idioma",
        friends: "Amigos",
        upgradePrompt: "Ir para um nível mais difícil?",
        yes: "Sim",
        no: "Não",
        time: "Tempo",
        moves: "Jogadas",
        stars: "Estrelas",
        congrats: "Muito bem!",
        playAgain: "Jogar novamente",
    },
};
