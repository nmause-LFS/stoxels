//------------------------------------------------------------------------
//-------------------CHARACTER SELECTION----------------------------------
//------------------------------------------------------------------------
// Shows a character selection screen the first time a new game starts
// (i.e. no playerCharacter set in STATE). After selection the normal
// tutorial / setup flow resumes.
//------------------------------------------------------------------------

const CHARACTERS = {
    stox: {
        id: 'stox',
        name: 'STOX',
        nameDE: 'STOX',
        tagline: 'The Analyst',
        taglineDE: 'Der Analytiker',
        background: 'Raised in the Cartographers\' Guild archive, Stox has read every record of the day the Apex broke - and none of it adds up. He\'s out of pages to search, so now he searches in person.',
        backgroundDE: 'Im Archiv der Kartografengilde aufgewachsen, hat Stox jede Aufzeichnung über den Tag gelesen, an dem der Apex zerbrach - und nichts ergibt einen Sinn. Ihm sind die Seiten ausgegangen, also sucht er jetzt selbst.',
        personality: 'Dry, methodical, and quietly relentless. He trusts data over instinct, and a good pattern over a good feeling.',
        personalityDE: 'Trocken, methodisch und still unerbittlich. Er vertraut Daten mehr als Instinkt, und einem guten Muster mehr als einem guten Gefühl.',
        strength: 'Reads patterns fast and rarely panics under pressure - mistakes are just data points to him, not setbacks.',
        strengthDE: 'Erkennt Muster schnell und gerät selten in Panik - Fehler sind für ihn nur Datenpunkte, keine Rückschläge.',
        image: 'images/sprites/Stox_noclass.png',
        accentColor: '#4fc3f7',
        glowColor: 'rgba(79,195,247,0.35)',
        traits: [
            {
                icon: '🧠',
                nameEn: 'Process of Elimination',
                nameDE: 'Ausschlussverfahren',
                descEn: '+10% chance to auto-remove one wrong multiple-choice answer.',
                descDE: '+10% Chance, eine falsche Multiple-Choice-Antwort automatisch zu entfernen.',
            },
            {
                icon: '🛡️',
                nameEn: 'Unshakeable',
                nameDE: 'Unerschütterlich',
                descEn: 'Mistake penalties escalate more slowly.',
                descDE: 'Fehlerstrafen steigen langsamer an.',
            },
        ],
    },
    trix: {
        id: 'trix',
        name: 'TRIX',
        nameDE: 'TRIX',
        tagline: 'The Trickster',
        taglineDE: 'Die Trickserin',
        background: 'The last of a colony exiled for claiming the Variance Collapse was no accident, Trix grew up alone in a dying observatory deep in the Regression Rift. Now its readings are sliding toward zero, and she\'s come for answers.',
        backgroundDE: 'Als Letzte einer Kolonie, die verbannt wurde, weil sie behauptete, der Varianz-Kollaps sei kein Unfall gewesen, wuchs Trix allein in einem sterbenden Observatorium tief im Regressionsrift auf. Jetzt nähern sich dessen Messwerte der Null, und sie sucht Antworten.',
        personality: 'Cocky, sharp-tongued, and supremely confident - mostly because she\'s usually right.',
        personalityDE: 'Frech, schlagfertig und überaus selbstbewusst - meist, weil sie meistens recht hat.',
        strength: 'Thrives on risk and reads dangerous situations like a game she already knows how to win.',
        strengthDE: 'Blüht im Risiko auf und liest gefährliche Situationen wie ein Spiel, das sie schon gewonnen hat.',
        image: 'images/sprites/Trix_noclass.png',
        accentColor: '#ce93d8',
        glowColor: 'rgba(206,147,216,0.35)',

        traits: [
            {
                icon: '🎓',
                nameEn: 'Silver Tongue',
                nameDE: 'Silberzunge',
                descEn: '+10% chance that a Tutor item answers a question correctly.',
                descDE: '+10% Chance, dass ein Tutor-Gegenstand eine Frage richtig beantwortet.',
            },
            {
                icon: '🎲',
                nameEn: 'Loaded Dice',
                nameDE: 'Gezinkte Würfel',
                descEn: 'Increased chance of lucky tiles and lucky item drops.',
                descDE: 'Erhöhte Chance auf Glücksfelder und Glücks-Beute.',
            },
        ],

    },
    syla: {
        id: 'syla',
        name: 'SYLA',
        nameDE: 'SYLA',
        tagline: 'The Naturalist',
        taglineDE: 'Die Naturalistin',
        background: 'Syla spent years listening to her home forest - until corruption locked inside it for three hundred quiet years began spreading. Her notebooks have the proof. She came to the Outpost to find help.',
        backgroundDE: 'Syla verbrachte Jahre damit, ihrem Heimatwald zuzuhören - bis die Korruption, die dreihundert ruhige Jahre lang darin eingeschlossen war, sich auszubreiten begann. Ihre Notizbücher liefern den Beweis. Sie kam zum Außenposten um Hilfe zu finden.',
        personality: 'Warm, patient, and endlessly forgiving of mistakes - she sees every setback as just part of growing.',
        personalityDE: 'Warmherzig, geduldig und unendlich nachsichtig bei Fehlern - sie sieht jeden Rückschlag einfach als Teil des Wachsens.',
        strength: 'Stays calm and steady no matter how badly things are going, and bounces back quickly from setbacks.',
        strengthDE: 'Bleibt ruhig und gefasst, egal wie schlecht es läuft, und erholt sich schnell von Rückschlägen.',
        image: 'images/sprites/Syla_noclass.png',
        accentColor: '#66bb6a',
        glowColor: 'rgba(102,187,106,0.35)',

        traits: [
            {
                icon: '💡',
                nameEn: 'Quick Study',
                nameDE: 'Schnell gelernt',
                descEn: 'Exercise hints appear one wrong attempt sooner.',
                descDE: 'Aufgaben-Hinweise erscheinen einen Fehlversuch früher.',
            },
            {
                icon: '🌿',
                nameEn: "Nature's Aid",
                nameDE: 'Hilfe der Natur',
                descEn: 'On levels with remaining vegetation, nature reveals one correct tile at the start.',
                descDE: 'In Leveln mit verbleibender Vegetation enthüllt die Natur zu Beginn ein korrektes Feld.',
            },
        ],
    }
};


// showCharacterSelect — shows the character select screen.
// onSelect(characterId) is called once the player confirms.
function showCharacterSelect(onSelect) {
    switchScreen('screen-character-select');
    _buildCharacterSelectUI(onSelect);
}


// _buildCharacterSelectUI — builds (or rebuilds) the inner UI.
function _buildCharacterSelectUI(onSelect) {
    const container = document.getElementById('char-select-content');
    if (!container) return;

    let selectedId = null;

    const lang = typeof LANG !== 'undefined' ? LANG : 'en';

    container.innerHTML = `
        <div class="cs-title" data-t="cs_title">${lang === 'de' ? 'WÄHLE DEINEN CHARAKTER' : 'CHOOSE YOUR CHARACTER'}</div>
        <div class="cs-cards" id="cs-cards"></div>
        <button class="cs-confirm-btn disabled" id="cs-confirm-btn" disabled>
            ${lang === 'de' ? '▶ BESTÄTIGEN' : '▶ CONFIRM'}
        </button>
    `;

    const cardsEl = document.getElementById('cs-cards');

    Object.values(CHARACTERS).forEach(char => {
        const card = document.createElement('div');
        card.className = 'cs-card';
        card.dataset.charId = char.id;
        card.style.setProperty('--char-accent', char.accentColor);
        card.style.setProperty('--char-glow', char.glowColor);

        const charName = lang === 'de' ? char.nameDE : char.name;
        const tagline = lang === 'de' ? char.taglineDE : char.tagline;
        const background = lang === 'de' ? char.backgroundDE : char.background;
        const personality = lang === 'de' ? char.personalityDE : char.personality;
        const strength = lang === 'de' ? char.strengthDE : char.strength;

        const labelBackground = lang === 'de' ? 'Hintergrund' : 'Background';
        const labelPersonality = lang === 'de' ? 'Persönlichkeit' : 'Personality';
        const labelStrength = lang === 'de' ? 'Stärke' : 'Strength';
        const labelTraits = lang === 'de' ? 'Fähigkeiten' : 'Traits';

        const traitsHtml = (char.traits || []).map(tr => {
            const trName = lang === 'de' ? tr.nameDE : tr.nameEn;
            const trDesc = lang === 'de' ? tr.descDE : tr.descEn;
            return `
                <div class="cs-trait-row">
                    <span class="cs-trait-icon">${tr.icon}</span>
                    <span class="cs-trait-text">
                        <span class="cs-trait-name">${trName}</span>
                        <span class="cs-trait-desc">${trDesc}</span>
                    </span>
                </div>`;
        }).join('');

        card.innerHTML = `
            <div class="cs-card-glow"></div>
            <img class="cs-card-img" src="${char.image}" alt="${charName}" draggable="false">
            <div class="cs-card-body">
                <div class="cs-card-name">${charName}</div>
                <div class="cs-card-tag">${tagline}</div>
                <div class="cs-card-section">
                    <div class="cs-card-section-label">${labelBackground}</div>
                    <div class="cs-card-section-text">${background}</div>
                </div>
                <div class="cs-card-section">
                    <div class="cs-card-section-label">${labelPersonality}</div>
                    <div class="cs-card-section-text">${personality}</div>
                </div>
                <div class="cs-card-section cs-card-traits">
                    <div class="cs-card-section-label">${labelTraits}</div>
                    ${traitsHtml}
                </div>
            </div>
            <div class="cs-card-check">✓</div>
        `;

        card.addEventListener('click', () => {
            // Deselect all, select this one
            document.querySelectorAll('.cs-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedId = char.id;

            const confirmBtn = document.getElementById('cs-confirm-btn');
            if (confirmBtn) {
                confirmBtn.classList.remove('disabled');
                confirmBtn.disabled = false;
                confirmBtn.style.borderColor = char.accentColor;
                confirmBtn.style.color = char.accentColor;
            }
        });

        cardsEl.appendChild(card);
    });

    // Confirm button
    document.getElementById('cs-confirm-btn').addEventListener('click', () => {
        if (!selectedId) return;
        STATE.playerCharacter = selectedId;
        save();
        showBeat('character_intro', {
            character: selectedId,
            onComplete: () => {
                if (typeof onSelect === 'function') onSelect(selectedId);
            }
        });
    });
}


// maybeShowCharacterSelect — entry point called from the play button flow.
// Shows character select if no character chosen yet, otherwise calls onDone directly.
function maybeShowCharacterSelect(onDone) {
    if (STATE.playerCharacter) {
        onDone();
        return;
    }
    showCharacterSelect(() => onDone());
}


//------------------------------------------------------------------------
//-------------------CHARACTER AVATAR IN LEVEL SELECT--------------------
//------------------------------------------------------------------------

// renderLSCharacterAvatar — injects the chosen character's avatar into
// the level-select top bar. Safe to call multiple times (replaces old one).
function renderLSCharacterAvatar() {
    // Remove any existing avatar
    const old = document.getElementById('ls-char-avatar');
    if (old) old.remove();

    if (!STATE.playerCharacter) return;

    const char = CHARACTERS[STATE.playerCharacter];
    if (!char) return;

    const topbarRight = document.querySelector('#screen-levels .ls-topbar-right') ||
        document.querySelector('#screen-map-view .ls-topbar-right');
    if (!topbarRight) return;

    const lang = typeof LANG !== 'undefined' ? LANG : 'en';
    const charName = lang === 'de' ? char.nameDE : char.name;

    const avatar = document.createElement('div');
    avatar.id = 'ls-char-avatar';
    avatar.className = 'ls-char-avatar';
    avatar.style.setProperty('--char-accent', char.accentColor);
    avatar.style.setProperty('--char-glow', char.glowColor);
    avatar.title = charName;
    avatar.innerHTML = `
        <img src="${char.image}" alt="${charName}" class="ls-char-avatar-img">
        <span class="ls-char-avatar-name">${charName}</span>
    `;

    // Prepend so avatar sits at the far left of the right cluster
    topbarRight.prepend(avatar);

    // Sync sprite to current class/ascendency
    if (typeof _updateLSAvatarImage === 'function') _updateLSAvatarImage();
}