// Used to convert ability score number to their modifiers
function convertScoreToMod(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
}

// Used to convert the level to the proficiency bonus.
function convertLevelToProficiencyBonus(level) {
    return 1 + Math.ceil((level) / 4);
}

// Updates an ability modifier when an ability score changes.
function updateAbilityModifier(abilityScore) {
    const score = abilityScore.value;
    if (!isNaN(score)) {
        const abilityMod = document.querySelector('#' + abilityScore.id + '-modifier');
        const modifier = convertScoreToMod(score);
        abilityMod.textContent = (modifier >= 0) ? '+' + modifier : '' + modifier;
    }
}

// Sets all checkboxes to checked or unchecked when the page loads.
function updateCheckBoxes() {
    const inspiration = document.querySelector('#inspiration');
    if (inspiration.value === 'true') {
        inspiration.setAttribute('checked', 'checked');
    } else {
        inspiration.removeAttribute('checked');
    }
}

// Update ALL ability modifiers based on their ability scores.
function updateModifiers() {
    const abilityScores = document.getElementsByClassName('ability-score');
    for (let i = 0; i < abilityScores.length; i++) {
        updateAbilityModifier(abilityScores[i]);
    }
}

// Whenever the level changes, ensure that the proficiency bonus changes if need be.
function updateProficiencyBonus(level) {
    const bonus = document.querySelector('#proficiency-bonus');
    if (!isNaN(level.value)) {
        const proficiencyBonus = convertLevelToProficiencyBonus(level.value);
        if (bonus.textContent !== '+' + proficiencyBonus) {
            bonus.textContent = '+' + proficiencyBonus;
            updateSavingThrows(document.querySelector('#proficiency-bonus'));
            updateSkillProficiencies(document.querySelector('#proficiency-bonus'));
        }
    }
}

// Update all saving throws based on their proficiencies and relevant ability scores.
function updateSavingThrows(proficiency) {
    const proficiencyBonus = (proficiency.textContent.includes('+'))
        ? parseInt(proficiency.textContent.slice(1)) : parseInt(proficiency.textContent);
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    let fullBonus = 0;

    for (let i = 0; i < abilityScores.length; i++) {
        const abilityModifierObj = document.querySelector('#' + abilityScores[i] + '-modifier');
        fullBonus = 0;

        fullBonus += (abilityModifierObj.textContent.includes('+')) ?
            parseInt(abilityModifierObj.textContent.slice(1)) : parseInt(abilityModifierObj.textContent);

        const proficiencyIndicator = document.querySelector('#' + abilityScores[i] + '-proficiency');
        switch (proficiencyIndicator.value) {
            default:
            case 'none':
                fullBonus += 0;
                break;
            case 'proficient':
                fullBonus += proficiencyBonus;
                break;
            case 'expertise':
                fullBonus += proficiencyBonus * 2;
                break;
        }

        const proficiencyNumber = document.querySelector('#' + abilityScores[i] + '-proficiency-bonus');
        proficiencyNumber.textContent = (fullBonus >= 0) ? '+' + fullBonus : '' + fullBonus;
    }
}

// Update all skill proficiencies based on their proficiency and and relevant ability score.
function updateSkillProficiencies(proficiency) {
    const proficiencyBonus = (proficiency.textContent.includes('+'))
        ? parseInt(proficiency.textContent.slice(1)) : parseInt(proficiency.textContent);
    let fullBonus = 0;

    const skills = ["acrobatics", "animal-handling", "arcana", "athletics", "deception", "history", "insight",
        "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion",
        "religion", "sleight-of-hand", "stealth", "survival"];
    const relevantAbilityScores = ["dex", "wis", "int", "str", "cha", "int", "wis",
        "cha", "int", "wis", "int", "wis", "cha", "cha",
        "int", "dex", "dex", "wis"];

    for (let i = 0; i < skills.length; i++) {
        const abilityModifierObj = document.querySelector('#' + relevantAbilityScores[i] + '-modifier');
        fullBonus = 0;
        fullBonus += (abilityModifierObj.textContent.includes('+')) ?
            parseInt(abilityModifierObj.textContent.slice(1)) : parseInt(abilityModifierObj.textContent);

        const proficiencyIndicator = document.querySelector('#' + skills[i]);
        switch (proficiencyIndicator.value) {
            default:
            case 'none':
                fullBonus += 0;
                break;
            case 'proficient':
                fullBonus += proficiencyBonus;
                break;
            case 'expertise':
                fullBonus += proficiencyBonus * 2;
                break;
        }

        const proficiencyNumber = document.querySelector('#' + skills[i] + '-proficiency');
        proficiencyNumber.textContent = (fullBonus >= 0) ? '+' + fullBonus : '' + fullBonus;
    }

}

// Update the modifiers whenever the ability score changes.
function abilityScoreListener(HTMLObject) {
    HTMLObject.addEventListener('input', function () {
        updateAbilityModifier(this);
        updateSavingThrows(document.querySelector('#proficiency-bonus'));
        updateSkillProficiencies(document.querySelector('#proficiency-bonus'));
    });
}

// Update proficiency bonus, saving throws, and skill proficiencies on level up.
function levelListener(HTMLObject) {
    HTMLObject.addEventListener('input', function () {
        updateProficiencyBonus(this);
    });
}

// Setup all javascript helper functions.
function setupHelpers() {
    const abilityScores = document.getElementsByClassName('ability-score');
    for (let i = 0; i < abilityScores.length; i++) {
        abilityScoreListener(abilityScores[i]);
    }
    levelListener(document.querySelector('#level'));
}

// Disable all inputs if the user is signed out.
function disableAllInputs() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

// Watch for changes made to inputs and respond accordingly.
function watchForChanges() {
    // Highlight Changes Made to any input
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type !== 'submit') {
            inputs[i].addEventListener('input', function () {
                this.style.backgroundColor = 'beige';
            });
        }
    }
    // Update skill proficiencies and saving throws when a proficiency value is changed.
    const skillProficiencySelections = document.getElementsByClassName('proficiency-select');
    for (let i = 0; i < skillProficiencySelections.length; i++) {
        skillProficiencySelections[i].addEventListener('input', function () {
            updateSavingThrows(document.querySelector('#proficiency-bonus'));
            updateSkillProficiencies(document.querySelector('#proficiency-bonus'));
        });
    }
    setupHelpers();
}