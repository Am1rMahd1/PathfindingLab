class Node {
    constructor(row, col, parent = null, gCost = 0, hCost = 0) {
        this.row = row;
        this.col = col;
        this.parent = parent;
        this.gCost = gCost; // هزینه از شروع تا این گره
        this.hCost = hCost; // هزینه تخمینی از این گره تا هدف
        this.fCost = gCost + hCost; // هزینه کل (برای A*)
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(node, priority) {
        const queueElement = { node, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift()?.node;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    getItems() {
        return this.items.map(item => item.node);
    }
}

const manhattanDistance = (node1, node2) => {
    return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
};

const euclideanDistance = (node1, node2) => {
    const dx = node1.row - node2.row;
    const dy = node1.col - node2.col;
    return Math.sqrt(dx * dx + dy * dy);
};

const getNeighbors = (node, gridSize) => {
    const neighbors = [];
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    directions.forEach(([dRow, dCol]) => {
        const newRow = node.row + dRow;
        const newCol = node.col + dCol;

        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            neighbors.push(new Node(newRow, newCol, node));
        }
    });

    return neighbors;
};

const reconstructPath = (targetNode) => {
    const path = [];
    let current = targetNode;

    while (current) {
        path.unshift({ row: current.row, col: current.col });
        current = current.parent;
    }

    return path;
};

export const bfsAlgorithm = async (start, target, gridSize, onStep, speed) => {
    const queue = [new Node(start.row, start.col)];
    const visited = new Set();
    const visitedNodes = [];
    let nodesExplored = 0;

    const startTime = Date.now();

    while (queue.length > 0) {
        const current = queue.shift();
        const currentKey = `${current.row}-${current.col}`;

        if (visited.has(currentKey)) continue;

        visited.add(currentKey);
        visitedNodes.push({ row: current.row, col: current.col });
        nodesExplored++;

        if (current.row === target.row && current.col === target.col) {
            const endTime = Date.now();
            const path = reconstructPath(current);

            return {
                success: true,
                path,
                visitedNodes,
                stats: {
                    algorithm: 'BFS',
                    nodesExplored,
                    pathLength: path.length,
                    executionTime: endTime - startTime,
                    isOptimal: true,
                    pathCost: path.length - 1
                }
            };
        }

        await onStep({
            current: { row: current.row, col: current.col },
            visited: visitedNodes,
            queue: queue.map(n => ({ row: n.row, col: n.col }))
        });

        await new Promise(resolve => setTimeout(resolve, speed));

        const neighbors = getNeighbors(current, gridSize);
        neighbors.forEach(neighbor => {
            const neighborKey = `${neighbor.row}-${neighbor.col}`;
            if (!visited.has(neighborKey)) {
                queue.push(neighbor);
            }
        });
    }

    const endTime = Date.now();
    return {
        success: false,
        path: [],
        visitedNodes,
        stats: {
            algorithm: 'BFS',
            nodesExplored,
            pathLength: 0,
            executionTime: endTime - startTime,
            isOptimal: false,
            pathCost: 0
        }
    };
};

export const dfsAlgorithm = async (start, target, gridSize, onStep, speed) => {
    const stack = [new Node(start.row, start.col)];
    const visited = new Set();
    const visitedNodes = [];
    let nodesExplored = 0;

    const startTime = Date.now();

    while (stack.length > 0) {
        const current = stack.pop();
        const currentKey = `${current.row}-${current.col}`;

        if (visited.has(currentKey)) continue;

        visited.add(currentKey);
        visitedNodes.push({ row: current.row, col: current.col });
        nodesExplored++;

        if (current.row === target.row && current.col === target.col) {
            const endTime = Date.now();
            const path = reconstructPath(current);

            return {
                success: true,
                path,
                visitedNodes,
                stats: {
                    algorithm: 'DFS',
                    nodesExplored,
                    pathLength: path.length,
                    executionTime: endTime - startTime,
                    isOptimal: false,
                    pathCost: path.length - 1
                }
            };
        }

        await onStep({
            current: { row: current.row, col: current.col },
            visited: visitedNodes,
            stack: stack.map(n => ({ row: n.row, col: n.col }))
        });

        await new Promise(resolve => setTimeout(resolve, speed));

        const neighbors = getNeighbors(current, gridSize);
        neighbors.reverse().forEach(neighbor => {
            const neighborKey = `${neighbor.row}-${neighbor.col}`;
            if (!visited.has(neighborKey)) {
                stack.push(neighbor);
            }
        });
    }

    const endTime = Date.now();
    return {
        success: false,
        path: [],
        visitedNodes,
        stats: {
            algorithm: 'DFS',
            nodesExplored,
            pathLength: 0,
            executionTime: endTime - startTime,
            isOptimal: false,
            pathCost: 0
        }
    };
};

export const ucsAlgorithm = async (start, target, gridSize, onStep, speed) => {
    const priorityQueue = new PriorityQueue();
    const startNode = new Node(start.row, start.col, null, 0);
    priorityQueue.enqueue(startNode, 0);

    const visited = new Set();
    const visitedNodes = [];
    const costs = new Map();
    costs.set(`${start.row}-${start.col}`, 0);
    let nodesExplored = 0;

    const startTime = Date.now();

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();
        const currentKey = `${current.row}-${current.col}`;

        if (visited.has(currentKey)) continue;

        visited.add(currentKey);
        visitedNodes.push({ row: current.row, col: current.col });
        nodesExplored++;

        if (current.row === target.row && current.col === target.col) {
            const endTime = Date.now();
            const path = reconstructPath(current);

            return {
                success: true,
                path,
                visitedNodes,
                stats: {
                    algorithm: 'UCS',
                    nodesExplored,
                    pathLength: path.length,
                    executionTime: endTime - startTime,
                    isOptimal: true,
                    pathCost: current.gCost
                }
            };
        }

        await onStep({
            current: { row: current.row, col: current.col },
            visited: visitedNodes,
            queue: priorityQueue.getItems().map(n => ({ row: n.row, col: n.col })),
            currentCost: current.gCost
        });

        await new Promise(resolve => setTimeout(resolve, speed));

        const neighbors = getNeighbors(current, gridSize);
        neighbors.forEach(neighbor => {
            const neighborKey = `${neighbor.row}-${neighbor.col}`;
            const newCost = current.gCost + 1; // هزینه حرکت = 1

            if (!visited.has(neighborKey) &&
                (!costs.has(neighborKey) || newCost < costs.get(neighborKey))) {
                costs.set(neighborKey, newCost);
                neighbor.gCost = newCost;
                neighbor.parent = current;
                priorityQueue.enqueue(neighbor, newCost);
            }
        });
    }

    const endTime = Date.now();
    return {
        success: false,
        path: [],
        visitedNodes,
        stats: {
            algorithm: 'UCS',
            nodesExplored,
            pathLength: 0,
            executionTime: endTime - startTime,
            isOptimal: false,
            pathCost: 0
        }
    };
};

export const aStarAlgorithm = async (start, target, gridSize, onStep, speed, heuristic = 'manhattan') => {
    const priorityQueue = new PriorityQueue();
    const targetNode = { row: target.row, col: target.col };

    const initialH = heuristic === 'euclidean'
        ? euclideanDistance(start, targetNode)
        : manhattanDistance(start, targetNode);

    const startNode = new Node(start.row, start.col, null, 0, initialH);
    priorityQueue.enqueue(startNode, startNode.fCost);

    const visited = new Set();
    const visitedNodes = [];
    const gScores = new Map();
    gScores.set(`${start.row}-${start.col}`, 0);
    let nodesExplored = 0;

    const startTime = Date.now();

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();
        const currentKey = `${current.row}-${current.col}`;

        if (visited.has(currentKey)) continue;

        visited.add(currentKey);
        visitedNodes.push({ row: current.row, col: current.col });
        nodesExplored++;

        if (current.row === target.row && current.col === target.col) {
            const endTime = Date.now();
            const path = reconstructPath(current);

            return {
                success: true,
                path,
                visitedNodes,
                stats: {
                    algorithm: `A* (${heuristic})`,
                    nodesExplored,
                    pathLength: path.length,
                    executionTime: endTime - startTime,
                    isOptimal: true,
                    pathCost: current.gCost,
                    heuristic: heuristic
                }
            };
        }

        await onStep({
            current: { row: current.row, col: current.col },
            visited: visitedNodes,
            queue: priorityQueue.getItems().map(n => ({ row: n.row, col: n.col })),
            currentCost: current.gCost,
            heuristicCost: current.hCost,
            totalCost: current.fCost
        });

        await new Promise(resolve => setTimeout(resolve, speed));

        const neighbors = getNeighbors(current, gridSize);
        neighbors.forEach(neighbor => {
            const neighborKey = `${neighbor.row}-${neighbor.col}`;
            const tentativeGScore = current.gCost + 1;

            if (!visited.has(neighborKey) &&
                (!gScores.has(neighborKey) || tentativeGScore < gScores.get(neighborKey))) {

                gScores.set(neighborKey, tentativeGScore);

                const hCost = heuristic === 'euclidean'
                    ? euclideanDistance(neighbor, targetNode)
                    : manhattanDistance(neighbor, targetNode);

                neighbor.gCost = tentativeGScore;
                neighbor.hCost = hCost;
                neighbor.fCost = tentativeGScore + hCost;
                neighbor.parent = current;

                priorityQueue.enqueue(neighbor, neighbor.fCost);
            }
        });
    }

    const endTime = Date.now();
    return {
        success: false,
        path: [],
        visitedNodes,
        stats: {
            algorithm: `A* (${heuristic})`,
            nodesExplored,
            pathLength: 0,
            executionTime: endTime - startTime,
            isOptimal: false,
            pathCost: 0,
            heuristic: heuristic
        }
    };
};
