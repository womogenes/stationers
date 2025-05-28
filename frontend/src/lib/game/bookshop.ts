import { StationersGame } from './game';

// Represents a bookshop tile

export interface Bookshop {
  name: string;
  description: string;

  // How this is used:
  //  minorTeam is -1 if they didn't give >1/2 shares
  //  (this is up to game to figure out)
  resolve: (majorTeam: number, minorTeam: number, game: StationersGame) => [number, number];
}

export const createShop = (name: string) => {
  switch (name) {
    case 'alamancs':
      return {
        name: 'Alamancs',
        description:
          'Multiply three cards together. Divide by a fourth. Remove all favors at the end of the round.',
        resolve: (majorTeam: number, minorTeam: number, game: StationersGame) => {
          // Draw four cards from a deck
          // Multiply the three highest
          // Divide by the lowest
          // Return [majorTeamScore, minorTeamScore]
        },
      };

    case 'arts':
      return {
        name: 'Arts',
        description: 'Draw one card. Square it.',
        resolve: (majorTeam: number, minorTeam: number, game: StationersGame) => {
          // Draw one card
          // Square it
          // Return [majorTeamScore, minorTeamScore]
        },
      };

    default:
      throw Error(`Invalid shop name '${name}'`);
  }
};
