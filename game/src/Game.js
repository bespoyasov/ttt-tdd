export default class Game {
  constructor(board) {
    this._userName = 'user'
    this._computerName = 'computer'

    this._userMoveSymbol = '×'
    this._computerMoveSymbol = 'o'
    
    this._fieldSize = 3
    this._history = []
    this._board = board || [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  }

  getState() {
    return this._board
  }

  getSize() {
    return this._fieldSize
  }

  getMoveHistory() {
    return this._history
  }

  clear() {
    this._history = []
    this._board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  }

  acceptUserMove(x, y) {
    if (!this._isCellFree(x, y)) {
      return this._throwException('cell is already taken')
    }

    this._updateHistory(this._userName, x, y)
    this._updateBoard(x, y)
  }

  createComputerMove() {
    if (this._getFreeCellsCount() === 0) {
      return this._throwException('no cells available')
    }

    const [x, y] = this._getFreeRandomCoordinates()
    this._updateHistory(this._computerName, x, y)
    this._updateBoard(x, y, {
      symbol: this._computerMoveSymbol
    })
  }

  isWinner(player) {
    const symbol = this._getSymbolForPlayer(player)
    const range = [...Array(this._fieldSize).keys()]
    const isEqual = this._checkCellEqual(symbol)

    const horizontal = range.reduce((res, i) =>
      isEqual(i, 0) && isEqual(i, 1) && isEqual(i, 2) || res, false)

    const vertical = range.reduce((res, i) =>
      isEqual(0, i) && isEqual(1, i) && isEqual(2, i) || res, false)

    const diagonal = isEqual(0, 0) && isEqual(1, 1) && isEqual(2, 2)
      || isEqual(0, 2) && isEqual(1, 1) && isEqual(2, 0)

    return horizontal 
      || vertical 
      || diagonal 
      || false
  }

  checkGame() {
    if (this.isWinner(this._userName)) return `${this._userName} won!`
    if (this.isWinner(this._computerName)) return `${this._computerName} won!`
    if (this._getFreeCellsCount() === 0) return `nobody won :–(`
    return 'continue'
  }


  _updateBoard(x, y, config={}) {
    const {symbol=this._userMoveSymbol} = config
    this._board[x][y] = symbol
  }

  _updateHistory(turn, x, y) {
    this._history.push({turn, x, y})
  }

  _throwException(msg) {
    throw new Error(msg)
  }

  _isCellFree(x, y) {
    return !this._board[x][y]
  }

  _getFreeCellsCount() {
    return this._board.reduce((total, row) =>
      row.reduce((count, el) =>
        el === '' ? ++count : count, total), 0)
  }

  _getRandomCoordinate() {
    return Math.floor(Math.random() * (this._fieldSize - 0))
  }

  _getFreeRandomCoordinates() {
    let x = this._getRandomCoordinate()
    let y = this._getRandomCoordinate()

    while (!!this._board[x][y]) {
      x = this._getRandomCoordinate()
      y = this._getRandomCoordinate()
    }

    return [x, y]
  }

  _getSymbolForPlayer(player) {
    return player === this._userName
      ? this._userMoveSymbol
      : this._computerMoveSymbol
  }

  _checkCellEqual(symbol) {
    return (i, j) => 
      this._board[i][j] === symbol
  }
}