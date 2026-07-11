//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA DEFINITIONS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Class projectile visuals
// Maps playerClass to the visual appearance of the outgoing player projectile.
// _default is used when the player's class is null or unrecognised.
const EG_CLASS_PROJECTILES = {
    probabilist: { emoji: '➤', cssClass: 'eg-proj-arrow', duration: 1000, easing: 'linear' },
    mathmagician: { emoji: '🔥', cssClass: 'eg-proj-fireball', duration: 1000, easing: 'ease-in' },
    statistician: { emoji: '🗡️', cssClass: 'eg-proj-sword', duration: 1000, easing: 'ease-out' },
    _default: { emoji: '⚡', cssClass: 'eg-proj-default', duration: 400, easing: 'ease-in' },
};





//------------------------------------------------------------------------
//-------------------PROJECTILE HELPERS-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the projectile definition for the player's current class.
// Falls back to _default when class is null or unrecognised.
function _egGetProjectileDef() {
    const cls = (typeof STATE !== 'undefined' && STATE.playerClass)
        ? STATE.playerClass.toLowerCase()
        : '_default';
    return EG_CLASS_PROJECTILES[cls] || EG_CLASS_PROJECTILES._default;
}

// Returns the screen-centre coordinates of a DOM element as { x, y }.
function _egGetElementCentre(el) {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// Creates, animates, and auto-removes a projectile div travelling from start to end.
// onArrive() is called when the animation completes (i.e. on impact).
function _egFireProjectile(emoji, cssClass, start, end, duration, easing, onArrive) {
    const proj = document.createElement('div');
    proj.className = `eg-projectile ${cssClass}`;
    proj.textContent = emoji;
    proj.style.left = '0px';
    proj.style.top = '0px';
    document.body.appendChild(proj);

    const anim = proj.animate([
        { transform: `translate(${start.x}px, ${start.y}px) scale(1.5)` },
        { transform: `translate(${end.x}px,   ${end.y}px)   scale(0.5)` },
    ], { duration, easing });

    anim.onfinish = () => { proj.remove(); onArrive(); };
}