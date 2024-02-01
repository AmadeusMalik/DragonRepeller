// VARIABLES:
// Player stats
let xp = 0 // Player's experience points
let health = 100 // Player's health
let gold = 50 // Player's gold
let currentWeapon = 0 // Index of the player's current weapon in the weapons array
let fighting // Placeholder for storing fighting state
let monsterHealth // Placeholder for storing monster's health
let inventory = ['stick'] // Array to store player's weapons

// Game elements
const button1 = document.querySelector('#button1') // Button 1
const button2 = document.querySelector('#button2') // Button 2
const button3 = document.querySelector('#button3') // Button 3
const text = document.querySelector('#text') // Text element for displaying messages
const xpText = document.querySelector('#xpText') // Element to display player's XP
const healthText = document.querySelector('#healthText') // Element to display player's health
const goldText = document.querySelector('#goldText') // Element to display player's gold
const monsterStats = document.querySelector('#monsterStats') // Container for monster stats
const monsterName = document.querySelector('#monsterName') // Element to display monster's name
const monsterHealthText = document.querySelector('#monsterHealth') // Element to display monster's health

// Weapon data
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
]
//Monster Data
const monsters = [
  { name: 'slime', level: 2, health: 15 },
  { name: 'fanged beast', level: 8, health: 60 },
  { name: 'dragon', level: 20, health: 300 }
]
// Location data
const locations = [
  //#0 (Indexed Locations)
  {
    name: 'town square',
    'button text': ['Go to store', 'Go to cave', 'Fight dragon'],
    'button functions': [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".'
  },
  {
    //#1
    name: 'store',
    'button text': [
      'Buy 10 health (10 gold)',
      'Buy weapon (30 gold)',
      'Go to town square'
    ],
    'button functions': [buyHealth, buyWeapon, goTown],
    text: 'You enter the store.'
  },
  {
    //#2
    name: 'cave',
    'button text': ['Fight slime', 'Fight fanged beast', 'Go to town square'],
    'button functions': [fightSlime, fightBeast, goTown],
    text: 'You enter the cave. You see some monsters.'
  },
  {
    //#3
    name: 'fight',
    'button text': ['Attack', 'Dodge', 'Run'],
    'button functions': [attack, dodge, goTown],
    text: 'You are fighting a monster.'
  },
  {
    //#4
    name: 'kill monster',
    'button text': [
      'Go to town square',
      'Go to town square',
      'Go to town square'
    ],
    'button functions': [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    //#5
    name: 'lose',
    'button text': ['REPLAY?', 'REPLAY?', 'REPLAY?'],
    'button functions': [restart, restart, restart],
    text: 'You die. ☠️'
  },
  {
    //#6
    name: 'win',
    'button text': ['REPLAY?', 'REPLAY?', 'REPLAY?'],
    'button functions': [restart, restart, restart],
    text: 'You defeat the dragon! YOU WIN THE GAME! 🎉'
  },
  {
    name: 'easter egg',
    'button text': ['2', '8', 'Go to town square?'],
    'button functions': [pickTwo, pickEight, goTown],
    text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!'
  }
]

// INITIALIZATION:
// Set initial button functions
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

// FUNCTIONS:
// Update game elements based on location data
function update (location) {
  monsterStats.style.display = 'none' //After a monster is defeated, the monster's stat box should no longer display
  button1.innerText = location['button text'][0]
  button2.innerText = location['button text'][1]
  button3.innerText = location['button text'][2]
  button1.onclick = location['button functions'][0]
  button2.onclick = location['button functions'][1]
  button3.onclick = location['button functions'][2]
  text.innerText = location.text
}

// Navigation functions
function goTown () {
  update(locations[0])
}

function goStore () {
  update(locations[1])
}

function goCave () {
  update(locations[2])
}

// Buy and sell functions
function buyHealth () {
  if (gold >= 10) {
    gold -= 10
    health += 10
    goldText.innerText = gold
    healthText.innerText = health
  } else {
    text.innerText = 'You do not have enough gold to buy health.'
  }
}

function buyWeapon () {
  if (currentWeapon < weapons.length - 1) {
    // Check for available upgrades
    if (gold >= 30) {
      gold -= 30
      currentWeapon++
      goldText.innerText = gold
      let newWeapon = weapons[currentWeapon].name
      text.innerText = 'You now have a ' + newWeapon + '.'
      inventory.push(newWeapon)
      text.innerText += ' In your inventory you have: ' + inventory
    } else {
      text.innerText = 'You do not have enough gold to buy a weapon.'
    }
  } else {
    text.innerText = 'You already have the most powerful weapon!'
    button2.innerText = 'Sell weapon for 15 gold'
    button2.onclick = sellWeapon
  }
}

function sellWeapon () {
  if (inventory.length > 1) {
    gold += 15
    goldText.innerText = gold
    let currentWeapon = inventory.shift()
    text.innerText = 'You sold a ' + currentWeapon + '.'
    text.innerText += ' In your inventory you have: ' + inventory
  } else {
    text.innerText = "Don't sell your only weapon!"
  }
}

//fight functions
function fightSlime () {
  fighting = 0
  goFight()
}

function fightBeast () {
  fighting = 1
}

function fightDragon () {
  fighting = 2
}

function goFight () {
  update(locations[3])
  monsterHealth = monsters[fighting].health
  monsterStats.style.display = 'block'
  monsterName.innerText = monsters[fighting].name
  monsterHealthText.innerText = monsters[fighting].health
}

function attack () {
  text.innerText = 'The ' + monsters[fighting].name + ' attacks.'
  text.innerText +=
    ' You attack it with your ' + weapons[currentWeapon].name + '.'

  health -= getMonsterAttackValue(monsters[fighting].level) //health = health - current monster level
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1 //Math.floor(Math.random() * 5) + 1; Picks a random number from 1-5 and rounds it down to the nearest interger
  } else {
    text.innerText += ' You miss.'
  }
  healthText.innerText = health
  monsterHealthText.innerText = monsterHealth
  if (health <= 0) {
    lose()
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame()
    } else {
      defeatMonster()
    }
  } //The player's weapon should only break if inventory.length does not equal (!==) one.
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += ' Your ' + inventory.pop() + ' breaks.' //inventory.pop() which will remove the last item in the array AND return it so it appears in your string
    currentWeapon--
  }
}

function getMonsterAttackValue (level) {
  const hit = level * 5 - Math.floor(Math.random() * xp) //this will set the monster's attack to five times their level minus a random number between 0 and the player's xp.
  //condition ? expressionIfTrue : expressionIfFalse
  return hit ? hit < 0 : 0
}

function isMonsterHit () {
  return Math.random() > 0.2 || health < 20
}

function dodge () {
  text.innerText =
    'You dodge the attack from the ' + monsters[fighting].name + ' .'
}

function defeatMonster () {
  gold += Math.floor(monsters[fighting].level * 6.7)
  xp += monsters[fighting].level
  goldText.innerText = gold
  xpText.innerText = xp
  update(locations[4])
}

function lose () {
  update(locations[5])
}

function winGame () {
  update(locations[6])
}

function restart () {
  xp = 0
  health = 100
  gold = 50
  currentWeapon = 0
  inventory = inventory[0]
  goldText.innerText = gold
  healthText.innerText = health
  xpText.innerText = xp
  goTown()
}

function easterEgg () {
  update(locations[7])
}

function pick (guess) {
  const numbers = []
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11)) //push a random number between 0 and 10 to the end of the numbers array
  }
  text.innerText = 'You picked ' + guess + '. Here are the random numbers:\n' // \n This will cause the next part you add to text.innerText to appear on a new line
  for (let i = 0; x < 5; i++) {
    //*for loops use i as the counter and start from 0
    // for (a; b; c), where a is the initialization expression, b is the condition, and c is the final expression
    text.innerText += numbers[i] + '\n'
  }
  if (numbers.includes(guess)) {
    //*includes() method determines if an array contains an element and will return either true or false.
    text.InnerText += 'Right! You win 20 gold!'
    gold += 20
    goldText.innerText = gold
  } else {
    text.innerText += 'Wrong! You lose 10 health!'
    health -= 10
    healthText.innerText = health
    if (health <= 0) {
      lose();
    }
  }
}

function pickTwo () {
  pick(2)
}

function pickEight () {
  pick(8)
}
