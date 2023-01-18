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

    }

    /**
     * Phase 2 of the MCTS algorithm.
     * Expansion: Expand a random unexpanded child node.
     * @param {Node} node 
     */
    expand(node) {

    }

    /**
     * Phase 3 of the MCTS algorithm.
     * Simulation: Simulate a node to a terminal state, return winner.
     * @param {Node} node 
     */
    simulate(node) {
        
    }

    /**
     * Phase 4 of the MCTS algorithm.
     * Backpropagation: Update ancestors statistics.
     * @param {Node} node 
     * @param {Number} winner
     */
    backpropagate(node, winner) {

    }

    /**
     * Create a node with the given state if not already existing.
     * @param {GameState} state 
     */
    makeNode(state) {

    }

    /**
     * From given state, repeatedly run MCTS to build statistics.
     * @param {GameState} state 
     * @param {Number} timeout 
     */
    runSearch(state, timeout = 3) {

    }

    /**
     * Get the best play from available statistics.
     * @param {GameState} state 
     */
    bestPlay(state) {

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