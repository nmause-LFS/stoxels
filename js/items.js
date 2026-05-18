//------------------------------------------------------------------------
//---------TRANSLATION FUNCTIONS FOR ITEMNAME & DESCRIPTION---------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function itemName(def) {
    return LANG === 'de' ? def.nameDE : def.nameEn;
}


function itemDesc(def) {
    return LANG === 'de' ? def.descDE : def.descEn;
}





//------------------------------------------------------------------------
//------------------------RANDOM ITEM PICKER------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Weighted draw from all items that have weight > 0
function pickRandomItem() {
    const pool = Object.values(ITEM_DEFS).filter(d => d.weight > 0);
    const total = pool.reduce((sum, d) => sum + d.weight, 0);
    let roll = Math.random() * total;
    for (const d of pool) {
        roll -= d.weight;
        if (roll <= 0) return d.id;
    }
    return pool[pool.length - 1].id; 
}


// Same pool but with a small artifact chance on top
function pickLuckyItem() {
    if (Math.random() < 0.01) return 'artifactComplete';
    return pickRandomItem();
}




//------------------------------------------------------------------------
//-----------------RARITY COLOR MAPPING-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function rarityColors(rarity) {
    const map = {
        common: { border: '#7a7a7a', color: '#b0b0b0' },
        uncommon: { border: '#2ecc71', color: '#2ecc71' },
        rare: { border: '#3498db', color: '#3498db' },
        epic: { border: '#9b59b6', color: '#c39bd3' },
        legendary: { border: '#f39c12', color: '#f5b642' },
        cursed: { border: '#e74c3c', color: '#e74c3c' },
        artifact: { border: '#f1c40f', color: '#f1c40f' },
    };
    return map[rarity] || { border: 'var(--border2)', color: 'var(--accent2)' };
}












