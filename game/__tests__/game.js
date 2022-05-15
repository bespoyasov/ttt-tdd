import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import Game from "../src/Game";
import GameBuilder from "../src/GameBuilder";

import {
  userName,
  computerName,
  userMoveSymbol,
  computerMoveSymbol,
  initialGameBoard,
} from "../src/const";

let game;
beforeEach(() => {
  game = new Game();
});

const fillCells = (game, config = {}) => {
  const { x = -1, y = -1 } = config;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== x || j !== y) game.acceptUserMove(i, j);
    }
  }
};

const count = (arr, symbol) =>
  arr.reduce((result, row) => {
    return row.reduce((count, el) => {
      return el === symbol ? ++count : count;
    }, result);
  }, 0);

describe("Game", () => {
  test("Should return empty game board", () => {
    const board = game.getState();

    expect(board).toEqual(initialGameBoard);
  });

  test("Writes user's symbol in cell with given coordinates", () => {
    const x = 1;
    const y = 1;

    game.acceptUserMove(x, y);
    const board = game.getState();

    expect(board[x][y]).toEqual(userMoveSymbol);
  });

  test("Throws an exception if user moves in taken cell", () => {
    const x = 2;
    const y = 2;

    game.acceptUserMove(x, y);
    const func = game.acceptUserMove.bind(game, x, y);

    expect(func).toThrow("cell is already taken");
  });

  test("Game saves user's move in history", () => {
    const x = 1;
    const y = 1;

    game.acceptUserMove(x, y);
    const history = game.getMoveHistory();

    expect(history).toEqual([{ turn: "user", x, y }]);
  });

  test("Game saves computer's move in history", () => {
    const mock = jest.spyOn(global.Math, "random").mockReturnValue(0.5);

    game.createComputerMove();
    const history = game.getMoveHistory();

    expect(history).toEqual([{ turn: computerName, x: 1, y: 1 }]);
    mock.mockRestore();
  });

  test("Game saves 1 user's move and 1 computer's move in history", () => {
    const x = 1;
    const y = 1;

    game.acceptUserMove(x, y);
    game.createComputerMove();
    const history = game.getMoveHistory();

    expect(history.length).toEqual(2);
    expect(history[0].turn).toEqual(userName);
    expect(history[1].turn).toEqual(computerName);
  });

  test("Computer moves in randomly chosen cell", () => {
    const mock = jest.spyOn(global.Math, "random").mockReturnValue(0.5);

    game.createComputerMove();
    const board = game.getState();

    expect(board[1][1]).toEqual(computerMoveSymbol);
    mock.mockRestore();
  });

  test("Computer moves in cell that is not taken", () => {
    fillCells(game, { x: 2, y: 2 });

    game.createComputerMove();
    const board = game.getState();

    expect(count(board, userMoveSymbol)).toBe(8);
    expect(count(board, computerMoveSymbol)).toBe(1);
    expect(board[2][2]).toEqual(computerMoveSymbol);
  });

  test("If there are no free cells computer throws an exception", () => {
    fillCells(game);

    const func = game.createComputerMove.bind(game);
    expect(func).toThrow("no cells available");
  });

  test("Checks if user won by horizontal", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        x x x
        . . .
        . . .`
      )
      .build();

    const userWon = game.isWinner(userName);
    expect(userWon).toEqual(true);
  });

  test("Checks if user has won by vertical", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        x . .
        x . .
        x . .`
      )
      .build();

    const userWon = game.isWinner(userName);
    expect(userWon).toEqual(true);
  });

  test("Checks if user has won by main diagonal", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        x . .
        . x .
        . . x`
      )
      .build();

    const userWon = game.isWinner(userName);
    expect(userWon).toEqual(true);
  });

  test("Checks if user has won by secondary diagonal", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        . . x
        . x .
        x . .`
      )
      .build();

    const userWon = game.isWinner(userName);
    expect(userWon).toEqual(true);
  });

  test("Checks if there is winner", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        x x x
        . . .
        . . .`
      )
      .build();

    const state = game.checkGame();
    expect(state).toEqual(`${userName} won!`);
  });

  test("Checks if there are no winners", () => {
    const game = new GameBuilder()
      .withBoardState(
        `
        . x x
        . . .
        . . .`
      )
      .build();

    const state = game.checkGame();
    expect(state).toEqual(`continue`);
  });

  test("Returns game board size", () => {
    const size = game.getSize();

    expect(size).toBe(3);
  });
});
