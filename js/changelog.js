//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

const CHANGELOG_DATA = [
    {
        version: "v0.24 BETA",
        date: "08.06.2026",
        changes: [
            {
                category: "New Features",
                items: [
                    "Added this Changelog. Will stay English only for now.",
                    "Added a Passive Tracker that tracks the state of various probability tree nodes while doing a puzzle. The Passive Tracker can be minimized and moved around.",
                    "Achievements for interactions with the Probability Tree and the Inference system have been added.",
                    "Added Pause functionality: Pressing Escape while in a Level now pauses and unpauses the game.",
                    "Added World 8.",

                ],
            },
            {
                category: "General Adjustments",
                items: [
                    "Slightly adjusted the order of levels in world 1 and 4.",
                    "Slightly adjusted the following levels: Union Bound, Exponential Distribution, Impossible Event, Algebra, Probability Tree, Quantile Function, Expectation, Discrete Expected Value, Draw without Order with Replacement, Standard Deviation, Variance Property, Transformation, Density Transform, Linearity, Convolution, Standard Normal, Poisson Limit Theorem, Geometric Expectation, Poisson Convolution, Geometric Distribution, Hypergeometric Distribution, Multivariate Normal Distribution, Variance of Dependent Sum, Correlation Bound, Bilinearity, Data Histogram with Gaussian Curve, Mean, Tschebyscheff, Central Limit Theorem  ",
                    "Multiple Choice and Excercises now use a different font for question texts and font size has been increased. This should help with seeing math symbols more clearly.",
                    "Updated and improved various Multiple Choice and Excercise questions.",
                    "Added a new sound effect that occurs when a shield - item effect protects the player from a penalty.",
                    "Using a Shield now visually protects the whole grid while it is active.",
                    "Almost all files have gotten another round of optimization and cleanup.",
                    "Updated the How-to-play? section.",
                    "Tutor - Items can now no longer be used when having no mistakes",
                    "The same question can now no longer appear more than once within the same Scouts Primer question pool.",
                    "Alot of german text has been updated.",
                    "Achievement Toasts now only show for 5 seconds (down from 10 seconds). They also appear much faster on the screen now.",
                    "Progress Bars towards Moodle Codes are now shown in the Codes screen instead of the Highscore screen. These now also give information about achievement milestone progress towards unlocking Moodle Codes.",
                    "Adjusted the Level Selection tooltip on Levels to indicate that you can get even more Score by completing the level faster when having all modifiers.",
                    "Time Penalties for mistakes have been slightly increased to offset all of the available ways of increasing time that exist now.",
                    "Title Screen has been modernized",
                    "Started building the foundations for an Endgame system.",
                ],
            },
            {
                category: "Class Changes",
                items: [
                    "Actuary: New sound effects added for both abilities.",
                    "Outlier: Tail Risk ability description has been adjusted.",
                    "Outlier: Tail Risk now shows the costs in minutes:seconds instead of only in seconds.",
                    "Probabilist: Precision Mark Bows now only target the cells it has just marked, instead of all marked cells on the grid.",
                    "Bayesian: Bayes Traps Fuse Timer reduced from 10 seconds down to 7 seconds.",
                    "Random Walker: Brownian Motion and Drifter are now instant abilities.", 
                    "Random Walker: Drifter cooldown has been reduced from 10 minutes to 5 minutes.",
                    "Random Walker: Drifter's parting gift is no longer able to walk.",
                    "Random Walker: Drifter's remaining Timer is now additionally also shown as Countdown underneath the icon on the grid.",
                    "Recursionist: Residual now properly requires a mistake cell to be selected.",
                    "Recursionist: Base Radius of Residual Totem Beams has been increased by 1 for each ability rank.",
                ],
            },
            {
                category: "Probability Tree",
                items: [
                    "Keystone nodes have been renamed to Keystones.",
                    "Keystone nodes are now visually distinct on the Probability Tree.",
                    "When opening the Tree the view is now centered on the last node you have selected.",
                    "Added a new sound effect for the Poisson Process node.",
                    "Binomial Burst now has a visual effect and an audio cue when it activates.",
                    "Residual Analysis proc chance has been lowered from 25% to 10%. Other nodes can now increase the chance to 25%.",
                    "Added a new visual and sound effect for Residual Analysis.",
                    "Error Feedback now has a new visual and sound effect.",
                    "Overfitting now plays an Alert sound when crossing the treshold.",
                    "Sample Efficiency now has new visuals and sound effects",
                    "Stochastic Resonance now has new visuals and sound effects",
                ],
            },
            {
                category: "Bug Fixes",
                items: [
                    "Fixed a bug that caused Inference Milestone Popups to not play a sound effect.",
                    "Fixed a bug that allowed casting instant abilities while a targeted ability was already armed.",
                    "Fixed a bug that made units on input Excercises not respect the chosen language when they were picked as bonus quiz question.",
                    "Fixed a bug that caused issues with scaling the grid.",
                    "Fixed a bug that made the Back buttons on the Highscores and Moodle Codes tabs huge.",
                ],
            }
        ]
    }
];


//------------------------------------------------------------------------
//-------------------CHANGELOG RENDERING----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds the HTML string for a single change category group (e.g. "Bug Fixes")
function buildCategoryGroupHtml(group) {
    const items = group.items
        .map(item => `<li>${item}</li>`)
        .join("");

    return `
        <div class="cl-category-group">
            <div class="cl-category-label">${group.category}</div>
            <ul class="cl-list">${items}</ul>
        </div>`;
}

// Builds the HTML string for a single version block, including all its category groups
function buildVersionBlockHtml(update) {
    const categoryGroupsHtml = update.changes
        .map(buildCategoryGroupHtml)
        .join("");

    return `
        <div class="cl-version-block">
            <div class="cl-header">
                <span class="cl-version-num">${update.version}</span>
                <span class="cl-date">${update.date}</span>
            </div>
            ${categoryGroupsHtml}
        </div>`;
}

// Renders the full changelog into the DOM. Skips if already rendered.
function renderChangelog() {
    const container = document.getElementById("changelog-content");
    if (container.innerHTML !== "") return;

    container.innerHTML = CHANGELOG_DATA
        .map(buildVersionBlockHtml)
        .join("");
}


//------------------------------------------------------------------------
//-------------------CHANGELOG MODAL--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Opens the changelog modal, rendering its content first if needed
function openChangelog() {
    renderChangelog();
    document.getElementById("changelog-modal").classList.add("show");
}