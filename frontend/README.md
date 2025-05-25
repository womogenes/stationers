# Stationers frontend

## Game state

Mental model: all clients have a copy of the state. They are authorized to send actions that edit their state. They send it to their own copy as well as all peer instances. State gets modified only when we receive a `receive` message.

Game attributes:

- players: list of players
- pawns: list of pawns

Data structures:

- Player: name (str), team (int)
- Pawn: square (0-14), player (string), team (int)

## Game event documentation

- `add-player <name>`
- `assign-team <name> <team>`
- `start-game`
  - After a game has been started, new players may not be added
