class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    let me = gameState.players[gameState.in_action];
    let holeCards = me.hole_cards;
    let isPair = holeCards[0].rank === holeCards[1].rank;
    bet(isPair ? 10000 : 0);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
