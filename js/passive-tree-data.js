const TALENT_TREE_DATA = 
{
    "Skills": [
        {
            "Skill Name": "Start",
            "Skill Position": "(15,2)",
            "Skill Position Exact": {
                "x": 1752,
                "y": 246
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Grid General",
                "Classes",
                "Tutor"
            ],
            "Skill Prerequisite": "-",
            "Skill Resources": []
        },
        {
            "Skill Name": "Item Consumption",
            "Skill Position": "(15,4)",
            "Skill Position Exact": {
                "x": 1777,
                "y": 511
            },
            "Skill Level": 1,
            "Skill Description": "5% chance to not remove an Item after useage",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Reveal Items Droprate",
                "Timer Item Droprate",
                "Shield Item Droprate",
                "Cursed Item Droprate",
                "Marker Item Droprate"
            ],
            "Skill Prerequisite": "-",
            "Skill Resources": []
        },
        {
            "Skill Name": "Grid General",
            "Skill Position": "(21,2)",
            "Skill Position Exact": {
                "x": 2557,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "Chance to auto - reveal 1/2/3 random tiles on level start",
            "Skill Max Points": 3,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "small grid (up to 25 cells)",
                "huge grid",
                "medium grid"
            ],
            "Skill Prerequisite": "Start (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Classes",
            "Skill Position": "(10,2)",
            "Skill Position Exact": {
                "x": 1177,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "Active Class Abilities have their cooldowns reduced by 30 seconds.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Gear of the Mathmagician",
                "Gear of the Statistician",
                "Gear of the Probabilist"
            ],
            "Skill Prerequisite": "Start (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "medium grid",
            "Skill Position": "(27,0)",
            "Skill Position Exact": {
                "x": 3217,
                "y": -29
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Skill 25",
                "Skill 26"
            ],
            "Skill Prerequisite": "Grid General (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "small grid (up to 25 cells)",
            "Skill Position": "(25,-1)",
            "Skill Position Exact": {
                "x": 3037,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "20 % chance to reveal 1/2/3 correct cells on level start\n20% chance to mark 1/2/3 incorrect cells on level start",
            "Skill Max Points": 3,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "small grid revealer",
                "small grid marker"
            ],
            "Skill Prerequisite": "Grid General (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "large grid",
            "Skill Position": "(27,2)",
            "Skill Position Exact": {
                "x": 3217,
                "y": 211
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Skill 27",
                "Skill 28"
            ],
            "Skill Prerequisite": "-",
            "Skill Resources": []
        },
        {
            "Skill Name": "huge grid",
            "Skill Position": "(27,4)",
            "Skill Position Exact": {
                "x": 3217,
                "y": 451
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Skill 22",
                "Skill 21"
            ],
            "Skill Prerequisite": "Grid General (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 21",
            "Skill Position": "(28,5)",
            "Skill Position Exact": {
                "x": 3337,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "huge grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 22",
            "Skill Position": "(28,4)",
            "Skill Position Exact": {
                "x": 3337,
                "y": 451
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "huge grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "small grid revealer",
            "Skill Position": "(27,-1)",
            "Skill Position Exact": {
                "x": 3217,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "",
            "Skill Max Points": 3,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "small grid (up to 25 cells) (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "small grid marker",
            "Skill Position": "(27,-2)",
            "Skill Position Exact": {
                "x": 3217,
                "y": -269
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "small grid (up to 25 cells) (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 25",
            "Skill Position": "(28,1)",
            "Skill Position Exact": {
                "x": 3337,
                "y": 91
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "medium grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 26",
            "Skill Position": "(28,0)",
            "Skill Position Exact": {
                "x": 3337,
                "y": -29
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "medium grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 27",
            "Skill Position": "(28,2)",
            "Skill Position Exact": {
                "x": 3337,
                "y": 211
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "large grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Skill 28",
            "Skill Position": "(28,3)",
            "Skill Position Exact": {
                "x": 3337,
                "y": 331
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 5,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "large grid (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Reveal Items Droprate",
            "Skill Position": "(11,5)",
            "Skill Position Exact": {
                "x": 1357,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Reveal - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Reveal Items Droprate copy"
            ],
            "Skill Prerequisite": "Item Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Marker Item Droprate",
            "Skill Position": "(19,5)",
            "Skill Position Exact": {
                "x": 2317,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Marker - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Marker Item Droprate copy"
            ],
            "Skill Prerequisite": "Item Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Timer Item Droprate",
            "Skill Position": "(12,7)",
            "Skill Position Exact": {
                "x": 1477,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Timer - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Timer Item Droprate copy"
            ],
            "Skill Prerequisite": "Item Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Cursed Item Droprate",
            "Skill Position": "(15,7)",
            "Skill Position Exact": {
                "x": 1777,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Cursed - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Cursed Item Droprate copy"
            ],
            "Skill Prerequisite": "Item Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shield Item Droprate",
            "Skill Position": "(17,7)",
            "Skill Position Exact": {
                "x": 2077,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Shield - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Shield Item Droprate copy"
            ],
            "Skill Prerequisite": "Item Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Mathmagician",
            "Skill Position": "(7,2)",
            "Skill Position Exact": {
                "x": 817,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "Mathmagicians have a 20% higher chance to receive Freeze and Chronobolt Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Gear of the Mathmagician"
            ],
            "Skill Prerequisite": "Classes (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Entropy",
            "Skill Position": "(3,2)",
            "Skill Position Exact": {
                "x": 337,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Entropy"
            ],
            "Skill Prerequisite": "Gear of the Mathmagician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Tutor",
            "Skill Position": "(15,0)",
            "Skill Position Exact": {
                "x": 1777,
                "y": -29
            },
            "Skill Level": 1,
            "Skill Description": "Enables useage of Tutor items during a Bonus Quiz or Probability Gate question. The Tutor has a 10% chance to automatically answers the question for you. Requires a Tutor item to be in the inventory and consumes the item on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Stochastics Tutor",
                "Tutor Consumption",
                "Probability Gate Hint and Item",
                "Bonus Quiz Marker and Item"
            ],
            "Skill Prerequisite": "Start (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Stochastics Tutor",
            "Skill Position": "(16,-2)",
            "Skill Position Exact": {
                "x": 1897,
                "y": -269
            },
            "Skill Level": 1,
            "Skill Description": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Statistics Tutor"
            ],
            "Skill Prerequisite": "Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Tutor Consumption",
            "Skill Position": "(14,-2)",
            "Skill Position Exact": {
                "x": 1657,
                "y": -269
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Tutor Consumption"
            ],
            "Skill Prerequisite": "Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Statistics Tutor",
            "Skill Position": "(16,-4)",
            "Skill Position Exact": {
                "x": 1897,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Math Tutor"
            ],
            "Skill Prerequisite": "Stochastics Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Math Tutor",
            "Skill Position": "(16,-5)",
            "Skill Position Exact": {
                "x": 1897,
                "y": -569
            },
            "Skill Level": 1,
            "Skill Description": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "My Tutor is a Professor"
            ],
            "Skill Prerequisite": "Statistics Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Tutor Consumption",
            "Skill Position": "(14,-4)",
            "Skill Position Exact": {
                "x": 1657,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Tutor Consumption"
            ],
            "Skill Prerequisite": "Tutor Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Tutor Consumption",
            "Skill Position": "(14,-5)",
            "Skill Position Exact": {
                "x": 1657,
                "y": -569
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "My Tutor is a Professor"
            ],
            "Skill Prerequisite": "Tutor Consumption (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "My Tutor is a Professor",
            "Skill Position": "(15,-6)",
            "Skill Position Exact": {
                "x": 1777,
                "y": -689
            },
            "Skill Level": 1,
            "Skill Description": "Increases the chance that the tutor can solve the question by an additional 20%.\n20% chance to not spend the Tutor item when using a Tutor to answer a question.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Math Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Hint and Item",
            "Skill Position": "(11,-1)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "Probability Gates will show a hint after 5 unsuccessfull attempts.\n10% chance to receive an additional Item reward when completing a Probability Gate.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Helper",
                "Probability Gate Item Bonus"
            ],
            "Skill Prerequisite": "Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Helper",
            "Skill Position": "(11,-3)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -329
            },
            "Skill Level": 1,
            "Skill Description": "Probability Gates now show up after one less unsuccessfull attempt.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Helper ",
                "Primed Row Reveals copy"
            ],
            "Skill Prerequisite": "Probability Gate Hint and Item (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Helper ",
            "Skill Position": "(9,-4)",
            "Skill Position Exact": {
                "x": 1117,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "Probability Gates now show up after one less unsuccessfull attempt.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Helper"
            ],
            "Skill Prerequisite": "Probability Gate Helper (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Helper",
            "Skill Position": "(7,-4)",
            "Skill Position Exact": {
                "x": 877,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "Probability Gates now show up after one less unsuccessfull attempt.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Mastery"
            ],
            "Skill Prerequisite": "Probability Gate Helper  (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Mastery",
            "Skill Position": "(6,-3)",
            "Skill Position Exact": {
                "x": 697,
                "y": -329
            },
            "Skill Level": 1,
            "Skill Description": "Probability Gate Hints now immideately show up.\n30% chance to receive an additional Item reward when completing a Probability Gate.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Probability Gate Helper (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Item Bonus",
            "Skill Position": "(10,-1)",
            "Skill Position Exact": {
                "x": 1177,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "20% chance to receive an additional item when completing a Probability Gate.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Item Bonus"
            ],
            "Skill Prerequisite": "Probability Gate Hint and Item (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Item Bonus copy",
            "Skill Position": "(7,-1)",
            "Skill Position Exact": {
                "x": 817,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "20% chance to receive an additional item when completing a Probability Gate.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Mastery"
            ],
            "Skill Prerequisite": "Probability Gate Item Bonus (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Probability Gate Item Bonus",
            "Skill Position": "(8,-1)",
            "Skill Position Exact": {
                "x": 997,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "20% chance to receive an additional item when completing a Probability Gate.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Probability Gate Item Bonus copy"
            ],
            "Skill Prerequisite": "Probability Gate Item Bonus (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Marker and Item",
            "Skill Position": "(17,-1)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to automatically remove one wrong answer from a Multiple Choice question.\n10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Item",
                "Bonus Quiz Marker"
            ],
            "Skill Prerequisite": "Tutor (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Marker",
            "Skill Position": "(17,-3)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -329
            },
            "Skill Level": 1,
            "Skill Description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Marker",
                "Primed Column Reveals"
            ],
            "Skill Prerequisite": "Bonus Quiz Marker and Item (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Item",
            "Skill Position": "(19,-1)",
            "Skill Position Exact": {
                "x": 2257,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Item copy"
            ],
            "Skill Prerequisite": "Bonus Quiz Marker and Item (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Item copy",
            "Skill Position": "(20,-1)",
            "Skill Position Exact": {
                "x": 2437,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Item copy"
            ],
            "Skill Prerequisite": "Bonus Quiz Item (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Item copy",
            "Skill Position": "(22,-1)",
            "Skill Position Exact": {
                "x": 2617,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Mastery"
            ],
            "Skill Prerequisite": "Bonus Quiz Item copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Marker",
            "Skill Position": "(19,-4)",
            "Skill Position Exact": {
                "x": 2317,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Marker"
            ],
            "Skill Prerequisite": "Bonus Quiz Marker (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Marker",
            "Skill Position": "(21,-4)",
            "Skill Position Exact": {
                "x": 2557,
                "y": -449
            },
            "Skill Level": 1,
            "Skill Description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bonus Quiz Mastery"
            ],
            "Skill Prerequisite": "Bonus Quiz Marker (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bonus Quiz Mastery",
            "Skill Position": "(23,-3)",
            "Skill Position Exact": {
                "x": 2737,
                "y": -329
            },
            "Skill Level": 1,
            "Skill Description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.\n10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Bonus Quiz Marker (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Mathmagician",
            "Skill Position": "(5,2)",
            "Skill Position Exact": {
                "x": 577,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "Mathmagicians have a 20% higher chance to receive Freeze and Chronobolt Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Entropy",
                "Magical Revelations",
                "Shiver"
            ],
            "Skill Prerequisite": "Gear of the Mathmagician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Entropy",
            "Skill Position": "(1,2)",
            "Skill Position Exact": {
                "x": 157,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Entropy"
            ],
            "Skill Prerequisite": "Entropy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Entropy",
            "Skill Position": "(0,2)",
            "Skill Position Exact": {
                "x": -23,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Variance Shield Mastery"
            ],
            "Skill Prerequisite": "Entropy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magical Revelations",
            "Skill Position": "(3,1)",
            "Skill Position Exact": {
                "x": 337,
                "y": 151
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magical Revelations"
            ],
            "Skill Prerequisite": "Gear of the Mathmagician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magical Revelations",
            "Skill Position": "(1,1)",
            "Skill Position Exact": {
                "x": 157,
                "y": 151
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magical Revelations"
            ],
            "Skill Prerequisite": "Magical Revelations (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magical Revelations",
            "Skill Position": "(0,1)",
            "Skill Position Exact": {
                "x": -23,
                "y": 151
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Arcane Reveal Mastery"
            ],
            "Skill Prerequisite": "Magical Revelations (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Arcane Reveal Mastery",
            "Skill Position": "(-2,1)",
            "Skill Position Exact": {
                "x": -203,
                "y": 151
            },
            "Skill Level": 1,
            "Skill Description": "20% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Mathmagician"
            ],
            "Skill Prerequisite": "Magical Revelations (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Variance Shield Mastery",
            "Skill Position": "(-2,2)",
            "Skill Position Exact": {
                "x": -263,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Mathmagician"
            ],
            "Skill Prerequisite": "Entropy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Path of the Mathmagician",
            "Skill Position": "(-4,2)",
            "Skill Position Exact": {
                "x": -443,
                "y": 271
            },
            "Skill Level": 1,
            "Skill Description": "Variance Shield now absorbs twice as many mistakes.\nArcane Reveal and Absolute Zero have their cooldowns reduced by 2 minutes.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Variance Shield Mastery (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shiver",
            "Skill Position": "(3,3)",
            "Skill Position Exact": {
                "x": 337,
                "y": 391
            },
            "Skill Level": 1,
            "Skill Description": "Absolute Zero lasts 0.2 more seconds.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Shiver"
            ],
            "Skill Prerequisite": "Gear of the Mathmagician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shiver",
            "Skill Position": "(1,3)",
            "Skill Position Exact": {
                "x": 157,
                "y": 391
            },
            "Skill Level": 1,
            "Skill Description": "Absolute Zero lasts 0.2 more seconds.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Shiver"
            ],
            "Skill Prerequisite": "Shiver (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shiver",
            "Skill Position": "(0,3)",
            "Skill Position Exact": {
                "x": -23,
                "y": 391
            },
            "Skill Level": 1,
            "Skill Description": "Absolute Zero lasts 0.2 more seconds.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Absolute Zero Mastery"
            ],
            "Skill Prerequisite": "Shiver (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Absolute Zero Mastery",
            "Skill Position": "(-2,3)",
            "Skill Position Exact": {
                "x": -203,
                "y": 391
            },
            "Skill Level": 1,
            "Skill Description": "20% chance for the Absolute Zero spell to not invoke a cooldown on use.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Mathmagician"
            ],
            "Skill Prerequisite": "Shiver (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Statistician",
            "Skill Position": "(7,1)",
            "Skill Position Exact": {
                "x": 817,
                "y": 151
            },
            "Skill Level": 1,
            "Skill Description": "Statisticians have a 20% higher chance to receive ? and ? Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Gear of the Statistician"
            ],
            "Skill Prerequisite": "Classes (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Probabilist",
            "Skill Position": "(7,3)",
            "Skill Position Exact": {
                "x": 817,
                "y": 391
            },
            "Skill Level": 1,
            "Skill Description": "Probabilists have a 20% higher chance to receive ? and ? Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Gear of the Probabilist"
            ],
            "Skill Prerequisite": "Classes (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Statistician",
            "Skill Position": "(5,0)",
            "Skill Position Exact": {
                "x": 637,
                "y": 31
            },
            "Skill Level": 1,
            "Skill Description": "Statisticians have a 20% higher chance to receive ? and ? Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Data Strike Enhancement",
                "Momentum",
                "Diagonal Strike enchancement"
            ],
            "Skill Prerequisite": "Gear of the Statistician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Gear of the Probabilist",
            "Skill Position": "(5,5)",
            "Skill Position Exact": {
                "x": 637,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Probabilists have a 20% higher chance to receive ? and ? Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Insight",
                "Precision Mark Augment",
                "Field Scan Augment"
            ],
            "Skill Prerequisite": "Gear of the Probabilist (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Momentum",
            "Skill Position": "(3,-1)",
            "Skill Position Exact": {
                "x": 397,
                "y": -89
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Momentum copy"
            ],
            "Skill Prerequisite": "Gear of the Statistician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Data Strike Enhancement",
            "Skill Position": "(4,-1)",
            "Skill Position Exact": {
                "x": 517,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Data Strike Enhancement copy"
            ],
            "Skill Prerequisite": "Gear of the Statistician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Diagonal Strike enchancement",
            "Skill Position": "(3,0)",
            "Skill Position Exact": {
                "x": 397,
                "y": 31
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Diagonal Strike enchancement copy"
            ],
            "Skill Prerequisite": "Gear of the Statistician (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Diagonal Strike enchancement copy",
            "Skill Position": "(-1,-1)",
            "Skill Position Exact": {
                "x": -83,
                "y": -89
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Diagonal Strike Mastery"
            ],
            "Skill Prerequisite": "Diagonal Strike enchancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Diagonal Strike enchancement copy",
            "Skill Position": "(0,0)",
            "Skill Position Exact": {
                "x": 37,
                "y": 31
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Diagonal Strike enchancement copy"
            ],
            "Skill Prerequisite": "Diagonal Strike enchancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Diagonal Strike enchancement copy",
            "Skill Position": "(2,0)",
            "Skill Position Exact": {
                "x": 217,
                "y": -29
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Diagonal Strike enchancement copy"
            ],
            "Skill Prerequisite": "Diagonal Strike enchancement (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Momentum copy",
            "Skill Position": "(0,-2)",
            "Skill Position Exact": {
                "x": 37,
                "y": -209
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Momentum Mastery"
            ],
            "Skill Prerequisite": "Momentum copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Momentum copy",
            "Skill Position": "(1,-1)",
            "Skill Position Exact": {
                "x": 157,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Momentum copy"
            ],
            "Skill Prerequisite": "Momentum copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Momentum copy",
            "Skill Position": "(2,-1)",
            "Skill Position Exact": {
                "x": 277,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Momentum copy"
            ],
            "Skill Prerequisite": "Momentum (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Data Strike Enhancement copy",
            "Skill Position": "(1,-3)",
            "Skill Position Exact": {
                "x": 157,
                "y": -329
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Data Strike Mastery"
            ],
            "Skill Prerequisite": "Data Strike Enhancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Data Strike Enhancement copy",
            "Skill Position": "(2,-2)",
            "Skill Position Exact": {
                "x": 277,
                "y": -269
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Data Strike Enhancement copy"
            ],
            "Skill Prerequisite": "Data Strike Enhancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Data Strike Enhancement copy",
            "Skill Position": "(3,-2)",
            "Skill Position Exact": {
                "x": 397,
                "y": -209
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Data Strike Enhancement copy"
            ],
            "Skill Prerequisite": "Data Strike Enhancement (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Momentum Mastery",
            "Skill Position": "(-1,-2)",
            "Skill Position Exact": {
                "x": -83,
                "y": -269
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Statistician"
            ],
            "Skill Prerequisite": "Momentum copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Data Strike Mastery",
            "Skill Position": "(0,-3)",
            "Skill Position Exact": {
                "x": 37,
                "y": -389
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Statistician"
            ],
            "Skill Prerequisite": "Data Strike Enhancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Diagonal Strike Mastery",
            "Skill Position": "(-2,-1)",
            "Skill Position Exact": {
                "x": -203,
                "y": -149
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Statistician"
            ],
            "Skill Prerequisite": "Diagonal Strike enchancement copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Path of the Statistician",
            "Skill Position": "(-2,-3)",
            "Skill Position Exact": {
                "x": -263,
                "y": -389
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Data Strike Mastery (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Insight",
            "Skill Position": "(4,6)",
            "Skill Position Exact": {
                "x": 457,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Insight copy"
            ],
            "Skill Prerequisite": "Gear of the Probabilist (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Bayesian Insight Mastery",
            "Skill Position": "(-1,6)",
            "Skill Position Exact": {
                "x": -83,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Probabilist"
            ],
            "Skill Prerequisite": "Insight copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Insight copy",
            "Skill Position": "(1,6)",
            "Skill Position Exact": {
                "x": 97,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Bayesian Insight Mastery"
            ],
            "Skill Prerequisite": "Insight copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Insight copy",
            "Skill Position": "(2,6)",
            "Skill Position Exact": {
                "x": 277,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Insight copy"
            ],
            "Skill Prerequisite": "Insight (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Path of the Probabilist",
            "Skill Position": "(-2,6)",
            "Skill Position Exact": {
                "x": -263,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Bayesian Insight Mastery (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Precision Mark Augment",
            "Skill Position": "(4,5)",
            "Skill Position Exact": {
                "x": 457,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Precision Mark Augment copy"
            ],
            "Skill Prerequisite": "Gear of the Probabilist (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Precision Mark Mastery",
            "Skill Position": "(-1,5)",
            "Skill Position Exact": {
                "x": -83,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Probabilist"
            ],
            "Skill Prerequisite": "Precision Mark Augment copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Precision Mark Augment copy",
            "Skill Position": "(2,5)",
            "Skill Position Exact": {
                "x": 277,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Precision Mark Augment copy"
            ],
            "Skill Prerequisite": "Precision Mark Augment (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Precision Mark Augment copy",
            "Skill Position": "(1,5)",
            "Skill Position Exact": {
                "x": 97,
                "y": 571
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Precision Mark Mastery"
            ],
            "Skill Prerequisite": "Precision Mark Augment copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Field Scan Augment",
            "Skill Position": "(4,7)",
            "Skill Position Exact": {
                "x": 457,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Field Scan Augment copy"
            ],
            "Skill Prerequisite": "Gear of the Probabilist (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Field Scan Mastery",
            "Skill Position": "(-1,7)",
            "Skill Position Exact": {
                "x": -83,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Path of the Probabilist"
            ],
            "Skill Prerequisite": "Field Scan Augment copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Field Scan Augment copy",
            "Skill Position": "(1,7)",
            "Skill Position Exact": {
                "x": 97,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Field Scan Mastery"
            ],
            "Skill Prerequisite": "Field Scan Augment copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Field Scan Augment copy",
            "Skill Position": "(2,7)",
            "Skill Position Exact": {
                "x": 277,
                "y": 811
            },
            "Skill Level": 1,
            "Skill Description": "Click to edit skill description.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Field Scan Augment copy"
            ],
            "Skill Prerequisite": "Field Scan Augment (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Reveal Items Droprate copy",
            "Skill Position": "(9,6)",
            "Skill Position Exact": {
                "x": 1117,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Reveal - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Reveal Items Droprate copy copy"
            ],
            "Skill Prerequisite": "Reveal Items Droprate (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Timer Item Droprate copy",
            "Skill Position": "(12,8)",
            "Skill Position Exact": {
                "x": 1417,
                "y": 991
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Timer - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Timer Item Droprate copy copy"
            ],
            "Skill Prerequisite": "Timer Item Droprate (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Cursed Item Droprate copy",
            "Skill Position": "(15,9)",
            "Skill Position Exact": {
                "x": 1777,
                "y": 1051
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Cursed - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Cursed Item Droprate copy copy"
            ],
            "Skill Prerequisite": "Cursed Item Droprate (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shield Item Droprate copy",
            "Skill Position": "(18,9)",
            "Skill Position Exact": {
                "x": 2197,
                "y": 1051
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Shield - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Shield Item Droprate copy copy"
            ],
            "Skill Prerequisite": "Shield Item Droprate (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Marker Item Droprate copy",
            "Skill Position": "(21,6)",
            "Skill Position Exact": {
                "x": 2557,
                "y": 691
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Marker - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Marker Item Droprate copy copy"
            ],
            "Skill Prerequisite": "Marker Item Droprate (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Reveal Items Droprate copy copy",
            "Skill Position": "(8,8)",
            "Skill Position Exact": {
                "x": 937,
                "y": 931
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Reveal - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Candle Revealer copy",
                "Candle Revealer"
            ],
            "Skill Prerequisite": "Reveal Items Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Timer Item Droprate copy copy",
            "Skill Position": "(11,10)",
            "Skill Position Exact": {
                "x": 1357,
                "y": 1231
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Timer - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Timer Item Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Cursed Item Droprate copy copy",
            "Skill Position": "(15,11)",
            "Skill Position Exact": {
                "x": 1777,
                "y": 1291
            },
            "Skill Level": 1,
            "Skill Description": "5% higher chance of obtaining the following Cursed - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Cursed Item Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Shield Item Droprate copy copy",
            "Skill Position": "(19,11)",
            "Skill Position Exact": {
                "x": 2257,
                "y": 1291
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Shield - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Shield Item Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Marker Item Droprate copy copy",
            "Skill Position": "(23,8)",
            "Skill Position Exact": {
                "x": 2797,
                "y": 931
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining the following Marker - Items: ...",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Marker Item Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Candle Revealer",
            "Skill Position": "(6,8)",
            "Skill Position Exact": {
                "x": 757,
                "y": 931
            },
            "Skill Level": 1,
            "Skill Description": "Candles have 20% chance to reveal twice as many correct tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Candle Revealer copy"
            ],
            "Skill Prerequisite": "Reveal Items Droprate copy copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magnifier Revealer",
            "Skill Position": "(4,9)",
            "Skill Position Exact": {
                "x": 517,
                "y": 1051
            },
            "Skill Level": 1,
            "Skill Description": "Magnifiers have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magnifier Revealer copy"
            ],
            "Skill Prerequisite": "Candle Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Candle Revealer copy",
            "Skill Position": "(5,8)",
            "Skill Position Exact": {
                "x": 637,
                "y": 991
            },
            "Skill Level": 1,
            "Skill Description": "Candles have 20% chance to reveal twice as many correct tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magnifier Revealer"
            ],
            "Skill Prerequisite": "Candle Revealer (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Candle Revealer copy",
            "Skill Position": "(8,9)",
            "Skill Position Exact": {
                "x": 997,
                "y": 1051
            },
            "Skill Level": 1,
            "Skill Description": "Candles have 20% chance to reveal twice as many correct tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Candle Revealer copy"
            ],
            "Skill Prerequisite": "Reveal Items Droprate copy copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Candle Revealer copy",
            "Skill Position": "(8,10)",
            "Skill Position Exact": {
                "x": 997,
                "y": 1171
            },
            "Skill Level": 1,
            "Skill Description": "Candles have 20% chance to reveal twice as many correct tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magnifier Revealer copy"
            ],
            "Skill Prerequisite": "Candle Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magnifier Revealer copy",
            "Skill Position": "(7,12)",
            "Skill Position Exact": {
                "x": 877,
                "y": 1411
            },
            "Skill Level": 1,
            "Skill Description": "Magnifiers have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Spyglass Revealer copy"
            ],
            "Skill Prerequisite": "Magnifier Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magnifier Revealer copy",
            "Skill Position": "(3,10)",
            "Skill Position Exact": {
                "x": 397,
                "y": 1171
            },
            "Skill Level": 1,
            "Skill Description": "Magnifiers have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Spyglass Revealer"
            ],
            "Skill Prerequisite": "Magnifier Revealer (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Magnifier Revealer copy",
            "Skill Position": "(8,11)",
            "Skill Position Exact": {
                "x": 937,
                "y": 1291
            },
            "Skill Level": 1,
            "Skill Description": "Magnifiers have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Magnifier Revealer copy"
            ],
            "Skill Prerequisite": "Candle Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Spyglass Revealer",
            "Skill Position": "(3,11)",
            "Skill Position Exact": {
                "x": 337,
                "y": 1291
            },
            "Skill Level": 1,
            "Skill Description": "Spyglasses have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Spyglass Revealer copy"
            ],
            "Skill Prerequisite": "Magnifier Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Spyglass Revealer copy",
            "Skill Position": "(5,12)",
            "Skill Position Exact": {
                "x": 577,
                "y": 1471
            },
            "Skill Level": 1,
            "Skill Description": "Spyglasses have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scanner Revealer copy",
                "Scout's Primer Droprate copy"
            ],
            "Skill Prerequisite": "Spyglass Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Spyglass Revealer copy",
            "Skill Position": "(4,11)",
            "Skill Position Exact": {
                "x": 457,
                "y": 1351
            },
            "Skill Level": 1,
            "Skill Description": "Spyglasses have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scanner Revealer",
                "Scout's Primer Droprate"
            ],
            "Skill Prerequisite": "Spyglass Revealer (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Spyglass Revealer copy",
            "Skill Position": "(6,12)",
            "Skill Position Exact": {
                "x": 757,
                "y": 1471
            },
            "Skill Level": 1,
            "Skill Description": "Spyglasses have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Spyglass Revealer copy"
            ],
            "Skill Prerequisite": "Magnifier Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scanner Revealer",
            "Skill Position": "(5,10)",
            "Skill Position Exact": {
                "x": 577,
                "y": 1231
            },
            "Skill Level": 1,
            "Skill Description": "Scanners have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scanner Revealer copy"
            ],
            "Skill Prerequisite": "Spyglass Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scanner Revealer copy",
            "Skill Position": "(6,10)",
            "Skill Position Exact": {
                "x": 697,
                "y": 1231
            },
            "Skill Level": 1,
            "Skill Description": "Scanners have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Codex of Completion"
            ],
            "Skill Prerequisite": "Scanner Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scanner Revealer copy",
            "Skill Position": "(5,10)",
            "Skill Position Exact": {
                "x": 637,
                "y": 1171
            },
            "Skill Level": 1,
            "Skill Description": "Scanners have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Codex of Completion"
            ],
            "Skill Prerequisite": "Scanner Revealer (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scanner Revealer copy",
            "Skill Position": "(5,11)",
            "Skill Position Exact": {
                "x": 637,
                "y": 1351
            },
            "Skill Level": 1,
            "Skill Description": "Scanners have 5% chance to reveal twice as many tiles.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scanner Revealer copy"
            ],
            "Skill Prerequisite": "Spyglass Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Codex of Completion",
            "Skill Position": "(6,9)",
            "Skill Position Exact": {
                "x": 757,
                "y": 1111
            },
            "Skill Level": 1,
            "Skill Description": "1% chance of obtaining a Codex of Completion on finishing a level",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Scanner Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scout's Primer Droprate",
            "Skill Position": "(3,12)",
            "Skill Position Exact": {
                "x": 337,
                "y": 1411
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining Scout's Primer Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scout's Primer Droprate copy"
            ],
            "Skill Prerequisite": "Spyglass Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Row Reveals",
            "Skill Position": "(11,-7)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -869
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer has a 20% chance to reveal an additional row.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Scout"
            ],
            "Skill Prerequisite": "Primed Row Reveals copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Row Reveals copy",
            "Skill Position": "(11,-6)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -749
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer has a 20% chance to reveal an additional row.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Row Reveals"
            ],
            "Skill Prerequisite": "Primed Row Reveals copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Row Reveals copy",
            "Skill Position": "(11,-5)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -629
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer has a 20% chance to reveal an additional row.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Row Reveals copy"
            ],
            "Skill Prerequisite": "Primed Row Reveals copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Row Reveals copy",
            "Skill Position": "(11,-4)",
            "Skill Position Exact": {
                "x": 1357,
                "y": -509
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer has a 20% chance to reveal an additional row.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Row Reveals copy"
            ],
            "Skill Prerequisite": "Probability Gate Helper (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Column Reveals",
            "Skill Position": "(17,-4)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -509
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer have a 20% chance of revealing an additional column.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Column Reveals copy"
            ],
            "Skill Prerequisite": "Bonus Quiz Marker (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Column Reveals copy",
            "Skill Position": "(17,-7)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -869
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer have a 20% chance of revealing an additional column.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Scout"
            ],
            "Skill Prerequisite": "Primed Column Reveals copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Column Reveals copy",
            "Skill Position": "(17,-6)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -749
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer have a 20% chance of revealing an additional column.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Column Reveals copy"
            ],
            "Skill Prerequisite": "Primed Column Reveals copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Column Reveals copy",
            "Skill Position": "(17,-5)",
            "Skill Position Exact": {
                "x": 2077,
                "y": -629
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer have a 20% chance of revealing an additional column.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Primed Column Reveals copy"
            ],
            "Skill Prerequisite": "Primed Column Reveals (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scout's Primer Droprate copy",
            "Skill Position": "(2,13)",
            "Skill Position Exact": {
                "x": 217,
                "y": 1531
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining Scout's Primer Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scout's Primer Droprate copy",
                "Scout's Primer Droprate"
            ],
            "Skill Prerequisite": "Scout's Primer Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scout's Primer Droprate copy",
            "Skill Position": "(3,14)",
            "Skill Position Exact": {
                "x": 337,
                "y": 1651
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining Scout's Primer Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scout's Primer Droprate copy",
                "Scout's Primer Droprate copy"
            ],
            "Skill Prerequisite": "Scout's Primer Droprate copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Scout's Primer Droprate copy",
            "Skill Position": "(4,13)",
            "Skill Position Exact": {
                "x": 457,
                "y": 1591
            },
            "Skill Level": 1,
            "Skill Description": "5% increased chance of obtaining Scout's Primer Items.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [
                "Scout's Primer Droprate copy"
            ],
            "Skill Prerequisite": "Spyglass Revealer copy (1)",
            "Skill Resources": []
        },
        {
            "Skill Name": "Primed Scout",
            "Skill Position": "(14,-8)",
            "Skill Position Exact": {
                "x": 1717,
                "y": -989
            },
            "Skill Level": 1,
            "Skill Description": "Scout's Primer have a 50% chance of revealing one additional row and column.",
            "Skill Max Points": 1,
            "Skill Current Points": 0,
            "Skill Image": "/axe-hammer-grey.png",
            "Skill Dependencies": [],
            "Skill Prerequisite": "Primed Row Reveals (1)",
            "Skill Resources": []
        }
    ],
    "Class Name": " ",
    "FullData": {
        "hideLockedSkills": 0,
        "totalStats": {},
        "showInfo": false,
        "showStatsSummary": false,
        "config": {
            "paths": {
                "assets": "/src/app/assets",
                "config": "/src/app/config",
                "images": {
                    "skills": "/img/skill",
                    "backgrounds": "/img/background",
                    "default": "/img/skill/axe-hammer-grey.png"
                }
            },
            "grid": {
                "spacing": 120,
                "startX": 100,
                "startY": 100
            },
            "skill": {
                "size": 100,
                "offset": 30
            },
            "connection": {
                "height": 2
            },
            "skillImages": [
                "/axe-hammer-grey.png",
                "/fire-orb.png",
                "/fire-rock.png",
                "/flaming-spear.png",
                "/flaming-staff.png",
                "/golden-arrow.png",
                "/gray-spear.png",
                "/ornate-spear.png",
                "/skull-blue.png",
                "/small-trident.png",
                "/spectral-dagger.png",
                "/water-sword.png"
            ]
        },
        "skills": [
            {
                "id": 11,
                "x": 1752,
                "y": 246,
                "name": "Start",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 110,
                "borderType": "solid",
                "shape": "square",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 14,
                "x": 1777,
                "y": 511,
                "name": "Item Consumption",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance to not remove an Item after useage",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 15,
                "x": 2557,
                "y": 271,
                "name": "Grid General",
                "showActions": false,
                "showTooltip": false,
                "description": "Chance to auto - reveal 1/2/3 random tiles on level start",
                "maxPoints": 3,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 16,
                "x": 1177,
                "y": 271,
                "name": "Classes",
                "showActions": false,
                "showTooltip": false,
                "description": "Active Class Abilities have their cooldowns reduced by 30 seconds.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 17,
                "x": 3217,
                "y": -29,
                "name": "medium grid",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 18,
                "x": 3037,
                "y": -149,
                "name": "small grid (up to 25 cells)",
                "showActions": false,
                "showTooltip": false,
                "description": "20 % chance to reveal 1/2/3 correct cells on level start\n20% chance to mark 1/2/3 incorrect cells on level start",
                "maxPoints": 3,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 19,
                "x": 3217,
                "y": 211,
                "name": "large grid",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 20,
                "x": 3217,
                "y": 451,
                "name": "huge grid",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 21,
                "x": 3337,
                "y": 571,
                "name": "Skill 21",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 22,
                "x": 3337,
                "y": 451,
                "name": "Skill 22",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 23,
                "x": 3217,
                "y": -149,
                "name": "small grid revealer",
                "showActions": false,
                "showTooltip": false,
                "description": "",
                "maxPoints": 3,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 24,
                "x": 3217,
                "y": -269,
                "name": "small grid marker",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 25,
                "x": 3337,
                "y": 91,
                "name": "Skill 25",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 26,
                "x": 3337,
                "y": -29,
                "name": "Skill 26",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 27,
                "x": 3337,
                "y": 211,
                "name": "Skill 27",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 28,
                "x": 3337,
                "y": 331,
                "name": "Skill 28",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 5,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 29,
                "x": 1357,
                "y": 571,
                "name": "Reveal Items Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Reveal - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 30,
                "x": 2317,
                "y": 571,
                "name": "Marker Item Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Marker - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 31,
                "x": 1477,
                "y": 811,
                "name": "Timer Item Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Timer - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 32,
                "x": 1777,
                "y": 811,
                "name": "Cursed Item Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Cursed - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 33,
                "x": 2077,
                "y": 811,
                "name": "Shield Item Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Shield - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 34,
                "x": 817,
                "y": 271,
                "name": "Gear of the Mathmagician",
                "showActions": false,
                "showTooltip": false,
                "description": "Mathmagicians have a 20% higher chance to receive Freeze and Chronobolt Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 37,
                "x": 337,
                "y": 271,
                "name": "Entropy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 47,
                "x": 1777,
                "y": -29,
                "name": "Tutor",
                "showActions": false,
                "showTooltip": false,
                "description": "Enables useage of Tutor items during a Bonus Quiz or Probability Gate question. The Tutor has a 10% chance to automatically answers the question for you. Requires a Tutor item to be in the inventory and consumes the item on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 50,
                "x": 1897,
                "y": -269,
                "name": "Stochastics Tutor",
                "showActions": false,
                "showTooltip": false,
                "description": "Increases the chance that the tutor can solve the question by an additional 10%.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 52,
                "x": 1657,
                "y": -269,
                "name": "Tutor Consumption",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 53,
                "x": 1897,
                "y": -449,
                "name": "Statistics Tutor",
                "showActions": false,
                "showTooltip": false,
                "description": "Increases the chance that the tutor can solve the question by an additional 10%.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 55,
                "x": 1897,
                "y": -569,
                "name": "Math Tutor",
                "showActions": false,
                "showTooltip": false,
                "description": "Increases the chance that the tutor can solve the question by an additional 10%.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 57,
                "x": 1657,
                "y": -449,
                "name": "Tutor Consumption",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 58,
                "x": 1657,
                "y": -569,
                "name": "Tutor Consumption",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to not spend the Tutor item when using a Tutor to answer a question.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 59,
                "x": 1777,
                "y": -689,
                "name": "My Tutor is a Professor",
                "showActions": false,
                "showTooltip": false,
                "description": "Increases the chance that the tutor can solve the question by an additional 20%.\n20% chance to not spend the Tutor item when using a Tutor to answer a question.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 60,
                "x": 1357,
                "y": -149,
                "name": "Probability Gate Hint and Item",
                "showActions": false,
                "showTooltip": false,
                "description": "Probability Gates will show a hint after 5 unsuccessfull attempts.\n10% chance to receive an additional Item reward when completing a Probability Gate.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 61,
                "x": 1357,
                "y": -329,
                "name": "Probability Gate Helper",
                "showActions": false,
                "showTooltip": false,
                "description": "Probability Gates now show up after one less unsuccessfull attempt.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 65,
                "x": 1117,
                "y": -449,
                "name": "Probability Gate Helper ",
                "showActions": false,
                "showTooltip": false,
                "description": "Probability Gates now show up after one less unsuccessfull attempt.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 67,
                "x": 877,
                "y": -449,
                "name": "Probability Gate Helper",
                "showActions": false,
                "showTooltip": false,
                "description": "Probability Gates now show up after one less unsuccessfull attempt.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 69,
                "x": 697,
                "y": -329,
                "name": "Probability Gate Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Probability Gate Hints now immideately show up.\n30% chance to receive an additional Item reward when completing a Probability Gate.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 70,
                "x": 1177,
                "y": -149,
                "name": "Probability Gate Item Bonus",
                "showActions": false,
                "showTooltip": false,
                "description": "20% chance to receive an additional item when completing a Probability Gate.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 71,
                "x": 817,
                "y": -149,
                "name": "Probability Gate Item Bonus copy",
                "showActions": false,
                "showTooltip": false,
                "description": "20% chance to receive an additional item when completing a Probability Gate.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 73,
                "x": 997,
                "y": -149,
                "name": "Probability Gate Item Bonus",
                "showActions": false,
                "showTooltip": false,
                "description": "20% chance to receive an additional item when completing a Probability Gate.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 75,
                "x": 2077,
                "y": -149,
                "name": "Bonus Quiz Marker and Item",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to automatically remove one wrong answer from a Multiple Choice question.\n10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 76,
                "x": 2077,
                "y": -329,
                "name": "Bonus Quiz Marker",
                "showActions": false,
                "showTooltip": false,
                "description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 77,
                "x": 2257,
                "y": -149,
                "name": "Bonus Quiz Item",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 84,
                "x": 2437,
                "y": -149,
                "name": "Bonus Quiz Item copy",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 85,
                "x": 2617,
                "y": -149,
                "name": "Bonus Quiz Item copy",
                "showActions": false,
                "showTooltip": false,
                "description": "10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 86,
                "x": 2317,
                "y": -449,
                "name": "Bonus Quiz Marker",
                "showActions": false,
                "showTooltip": false,
                "description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 87,
                "x": 2557,
                "y": -449,
                "name": "Bonus Quiz Marker",
                "showActions": false,
                "showTooltip": false,
                "description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 88,
                "x": 2737,
                "y": -329,
                "name": "Bonus Quiz Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "10% additional chance for one answer to be automatically marked as incorrect on Multiple Choice Questions.\n10% chance to receive an additional Item when answering a Bonus Quiz question correctly.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 90,
                "x": 577,
                "y": 271,
                "name": "Gear of the Mathmagician",
                "showActions": false,
                "showTooltip": false,
                "description": "Mathmagicians have a 20% higher chance to receive Freeze and Chronobolt Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 91,
                "x": 157,
                "y": 271,
                "name": "Entropy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 92,
                "x": -23,
                "y": 271,
                "name": "Entropy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 93,
                "x": 337,
                "y": 151,
                "name": "Magical Revelations",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 94,
                "x": 157,
                "y": 151,
                "name": "Magical Revelations",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 95,
                "x": -23,
                "y": 151,
                "name": "Magical Revelations",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 98,
                "x": -203,
                "y": 151,
                "name": "Arcane Reveal Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "20% chance for the Arcane Reveal spell to not invoke a cooldown on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 99,
                "x": -263,
                "y": 271,
                "name": "Variance Shield Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "5% chance for a mistake to not count towards your Variance Shield. Lasts until all Variance Shield charges have been depleted. ",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 100,
                "x": -443,
                "y": 271,
                "name": "Path of the Mathmagician",
                "showActions": false,
                "showTooltip": false,
                "description": "Variance Shield now absorbs twice as many mistakes.\nArcane Reveal and Absolute Zero have their cooldowns reduced by 2 minutes.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 101,
                "x": 337,
                "y": 391,
                "name": "Shiver",
                "showActions": false,
                "showTooltip": false,
                "description": "Absolute Zero lasts 0.2 more seconds.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 102,
                "x": 157,
                "y": 391,
                "name": "Shiver",
                "showActions": false,
                "showTooltip": false,
                "description": "Absolute Zero lasts 0.2 more seconds.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 103,
                "x": -23,
                "y": 391,
                "name": "Shiver",
                "showActions": false,
                "showTooltip": false,
                "description": "Absolute Zero lasts 0.2 more seconds.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 104,
                "x": -203,
                "y": 391,
                "name": "Absolute Zero Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "20% chance for the Absolute Zero spell to not invoke a cooldown on use.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 106,
                "x": 817,
                "y": 151,
                "name": "Gear of the Statistician",
                "showActions": false,
                "showTooltip": false,
                "description": "Statisticians have a 20% higher chance to receive ? and ? Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 107,
                "x": 817,
                "y": 391,
                "name": "Gear of the Probabilist",
                "showActions": false,
                "showTooltip": false,
                "description": "Probabilists have a 20% higher chance to receive ? and ? Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 108,
                "x": 637,
                "y": 31,
                "name": "Gear of the Statistician",
                "showActions": false,
                "showTooltip": false,
                "description": "Statisticians have a 20% higher chance to receive ? and ? Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 109,
                "x": 637,
                "y": 571,
                "name": "Gear of the Probabilist",
                "showActions": false,
                "showTooltip": false,
                "description": "Probabilists have a 20% higher chance to receive ? and ? Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 110,
                "x": 397,
                "y": -89,
                "name": "Momentum",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 112,
                "x": 517,
                "y": -149,
                "name": "Data Strike Enhancement",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 113,
                "x": 397,
                "y": 31,
                "name": "Diagonal Strike enchancement",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 114,
                "x": -83,
                "y": -89,
                "name": "Diagonal Strike enchancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 115,
                "x": 37,
                "y": 31,
                "name": "Diagonal Strike enchancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 116,
                "x": 217,
                "y": -29,
                "name": "Diagonal Strike enchancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 117,
                "x": 37,
                "y": -209,
                "name": "Momentum copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 118,
                "x": 157,
                "y": -149,
                "name": "Momentum copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 119,
                "x": 277,
                "y": -149,
                "name": "Momentum copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 120,
                "x": 157,
                "y": -329,
                "name": "Data Strike Enhancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 121,
                "x": 277,
                "y": -269,
                "name": "Data Strike Enhancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 122,
                "x": 397,
                "y": -209,
                "name": "Data Strike Enhancement copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 123,
                "x": -83,
                "y": -269,
                "name": "Momentum Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 124,
                "x": 37,
                "y": -389,
                "name": "Data Strike Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 125,
                "x": -203,
                "y": -149,
                "name": "Diagonal Strike Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 126,
                "x": -263,
                "y": -389,
                "name": "Path of the Statistician",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 127,
                "x": 457,
                "y": 691,
                "name": "Insight",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 128,
                "x": -83,
                "y": 691,
                "name": "Bayesian Insight Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 129,
                "x": 97,
                "y": 691,
                "name": "Insight copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 130,
                "x": 277,
                "y": 691,
                "name": "Insight copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 131,
                "x": -263,
                "y": 691,
                "name": "Path of the Probabilist",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 132,
                "x": 457,
                "y": 571,
                "name": "Precision Mark Augment",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 133,
                "x": -83,
                "y": 571,
                "name": "Precision Mark Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 134,
                "x": 277,
                "y": 571,
                "name": "Precision Mark Augment copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 135,
                "x": 97,
                "y": 571,
                "name": "Precision Mark Augment copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 136,
                "x": 457,
                "y": 811,
                "name": "Field Scan Augment",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 137,
                "x": -83,
                "y": 811,
                "name": "Field Scan Mastery",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 138,
                "x": 97,
                "y": 811,
                "name": "Field Scan Augment copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 139,
                "x": 277,
                "y": 811,
                "name": "Field Scan Augment copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Click to edit skill description.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 141,
                "x": 1117,
                "y": 691,
                "name": "Reveal Items Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Reveal - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 142,
                "x": 1417,
                "y": 991,
                "name": "Timer Item Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Timer - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 143,
                "x": 1777,
                "y": 1051,
                "name": "Cursed Item Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Cursed - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 144,
                "x": 2197,
                "y": 1051,
                "name": "Shield Item Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Shield - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 145,
                "x": 2557,
                "y": 691,
                "name": "Marker Item Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Marker - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 146,
                "x": 937,
                "y": 931,
                "name": "Reveal Items Droprate copy copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Reveal - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 147,
                "x": 1357,
                "y": 1231,
                "name": "Timer Item Droprate copy copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Timer - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 148,
                "x": 1777,
                "y": 1291,
                "name": "Cursed Item Droprate copy copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% higher chance of obtaining the following Cursed - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 149,
                "x": 2257,
                "y": 1291,
                "name": "Shield Item Droprate copy copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Shield - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 150,
                "x": 2797,
                "y": 931,
                "name": "Marker Item Droprate copy copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining the following Marker - Items: ...",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 151,
                "x": 757,
                "y": 931,
                "name": "Candle Revealer",
                "showActions": false,
                "showTooltip": false,
                "description": "Candles have 20% chance to reveal twice as many correct tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 153,
                "x": 517,
                "y": 1051,
                "name": "Magnifier Revealer",
                "showActions": false,
                "showTooltip": false,
                "description": "Magnifiers have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 155,
                "x": 637,
                "y": 991,
                "name": "Candle Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Candles have 20% chance to reveal twice as many correct tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 156,
                "x": 997,
                "y": 1051,
                "name": "Candle Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Candles have 20% chance to reveal twice as many correct tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 157,
                "x": 997,
                "y": 1171,
                "name": "Candle Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Candles have 20% chance to reveal twice as many correct tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 158,
                "x": 877,
                "y": 1411,
                "name": "Magnifier Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Magnifiers have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 159,
                "x": 397,
                "y": 1171,
                "name": "Magnifier Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Magnifiers have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 160,
                "x": 937,
                "y": 1291,
                "name": "Magnifier Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Magnifiers have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 161,
                "x": 337,
                "y": 1291,
                "name": "Spyglass Revealer",
                "showActions": false,
                "showTooltip": false,
                "description": "Spyglasses have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 162,
                "x": 577,
                "y": 1471,
                "name": "Spyglass Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Spyglasses have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 163,
                "x": 457,
                "y": 1351,
                "name": "Spyglass Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Spyglasses have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 164,
                "x": 757,
                "y": 1471,
                "name": "Spyglass Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Spyglasses have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 165,
                "x": 577,
                "y": 1231,
                "name": "Scanner Revealer",
                "showActions": false,
                "showTooltip": false,
                "description": "Scanners have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 166,
                "x": 697,
                "y": 1231,
                "name": "Scanner Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scanners have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 167,
                "x": 637,
                "y": 1171,
                "name": "Scanner Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scanners have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 168,
                "x": 637,
                "y": 1351,
                "name": "Scanner Revealer copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scanners have 5% chance to reveal twice as many tiles.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 169,
                "x": 757,
                "y": 1111,
                "name": "Codex of Completion",
                "showActions": false,
                "showTooltip": false,
                "description": "1% chance of obtaining a Codex of Completion on finishing a level",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 170,
                "x": 337,
                "y": 1411,
                "name": "Scout's Primer Droprate",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining Scout's Primer Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 171,
                "x": 1357,
                "y": -869,
                "name": "Primed Row Reveals",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer has a 20% chance to reveal an additional row.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 172,
                "x": 1357,
                "y": -749,
                "name": "Primed Row Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer has a 20% chance to reveal an additional row.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 173,
                "x": 1357,
                "y": -629,
                "name": "Primed Row Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer has a 20% chance to reveal an additional row.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 174,
                "x": 1357,
                "y": -509,
                "name": "Primed Row Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer has a 20% chance to reveal an additional row.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 175,
                "x": 2077,
                "y": -509,
                "name": "Primed Column Reveals",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer have a 20% chance of revealing an additional column.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 176,
                "x": 2077,
                "y": -869,
                "name": "Primed Column Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer have a 20% chance of revealing an additional column.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 177,
                "x": 2077,
                "y": -749,
                "name": "Primed Column Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer have a 20% chance of revealing an additional column.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 178,
                "x": 2077,
                "y": -629,
                "name": "Primed Column Reveals copy",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer have a 20% chance of revealing an additional column.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 179,
                "x": 217,
                "y": 1531,
                "name": "Scout's Primer Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining Scout's Primer Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 180,
                "x": 337,
                "y": 1651,
                "name": "Scout's Primer Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining Scout's Primer Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 181,
                "x": 457,
                "y": 1591,
                "name": "Scout's Primer Droprate copy",
                "showActions": false,
                "showTooltip": false,
                "description": "5% increased chance of obtaining Scout's Primer Items.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            },
            {
                "id": 182,
                "x": 1717,
                "y": -989,
                "name": "Primed Scout",
                "showActions": false,
                "showTooltip": false,
                "description": "Scout's Primer have a 50% chance of revealing one additional row and column.",
                "maxPoints": 1,
                "currentPoints": 0,
                "requiredPoints": 0,
                "image": "/img/skill/axe-hammer-grey.png",
                "shouldAnimate": true,
                "resources": [],
                "size": 60,
                "borderType": "solid",
                "shape": "round",
                "cost": 1,
                "prerequisiteModeOverride": "global",
                "exclusiveSkillIds": []
            }
        ],
        "connections": [
            {
                "id": "11-15",
                "from": 11,
                "to": 15,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2029,
                    "y": 832
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "11-16",
                "from": 11,
                "to": 16,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1969,
                    "y": 772
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "15-18",
                "from": 15,
                "to": 18,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1938,
                    "y": 917
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "15-20",
                "from": 15,
                "to": 20,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1938,
                    "y": 1097
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "18-23",
                "from": 18,
                "to": 23,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1909,
                    "y": 843
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "18-24",
                "from": 18,
                "to": 24,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1909,
                    "y": 903
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "16-34",
                "from": 16,
                "to": 34,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1624,
                    "y": 853
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "14-29",
                "from": 14,
                "to": 29,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2104,
                    "y": 913
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "14-31",
                "from": 14,
                "to": 31,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2224,
                    "y": 913
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "14-33",
                "from": 14,
                "to": 33,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2284,
                    "y": 913
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "14-32",
                "from": 14,
                "to": 32,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2344,
                    "y": 913
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "20-22",
                "from": 20,
                "to": 22,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2223,
                    "y": 726
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "20-21",
                "from": 20,
                "to": 21,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2223,
                    "y": 846
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "19-27",
                "from": 19,
                "to": 27,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1934,
                    "y": 748
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "19-28",
                "from": 19,
                "to": 28,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2054,
                    "y": 748
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "17-25",
                "from": 17,
                "to": 25,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1394,
                    "y": 808
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "17-26",
                "from": 17,
                "to": 26,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1454,
                    "y": 748
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "15-17",
                "from": 15,
                "to": 17,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2433,
                    "y": 730
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "11-47",
                "from": 11,
                "to": 47,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1915,
                    "y": 1163
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "47-50",
                "from": 47,
                "to": 50,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2005,
                    "y": 1013
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "50-53",
                "from": 50,
                "to": 53,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2155,
                    "y": 1013
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "53-55",
                "from": 53,
                "to": 55,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2215,
                    "y": 893
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "47-52",
                "from": 47,
                "to": 52,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2106,
                    "y": 1100
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "52-57",
                "from": 52,
                "to": 57,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2136,
                    "y": 980
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "57-58",
                "from": 57,
                "to": 58,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2196,
                    "y": 860
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "55-59",
                "from": 55,
                "to": 59,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2376,
                    "y": 860
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "58-59",
                "from": 58,
                "to": 59,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2316,
                    "y": 800
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "47-60",
                "from": 47,
                "to": 60,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1956,
                    "y": 1160
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "60-61",
                "from": 60,
                "to": 61,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1776,
                    "y": 1100
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "61-65",
                "from": 61,
                "to": 65,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1686,
                    "y": 980
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "65-67",
                "from": 65,
                "to": 67,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1656,
                    "y": 860
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "67-69",
                "from": 67,
                "to": 69,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1656,
                    "y": 740
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "60-70",
                "from": 60,
                "to": 70,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1746,
                    "y": 1040
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "70-73",
                "from": 70,
                "to": 73,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1694,
                    "y": 933
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "73-71",
                "from": 73,
                "to": 71,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1514,
                    "y": 933
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "71-69",
                "from": 71,
                "to": 69,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1364,
                    "y": 873
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "75-77",
                "from": 75,
                "to": 77,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2014,
                    "y": 1000
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "75-76",
                "from": 75,
                "to": 76,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1864,
                    "y": 940
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "76-86",
                "from": 76,
                "to": 86,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1834,
                    "y": 820
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "86-87",
                "from": 86,
                "to": 87,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1924,
                    "y": 700
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "77-84",
                "from": 77,
                "to": 84,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2164,
                    "y": 940
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "84-85",
                "from": 84,
                "to": 85,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2254,
                    "y": 820
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "87-88",
                "from": 87,
                "to": 88,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2074,
                    "y": 640
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "85-88",
                "from": 85,
                "to": 88,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2224,
                    "y": 700
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "34-90",
                "from": 34,
                "to": 90,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1723,
                    "y": 786
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "90-37",
                "from": 90,
                "to": 37,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1731,
                    "y": 874
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "37-91",
                "from": 37,
                "to": 91,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1551,
                    "y": 814
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "91-92",
                "from": 91,
                "to": 92,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1371,
                    "y": 814
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "90-93",
                "from": 90,
                "to": 93,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1731,
                    "y": 934
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "93-94",
                "from": 93,
                "to": 94,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1551,
                    "y": 904
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "94-95",
                "from": 94,
                "to": 95,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1371,
                    "y": 874
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "95-98",
                "from": 95,
                "to": 98,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1107,
                    "y": 962
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "92-99",
                "from": 92,
                "to": 99,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1107,
                    "y": 842
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "99-100",
                "from": 99,
                "to": 100,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1143,
                    "y": 984
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "98-100",
                "from": 98,
                "to": 100,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1143,
                    "y": 1044
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "90-101",
                "from": 90,
                "to": 101,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1983,
                    "y": 1134
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "101-102",
                "from": 101,
                "to": 102,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1803,
                    "y": 1164
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "102-103",
                "from": 102,
                "to": 103,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1623,
                    "y": 1164
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "103-104",
                "from": 103,
                "to": 104,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1443,
                    "y": 1164
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "104-100",
                "from": 104,
                "to": 100,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1233,
                    "y": 1104
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "16-106",
                "from": 16,
                "to": 106,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2283,
                    "y": 933
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "16-107",
                "from": 16,
                "to": 107,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2283,
                    "y": 1143
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "106-108",
                "from": 106,
                "to": 108,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1899,
                    "y": 809
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "107-109",
                "from": 107,
                "to": 109,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1929,
                    "y": 1199
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "108-112",
                "from": 108,
                "to": 112,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2187,
                    "y": 971
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "108-110",
                "from": 108,
                "to": 110,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2127,
                    "y": 1001
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "108-113",
                "from": 108,
                "to": 113,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2127,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "113-116",
                "from": 113,
                "to": 116,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1917,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "116-115",
                "from": 116,
                "to": 115,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1737,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "115-114",
                "from": 115,
                "to": 114,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1587,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "110-119",
                "from": 110,
                "to": 119,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1947,
                    "y": 941
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "119-118",
                "from": 119,
                "to": 118,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1827,
                    "y": 941
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "118-117",
                "from": 118,
                "to": 117,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1677,
                    "y": 941
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "112-122",
                "from": 112,
                "to": 122,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2067,
                    "y": 851
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "122-121",
                "from": 122,
                "to": 121,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1947,
                    "y": 791
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "121-120",
                "from": 121,
                "to": 120,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1827,
                    "y": 731
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "114-125",
                "from": 114,
                "to": 125,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1467,
                    "y": 911
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "117-123",
                "from": 117,
                "to": 123,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1587,
                    "y": 791
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "120-124",
                "from": 120,
                "to": 124,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1707,
                    "y": 671
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "124-126",
                "from": 124,
                "to": 126,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1497,
                    "y": 641
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "123-126",
                "from": 123,
                "to": 126,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1437,
                    "y": 701
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "125-126",
                "from": 125,
                "to": 126,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1377,
                    "y": 761
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "109-127",
                "from": 109,
                "to": 127,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1880,
                    "y": 982
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "127-130",
                "from": 127,
                "to": 130,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1700,
                    "y": 1042
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "130-129",
                "from": 130,
                "to": 129,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1520,
                    "y": 1042
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "129-128",
                "from": 129,
                "to": 128,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1340,
                    "y": 1042
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "128-131",
                "from": 128,
                "to": 131,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1160,
                    "y": 1042
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "109-132",
                "from": 109,
                "to": 132,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1880,
                    "y": 922
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "132-134",
                "from": 132,
                "to": 134,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1700,
                    "y": 922
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "134-135",
                "from": 134,
                "to": 135,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1520,
                    "y": 922
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "135-133",
                "from": 135,
                "to": 133,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1340,
                    "y": 922
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "133-131",
                "from": 133,
                "to": 131,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1160,
                    "y": 982
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "109-136",
                "from": 109,
                "to": 136,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1881,
                    "y": 1042
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "136-139",
                "from": 136,
                "to": 139,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1701,
                    "y": 1162
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "139-138",
                "from": 139,
                "to": 138,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1521,
                    "y": 1162
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "138-137",
                "from": 138,
                "to": 137,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1341,
                    "y": 1162
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "137-131",
                "from": 137,
                "to": 131,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1161,
                    "y": 1102
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "14-30",
                "from": 14,
                "to": 30,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2227,
                    "y": 876
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "29-141",
                "from": 29,
                "to": 141,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1487,
                    "y": 892
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "31-142",
                "from": 31,
                "to": 142,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1697,
                    "y": 1162
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "32-143",
                "from": 32,
                "to": 143,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2027,
                    "y": 1192
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "33-144",
                "from": 33,
                "to": 144,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2387,
                    "y": 1192
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "30-145",
                "from": 30,
                "to": 145,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2687,
                    "y": 892
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "145-150",
                "from": 145,
                "to": 150,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2927,
                    "y": 1072
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "144-149",
                "from": 144,
                "to": 149,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2477,
                    "y": 1432
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "143-148",
                "from": 143,
                "to": 148,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2027,
                    "y": 1432
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "142-147",
                "from": 142,
                "to": 147,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1637,
                    "y": 1372
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "141-146",
                "from": 141,
                "to": 146,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1277,
                    "y": 1072
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "146-156",
                "from": 146,
                "to": 156,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1677,
                    "y": 1037
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "156-157",
                "from": 156,
                "to": 157,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1677,
                    "y": 1157
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "146-151",
                "from": 146,
                "to": 151,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1557,
                    "y": 977
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "151-155",
                "from": 151,
                "to": 155,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1407,
                    "y": 1007
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "157-160",
                "from": 157,
                "to": 160,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1873,
                    "y": 1104
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "160-158",
                "from": 160,
                "to": 158,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1813,
                    "y": 1224
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "155-153",
                "from": 155,
                "to": 153,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1543,
                    "y": 894
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "153-159",
                "from": 153,
                "to": 159,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1423,
                    "y": 984
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "158-164",
                "from": 158,
                "to": 164,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1899,
                    "y": 1242
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "164-162",
                "from": 164,
                "to": 162,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1809,
                    "y": 1362
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "159-161",
                "from": 159,
                "to": 161,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1449,
                    "y": 1002
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "161-163",
                "from": 161,
                "to": 163,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1329,
                    "y": 1122
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "162-168",
                "from": 162,
                "to": 168,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1681,
                    "y": 1298
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "168-166",
                "from": 168,
                "to": 166,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1561,
                    "y": 1388
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "163-165",
                "from": 163,
                "to": 165,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1231,
                    "y": 1058
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "165-167",
                "from": 165,
                "to": 167,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1231,
                    "y": 1178
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "166-169",
                "from": 166,
                "to": 169,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1411,
                    "y": 1388
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "167-169",
                "from": 167,
                "to": 169,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1291,
                    "y": 1298
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "61-174",
                "from": 61,
                "to": 174,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1339,
                    "y": 1177
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "174-173",
                "from": 174,
                "to": 173,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1339,
                    "y": 1027
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "173-172",
                "from": 173,
                "to": 172,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1339,
                    "y": 907
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "172-171",
                "from": 172,
                "to": 171,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1339,
                    "y": 787
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "76-175",
                "from": 76,
                "to": 175,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2059,
                    "y": 1177
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "175-178",
                "from": 175,
                "to": 178,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2059,
                    "y": 1027
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "178-177",
                "from": 178,
                "to": 177,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2059,
                    "y": 907
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "177-176",
                "from": 177,
                "to": 176,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 2059,
                    "y": 787
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "163-170",
                "from": 163,
                "to": 170,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1655,
                    "y": 971
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "162-181",
                "from": 162,
                "to": 181,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1775,
                    "y": 1121
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "181-180",
                "from": 181,
                "to": 180,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1655,
                    "y": 1211
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "180-179",
                "from": 180,
                "to": 179,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1535,
                    "y": 1181
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "170-179",
                "from": 170,
                "to": 179,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1535,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "179-180",
                "from": 179,
                "to": 180,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1535,
                    "y": 1181
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "179-170",
                "from": 179,
                "to": 170,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1535,
                    "y": 1061
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "180-181",
                "from": 180,
                "to": 181,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1655,
                    "y": 1211
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "47-75",
                "from": 47,
                "to": 75,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1944,
                    "y": 1077
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            },
            {
                "id": "171-182",
                "from": 171,
                "to": 182,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1591,
                    "y": 782
                },
                "mutuallyExclusive": false,
                "dotted": false
            },
            {
                "id": "176-182",
                "from": 176,
                "to": 182,
                "hasControlPoint": false,
                "controlPoint": {
                    "x": 1951,
                    "y": 782
                },
                "mutuallyExclusive": false,
                "dotted": false,
                "isHovered": false
            }
        ],
        "connectingFrom": null,
        "skillIdCounter": 182,
        "draggedSkill": null,
        "dragOffset": {
            "x": 33.28571428571422,
            "y": 40.85714285714289
        },
        "draggedElement": {},
        "isDragging": false,
        "isLinking": false,
        "hoveredSkill": null,
        "defaultMaxPoints": 5,
        "dragStartTime": 1778786781745,
        "dragStartPos": {
            "x": 2134.285714285714,
            "y": 852.8571428571429
        },
        "dragThreshold": 5,
        "showOptions": false,
        "isPanning": false,
        "panStart": {
            "x": 1651,
            "y": 1265
        },
        "treePosition": {
            "x": -293,
            "y": -719
        },
        "scale": 0.5,
        "minScale": 0.5,
        "maxScale": 2,
        "scaleStep": 0.1,
        "isLoaded": false,
        "touchStartX": null,
        "touchStartY": null,
        "lastTouchDistance": null,
        "touchTimeout": null,
        "doubleTapDelay": 300,
        "lastTap": 0,
        "editingSkill": null,
        "oldSkills": null,
        "oldBackgroundLink": null,
        "oldName": null,
        "currentBackgroundLink": "/img/background/grass-ancient.jpg",
        "currentName": " ",
        "currentClassDescription": null,
        "inputText": "",
        "isLoading": false,
        "historyIndex": 48,
        "maxHistorySize": 50,
        "showImageSelector": false,
        "selectedImage": null,
        "availableImages": [
            "/axe-hammer-grey.png",
            "/fire-orb.png",
            "/fire-rock.png",
            "/flaming-spear.png",
            "/flaming-staff.png",
            "/golden-arrow.png",
            "/gray-spear.png",
            "/ornate-spear.png",
            "/skull-blue.png",
            "/small-trident.png",
            "/spectral-dagger.png",
            "/water-sword.png"
        ],
        "skillShape": "round",
        "customImages": [],
        "gridSnapEnabled": true,
        "snapThreshold": 8,
        "mode": "edit",
        "overlayColor": "#000000",
        "overlayOpacity": 75,
        "showArrows": true,
        "showGlobalGrid": true,
        "gridOpacity": 12,
        "gridSize": 120,
        "maxPoints": 13,
        "selectionBox": null,
        "initialClick": {
            "x": 1785.7142857142858,
            "y": 722.8571428571429
        },
        "showLoadModal": false,
        "initialPositions": null,
        "prerequisiteMode": "all",
        "showGenerateControls": false,
        "lastPanTime": 0,
        "treeEl": {},
        "imageUrl": "",
        "defaultSkillImage": "/img/skill/axe-hammer-grey.png",
        "defaultMaxSkillPoints": 1,
        "selectingDefaultImage": false,
        "showSkillNames": false,
        "skillSizePresets": {
            "small": 30,
            "medium": 60,
            "large": 110,
            "huge": 330
        },
        "showRequirementsTooltip": true,
        "skillNamesSize": 12,
        "selectedConnection": null,
        "editingConnection": false,
        "controlPoints": [],
        "addSkillOnClick": true,
        "treeUnlockColor": "#ffd700",
        "treeUnlockBoxshadow": "0 0 5px rgba(0, 0, 0, 0.5)",
        "treeLockedColor": "#292929",
        "treeLockedBoxshadow": "0 0 5px rgba(0, 0, 0, 0.5)",
        "colorLockedSkills": false,
        "showNews": true,
        "keepTooltipOpen": false,
        "openAllTooltips": false,
        "showOpenTrees": false,
        "treeSearchQuery": "",
        "searchResults": [],
        "isSearching": false,
        "skillGoogleFontName": "",
        "skillFontSize": 12,
        "systemFontName": "",
        "systemFontSize": 12,
        "showNewsWindow": false,
        "closedNewsIds": [
            "news-011",
            "news-010",
            "news-009",
            "news-008",
            "news-007",
            "news-006",
            "news-005",
            "news-001"
        ],
        "newsItems": [
            {
                "id": "news-011",
                "date": "Dec 11, 2025",
                "title": "New Features Added / Bugfixes",
                "content": "• Delete option for your saved trees<br>• 'Open All Tooltips' toggle in the settings<br>• Edit icons now show above tooltips<br>"
            },
            {
                "id": "news-010",
                "date": "Dec 6, 2024",
                "title": "Paid Patreon Accounts are Coming January 1st",
                "content": "Everyone who logs in with a free Patreon account before January 1st will get Builder Tier for free forever.<br> <br>Starting January 1st, I'll be charging $3 a month (the Builder Tier on Patreon) to host new trees (the share tree online button). All existing trees will continue to be hosted at no cost.<br> <br>You can still save, download, input/upload files locally like normal without an account. It's only new clicks of the share tree online button that you'll need a Builder Tier Patreon account.<br> <br> I've <a href='https://github.com/hdevx/Skill-Tree-Maker' target='_blank'>given the code away for free under MIT License</a>. Feel free to host your own tool with no accounts, contribute features, or use it locally.<br> "
            },
            {
                "id": "news-009",
                "date": "Dec 5, 2024",
                "title": "New Features Added",
                "content": "• Improved mobile support<br>• Fixed mobile grid attachement when flipping device<br>• Fixed mobile skills moving when naming/editing<br>"
            },
            {
                "id": "news-008",
                "date": "Dec 2, 2024",
                "title": "New Features Added",
                "content": "• Ctrl+Click to link from selected skills<br>"
            },
            {
                "id": "news-007",
                "date": "Sept 3, 2024",
                "title": "New Features Added",
                "content": "- Requirements Tooltip Added<br> When hovering over a skill, the unmet requirements are shown above the skill description. This can be toggled on and off globally in the settings under \"Show Requirements Description\".<br> - Mutually Exclusive Skills<br> - Edit Connection Window<br> - Set the cost of each skill level for individual skills (previously could only be 1).<br> - Set the skill selection color under \"Tree Unlock Color\" in the settings.<br> - \"Add New Skill On Click\" toggle in the settings. Turn this off to disable new skills being made when clicking or tapping an empty part of the tree.<br> "
            },
            {
                "id": "news-006",
                "date": "July 30, 2024",
                "title": "New Features Added",
                "content": "- Individual skill size, basic shapes, borders <br> - Mass skill edits<br> "
            },
            {
                "id": "news-005",
                "date": "June 25, 2024",
                "title": "New Features Added",
                "content": "- Setting for default skill icons for new skills<br> - Setting for default max skill points for new skills<br> - Removable custom images with an 'x' button in the top right of each custom image <br> - 'Auto Format Skills From Circle' button in the settings. This should branch skills evenly spaced from their root node.<br> "
            },
            {
                "id": "news-001",
                "date": "January 15, 2025",
                "title": "Welcome to Skill Tree Maker!",
                "content": "Create amazing skill trees for your RPG characters and games. Drag and drop skills, connect them, and export as JSON!"
            }
        ],
        "showAccount": false,
        "accountStatus": {
            "logged_in": false
        },
        "showPatreonModal": false,
        "patreonModalTitle": "",
        "patreonModalMessage": "",
        "patreonModalButtonText": ""
    }
}