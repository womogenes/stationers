// Represents state for a game
// Methods for actions, serialization, etc.

import { shuffleArray } from '@/utils';
import './bookshop';

export class StationersGame {
  gameStarted: boolean;
  players: any[];
  pawns: any[];
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

  send(msg: string[]) {
    // Mutate game state
    const [cmd, args] = msg;

    switch (cmd) {
      case 'new-player':
        this.addPlayer(args[0]);
        break;

      case 'assign-team':
        this.assignTeam(args[0], parseInt(args[1]));
        break;

      case 'start-game':
        this.startGame();
        break;

      case 'increment-round':
        this.round++;
        break;

      default:
        break;
    }

    this.updateSubscribers();
  }

  // Getters
  getPlayer(name: string) {
    return this.players.find((p) => p.name === name);
  }

  addPlayer(name: string) {
    // Ensure game has not started
    if (this.gameStarted) throw Error('Cannot add players after game start');

    // Ensure no one has this name already
    if (this.getPlayer(name)) throw Error(`Name '${name}$' already in use`);
    if (['game'].includes(name)) throw Error(`Illegal player name '${name}'`);

    this.players.push({ name, team: -1 });

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
    const playersByTeam = [
      this.players.filter(({ team }) => team === 0),
      this.players.filter(({ team }) => team === 1),
    ];

    // Create all pawns
    if (![2, 3, 4, 5, 6].includes(this.players.length)) {
      throw Error(`Must have 2-6 players`);
    }
    const pawnDists = {
      2: [[1], [1]],
      3: [[1, 1], [2]],
      4: [
        [1, 1],
        [1, 1],
      ],
      5: [
        [1, 1, 1],
        [1, 2],
      ],
      6: [
        [1, 1, 1],
        [1, 1, 1],
      ],
    };
    // @ts-ignore
    const pawnDist = pawnDist[this.players.length];
    this.pawns = [];
    [0, 1].forEach((team) => {
      pawnDist[team].forEach((nPawns: number, playerIdx: number) => {
        this.pawns.push({
          square: 0,
          player: playersByTeam[team][playerIdx].name,
          team: team,
        });
      });
    });

    this.gameStarted = true;

    return true;
  }
}
