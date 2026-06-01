//------------------------------------------------------------------------
// Helper function to get the translated text for a level content field
//------------------------------------------------------------------------


// This is used for level content fields that need to be translated but don't have a fixed place in the HTML (e.g. hints, which are generated dynamically based on the level data).
// For static text elements that are always present in the HTML, we use [data-t] attributes and the t() function in translations.js instead, which is more efficient for filling in large amounts of text at once.
// The field name is passed as a parameter (e.g. 'hint') and the function looks for the DE variant of that field (e.g. 'hintDE') when German is active, returning it if found; otherwise it returns the default field (e.g. 'hint').

function lvText(obj, field) {
    if (LANG === 'de') {
        const de = obj[field + 'DE'];
        if (de) return de;
    }
    return obj[field];
}



//------------------------------------------------------------------------
// Array of all Levels
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Build ALL with correct gi values regardless of world size
const ALL = []; // sequential array of all levels in all worlds, with added world and gi fields; built by iterating through WORLDS
                // in order and pushing each level into ALL with the correct gi based on the current length of ALL

// gi (global index) is the index of the level in the ALL array, which is used for saving progress and tracking which levels have been completed; 
// it is assigned sequentially as we build ALL by iterating through WORLDS in order and pushing each level into ALL with the correct gi based on the current length of ALL

WORLDS.forEach((w, wi) => {
    w.data.forEach((p, li) => {
        const gi = ALL.length; 
        ALL.push({ world: wi + 1, li: li + 1, gIdx: gi, size: w.size, ...p });
    });
});




//------------------------------------------------------------------------
// WORLD_START_GI maps each world to the global index (gi) of its first level in the ALL array,
// i.e., where each world begins in the flattened level list.
//------------------------------------------------------------------------


// WORLD_START_GI is an object that maps each world index to the global index (gi) of the first level in that world; 
// built by iterating through WORLDS and keeping a running total of the number of levels seen so far
const WORLD_START_GI = WORLDS.reduce((acc, w, wi) => {
    acc[wi] = wi === 0 ? 0 : acc[wi - 1] + WORLDS[wi - 1].data.length;
    return acc;
}, {});

