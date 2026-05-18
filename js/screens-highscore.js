



//------------------------------------------------------------------------
//-------------------HIGHSCORE ENTRY SORTING------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns all high score entries sorted by score descending.
function getHSSortedEntries() {
    return Object.entries(STATE.levelHS)
        .map(([gi, hs]) => ({
            gi: parseInt(gi),
            lv: ALL[parseInt(gi)], // full level object (has .world and .li for display)
            hs
        }))
        .sort((a, b) => b.hs.score - a.hs.score);
}


//------------------------------------------------------------------------
//------------------MOD STRING IN HS SCREEN-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function formatModsString(mods) {
    if (!mods) return '—';
    const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
    const active = Object.keys(mods)
        .filter(m => mods[m])
        .map(m => modMap[m] || m.slice(0, 2).toUpperCase())
        .join('+');
    return active || '—';
}


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function buildHSProgressBar(wc, total) {
    const pct = Math.min(100, Math.round((total / wc.threshold) * 100));
    const unlocked = STATE.unlockedCodes.includes(wc.code);
    const tierName = LANG === 'de' ? wc.titleDE : wc.titleEn;
    const barColor = unlocked ? 'var(--green)' : 'var(--purple)';

    return `
    <div style="margin-bottom:10px;font-size:15px;color:var(--accent2);">
        ${tierName}: ${total.toLocaleString()}/${wc.threshold.toLocaleString()}
        ${unlocked ? `<span style="color:var(--green)">✓ ${t('hs_code_unlocked')}</span>` : ''}
        <div style="background:var(--surface);height:5px;margin-top:4px;border:1px solid var(--border);">
            <div style="background:${barColor};height:100%;width:${pct}%;"></div>
        </div>
    </div>`;
}





//------------------------------------------------------------------------
//-------------PROGRESS BAR SECTIONS FOR EACH CODE------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function buildHSProgressSection(total) {
    return WORLD_CODES.map(wc => buildHSProgressBar(wc, total)).join('');
}



//------------------------------------------------------------------------
//--------------------HIGHSCORE TABLE ROW---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Returns the CSS color variable for a given difficulty string.
function getDiffColor(diff) {
    const map = {
        easy: 'var(--green)',
        normal: 'var(--hs-row-text)',   // neutral grey for normal
        hard: 'var(--red)'
    };
    return map[diff] || 'var(--hs-row-text)';
}

// Returns the CSS color variable for a given mod key.
function getModColor(mod) {
    const map = {
        TT: 'var(--orange)',
        HC: 'var(--red)',
        IM: 'var(--purple)'
    };
    return map[mod] || 'var(--accent2)';
}

// Converts a mods object into colored <span> elements, or "—" if none active.
function formatModsString(mods) {
    if (!mods) return '—';
    const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
    const spans = Object.keys(mods)
        .filter(m => mods[m])
        .map(m => {
            const abbr = modMap[m] || m.slice(0, 2).toUpperCase();
            return `<span style="color:${getModColor(abbr)}">${abbr}</span>`;
        })
        .join('<span style="color:var(--hs-row-text)">+</span>');
    return spans || '—';
}

// Builds the HTML for a single row in the score table.
function buildHSTableRow({ lv, hs }) {
    const mods = formatModsString(hs.mods);
    const diffLabel = hs.diff ? t('diff_' + hs.diff) : '—';
    const diffColor = hs.diff ? getDiffColor(hs.diff) : 'var(--hs-row-text)';

    return `<tr>
        <td style="color:var(--white)">${lv.world}-${lv.li}</td>
        <td style="color:var(--yellow)">${hs.score}</td>
        <td style="color:${diffColor}">${diffLabel}</td>
        <td>${mods}</td>
    </tr>`;
}



//------------------------------------------------------------------------
//---------------------HIGHSCORE TABLE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function buildHSTableSection(entries) {
    if (!entries.length) {
        return `<p style="font-size:12px;color:#555;">${t('no_hs')}</p>`;
    }

    const rows = entries.map(buildHSTableRow).join('');

    return `<table class="hs-table">
        <thead><tr>
            <th>${t('hs_level')}</th>
            <th>${t('hs_best')}</th>
            <th>${t('hs_diff')}</th>
            <th>${t('hs_mods')}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
    </table>`;
}



//------------------------------------------------------------------------
//-------------------FULL HIGHSCORE SCREEN BUILD--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function buildHS() {
    const body = document.getElementById('hs-body');
    const total = STATE.totalScore;
    const entries = getHSSortedEntries();

    const html = `
    <div style="padding:18px;">
        <div class="hs-total">${t('hs_total')}: ${total}</div>
        ${buildHSProgressSection(total)}
        ${buildHSTableSection(entries)}
    </div>`;

    body.innerHTML = html;
}



//------------------------------------------------------------------------
//-------------FUNCTION TO SHOW HIGHSCORE SCREEN--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showHS() {
    buildHS();
    screenHistory.push('screen-title');
    ss('screen-hs');
}












