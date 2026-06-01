


//------------------------------------------------------------------------
//-------------------MODAL HELPER FUNCTIONS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



function showModal(id) { document.getElementById(id).classList.add('show'); }
function hideModal(id) { document.getElementById(id).classList.remove('show'); }



//------------------------------------------------------------------------
//----------------------------RESET---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function confirmReset() {
    hideModal('reset-modal');
    localStorage.removeItem('stoxels'); // wipe the save key
    // Re-initialise in-memory state 
    STATE = {
        totalScore: 0,
        levelHS: {},
        inventory: [],
        unlockedCodes: [],
        done: [],
        bonusDone: [],
        mathGatePassed: [],
        questStats: {},          
        questsClaimed: [],       
        questsNotified: [],      
    };
    // already handled by initState() since we call it again,
    // but explicitly clear them for safety:
    STATE.playerClass = null;
    STATE.classPassiveLevel = 1;
    STATE.classActiveLevel = 1;
    STATE.classUpgradesAvailable = 0;
    STATE.classWorldsCompleted = [];
    showTitle();
    showToast(t('toast_reset'));
}




//------------------------------------------------------------------------
//---------------TITLE SCREEN PUZZLE DECORATION---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


(() => {
    const d = document.getElementById('tdeco');

    // Three separate mini pixel-art panels side by side
    // Each is 5×5. Panels: [puzzle piece] [passive tree node] [inventory grid]
    const panels = [
        // Panel 1 – classic puzzle cross
        [
            [0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0],
        ],
        // Panel 2 – passive tree node (diamond / PoE style)
        [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
        ],
        // Panel 3 – inventory grid / chest
        [
            [1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 1, 1],
        ],
        // Panel 4 – star / score icon
        [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1],
        ],
    ];

    panels.forEach((grid, panelIndex) => {
        const panel = document.createElement('div');
        panel.className = 'title-deco-panel';
        panel.dataset.panel = panelIndex;

        grid.forEach((row, r) => {
            row.forEach((v, c) => {
                const cell = document.createElement('div');
                cell.className = 'title-deco-cell';
                cell.style.opacity = v ? '1' : '0';

                // Stagger the shimmer animation per cell, creating a wave effect
                if (v) {
                    const delay = (panelIndex * 0.4 + r * 0.08 + c * 0.05).toFixed(2);
                    cell.style.animationDelay = `${delay}s`;
                    cell.dataset.panel = panelIndex;
                }

                panel.appendChild(cell);
            });
        });

        d.appendChild(panel);
    });
})();



//------------------------------------------------------------------------
//----------------DISABLE BROWSER RIGHT CLICK FUNCTIONALITY---------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


document.addEventListener('contextmenu', e => e.preventDefault());