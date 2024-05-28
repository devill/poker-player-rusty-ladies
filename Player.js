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
      let lowestCard = Math.min(holeCards[0].value, holeCards[1].value);
      let countOutPlayers = gameState.players.filter(player => player.status === 'out').length;
      let lastToAct = (gameState.dealer + 2 + countOutPlayers) === gameState.in_action;
      let bothHigh = lowestCard  > 10;
      let suited = holeCards[0].suit === holeCards[1].suit;
      let otherAllIn = gameState.players.filter(player =>  player.name !== me.name && player.stack === 0 && player.status === 'active').length;
      let otherLargeBet = gameState.players.filter(player => player.name !== me.name && gameState.small_blind * 5 < player.bet && player.status === 'active').length;
      console.log('otherLargeBet', otherLargeBet, gameState.players);
      if( otherAllIn === 0 && lastToAct) {
      // if( otherLargeBet === 0) {
        bet(10000);
        return;
      }
      if(bothHigh && suited) {
        bet(10000);
        return;
      }
      if(countOutPlayers === 1) {
        bet(isPair && (highestCard > 6) ? 10000 : 0);
      } else {
        bet(isPair && (highestCard > 8) ? 10000 : 0);
      }
    } catch (e) {
      console.error(e);
      bet(0);
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
