// Like _egBuildBossSpawnList but reads from an explicit def object instead of cur.
// Used by _egSpawnChainBoss so it always reads from the original map def.
function _egBuildBossSpawnListFromDef(mapDef, baseLevel) {
    if (!mapDef) return [];
    const hasBossFlag = mapDef.hasBoss;
    const explicitBosses = mapDef.bosses && mapDef.bosses.length > 0;
    if (!hasBossFlag && !explicitBosses) return [];

    const bossCap = (mapDef.maxBosses != null && mapDef.maxBosses > 0) ? mapDef.maxBosses : 1;

    if (explicitBosses) {
        return mapDef.bosses.slice(0, bossCap).map(entry => ({
            id: entry.id,
            level: entry.level != null ? entry.level : _egRollMonsterLevel(baseLevel),
            isBossSpawn: true,
        }));
    }

    const allBossDefs = Object.values(EG_BOSS_DEFS);
    if (allBossDefs.length === 0) return [];
    const picked = allBossDefs[Math.floor(Math.random() * allBossDefs.length)];
    return [{ id: picked.id, level: _egRollMonsterLevel(baseLevel), isBossSpawn: true }];
}


// Returns true if every filled cell in the solution has been correctly placed.
function _egIsPuzzleSolved() {
    if (!cur || !userGrid) return false;
    for (let r = 0; r < cur.grid.length; r++)
        for (let c = 0; c < cur.grid[0].length; c++)
            if (cur.grid[r][c] === 1 && userGrid[r][c] !== 1) return false;
    return true;
}


//------------------------------------------------------------------------
//-------------------ENCOUNTER SPAWN LIST BUILDERS------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the base level for this encounter, with ±2 random variance applied.
// Variance keeps a wave from feeling perfectly uniform.
function _egRollMonsterLevel(baseLevel) {
    return Math.max(1, baseLevel + Math.floor(Math.random() * 5) - 2);
}

// Builds the normal (non-boss) part of the spawn list for this encounter.
// Uses cur.monsters if provided; otherwise picks a random subset of all non-boss defs.
// cur.maxMonsters caps the total count (0 = no normal monsters, boss-only encounter).
function _egBuildNormalSpawnList(baseLevel) {
    const cap = (cur.maxMonsters != null && cur.maxMonsters >= 0) ? cur.maxMonsters : 3; // ← default 3, not Infinity

    if (cap === 0) return [];

    if (cur.monsters && cur.monsters.length > 0) {
        return cur.monsters.slice(0, cap).map(entry => ({
            id: entry.id,
            level: entry.level != null ? entry.level : _egRollMonsterLevel(baseLevel),
        }));
    }

    const allNonBoss = Object.values(EG_MONSTER_DEFS);
    if (allNonBoss.length === 0) return [];

    const shuffled = [...allNonBoss].sort(() => Math.random() - 0.5);
    const maxCount = Math.min(cap, shuffled.length);
    const count = 1 + Math.floor(Math.random() * maxCount); // 1..cap
    return shuffled.slice(0, count).map(d => ({ id: d.id, level: _egRollMonsterLevel(baseLevel) }));
}

// Builds the boss part of the spawn list for this encounter.
// Uses cur.bosses (explicit list) or picks one random boss if cur.hasBoss is true.
// cur.maxBosses caps the count (defaults to 1).
function _egBuildBossSpawnList(baseLevel) {
    const hasBossFlag = cur.hasBoss;
    const explicitBosses = cur.bosses && cur.bosses.length > 0;
    if (!hasBossFlag && !explicitBosses) return [];

    const bossCap = (cur.maxBosses != null && cur.maxBosses > 0) ? cur.maxBosses : 1;

    if (explicitBosses) {
        return cur.bosses.slice(0, bossCap).map(entry => ({
            id: entry.id,
            level: entry.level != null ? entry.level : _egRollMonsterLevel(baseLevel),
            isBossSpawn: true,
        }));
    }

    const allBossDefs = Object.values(EG_BOSS_DEFS);
    if (allBossDefs.length === 0) return [];

    const picked = allBossDefs[Math.floor(Math.random() * allBossDefs.length)];
    return [{ id: picked.id, level: _egRollMonsterLevel(baseLevel), isBossSpawn: true }];
}

// Returns the full ordered spawn list for this encounter:
// normal monsters first (in order), then bosses appended at the end.
function _egBuildSpawnList() {
    const baseLevel = (cur.monsterLevel != null && cur.monsterLevel > 0) ? cur.monsterLevel : 1;
    const normalList = _egBuildNormalSpawnList(baseLevel);

    // Boss is always withheld from the initial wave — it spawns via _egSpawnChainBoss
    // at the 50% totalMonsters threshold.
    const bossList = [];

    return [...normalList, ...bossList];
}



// Schedules a single replacement monster to spawn after a short delay.
// Called whenever a normal monster dies and the kill gate is not yet reached.
// Does nothing if the encounter ended, the boss is already alive,
// or we are already at the concurrent monster cap.
function _egScheduleRespawn() {
    const delay = 4000 + Math.random() * 6000; // 4–10 s gap before next monster
    const t = setTimeout(() => {
        if (!_egIsActive()) return;

        const req = _egGetMapRequirements();
        const total = req.totalMonsters;
        if (total > 0 && _egChainKillCount >= total) return;

        // Don't respawn if a boss is already on the field
        if (_egMonsters.some(m => m.isBoss)) return;

        // Don't respawn if already at the concurrent cap
        if (_egMonsters.length >= EG_MAX_CONCURRENT_MONSTERS) return;

        const baseLevel = (cur.monsterLevel != null && cur.monsterLevel > 0) ? cur.monsterLevel : 1;
        const allNonBoss = Object.values(EG_MONSTER_DEFS);
        if (allNonBoss.length === 0) return;

        const def = allNonBoss[Math.floor(Math.random() * allNonBoss.length)];
        _egSpawnMonster(def.id, _egRollMonsterLevel(baseLevel));
    }, delay);
    _egSpawnTimers.push(t); // tracked so it gets cancelled on encounter stop
}





//------------------------------------------------------------------------
//-------------------ENCOUNTER LIFECYCLE----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Queues all monsters in spawnList with staggered appearance delays.
// The first 1–2 entries appear almost immediately; the rest are spread
// 4–10 seconds apart so the encounter ramps up gradually.
function _egScheduleMonsterSpawns(spawnList) {
    if (spawnList.length === 0) return;

    const immediateCount = Math.min(spawnList.length, 1 + Math.floor(Math.random() * 2));
    let cumulativeDelay = 0;

    spawnList.forEach((entry, i) => {
        let delay;
        if (i < immediateCount) {
            // Tiny stagger so the first batch doesn't all land simultaneously
            delay = 500 + i * 200;
        } else {
            cumulativeDelay += 4000 + Math.random() * 6000;
            delay = cumulativeDelay;
        }

        const t = setTimeout(() => {
            if (_egIsActive()) _egSpawnMonster(entry.id, entry.level || 1);
        }, delay);
        _egSpawnTimers.push(t);
    });
}

// Hides the monster panel and resets it to an empty state.
function _egHideMonsterPanel() {
    const allZones = [
        'eg-monster-panel',
        'eg-panel-left',
        'eg-panel-right',
        'eg-panel-bottom',
        'eg-panel-top-corner'
    ];

    // Clear the HTML inside all possible spawn locations
    allZones.forEach(zone => {
        const el = document.getElementById(zone);
        if (el) el.innerHTML = '';
    });

    const wrapper = document.getElementById('eg-monster-wrapper');
    if (wrapper) wrapper.classList.add('eg-hidden');
}

// Initialises and begins a full monster encounter for the current level.
// Called from start-level.js or equivalent when cur.isMonsterLevel is true.
function _egStartEncounter() {
    _egEncounterActive = true;
    _egTargetId = null;
    _egMonsters = [];
    _egMapDef = cur;
    _egMonsterSpawnCounter = 0;

    _egRenderPanel();

    if (_egTickInterval) clearInterval(_egTickInterval);
    _egTickInterval = setInterval(_egTickLoop, 100);

    _egStartPickupSpawner();
    _egScheduleMonsterSpawns(_egBuildSpawnList());
}

// Tears down a running encounter and cleans up all state and DOM.
// Safe to call even if no encounter is active.
function _egStopEncounter() {
    if (window._egSuppressEncounterStop) return; //

    _egEncounterActive = false;
    _egMonsters = [];
    _egTargetId = null;

    if (_egTickInterval) { clearInterval(_egTickInterval); _egTickInterval = null; }

    _egSpawnTimers.forEach(t => clearTimeout(t));
    _egSpawnTimers = [];

    _egStopPickupSpawner();
    _egBossCleanupAll();
    if (typeof _egChainCleanup === 'function') _egChainCleanup();
    _egHideMonsterPanel();
}


//------------------------------------------------------------------------
//-------------------COMBAT TICK LOOP-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Runs at 10Hz. Advances every monster's charge bar and fires their attack
// when the bar fills. Also calls _egBossTick for any future per-tick boss logic.
function _egTickLoop() {
    if (!_egIsActive()) return;
    if (typeof dead !== 'undefined' && dead) return;
    if (typeof _gamePaused !== 'undefined' && _gamePaused) return;

    _egBossTick();

    _egMonsters.forEach(m => {
        m.currentCharge += 0.1; // 0.1 seconds per tick at 10Hz
        if (m.currentCharge >= m.chargeMax) {
            m.currentCharge = 0;
            _egFireMonsterAttack(m);
        }
    });

    _egUpdateBars();
}


//------------------------------------------------------------------------
//-------------------MONSTER ATTACKS (Monster → Player)-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Flashes the monster's card to signal it is attacking.
function _egFlashMonsterAttackCard(monster) {
    const card = document.getElementById(`eg-card-${monster.id}`);
    if (!card) return;
    card.classList.remove('eg-flash-attack');
    void card.offsetWidth; // force reflow so the CSS animation restarts
    card.classList.add('eg-flash-attack');
}

// Applies hit-feedback to the player HUD on projectile impact:
// shows a floating damage number and briefly squishes + red-glows the HUD element.
function _egApplyPlayerHitFeedback(damageValue) {
    const hud = document.getElementById('class-hud-drag-handle');
    if (!hud) return;

    const dmgLabel = document.createElement('div');
    dmgLabel.className = 'eg-player-damage';
    dmgLabel.textContent = `-${damageValue}`;
    hud.appendChild(dmgLabel);
    setTimeout(() => dmgLabel.remove(), 500);

    hud.style.transform = 'scale(0.95)';
    hud.style.boxShadow = 'inset 0 0 15px rgba(255,0,0,0.8), 0 0 15px rgba(255,0,0,0.8)';
    setTimeout(() => { hud.style.transform = ''; hud.style.boxShadow = ''; }, 150);
}

// Fires the monster's attack: evaluates attack type, flashes card, and fires animation.
function _egFireMonsterAttack(monster) {
    _egFlashMonsterAttackCard(monster);

    // Resolve what kind of action is executing this turn
    let chosenAttack = monster.attackType || 'ranged';
    if (chosenAttack === 'both') {
        chosenAttack = Math.random() < 0.5 ? 'melee' : 'ranged';
    }

    // Branch animations conditionally
    if (chosenAttack === 'melee') {
        _egAnimateMonsterMelee(monster);
    } else {
        _egAnimateMonsterProjectile(monster);
    }
}

// Launches a projectile from the monster's card to the player HUD.
function _egAnimateMonsterProjectile(monster) {
    const sourceCard = document.getElementById(`eg-card-${monster.id}`);
    const targetHud = document.getElementById('class-hud-drag-handle');
    if (!sourceCard || !targetHud) return;

    const start = _egGetElementCentre(sourceCard);
    const end = _egGetElementCentre(targetHud);

    _egFireProjectile(monster.emoji, 'eg-proj-monster', start, end, 400, 'ease-in', () => {
        _egPlayerTakeDamage(monster.damageValue);
        _egApplyPlayerHitFeedback(monster.damageValue);
    });
}

// Physically lunges the monster card to the player HUD and flies back.
// Damage triggers at the peak impact step halfway through the roundtrip.
function _egAnimateMonsterMelee(monster) {
    const sourceCard = document.getElementById(`eg-card-${monster.id}`);
    const targetHud = document.getElementById('class-hud-drag-handle');
    if (!sourceCard || !targetHud) return;

    // Calculate structural relative spatial offset path
    const start = _egGetElementCentre(sourceCard);
    const end = _egGetElementCentre(targetHud);
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const duration = 500; // Roundtrip animation timeline duration (ms)

    // Ensure the lunging card renders on top of everything else during flight
    sourceCard.style.zIndex = '999';

    const anim = sourceCard.animate([
        { transform: 'translate(0px, 0px) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(1.15)` }, // Apex impact step
        { transform: 'translate(0px, 0px) scale(1)' }
    ], { duration, easing: 'ease-in-out' });

    // Clean up explicit stacking context when animation safely settles
    anim.onfinish = () => {
        sourceCard.style.zIndex = '';
    };

    // Calculate midpoint of duration to accurately deliver impact timing
    setTimeout(() => {
        // Validation safety checks to verify encounter structural integrity
        if (!_egIsActive() || !_egMonsters.some(m => m.id === monster.id)) return;

        _egPlayerTakeDamage(monster.damageValue);
        _egApplyPlayerHitFeedback(monster.damageValue);
    }, duration / 2);
}


//------------------------------------------------------------------------
//-------------------PLAYER ATTACKS (Player → Monster)--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Tracks a correctly filled cell in the recent-fills circular buffer.
// Used by the Prior Bomb mechanic to undo recent progress.
function _egTrackRecentFill(row, col) {
    _egRecentFills.push([row, col]);
    if (_egRecentFills.length > EG_RECENT_FILLS_CAPACITY) _egRecentFills.shift();
}

// Entry point called from mouse-button-handlers.js on every correct cell fill.
// Calculates damage, snapshots the current target (so mid-flight target changes
// don't redirect the projectile), then launches the player's projectile.
function _egOnCorrectCell(row, col) {
    if (!_egIsActive()) return;

    if (row !== undefined && col !== undefined) _egTrackRecentFill(row, col);

    const damage = _egCalcPlayerDamage();
    const targetIdAtFire = _egTargetId; // snapshot before animation completes
    _egAnimatePlayerProjectile(damage, targetIdAtFire);
}

// Launches a projectile from the player HUD to the targeted monster card.
// If the target card is not visible (e.g. monster not yet rendered), damage
// is applied immediately without animation so no hits are lost.
function _egAnimatePlayerProjectile(damage, targetId) {
    const sourceHud = document.getElementById('class-hud-drag-handle');
    const targetCard = targetId ? document.getElementById(`eg-card-${targetId}`) : null;

    if (!sourceHud || !targetCard) {
        // No visual target — apply damage instantly
        if (damage != null) _egDamageTargetById(targetId, damage);
        return;
    }

    const start = _egGetElementCentre(sourceHud);
    const end = _egGetElementCentre(targetCard);
    const projDef = _egGetProjectileDef();

    _egFireProjectile(projDef.emoji, projDef.cssClass, start, end, projDef.duration, projDef.easing, () => {
        _egDamageTargetById(targetId, damage);
    });
}


//------------------------------------------------------------------------
//-------------------TARGETING--------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the currently targeted monster object, or null if none.
function _egGetTarget() {
    if (!_egTargetId) return null;
    return _egMonsters.find(m => m.id === _egTargetId) || null;
}

// Sets the player's target to the given monster id and refreshes the panel.
// Called by onclick on the monster cards in the rendered panel HTML.
function _egSelectTarget(monsterId) {
    if (!_egIsActive()) return;
    _egTargetId = monsterId;
    _egRenderPanel();
}

// Convenience wrapper — damages the currently selected target.
// Kept for any legacy callers that don't pass an explicit id.
function _egDamageTarget(amount) {
    _egDamageTargetById(_egTargetId, amount);
}


//------------------------------------------------------------------------
//-------------------DAMAGE APPLICATION-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Applies incoming player damage to a specific monster by id.
// Handles boss immunity, charge pushback, phase transition checks, and kill detection.
// Called by the projectile onfinish callback so the impact moment matches visually.
function _egDamageTargetById(monsterId, amount) {
    if (!_egIsActive()) return;

    const target = _egMonsters.find(m => m.id === monsterId);
    if (!target) return;

    // Boss immunity window — ignore damage and show the immune flash
    if (target.bossImmune) {
        _egFlashImmune(target.id);
        return;
    }

    // Apply damage and charge pushback
    target.currentHP = Math.max(0, target.currentHP - amount);
    target.currentCharge = Math.max(0, target.currentCharge - EG_PLAYER_STATS.chargePushback);

    _egShowDamageNumber(target.id, amount);
    _egFlashDamageCard(target.id);

    // Check for boss phase transition before checking death
    if (target.isBoss) _egBossCheckPhase(target);

    if (target.currentHP <= 0) {
        _egKillMonster(target.id);
        return;
    }
    _egUpdateBars();
}

// Applies incoming monster damage to the player.
// Triggers the game-over sequence if the player's HP reaches zero.
function _egPlayerTakeDamage(amount) {
    if (!_egIsActive()) return;
    playerCurrentHP = Math.max(0, playerCurrentHP - amount);
    _renderPlayerHealth();
    if (playerCurrentHP <= 0) _egGameOver();
}


//------------------------------------------------------------------------
//-------------------MONSTER LIFECYCLE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Removes a monster from the encounter after its death animation fires.
// If more monsters remain, auto-targets the first one.
// If none remain, triggers the wave-clear sequence.
function _egKillMonster(monsterId) {
    const dying = _egMonsters.find(m => m.id === monsterId);
    _egBossCleanup(monsterId);
    _egFlashKillCard(monsterId);
    _egMonsters = _egMonsters.filter(m => m.id !== monsterId);

    if (_egMonsters.length > 0) {
        _egTargetId = _egMonsters[0].id;
    } else {
        _egTargetId = null;
        _egOnAllMonstersDead();
    }

    if (dying && !dying.isBoss) {
        _egChainKillCount++;

        const req = _egGetMapRequirements();
        const total = req.totalMonsters;

        if (total > 0) {
            showToast(`⚔️ ${dying.name} defeated! (${_egChainKillCount}/${total})`);
        } else {
            showToast(`⚔️ ${dying.name} defeated!`);
        }

        _egUpdateObjectivesHUD();

        // Boss spawns at 50% of totalMonsters (only once, only if a boss is configured)
        const bossThreshold = total > 0 ? Math.floor(total / 2) : 0;
        if (req.hasBoss && !_egBossSpawned && bossThreshold > 0 && _egChainKillCount >= bossThreshold) {
            _egBossSpawned = true;
            setTimeout(() => {
                if (_egIsActive()) _egSpawnChainBoss();
            }, 1500);
        }

        // Keep spawning regular monsters until total is reached (and boss slot doesn't block it)
        const totalReached = total > 0 && _egChainKillCount >= total;
        if (!totalReached) {
            _egScheduleRespawn();
        }
    }

    if (dying && dying.isBoss) {
        showToast(`🏆 ${dying.name} defeated!`);
        _egUpdateObjectivesHUD();
    }

    setTimeout(() => _egRenderPanel(), 350);
}

// Called when the last monster in the encounter is killed.
function _egOnAllMonstersDead() {
    // Intentionally empty — kill toasts handle all feedback.
}

// Triggers the game-over sequence when the player's HP reaches zero.
function _egGameOver() {
    _egStopEncounter();
    dead = true;
    stopTimer();
    document.getElementById('lose-title').textContent = 'Game Over';
    document.getElementById('lose-sub').textContent = 'The monsters overwhelmed you!';
    document.getElementById('ov-lose').classList.add('show');
}

// Adds a monster to the live encounter and notifies the player.
// Handles boss-specific initialisation if the spawned monster is a boss.
function _egSpawnMonster(defId, level) {
    if (_egMonsters.length >= EG_MAX_CONCURRENT_MONSTERS) return;
    let monster = _egBuildMonster(defId, level);
    if (!monster) {
        monster = _egBuildBoss(defId, level);
        if (monster) monster.isBoss = true; // tag so _egBossInit and isBoss checks work
    }
    if (!monster) return;

    // --- NEW LOGIC: Assign a random spawn zone ---
    const spawnZones = [
        'eg-monster-panel',
        'eg-panel-left',
        'eg-panel-right',
        'eg-panel-bottom',
        'eg-panel-top-corner'
    ];
    monster.zoneId = spawnZones[Math.floor(Math.random() * spawnZones.length)];
    // ---------------------------------------------

    _egMonsters.push(monster);
    if (!_egTargetId) _egTargetId = monster.id; // auto-target first monster to arrive
    _egRenderPanel();

    if (typeof showToast !== 'function') return;

    if (monster.isBoss) {
        showToast(`💀 BOSS: ${monster.name} has arrived!`);
        _egBossInit(monster);
    } else {
        showToast(`⚠️ ${monster.name} appeared!`);
    }
}


//------------------------------------------------------------------------
//-------------------VISUAL EFFECTS---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Appends a floating "-N" damage number to the monster's card that fades out.
function _egShowDamageNumber(monsterId, amount) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;

    const dmgText = document.createElement('div');
    dmgText.className = 'eg-damage-number';
    dmgText.textContent = `-${amount}`;
    card.appendChild(dmgText);
    setTimeout(() => dmgText.remove(), 600);
}

// Triggers the damage flash CSS animation on the monster's card.
// The class is removed and re-added to restart the animation every hit.
function _egFlashDamageCard(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;
    card.classList.remove('eg-flash-damage');
    void card.offsetWidth; // force reflow to restart the animation
    card.classList.add('eg-flash-damage');
}

// Adds the kill flash class to the monster's card (plays the death animation).
function _egFlashKillCard(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (card) card.classList.add('eg-flash-kill');
}

// Shows the IMMUNE label and flashes the immunity animation on the monster's card.
function _egFlashImmune(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;

    card.classList.remove('eg-flash-immune');
    void card.offsetWidth;
    card.classList.add('eg-flash-immune');
    setTimeout(() => card.classList.remove('eg-flash-immune'), 400);

    const label = document.createElement('div');
    label.className = 'eg-damage-number eg-immune-label';
    label.textContent = 'IMMUNE';
    card.appendChild(label);
    setTimeout(() => label.remove(), 700);
}


//------------------------------------------------------------------------
//-------------------RENDER-----------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the CSS class for an HP bar based on the percentage remaining.
function _egHpBarClass(hpPct) {
    if (hpPct > 60) return 'eg-hp-high';
    if (hpPct > 30) return 'eg-hp-mid';
    return 'eg-hp-low';
}

// Builds the badge HTML for a monster's name row (level, boss phase, immune, target).
function _egBuildMonsterBadgesHTML(m, isTarget) {
    let html = `<span class="eg-level-badge">Lv ${m.level}</span>`;
    if (m.isBoss && m.bossPhase)
        html += `<span class="eg-boss-phase-badge eg-boss-phase-${m.bossPhase}">Phase ${m.bossPhase}</span>`;
    if (m.bossImmune)
        html += `<span class="eg-boss-immune-badge">IMMUNE</span>`;
    if (isTarget)
        html += `<span class="eg-target-badge">TARGET</span>`;
    return html;
}

// Full panel rebuild helper for ultra-compact emoji cards
function _egBuildMonsterCardHTML(m) {
    const hpPct = Math.max(0, Math.round((m.currentHP / m.maxHP) * 100));
    const chargePct = Math.min(100, Math.max(0, (m.currentCharge / m.chargeMax) * 100));
    const isTarget = (m.id === _egTargetId);

    return `
    <div class="eg-monster-card-compact" id="eg-card-${m.id}" onclick="_egSelectTarget('${m.id}')">
        
        <!-- Bars stacked top-to-bottom: Charge bar then Life bar above the icon -->
        <div class="eg-compact-bars">
            <div class="eg-charge-track-compact">
                <div class="eg-charge-bar" id="eg-charge-bar-${m.id}" style="width:${chargePct}%"></div>
            </div>
            <div class="eg-hp-track-compact">
                <div class="eg-hp-bar-compact" id="eg-hp-bar-${m.id}" style="width:${hpPct}%"></div>
            </div>
        </div>

        <!-- Emoji Icon Box with built-in Level Badge & Hover Tooltip -->
        <div class="eg-emoji-wrapper ${isTarget ? 'eg-compact-targeted' : ''}">
            <span class="eg-monster-emoji-compact">${m.emoji}</span>
            <span class="eg-level-bottom-left">${m.level}</span>
            
            <!-- Hover Tooltip Container -->
            <div class="eg-monster-compact-tooltip">
                <div class="eg-tooltip-name">${m.name}</div>
                <div class="eg-tooltip-hp" id="eg-hp-label-${m.id}">${m.currentHP} / ${m.maxHP} HP</div>
            </div>
        </div>

    </div>`;
}

// High-frequency bar update (10Hz). Only touches bar widths and HP text —
// no DOM rebuilds. Keeps the tick loop cheap.
function _egUpdateBars() {
    if (!_egIsActive()) return;
    _egMonsters.forEach(m => {
        const hpPct = Math.max(0, Math.round((m.currentHP / m.maxHP) * 100));
        const chargePct = Math.min(100, Math.max(0, (m.currentCharge / m.chargeMax) * 100));

        const hpBar = document.getElementById(`eg-hp-bar-${m.id}`);
        const chargeBar = document.getElementById(`eg-charge-bar-${m.id}`);
        const hpLabel = document.getElementById(`eg-hp-label-${m.id}`);

        if (hpBar) { hpBar.style.width = hpPct + '%'; hpBar.className = `eg-hp-bar ${_egHpBarClass(hpPct)}`; }
        if (chargeBar) chargeBar.style.width = chargePct + '%';
        if (hpLabel) hpLabel.textContent = `${m.currentHP} / ${m.maxHP} HP`;
    });
}

// Full panel rebuild. Only called on spawn, death, or target change —
// never from the tick loop.
function _egRenderPanel() {
    const wrapper = document.getElementById('eg-monster-wrapper');
    const allZones = [
        'eg-monster-panel',
        'eg-panel-left',
        'eg-panel-right',
        'eg-panel-bottom',
        'eg-panel-top-corner'
    ];

    // 1. Hide the wrapper and clear ALL zones if there is no active encounter
    if (!_egIsActive()) {
        allZones.forEach(zone => {
            const el = document.getElementById(zone);
            if (el) el.innerHTML = '';
        });
        if (wrapper) wrapper.classList.add('eg-hidden');
        return;
    }

    // 2. If the encounter IS active, ALWAYS reserve the space to prevent grid shift
    if (wrapper) wrapper.classList.remove('eg-hidden');

    // 3. Clear all zones first to prepare for the fresh render
    allZones.forEach(zone => {
        const el = document.getElementById(zone);
        if (el) el.innerHTML = '';
    });

    // 4. Render each card into its assigned zone
    _egMonsters.forEach(m => {
        const targetZoneId = m.zoneId || 'eg-monster-panel'; // Fallback just in case
        const targetZone = document.getElementById(targetZoneId);

        if (targetZone) {
            // We use += instead of = so multiple monsters assigned to the same zone stack up nicely
            targetZone.innerHTML += _egBuildMonsterCardHTML(m);
        }
    });
}
