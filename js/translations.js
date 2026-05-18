// Currently selected language, default to English, updated when player clicks the EN/DE buttons in the title screen
let LANG = 'en';



//------------------------------------------------------------------------
// Function to return the string for key k in the active language. Falls back to T.en if the active language is
// missing a key, and falls back to the key itself as a last resort so missing translations are visible
//------------------------------------------------------------------------

function t(k) {
    return (T[LANG] || T.en)[k] || k;
}

//------------------------------------------------------------------------
// Function to switch the active language and update all UI text accordingly
//------------------------------------------------------------------------


function setLang(l) {
    LANG = l;

    // Highlight the matching language button
    document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.textContent === l.toUpperCase())
    );

    // Fill every element that has a data-t attribute
    document.querySelectorAll('[data-t]').forEach(el => {
        const k = el.getAttribute('data-t');
        const v = t(k);
        // Only write if the translation exists (v !== k guards against missing keys
        // accidentally overwriting useful fallback content)
        if (v && v !== k) el.innerHTML = v;
    });
}


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





















