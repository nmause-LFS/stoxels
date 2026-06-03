// ============================================================
//  settings.js  —  Persistent user settings
// ============================================================

const SETTINGS_KEY = 'stoxels_settings';

// Default values
const SETTINGS_DEFAULTS = {
    bgmEnabled: true,
    bgmVolume: 0.4,    // 0–1
    sfxEnabled: true,
    sfxVolume: 0.7,    // 0–1
    axisLock: true,
    questionMark: false,
};

// Load from localStorage, falling back to defaults for any missing keys
function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        return { ...SETTINGS_DEFAULTS, ...saved };
    } catch {
        return { ...SETTINGS_DEFAULTS };
    }

}

function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// The live settings object — other modules read from this
let SETTINGS = loadSettings();

// Apply all settings to the audio manager and game state.
// Call once at startup and again whenever a setting changes.
function applySettings() {
    Audio_Manager.toggleBGM(SETTINGS.bgmEnabled);
    Audio_Manager.setBGMVolume(SETTINGS.bgmVolume);
    Audio_Manager.toggleSFX(SETTINGS.sfxEnabled);
    Audio_Manager.setSFXVolume(SETTINGS.sfxVolume);
    if (typeof axisLockEnabled !== 'undefined') axisLockEnabled = SETTINGS.axisLock;
}


// ── Settings modal UI ────────────────────────────────────────

// Reads current SETTINGS and updates all controls to match.
// Call this every time the modal opens so it always shows live values.
function loadSettingsUI() {
    const s = SETTINGS;

    // BGM toggle
    const btnBGM = document.getElementById('stt-bgm');
    if (btnBGM) {
        btnBGM.textContent = s.bgmEnabled ? 'ON' : 'OFF';
        btnBGM.classList.toggle('settings-toggle-off', !s.bgmEnabled);
    }

    // BGM slider
    const sldBGM = document.getElementById('sld-bgm');
    const valBGM = document.getElementById('val-bgm');
    if (sldBGM) sldBGM.value = Math.round(s.bgmVolume * 100);
    if (valBGM) valBGM.textContent = Math.round(s.bgmVolume * 100) + '%';

    // SFX toggle
    const btnSFX = document.getElementById('stt-sfx');
    if (btnSFX) {
        btnSFX.textContent = s.sfxEnabled ? 'ON' : 'OFF';
        btnSFX.classList.toggle('settings-toggle-off', !s.sfxEnabled);
    }

    // SFX slider
    const sldSFX = document.getElementById('sld-sfx');
    const valSFX = document.getElementById('val-sfx');
    if (sldSFX) sldSFX.value = Math.round(s.sfxVolume * 100);
    if (valSFX) valSFX.textContent = Math.round(s.sfxVolume * 100) + '%';

    // Axis lock toggle
    const btnAxis = document.getElementById('stt-axis');
    if (btnAxis) {
        btnAxis.textContent = s.axisLock ? 'ON' : 'OFF';
        btnAxis.classList.toggle('settings-toggle-off', !s.axisLock);
    }

    // Question mark toggle
    const btnQM = document.getElementById('stt-qmark');
    if (btnQM) {
        btnQM.textContent = s.questionMark ? 'ON' : 'OFF';
        btnQM.classList.toggle('settings-toggle-off', !s.questionMark);
    }
}

// Wire up all interactive controls — called once on DOMContentLoaded
function initSettingsControls() {

    // BGM toggle
    document.getElementById('stt-bgm')?.addEventListener('click', () => {
        SETTINGS.bgmEnabled = !SETTINGS.bgmEnabled;
        saveSettings(SETTINGS);
        applySettings();
        loadSettingsUI();
    });

    // BGM slider
    document.getElementById('sld-bgm')?.addEventListener('input', e => {
        SETTINGS.bgmVolume = parseInt(e.target.value) / 100;
        document.getElementById('val-bgm').textContent = e.target.value + '%';
        saveSettings(SETTINGS);
        applySettings();
    });

    // SFX toggle
    document.getElementById('stt-sfx')?.addEventListener('click', () => {
        SETTINGS.sfxEnabled = !SETTINGS.sfxEnabled;
        saveSettings(SETTINGS);
        applySettings();
        loadSettingsUI();
    });

    // SFX slider
    document.getElementById('sld-sfx')?.addEventListener('input', e => {
        SETTINGS.sfxVolume = parseInt(e.target.value) / 100;
        document.getElementById('val-sfx').textContent = e.target.value + '%';
        saveSettings(SETTINGS);
        applySettings();
    });

    // Axis lock toggle
    document.getElementById('stt-axis')?.addEventListener('click', () => {
        SETTINGS.axisLock = !SETTINGS.axisLock;
        saveSettings(SETTINGS);
        applySettings();
        loadSettingsUI();
    });

    // Question mark toggle
    document.getElementById('stt-qmark')?.addEventListener('click', () => {
        SETTINGS.questionMark = !SETTINGS.questionMark;
        saveSettings(SETTINGS);
        loadSettingsUI();
    });
}