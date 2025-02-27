// Deck & Game State
let deck = [];
let playerHand = [];
let aiHand = [];
let discardPile = [];
let melds = [];

// Initialize the game
function initializeGame() {
    deck = generateDeck();
    shuffleDeck(deck);
    dealCards();
    updateUI();
}

// Generate a deck with 2 sets of 52 cards + 1 Joker
function generateDeck() {
    let suits = ["♥", "♦", "♠", "♣"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];

    for (let i = 0; i < 2; i++) {
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        deck.push({ value: "Joker", suit: "" }); // Add Joker
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal cards (15 for first player, 14 for others)
function dealCards() {
    for (let i = 0; i < 15; i++) playerHand.push(deck.pop());
    for (let i = 0; i < 14; i++) aiHand.push(deck.pop());
    discardPile.push(deck.pop()); // First discard card
}

// Draw a card
function drawCard() {
    if (deck.length === 0) return;
    playerHand.push(deck.pop());
    updateUI();
}

// Discard a card
function discardCard(index) {
    discardPile.push(playerHand.splice(index, 1)[0]);
    updateUI();
}

// Check if a meld is valid
function isValidMeld(meld) {
    if (meld.length < 3) return false;

    let isSet = meld.every(card => card.value === meld[0].value);
    let isRun = meld.every((card, i, arr) => i === 0 || parseInt(card.value) === parseInt(arr[i - 1].value) + 1);

    return isSet || isRun;
}

// Player makes a meld
function makeMeld(selectedIndexes) {
    let selectedCards = selectedIndexes.map(index => playerHand[index]);
    if (isValidMeld(selectedCards)) {
        melds.push(selectedCards);
        selectedIndexes.reverse().forEach(index => playerHand.splice(index, 1));
    }
    updateUI();
}

// AI Turn Logic
function aiTurn() {
    // AI will always draw a card first
    if (deck.length > 0) aiHand.push(deck.pop());

    // AI tries to make melds
    for (let i = 0; i < aiHand.length - 2; i++) {
        for (let j = i + 1; j < aiHand.length - 1; j++) {
            for (let k = j + 1; k < aiHand.length; k++) {
                let potentialMeld = [aiHand[i], aiHand[j], aiHand[k]];
                if (isValidMeld(potentialMeld)) {
                    melds.push(potentialMeld);
                    aiHand = aiHand.filter(card => !potentialMeld.includes(card));
                    break;
                }
            }
        }
    }

    // AI discards a random card
    if (aiHand.length > 0) {
        let discardIndex = Math.floor(Math.random() * aiHand.length);
        discardPile.push(aiHand.splice(discardIndex, 1)[0]);
    }

    updateUI();
}

// Update UI
function updateUI() {
    document.getElementById("hand-cards").innerHTML = playerHand.map((card, index) =>
        `<span class="card" onclick="discardCard(${index})">${card.value} ${card.suit}</span>`
    ).join("");

    document.getElementById("discarded-card").innerHTML = discardPile.length > 0
        ? `${discardPile[discardPile.length - 1].value} ${discardPile[discardPile.length - 1].suit}`
        : "Empty";

    document.getElementById("meld-cards").innerHTML = melds.map(meld =>
        `<div class="meld">${meld.map(card => `${card.value} ${card.suit}`).join(" ")}</div>`
    ).join("");
}

// End Player Turn & Let AI Play
function endTurn() {
    aiTurn();
}

// Start the game
initializeGame();