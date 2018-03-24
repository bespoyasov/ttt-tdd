import {expect} from 'chai'
import jsdom from 'jsdom'
import sinon from 'sinon'

import Game from '../src/Game'
import DomController from '../src/DomController'

const {JSDOM} = jsdom
const dom = new JSDOM('<html><body id="root"></body></html>')

global.window = dom.window
global.document = dom.window.document


const createGame = (board) => new Game(board)

const createInstance = (game={}) => {
  return new DomController({
    game: game,
    root: '#root'
  })
}

beforeEach(() => {
  window.alert = sinon.spy()
  window.confirm = sinon.spy()
})

afterEach(() => {
  document.body.innerHTML = ''
})


describe('DOM controller', () => {
  it('Creates empty table', () => {
    const domController = createInstance()

    domController.createTable()

    expect(document.querySelectorAll('table').length).to.equal(1)
  })

  it('Creates table with 3 rows and 3 columns', () => {
    const domController = createInstance()

    domController.createTable(3, 3)

    expect(document.querySelectorAll('table').length).to.equal(1)
    expect(document.querySelectorAll('tr').length).to.equal(3)
    expect(document.querySelectorAll('td').length).to.equal(9)
  })

  it('Remembers indecies of last clicked cell', () => {
    const domController = createInstance()

    domController.createTable(3, 3)
    document.querySelector('table td').click()

    expect(domController.lastClickedIndecies).to.deep.equal([0, 0])
  })

  it('Makes user move in game on cell click', () => {
    const gameMock = { acceptUserMove: sinon.spy() }
    const domController = createInstance(gameMock)

    domController.createTable(3, 3)
    document.querySelector('table td').click()

    expect(domController.game.acceptUserMove.called).to.be.true
  })

  it('Checks initialization of table by game state', () => {
    const game = createGame()
    const domController = createInstance(game)

    domController.init()

    expect(document.querySelectorAll('table').length).to.equal(1)
    expect(document.querySelectorAll('tr').length).to.equal(3)
    expect(document.querySelectorAll('td').length).to.equal(9)
  })

  it('Gets an alert when user makes move in taken cell', () => {
    const game = createGame()
    const domController = createInstance(game)

    domController.init()
    document.querySelector('table td').click()
    document.querySelector('table td').click()

    expect(window.alert.called).to.be.true
  })

  it('Redraws table on cell click', () => {
    const game = createGame()
    const domController = createInstance(game)

    domController.init()
    document.querySelector('table td').click()
    const text = document.querySelector('table td').textContent

    expect(text).to.be.equal('×')
  })

  it('Makes computer move right after users move', () => {
    const game = createGame()
    const domController = createInstance(game)

    domController.init()
    document.querySelector('table td').click()
    const text = document.querySelector('table').textContent

    expect(text.indexOf('o') > -1).to.be.true
  })

  it('Creates status text below table is someone wins', () => {
    const game = createGame([
      ['×', '×', ''], 
      ['', '', ''], 
      ['', '', '']
    ])

    const domController = createInstance(game)

    domController.init()
    document.querySelector('table tr:nth-child(1) td:nth-child(3)').click()

    const status = document.querySelector('#status')
    expect(status.textContent).to.equal('user won!')
  })

  it('Creates clear button if someone wins', () => {
    const game = createGame([
      ['×', '×', ''], 
      ['', '', ''], 
      ['', '', '']
    ])

    const domController = createInstance(game)

    domController.init()
    document.querySelector('table tr:nth-child(1) td:nth-child(3)').click()

    const button = document.querySelectorAll('button')
    expect(button.length).to.equal(1)
  })


  it('Clears table on button click', () => {
    const game = createGame([
      ['×', '×', ''], 
      ['', '', ''], 
      ['', '', '']
    ])

    const domController = createInstance(game)

    domController.init()
    document.querySelector('table tr:nth-child(1) td:nth-child(3)').click()
    document.querySelector('button').click()

    expect(document.querySelector('table').textContent).to.equal('')
    expect(document.querySelectorAll('button').length).to.equal(0)
  })
})