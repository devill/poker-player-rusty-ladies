class Player {
  static get VERSION() {
    return 'Ultimate chan killer ';
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
      let countOutPlayers = gameState.players.filter(player => player.status === 'out').length;
      let mid = (gameState.dealer + 1 + countOutPlayers) === gameState.in_action;
      let late = (gameState.dealer + 2 + countOutPlayers) === gameState.in_action;
      let otherAllIn = gameState.players.filter(player =>  player.name !== me.name && player.stack === 0 && player.status === 'active').length;
      let otherLargeBet = gameState.players.filter(player => player.name !== me.name && gameState.small_blind * 20 < player.bet && player.status === 'active').length;

      function calculateChenScore(holeCards) {
        let card1 = Player.toValue(holeCards[0].rank);
        let card2 = Player.toValue(holeCards[1].rank);
        let highestCard = Math.max(card1, card2);
        let lowestCard = Math.min(card1, card2);
        let isPair = card1 === card2;
        let isSuited = holeCards[0].suit === holeCards[1].suit;
        let gap = highestCard - lowestCard;

        // Score your highest card only
        let score;
        if (highestCard > 10) {
          score = highestCard - 1; // A=10, K=8, Q=7, J=6
        } else {
          score = highestCard / 2; // 10 to 2 = 1/2 of card value
        }

        // Multiply pairs by 2 of one card’s value. However, minimum score for a pair is 5
        if (isPair) {
          score = Math.max(5, score * 2);
        }

        // Add 2 points if cards are suited
        if (isSuited) {
          score += 2;
        }

        // Subtract points if there is a gap between the two cards
        if (gap === 1) {
          score -= 1;
        } else if (gap === 2) {
          score -= 2;
        } else if (gap === 3) {
          score -= 4;
        } else if (gap >= 4) {
          score -= 5;
        }

        // Add 1 point if there is a 0 or 1 card gap and both cards are lower than a Q
        if (gap <= 1 && highestCard < 12 && !isPair) {
          score += 1;
        }

        // Round half point scores up
        score = Math.ceil(score);

        return score;
      }


      if( otherLargeBet === 0 && late) {
      // if( otherLargeBet === 0) {
        bet(10000);
        return;
      }

      let chenScore = calculateChenScore(holeCards);

      if(late)
        bet(isPair && (chenScore >= 7 - countOutPlayers) ? 10000 : 0);
      else if(mid)
        bet(isPair && (chenScore >= 9 - countOutPlayers) ? 10000 : 0);
      else
        bet(isPair && (chenScore >= 10 - countOutPlayers) ? 10000 : 0);
    } catch (e) {
      console.error(e);
      bet(0);
    }
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
