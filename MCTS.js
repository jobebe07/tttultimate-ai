import GameState from "./GameState.js"
import Node from "./Node.js"

export default class MCTS {
    constructor(game, UBC1ExploreParam = 2) {
        this.game = game
        this.UBC1ExploreParam = UBC1ExploreParam
        this.nodes = new Map()
    }

    /**
     * Phase 1 of the MCTS algorithm.
     * Selection: Select until node is not fully expanded or is terminal (leaf).
     * @param {GameState} state 
     */
    select(state) {
        let node = this.nodes.get(state.hash())
        while(node.isFullyExpanded() && !node.isLeaf()) {
            let plays = node.getAllPlays()
            let bestPlay
            let bestUCB1 = -Infinity
            for(let play of plays) {
                let childUCB1 = node.getChildNode(play).getUCB1Value(this.UBC1ExploreParam)
                if(childUCB1 > bestUCB1) {
                    bestPlay = play
                    bestUCB1 = childUCB1
                }
            }
            // select node with best ucb1 score
            node = node.getChildNode(bestPlay)
            //console.log("selected a node")
        }
        return node
    }

    /**
     * Phase 2 of the MCTS algorithm.
     * Expansion: Expand a random unexpanded child node.
     * @param {Node} node 
     */
    expand(node) {
        let unexpandedPlays = node.getUnexpandedPlays()
        let index = Math.floor(Math.random() * unexpandedPlays.length)
        let play = unexpandedPlays[index]

        let childState = this.game.nextState(node.state, play)
        let legalPlays = this.game.legalPlays(childState)
        let childNode = node.expand(play, childState, legalPlays)

        this.nodes.set(childState.hash(), childNode)
        //console.log(childNode)
        return childNode
    }

    /**
     * Phase 3 of the MCTS algorithm.
     * Simulation: Simulate a node to a terminal state, return winner.
     * @param {Node} node 
     */
    simulate(node) {
        let state = node.state.clone()
        let winner = this.game.winner(state)
        while(winner === false) {
            let legalPlays = this.game.legalPlays(state)
            let index = Math.floor(Math.random() * legalPlays.length)
            let play = legalPlays[index]
            
            state = this.game.nextState(state, play)
            winner = this.game.winner(state)

            //console.log(legalPlays)
        }
        return winner
    }

    /**
     * Phase 4 of the MCTS algorithm.
     * Backpropagation: Update ancestors statistics.
     * @param {Node} node 
     * @param {Number} winner
     */
    backpropagate(node, winner) {
        while(node != null) {
            node.n_plays++
            // Update win counter when it was a win for the current player of the *node*!!!
            if(node.state.player === winner) {
                node.n_wins++
                //console.log("win")
            } else {
                //console.log("no win")
            }

            node = node.parent
        }
    }

    /**
     * Create a node with the given state if not already existing.
     * @param {GameState} state 
     */
    makeNode(state) {
        if(!this.nodes.has(state.hash())) {
            let unexpandedPlays = this.game.legalPlays(state)
            let node = new Node(null, null, state, unexpandedPlays)
            this.nodes.set(state.hash(), node)
        }
    }

    /**
     * From given state, repeatedly run MCTS to build statistics.
     * @param {GameState} state 
     * @param {Number} timeout 
     */
    runSearch(state, timeout = 3) {
        this.makeNode(state)
        let end = Date.now() + timeout * 1000
        while(Date.now() < end) {
            let node = this.select(state)
            //console.log(node)
            //console.log(this.game.getFieldVisual(node.state))
            let winner = this.game.winner(node.state)
            //console.log(winner)
            if(!node.isLeaf() && winner == false) {
                node = this.expand(node)
                winner = this.simulate(node)
                console.log("AND THE WINNER IS: " + winner)
            }
            this.backpropagate(node, winner)
        }
        //console.log(this.nodes)
    }

    /**
     * Get the best play from available statistics.
     * @param {GameState} state 
     */
    bestPlay(state) {
        this.makeNode(state)

        let node = this.nodes.get(state.hash())
        console.log(node)
        
        if(node.isFullyExpanded() === false) throw new Error("Not enough statistics")
        
        let allPlays = node.getAllPlays()
        let bestPlay
        let max = -Infinity
        for(let play of allPlays) {
            let childNode = node.getChildNode(play)
            if(childNode.n_plays > max) {
                bestPlay = play
                max = childNode.n_plays
            }
        }

        return bestPlay
    }

    /**
     * 
     * @param {GameState} state 
     * @returns {Object} An object containing the current statistics.
     */
    getStats(state) {
        let node = this.nodes.get(state.hash())
        let stats = { n_plays: node.n_plays, 
                    n_wins: node.n_wins, 
                    children: [] }
        
        for (let child of node.children.values()) {
            if (child.node === null) 
                stats.children.push({ play: child.play, 
                                    n_plays: null, 
                                    n_wins: null})
            else 
                stats.children.push({ play: child.play, 
                                    n_plays: child.node.n_plays, 
                                    n_wins: child.node.n_wins})
        }
        return stats
    }
}