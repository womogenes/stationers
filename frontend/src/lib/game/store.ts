import { StationersGame } from './game';

let gameInstance: StationersGame;
export function getGameInstance() {
  if (!gameInstance) gameInstance = new StationersGame();
  return gameInstance;
}
