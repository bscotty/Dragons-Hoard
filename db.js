const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

// Enums

// The Six Main Ability Scores
const AbilityScoreEnum = {
    STR: "Strength",
    DEX: "Dexterity",
    CON: "Constitution",
    INT: "Intelligence",
    WIS: "Wisdom",
    CHA: "Charisma"
};

// The Skills Available in Fifth Edition
const SkillEnum = {
    ACROBATICS: "Acrobatics",
    ANIMAL_HANDLING: "Animal Handling",
    ARCANA: "Arcana",
    ATHLETICS: "Athletics",
    DECEPTION: "Deception",
    HISTORY: "History",
    INSIGHT: "Insight",
    INTIMIDATION: "Intimidation",
    INVESTIGATION: "Investigation",
    MEDICINE: "Medicine",
    NATURE: "Nature",
    PERCEPTION: "Perception",
    PERFORMANCE: "Performance",
    PERSUASION: "Persuasion",
    RELIGION: "Religion",
    SLEIGHT_OF_HAND: "Sleight of Hand",
    STEALTH: "Stealth",
    SURVIVAL: "Survival"
};

// Acceptable Alignments
const AlignmentEnum = {
    LG: "Lawful Good",
    NG: "Neutral Good",
    CG: "Chaotic Good",
    LN: "Lawful Neutral",
    TN: "True Neutral",
    CN: "Chaotic Neutral",
    LE: "Lawful Evil",
    NE: "Neutral Evil",
    CE: "Chaotic Evil"
};

const ProficiencyEnum = {
    PROFICIENCY_TYPES: {
        PROFICIENT: "Proficient",
        EXPERT: "Expert",
    },

    WEAPON: {
        WEAPONS_SIMPLE: "Simple Weapons",

        WEAPONS_SIMPLE_MELEE: "Simple Melee Weapon",
        WEAPONS_SIMPLE_RANGED: "Simple Ranged Weapon",

        WEAPONS_MARTIAL: "Martial Weapons",

        WEAPON_MARTIAL_MELEE: "Martial Melee Weapon",
        WEAPON_MARTIAL_RANGED: "Martial Ranged Weapon",

        WEAPON_SIMPLE: {
            MELEE: {
                WEAPON_SIMPLE_CLUB: "Club",
                WEAPON_SIMPLE_DAGGER: "Dagger",
                WEAPON_SIMPLE_GREATCLUB: "Greatclub",
                WEAPON_SIMPLE_HANDAXE: "Handaxe",
                WEAPON_SIMPLE_JAVELIN: "Javelin",
                WEAPON_SIMPLE_LIGHT_HAMMER: "Light Hammer",
                WEAPON_SIMPLE_MACE: "Mace",
                WEAPON_SIMPLE_QUARTERSTAFF: "Quarterstaff",
                WEAPON_SIMPLE_SICKLE: "Sickle",
                WEAPON_SIMPLE_SPEAR: "Spear",
            },
            RANGED: {
                WEAPON_SIMPLE_CROSSBOW_LIGHT: "Crossbow, Light",
                WEAPON_SIMPLE_DART: "Dart",
                WEAPON_SIMPLE_SHORTBOW: "Shortbow",
                WEAPON_SIMPLE_SLING: "Sling",
            }
        },

        WEAPON_MARTIAL: {
            MELEE: {
                WEAPON_MARTIAL_BATTLEAXE: "Battleaxe",
                WEAPON_MARTIAL_FLAIL: "Flail",
                WEAPON_MARTIAL_GLAIVE: "Glaive",
                WEAPON_MARTIAL_GREATAXE: "Greataxe",
                WEAPON_MARTIAL_GREATSWORD: "Greatsword",
                WEAPON_MARTIAL_HALBERD: "Halberd",
                WEAPON_MARTIAL_LANCE: "Lance",
                WEAPON_MARTIAL_LONGSWORD: "Longsword",
                WEAPON_MARTIAL_MAUL: "Maul",
                WEAPON_MARTIAL_MORNINGSTAR: "Morningstar",
                WEAPON_MARTIAL_PIKE: "Pike",
                WEAPON_MARTIAL_RAPIER: "Rapier",
                WEAPON_MARTIAL_SCIMITAR: "Scimitar",
                WEAPON_MARTIAL_SHORTSWORD: "Shortsword",
                WEAPON_MARTIAL_TRIDENT: "Trident",
                WEAPON_MARTIAL_WAR_PICK: "War Pick",
                WEAPON_MARTIAL_WARHAMMER: "Warhammer",
                WEAPON_MARTIAL_WHIP: "Whip",
            },

            RANGED: {
                WEAPON_MARTIAL_BLOWGUN: "Blowgun",
                WEAPON_MARTIAL_CROSSBOW_HAND: "Crossbow, Hand",
                WEAPON_MARTIAL_CROSSBOW_HEAVY: "Crossbow, Heavy",
                WEAPON_MARTIAL_LONGBOW: "Longbow",
                WEAPON_MARTIAL_NET: "Net",
            }
        }
    },

    ARMOR: {
        LIGHT_ARMOR: "Light",
        MEDIUM_ARMOR: "Medium",
        HEAVY_ARMOR: "Heavy",
        SHIELD: "Shield"
    }
};

const ToolEnum = {
    ARTISAN: {
        TOOL_ARTISAN_ALCHEMIST: "Alchemist\'s Supplies",
        TOOL_ARTISAN_BREWER: "Brewer\'s Supplies",
        TOOL_ARTISAN_CALLIGRAPHER: "Calligrapher\'s Supplies",
        TOOL_ARTISAN_CARPENTER: "Carpenter\'s Tools",
        TOOL_ARTISAN_CARTOGRAPHER: "Cartographer\'s Tools",
        TOOL_ARTISAN_COBBLER: "Cobbler\'s Tools",
        TOOL_ARTISAN_COOK: "Cook\'s Utensils",
        TOOL_ARTISAN_GLASSBLOWER: "Glassblower\'s Tools",
        TOOL_ARTISAN_JEWELER: "Jeweler\'s Tools",
        TOOL_ARTISAN_LEATHER: "Leather Worker\'s Tools",
        TOOL_ARTISAN_MASON: "Mason\'s Tools",
        TOOL_ARTISAN_PAINTER: "Painter\'s Tools",
        TOOL_ARTISAN_POTTER: "Potter\'s Tools",
        TOOL_ARTISAN_SMITH: "Smith\'s Tools",
        TOOL_ARTISAN_TINKER: "Tinker\'s Tools",
        TOOL_ARTISAN_WEAVER: "Weaver\'s Tools",
        TOOL_ARTISAN_WOODCARVER: "Woodcarver\'s Tools",
    },

    GAMING: {
        TOOL_GAMING_DICE: "Dice Set",
        TOOL_GAMING_CARDS: "Playing Card Set",
    },

    INSTRUMENT: {
        TOOL_INSTRUMENT_BAGPIPES: "Bagpipes",
        TOOL_INSTRUMENT_DRUM: "Drum",
        TOOL_INSTRUMENT_FLUTE: "Flute",
        TOOL_INSTRUMENT_GUITAR: "Guitar",
        TOOL_INSTRUMENT_HORN: "Horn",
        TOOL_INSTRUMENT_LUTE: "Lute",
        TOOL_INSTRUMENT_LYRE: "Lyre",
    },

    VEHICLE: {
        TOOL_VEHICLE_LAND: "Land Vehicle",
        TOOL_VEHICLE_WATER: "Water Vehicle",
    },

    OTHER: {
        TOOL_MISC_DISGUISE: "Disguise Kit",
        TOOL_MISC_FORGERY: "Forgery Kit",
        TOOL_MISC_HERBALISM: "Herbalism Kit",
        TOOL_MISC_NAVIGATOR: "Navigator\'s Tools",
        TOOL_MISC_POISONER: "Poisoner\'s Kit",
        TOOL_MISC_THIEVES: "Thieve\'s Kit"
    }
};

// Schemas

// Schemas Embedded into Sheet
const Weapon = new Schema({
    name: String,
    bonus: Number,
    damage: String,
    type: String,   // Chosen from ProficiencyEnum.WEAPON
    description: String,
});

const Armor = new Schema({
    name: String,   // Chosen by User
    type: String,   // Chosen from ProficiencyEnum.ARMOR
    stealthPenalty: Number,
    baseAC: Number,
    dexterityBonus: Number,
    magicalBonus: Number,
    armorClass: (this.baseAC + this.dexterityBonus + this.magicalBonus),
    description: String,
    equipped: Boolean
});

const Shield = new Schema({
    name: String,   // Chosen By User
    type: String,   // Should always be "Shield"
    baseBonus: Number,
    magicalBonus: Number,
    armorBonus: (this.baseBonus + this.magicalBonus),
    description: String,
    equipped: Boolean
});

const SkillProficiency = new Schema ({
    skill: String,  // Chosen from SkillEnum
    type: String    // Chosen from ProficiencyEnum.PROFICIENCY_TYPE
});

const Feat = new Schema({
    name: String,
    description: String
});

const SpellLevel = new Schema({
    slots: Number,
    expended: Number,
    spells: [String]
});

// The Sheet Schema
const Sheet = new Schema({
    user: String,           // For Database Reference Only -- A String Link to the User's ID.

    // Basic Character Information
    name: String,           // character name
    class: String,          // class name
    level: Number,          // character level
    experience: Number,     // character experience points
    background: String,     // 5e Background Attribute
    player: String,         // player name
    faction: String,        // character faction
    race: String,           // character race
    subrace: String,        // character subrace
    alignment: String,      // character alignment

    // More in-depth character information
    traits: {
        ideological: {
            personality: String,
            ideals: String,
            bonds: String,
            flaws: String,
            backstory: String
        },
        personal: {
            gender: [String],
            age: String,
            height: String,
            weight: String,
            eyes: String,
            skin: String,
            hair: String,
            image: String, // A URL to an Image
        }
    },


    // Statistics
    abilityScores: {
        // The Six Main Statistics of Dungeons and Dragons
        str: Number,
        dex: Number,
        con: Number,
        int: Number,
        wis: Number,
        cha: Number
    },
    saves: {
        str: String,
        dex: String,
        con: String,
        int: String,
        wis: String,
        cha: String
    },        // Proficient Ability Saves
    skills: {
        acrobatics: String,
        animalHandling: String,
        arcana: String,
        athletics: String,
        deception: String,
        history: String,
        insight: String,
        intimidation: String,
        investigation: String,
        medicine: String,
        nature: String,
        perception: String,
        performance: String,
        persuasion: String,
        religion: String,
        sleightOfHand: String,
        stealth: String,
        survival: String
    }, // Proficient Skill Saves
    hitPoints: Number,
    currentHP: Number,
    temporaryHP: Number,
    hitDice: String,
    inspiration: String,

    armorClass: Number,
    initiative: Number,
    speed: Number,

    deathSaves: {
        successes: {
            success1: Boolean,
            success2: Boolean,
            success3: Boolean
        },
        failures: {
            failure1: Boolean,
            failure2: Boolean,
            failure3: Boolean
        }
    },

    proficiencies: {
        language: [String], // Chosen by User
        weapon: [String],   // Chosen from ProficiencyEnum.Weapon
        armor: [String],    // Chosen from ProficiencyEnum.Armor
        tool: [String],     // Chosen from ToolEnum
        other: [String]     // Chosen by User
    },

    feats: [Feat],

    // Equipment
    weapons: [Weapon],      // Chosen By User
    armor: [Armor],         // Chosen By User
    shields: [Shield],      // Chosen By User
    inventory: [String],    // Chosen by User

    // Magical Information
    magic: {
        caster: Boolean,
        spellCastingAbility: String, // Chosen from AbilityScoreEnum
        spellSaveDC: Number,
        spellAttackBonus: Number,
        spells: {
            level0: SpellLevel,
            level1: SpellLevel,
            level2: SpellLevel,
            level3: SpellLevel,
            level4: SpellLevel,
            level5: SpellLevel,
            level6: SpellLevel,
            level7: SpellLevel,
            level8: SpellLevel,
            level9: SpellLevel,
        },
    },
    createdAt: String // Time Stamp

});

// The User Schema
const User = new Schema({
    username: String,   // The Username
    hash: String,       // The Password Hashed
    sheets: [Sheet]     // Should potentially only be an array of Strings? We link to sheets from here
});


// Remember to add everything to mongoose and connect with mongoose.
Sheet.plugin(URLSlugs('createdAt'));

mongoose.model('Weapon', Weapon);
mongoose.model('Armor', Armor);
mongoose.model('Shield', Shield);
mongoose.model('SkillProficiency', SkillProficiency);
mongoose.model('Feat', Feat);
mongoose.model('SpellLevel', SpellLevel);
mongoose.model('Sheet', Sheet);
mongoose.model('User', User);

let dbconf;
// is the environment variable, NODE_ENV, set to PRODUCTION?
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // connection string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/dragons-hoard';
}

mongoose.connect(dbconf);