// Represents state for a game
// Methods for actions, serialization, etc.

import { shuffleArray } from '@/utils';

import { FAVOR_COUNTS, PAWN_DISTS } from './constants';
import type { Player, Pawn } from './types';

export class StationersGame {
  gameStarted: boolean;
  players: Player[];
  pawns: Pawn[];
  round: number;

  subscribers: ((gameState: any) => void)[];

  constructor() {
    this.gameStarted = false;
    this.players = [];
    this.pawns = [];
    this.round = 0;

    this.subscribers = [];
  }

  // Methods for updating subscribers
  toJSON() {
    return {
      gameStarted: this.gameStarted,
      players: this.players,
      pawns: this.pawns,
      round: this.round,
    };
  }
  subscribe(callback: (gameState: any) => void) {
    this.subscribers.push(callback);
    callback(this.toJSON());

    return {
      unsubscribe: () => (this.subscribers = this.subscribers.filter((cb) => cb !== callback)),
    };
  }
  updateSubscribers() {
    this.subscribers.forEach((callback) => callback(this.toJSON()));
  }

  // Resetting game state
  reset() {
    this.gameStarted = false;
    this.players = [];
    this.pawns = [];
    this.round = 0;

    this.updateSubscribers();
  }

  send(msg: [string, string[]]) {
    // Mutate game state
    const [cmd, args] = msg;

    switch (cmd) {
      case 'add-player':
        this.addPlayer(args[0]);
        break;

      case 'remove-player':
        this.removePlayer(args[0]);
        break;

      case 'assign-team':
        this.assignTeam(args[0], parseInt(args[1]));
        break;

      case 'start-game':
        this.startGame();
        break;

      case 'reset':
        this.reset();
        break;

      default:
        break;
    }

    this.updateSubscribers();
  }

  // Convenience helper methods
  getPlayer(name: string) {
    return this.players.find((p) => p.name === name);
  }
  getPlayersByTeam() {
    return [
      this.players.filter(({ team }) => team === 0),
      this.players.filter(({ team }) => team === 1),
    ];
  }
  isGameStartReady() {
    if (![2, 3, 4, 5, 6].includes(this.players.length)) return false;
    const playersByTeam = this.getPlayersByTeam();
    const teamASize = playersByTeam[0].length;
    const teamBSize = playersByTeam[1].length;
    if (teamASize + teamBSize !== this.players.length) return false;
    if (Math.abs(teamASize - teamBSize) > 1) return false;
    return true;
  }

  addPlayer(name: string) {
    // Ensure game has not started
    if (this.gameStarted) throw Error('Cannot add players after game start');

    // Ensure no one has this name already
    if (this.getPlayer(name)) throw Error(`Name '${name}' already in use`);
    if (['game'].includes(name)) throw Error(`Illegal player name '${name}'`);

    this.players.push({ name, team: 2, favors: 0, insurance: 0 });

    return true;
  }

  removePlayer(name: string) {
    if (this.gameStarted) throw Error('Cannot remove players after game start');

    const player = this.getPlayer(name);
    if (!player) throw Error(`Player '${name}' not found`);
    this.players = this.players.filter((p) => p.name !== name);

    return true;
  }

  assignTeam(name: string, team: number) {
    if (this.gameStarted) throw Error('Cannot assign teams after game start');
    if (![0, 1].includes(team)) throw Error(`Invalid team '${team}'`);

    const player = this.getPlayer(name);
    if (!player) throw Error(`Player '${name}' not found`);
    player.team = team;

    return true;
  }

  /*
    Pawn distribution:
      - 2 players: [[1], [1]]
      - 3 players: [[1, 1], [2]]
      - 4 players: [[1, 1], [1, 1]]
      - 5 players: [[1, 1, 1], [1, 2]]
      - 6 players: [[1, 1, 1], [1, 1, 1]]
  */
  startGame() {
    if (this.gameStarted) throw Error('Game already started');

    // Assign tiles

    // Shuffle players for ease of indexing
    shuffleArray(this.players);
    const playersByTeam = this.getPlayersByTeam();
    if (!this.isGameStartReady()) throw Error('Game not ready to start');

    // Create all pawns and distribute favors
    // @ts-ignore
    const pawnDist = PAWN_DISTS[this.players.length];
    this.pawns = [];
    [0, 1].forEach((team) => {
      pawnDist[team].forEach((nPawns: number, playerIdx: number) => {
        for (let i = 0; i < nPawns; i++) {
          this.pawns.push({
            square: 0,
            favors: FAVOR_COUNTS[team][this.players.length >= 6 ? 'extraPlayers' : 'normal'],
            player: playersByTeam[team][playerIdx].name,
            team: team,
          });
        }
      });
    });

    // Shuffle the pawns
    shuffleArray(this.pawns);

    // Start first round
    this.round = 1;
    this.gameStarted = true;

    return true;
  }
}
