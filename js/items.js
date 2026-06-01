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

function pickRandomItem() {
    const pool = Object.values(ITEM_DEFS).filter(d => {
        if (d.weight <= 0) return false;
        return true;
    });

    // Apply passive-tree boosts: node-unlocked items added with weight 3
    const nodeItems = [
        { id: 'pearlOfHaste', node: 'pearl_of_haste' },
        { id: 'pearlOfSwiftness', node: 'pearl_of_swiftness' },
        { id: 'grandPearl', node: 'grand_pearl' },
        { id: 'theWitch', node: 'keystone_the_witch' },
        { id: 'goldenClock', node: 'keystone_golden_clock' },
        { id: 'shadowSeal', node: 'keystone_shadow_seal' },
    ];
    nodeItems.forEach(({ id, node }) => {
        if (ptHasSkill(node) && ITEM_DEFS[id]) {
            pool.push({ ...ITEM_DEFS[id], weight: 3 });
        }
    });

    // Quality Loot: boost epic/legendary weight by 10% per node
    const qualityBoost = (ptHasSkill('quality_loot_1') ? 0.10 : 0)
        + (ptHasSkill('quality_loot_2') ? 0.10 : 0)
        + (ptHasSkill('quality_loot_3') ? 0.10 : 0);

    // Cursed Attraction: boost cursed weight
    const cursedBoost = (ptHasSkill('cursed_attraction_1') ? 0.05 : 0)
        + (ptHasSkill('cursed_attraction_2') ? 0.05 : 0)
        + (ptHasSkill('cursed_attraction_3') ? 0.10 : 0);

    // Seeker of Light: boost reveal item weight
    const revealBoost = (ptHasSkill('seeker_of_light_1') ? 0.15 : 0)
        + (ptHasSkill('seeker_of_light_2') ? 0.15 : 0)
        + (ptHasSkill('seeker_of_light_3') ? 0.20 : 0);

    // Error Collector: boost mark-wrong item weight
    const markBoost = (ptHasSkill('error_collector_1') ? 0.15 : 0)
        + (ptHasSkill('error_collector_2') ? 0.15 : 0)
        + (ptHasSkill('error_collector_3') ? 0.20 : 0);

    // Mentor's Following: boost tutor item weight
    const tutorBoost = (ptHasSkill('mentors_following_1') ? 0.15 : 0)
        + (ptHasSkill('mentors_following_2') ? 0.15 : 0)
        + (ptHasSkill('mentors_following_3') ? 0.20 : 0);

    // Warden's Stockpile: boost shield item weight
    const shieldBoost = (ptHasSkill('wardens_stockpile_1') ? 0.15 : 0)
        + (ptHasSkill('wardens_stockpile_2') ? 0.15 : 0)
        + (ptHasSkill('wardens_stockpile_3') ? 0.20 : 0);

    // Utility Hoarder: boost utility (freeze, shield, tutor, primer) weight
    const utilityBoost = (ptHasSkill('utility_hoarder_1') ? 0.15 : 0)
        + (ptHasSkill('utility_hoarder_2') ? 0.15 : 0)
        + (ptHasSkill('utility_hoarder_3') ? 0.20 : 0);

    const REVEAL_IDS = new Set(['reveal1', 'reveal2', 'reveal3', 'reveal4']);
    const MARK_IDS = new Set(['markWrong2', 'markWrong4', 'markWrong6', 'markWrong8']);
    const TUTOR_IDS = new Set(['mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll']);
    const SHIELD_IDS = new Set(['shield']);
    const UTILITY_IDS = new Set(['freeze', 'shield', 'mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll', 'scoutPrimer']);

    const adjustedPool = pool.map(d => {
        let w = d.weight;
        const r = d.rarity;
        if ((r === 'epic' || r === 'legendary') && qualityBoost) w *= (1 + qualityBoost);
        if (r === 'cursed' && cursedBoost) w *= (1 + cursedBoost);
        if (REVEAL_IDS.has(d.id) && revealBoost) w *= (1 + revealBoost);
        if (MARK_IDS.has(d.id) && markBoost) w *= (1 + markBoost);
        if (TUTOR_IDS.has(d.id) && tutorBoost) w *= (1 + tutorBoost);
        if (SHIELD_IDS.has(d.id) && shieldBoost) w *= (1 + shieldBoost);
        if (UTILITY_IDS.has(d.id) && utilityBoost) w *= (1 + utilityBoost);

        return { ...d, weight: w };
    });

    const total = adjustedPool.reduce((s, d) => s + d.weight, 0);
    let roll = Math.random() * total;


    for (const d of adjustedPool) {
        roll -= d.weight;
        if (roll <= 0) {
            // Apex Collector: if the rolled item is below epic, give nothing
            if (ptHasSkill('keystone_apex_collector')
                && d.rarity !== 'epic' && d.rarity !== 'legendary'
                && d.rarity !== 'artifact' && d.rarity !== 'cursed') {
                return null;
            }
            // Common Refinement: chance to upgrade common -> uncommon
            if (d.rarity === 'common') {
                const upgradeChance = (ptHasSkill('common_refinement_1') ? 0.05 : 0)
                    + (ptHasSkill('common_refinement_2') ? 0.05 : 0)
                    + (ptHasSkill('common_refinement_3') ? 0.10 : 0);
                if (upgradeChance > 0 && Math.random() < upgradeChance) {
                    // Upgrade: pick the uncommon version of the same item category if it exists
                    const uncommonUpgrades = {
                        'reveal1': 'reveal2', 'markWrong2': 'markWrong4', 'addTime60': 'addTime300'
                    };
                    if (uncommonUpgrades[d.id]) return uncommonUpgrades[d.id];
                }
            }
            return d.id;
        }
    }

    // Apex Collector: final fallback item might also be below epic
    const fallback = adjustedPool[adjustedPool.length - 1];
    if (ptHasSkill('keystone_apex_collector')
        && fallback.rarity !== 'epic' && fallback.rarity !== 'legendary'
        && fallback.rarity !== 'artifact' && fallback.rarity !== 'cursed') {
        return null;
    }
    return fallback.id;


}


// Same pool but with a small artifact chance on top
function pickLuckyItem() {
    if (ptHasSkill('keystone_apex_collector') && Math.random() < 0.03) return 'artifactComplete';
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












