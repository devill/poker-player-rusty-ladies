class Player {
  static get VERSION() {
    return '0.1';
  }

  static toValue(rank) {
    switch (rank) {
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      case 'A':
        return 14;
      default:
        return parseInt(rank, 10);
    }
  }

  static betRequest(gameState, bet) {
    try {
      let me = gameState.players[gameState.in_action];
      let holeCards = me.hole_cards;
      let isPair = holeCards[0].rank === holeCards[1].rank;
      holeCards[0].value = Player.toValue(holeCards[0].rank);
      holeCards[1].value = Player.toValue(holeCards[1].rank);
      let highestCard = Math.max(holeCards[0].value, holeCards[1].value);
      bet(isPair && highestCard > 10 ? 10000 : 0);
    } catch (e) {
      console.error(e);
      bet(0);
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
