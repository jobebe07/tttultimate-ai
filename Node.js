import GameState from "./GameState.js";
import Play from "./modules/Play.js";

export default class Node {
    /**
     * Create a new MonteCarloNode in the search tree.
     * @param {Node} parent - The parent node.
     * @param {Play} play - Last play played to get to this state.
     * @param {GameState} state - The corresponding state.
     * @param {Play[]} unexpandedPlays - The node's unexpanded child plays.
     */
    constructor(parent, play, state, unexpandedPlays) {
        // Monte Carlo stuff, used for generating score of the node
        this.n_plays = 0;
        this.n_wins = 0;

        this.play = play
        this.state = state
        this.parent = parent

        this.children = new Map()
        for(let play of unexpandedPlays) {
            this.children.set(play.hash(), {play: play, node: null})
        }
    }

    /**
     * Get the MonteCarloNode corresponding to the given play.
     * @param {Play} play - The play leading to the child node.
     * @return {Node} The child node corresponding to the play given.
     */
    getChildNode(play) {
        let child = this.children.get(play.hash())

        if(child === undefined) throw new Error("This play is not possible")
        if(child.node === null) throw new Error("This node is not expanded")
        
        return this.children.get(play.hash()).node
    }
    /**
     * Expand the specified child play and return the new child node.
     * Add the node to the array of children nodes.
     * Remove the play from the array of unexpanded plays.
     * @param {Play} play - The play to expand.
     * @param {GameState} childState - The child state corresponding to the given play.
     * @param {Play[]} unexpandedPlays - The given child's unexpanded child plays; typically all of them.
     * @return {Node} The new child node.
     */
    expand(play, childState, unexpandedPlays) {
        if(!this.children.has(play.hash())) throw new Error("This play is not possible")

        let childNode = new Node(this, play, childState, unexpandedPlays)

        this.children.set(play.hash(), {play: play, node: childNode})

        return childNode
    }
}