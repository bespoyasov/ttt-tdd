import DomController from './DomController'
import Game from './Game'

const game = new Game()
const dom = new DomController({
  root: 'body', 
  game
})

dom.init()