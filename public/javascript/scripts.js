function addInputListener(DOMObject, fn) {
    DOMObject.addEventListener('input', fn);
}

// Updates an ability modifier when an ability score changes.
function updateAbilityModifier(abilityScore) {
    const score = abilityScore.value;
    if (!isNaN(score)) {
        const abilityMod = document.querySelector('#' + abilityScore.id + '-modifier');
        const modifier = Math.floor((score - 10) / 2);
        abilityMod.textContent = (modifier >= 0) ? '+' + modifier : '' + modifier;
    }
}

// Sets all checkboxes to checked or unchecked when the page loads.
function updateCheckBoxes() {
    const checkboxes = [];

    checkboxes.push(document.querySelector('#inspiration'));

    checkboxes.push(document.querySelector('#dss1'));
    checkboxes.push(document.querySelector('#dss2'));
    checkboxes.push(document.querySelector('#dss3'));

    checkboxes.push(document.querySelector('#dsf1'));
    checkboxes.push(document.querySelector('#dsf2'));
    checkboxes.push(document.querySelector('#dsf3'));

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].value === 'true') {
            checkboxes[i].setAttribute('checked', 'checked');
        } else {
            checkboxes[i].removeAttribute('checked');
        }
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
function updateProficiencyBonus() {
    const level = document.querySelector('#level');
    const bonus = document.querySelector('#proficiency-bonus');
    if (!isNaN(level.value)) {
        const proficiencyBonus = 1 + Math.ceil((level.value) / 4);
        if (bonus.textContent !== '+' + proficiencyBonus) {
            bonus.textContent = '+' + proficiencyBonus;
            updateSavingThrows();
            updateSkillProficiencies();
        }
    }
}

// Update all saving throws based on their proficiencies and relevant ability scores.
function updateSavingThrows() {
    const proficiency = document.querySelector('#proficiency-bonus');
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
function updateSkillProficiencies() {
    const proficiency = document.querySelector('#proficiency-bonus');
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

    const passivePerception = document.querySelector('#passive-perception');
    const perceptionObj = document.querySelector('#perception-proficiency');
    const perceptionMod = (perceptionObj.textContent.includes('+')) ?
        parseInt(perceptionObj.textContent.slice(1)) : parseInt(perceptionObj.textContent);
    const passivePerceptionMod = 10 + perceptionMod;
    passivePerception.textContent = (passivePerceptionMod >= 0) ? '+' + passivePerceptionMod : '' + passivePerceptionMod;
}

// Update the modifiers whenever the ability score changes.
function abilityScoreListener(DOMObject) {
    addInputListener(DOMObject, function() {
        updateAbilityModifier(DOMObject);
        updateSavingThrows();
        updateSkillProficiencies();
    });
}

// Update proficiency bonus, saving throws, and skill proficiencies on level up.
function levelListener(DOMObject) {
    addInputListener(DOMObject, function () {
        updateProficiencyBonus(DOMObject);
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
    const textAreas = document.getElementsByTagName('textarea');
    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].disabled = true;
    }
}

function highlightBackgroundsOnChange(objectArray) {
    for (let i = 0; i < objectArray.length; i++) {
        if (objectArray[i].type !== 'submit') {
            addInputListener(objectArray[i], function() {
                objectArray[i].style.backgroundColor = 'beige';
            });
        }
    }
}

// Watch for changes made to inputs and respond accordingly.
function watchForChanges() {
    // Highlight Changes Made to any input or text area.
    const inputs = document.getElementsByTagName('input');
    highlightBackgroundsOnChange(inputs);
    const textAreas = document.getElementsByTagName('textarea');
    highlightBackgroundsOnChange(textAreas);

    // Update skill proficiencies and saving throws when a proficiency value is changed.
    const skillProficiencySelections = document.getElementsByClassName('proficiency-select');
    for (let i = 0; i < skillProficiencySelections.length; i++) {
        addInputListener(skillProficiencySelections[i], () => {
            updateSavingThrows();
            updateSkillProficiencies();
        });
    }
    setupHelpers();
}
