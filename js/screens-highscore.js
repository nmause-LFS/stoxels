//------------------------------------------------------------------------
//-------------------SCREENS-HIGHSCORE.JS---------------------------------
//------------------------------------------------------------------------
// Handles everything related to the Highscore screen:
//   - sorting and preparing HS entries
//   - progress bars for world code unlocks
//   - the score table (rows, colors, mod formatting)
//   - assembling and displaying the full HS screen
//------------------------------------------------------------------------
//------------------------------------------------------------------------




//------------------------------------------------------------------------
//-------------------CONSTANTS / LOOKUP MAPS------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Maps internal mod keys to their short display abbreviations.
const MOD_ABBR_MAP = {
    timetrial: 'TT',
    hardcore: 'HC',
    ironman: 'IM',
    classless: 'CL',
    treeless: 'TL'
};

// Maps difficulty strings to their CSS color variables.
const DIFF_COLOR_MAP = {
    easy: 'var(--green)',
    normal: 'var(--hs-row-text)',   // neutral grey — normal is intentionally understated
    hard: 'var(--red)'
};

// Maps mod abbreviations to their CSS color variables.
const MOD_COLOR_MAP = {
    TT: 'var(--orange)',
    HC: 'var(--red)',
    IM: 'var(--purple)',
    CL: 'var(--accent)',
    TL: 'var(--green)'
};




//------------------------------------------------------------------------
//-------------------ENTRY SORTING----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Maps a raw [globalIndex, hs] entry pair into a structured object.
// lv is the full level object from ALL[], which holds .world and .li for display.
function hsEntryFromPair([gi, hs]) {
    const index = parseInt(gi);
    return {
        gi: index,
        lv: ALL[index],
        hs
    };
}

// Returns all highscore entries as structured objects, sorted by score descending.
function getHSSortedEntries() {
    return Object.entries(STATE.levelHS)
        .map(hsEntryFromPair)
        .sort((a, b) => b.hs.score - a.hs.score);
}









//------------------------------------------------------------------------
//-------------------TABLE ROW HELPERS------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the CSS color variable for a given difficulty string.
// Falls back to the neutral row text color if the difficulty is unknown.
function getDiffColor(diff) {
    return DIFF_COLOR_MAP[diff] || 'var(--hs-row-text)';
}

// Returns the CSS color variable for a given mod abbreviation.
// Falls back to accent2 if the mod abbreviation is not in the map.
function getModColor(modAbbr) {
    return MOD_COLOR_MAP[modAbbr] || 'var(--accent2)';
}

// Converts a single mod key to its colored <span> element.
function buildModSpan(modKey) {
    const abbr = MOD_ABBR_MAP[modKey] || modKey.slice(0, 2).toUpperCase();
    return `<span style="color:${getModColor(abbr)}">${abbr}</span>`;
}

// The separator placed between mod spans (e.g. TT+HC).
function buildModSeparator() {
    return `<span style="color:var(--hs-row-text)">+</span>`;
}

// Converts a mods object into a string of colored <span> elements joined by "+".
// Returns "—" if no mods are active or if the mods object is missing.
function formatModsString(mods) {
    if (!mods) return '—';

    const activeSpans = Object.keys(mods)
        .filter(m => mods[m])
        .map(buildModSpan);

    return activeSpans.length
        ? activeSpans.join(buildModSeparator())
        : '—';
}

// Resolves the display label for a difficulty value, or "—" if not set.
function getDiffLabel(diff) {
    return diff ? t('diff_' + diff) : '—';
}




//------------------------------------------------------------------------
//-------------------TABLE ROW MAIN BUILD---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds the HTML for a single row in the highscore table.
// lv — the level object (has .world and .li)
// hs — the highscore object (has .score, .diff, .mods)
function buildHSTableRow({ lv, hs }) {
    const diffLabel = getDiffLabel(hs.diff);
    const diffColor = hs.diff ? getDiffColor(hs.diff) : 'var(--hs-row-text)';
    const modsHTML = formatModsString(hs.mods);

    return `<tr>
        <td style="color:var(--white)">${lv.world}-${lv.li}</td>
        <td style="color:var(--yellow)">${hs.score}</td>
        <td style="color:${diffColor}">${diffLabel}</td>
        <td>${modsHTML}</td>
    </tr>`;
}




//------------------------------------------------------------------------
//-------------------HIGHSCORE TABLE MAIN BUILD---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds the table header row using localized column labels.
function buildHSTableHeader() {
    return `<thead><tr>
        <th>${t('hs_level')}</th>
        <th>${t('hs_best')}</th>
        <th>${t('hs_diff')}</th>
        <th>${t('hs_mods')}</th>
    </tr></thead>`;
}

// Builds the table body from all sorted entries.
function buildHSTableBody(entries) {
    return `<tbody>${entries.map(buildHSTableRow).join('')}</tbody>`;
}

// Builds the full score table, or an empty-state message if there are no entries.
function buildHSTableSection(entries) {
    if (!entries.length) {
        return `<p style="font-size:12px;color:#555;">${t('no_hs')}</p>`;
    }

    return `<table class="hs-table">
        ${buildHSTableHeader()}
        ${buildHSTableBody(entries)}
    </table>`;
}




//------------------------------------------------------------------------
//-------------------FULL HIGHSCORE SCREEN BUILD--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Assembles the complete inner HTML for the highscore screen body.
// Total score and code progress bars live on the Codes screen instead.
function buildHSBodyHTML(entries) {
    return `
    <div style="padding:18px;">
        ${buildHSTableSection(entries)}
    </div>`;
}

// Gathers all data and renders the full highscore screen into #hs-body.
function buildHS() {
    const body = document.getElementById('hs-body');
    const entries = getHSSortedEntries();

    body.innerHTML = buildHSBodyHTML(entries);
}




//------------------------------------------------------------------------
//-------------------SHOW HIGHSCORE SCREEN--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds and navigates to the highscore screen.
// Pushes the title screen onto history so the back button works correctly.
function showHS() {
    buildHS();
    screenHistory.push('screen-title');
    switchScreen('screen-hs');
}