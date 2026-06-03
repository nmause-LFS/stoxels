

let reshuffleCount = 0;     // tracks right-clicked (discarded) items toward the goal
const RESHUFFLE_GOAL = 5;   // number of discards needed to trigger the reshuffle reward modal




//------------------------------------------------------------------------
//-------------COUNTER BADGE SYNCHRONIZATION------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function updateReshuffleCounter() {
    const el = document.getElementById('reshuffle-counter');
    if (el) el.textContent = `♻ ${reshuffleCount}/${RESHUFFLE_GOAL}`;
}





//------------------------------------------------------------------------
//-----Reshuffle gets called when rightclicking an item in inventory------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//called on right click on item
function reshuffleRightClickItem(uid) {
    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return;

    const def = ITEM_DEFS[STATE.inventory[idx].defId];
    STATE.inventory.splice(idx, 1);
    reshuffleCount++;
    trackAchStat('itemsSold');
    save();
    buildInventoryPanel(); // also calls updateReshuffleCounter()
    showToast(`${def.icon} Tossed into the reshuffle pile… (${reshuffleCount}/${RESHUFFLE_GOAL})`);

    if (reshuffleCount >= RESHUFFLE_GOAL) {
        reshuffleCount = 0;
        updateReshuffleCounter();
        setTimeout(() => openReshuffleModal(), 300); // slight delay so toast reads first
    }
}





//------------------------------------------------------------------------
//--------------------------RESHUFFLE MODAL-------------------------------
//----------------opened when reshuffle goal is reached-------------------
//------------------------------------------------------------------------

function openReshuffleModal() {
    // Pick 3 distinct random items
    const picks = [];
    const usedIds = new Set();
    let attempts = 0;
    while (picks.length < 3 && attempts < 50) {
        attempts++;
        const id = pickLuckyItem(); // uses existing weighted pool with artifact chance
        if (id && ITEM_DEFS[id] &&!usedIds.has(id)) {
            usedIds.add(id);
            picks.push(ITEM_DEFS[id]);
        }
    }

    // Build modal HTML
    const cardsHtml = picks.map(def => `
        <div class="rshuffle-card" data-id="${def.id}">
            <div class="rshuffle-card-icon">${def.icon}</div>
            <div class="rshuffle-card-name" style="color:${rarityColors(def.rarity).color}">${itemName(def)}</div>
            <div class="rshuffle-card-desc">${itemDesc(def)}</div>
        </div>`).join('');

    const modal = document.createElement('div');
    modal.id = 'rshuffle-modal';
    modal.innerHTML = `
        <div id="rshuffle-box">
            <div id="rshuffle-title">♻ Reshuffle Reward</div>
            <div id="rshuffle-subtitle">5 items sacrificed — choose your reward:</div>
            <div id="rshuffle-cards">${cardsHtml}</div>
        </div>`;
    document.body.appendChild(modal);

    // Attach click handlers
    modal.querySelectorAll('.rshuffle-card').forEach(card => {
        card.addEventListener('click', () => {
            const chosenId = card.dataset.id;
            const chosenDef = ITEM_DEFS[chosenId];

            // Add chosen item to inventory
            STATE.inventory.push({ uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`, defId: chosenId });


            save();
            buildInventoryPanel();
            showToast(`${chosenDef.icon} ${itemName(chosenDef)} added to your inventory!`);

            modal.remove();
        });
    });
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------























