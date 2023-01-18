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

    /**
     * Get all legal plays for this node.
     * @return {Play[]} All legal plays for this node.
     */
    getAllPlays() {
        let plays = []
        for(let child of this.children.values()) {
            plays.push(child.play)
        }
        return plays
    }

    /**
     * Get all unexpanded play for this node.
     * @return {Play[]} All unexpanded play for this node.
     */
    getUnexpandedPlays() {
        let plays = []
        for(let child of this.children.values()) {
            if(child.node === null) plays.push(child.play)
        }

        return plays
    }

    /**
     * @return {boolean} Whether this node is fully expanded
     */
    isFullyExpanded() {
        for(let child of this.children.values()) {
            if(child.node === null) return false
        }
        return true
    }

    /**
     * Whether this node is terminal in the game tree, NOT INCLUSIVE of termination due to winning.
     * @return {boolean} Whether this node is a leaf in the tree.
     */
    isLeaf() {
        return this.children.size === 0
    }

    /**
     * Get the UCB1 value for this node.
     * @param {number} biasParam - The square of the bias parameter in the UCB1 algorithm, defaults to 2.
     * @return {number} The UCB1 value of this node.
     */
    getUCB1Value(biasParam = 2) {
        return (this.n_wins / this.n_plays) + Math.sqrt(biasParam * Math.log(this.parent.n_plays) / this.n_plays);
    }
}