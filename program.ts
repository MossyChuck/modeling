const PI1 = 0.55;
const PI2 = 0.5;

interface Block {
    run: () => void;
}

class EndChanel implements Block {
    state: number;
    pi = PI2;
    processedCount: number;

    constructor(pi = PI2) {
        this.state = 0;
        this.processedCount = 0;
        this.pi = pi;
    }

    run() {
        if(this.state === 0) {
            return;
        }
        if(this.isProcessed()) {
            this.state = 0;
            this.processedCount++;
        }
    }

    isProcessed() {
        return Math.random() < 1 - this.pi;
    }
}

class Chanel1 implements Block {
    state: number;
    pi = PI1;
    omited: number;
    endChanel: EndChanel;

    constructor(endChanel: EndChanel, pi = PI1) {
        this.state = 0;
        this.omited = 0;
        this.endChanel = endChanel;
        this.pi = pi;
    }

    run() {
        if(this.state === 0) {
            return;
        }
        if(!this.isProcessed()) {
            return;
        }

        this.state = 0;
        if(this.endChanel.state === 0) {
            this.endChanel.state = 1;
        } else {
            this.omited++;
        }
    }

    isProcessed() {
        return Math.random() < 1 - this.pi;
    }
}

class Queue implements Block {
    state: number;
    chanel1: Chanel1;
    maxCount = 1;
    queueCount: number;

    constructor(chanel: Chanel1) {
        this.state = 0;
        this.chanel1 = chanel;
        this.queueCount = 0;
    }

    run() {
        if (this.chanel1.state === 0 && this.state > 0) {
            this.state--;
            this.chanel1.state = 1;
        }
        this.queueCount += this.state;
    }

    isFull() {
        return this.state === this.maxCount;
    }
}

class Source implements Block {
    state: number;
    blocksCount: number;
    queue: Queue;
    total: number;

    constructor(queue: Queue) {
        this.state = 2;
        this.blocksCount = 0;
        this.queue = queue;
        this.total = 0;
    }

    run() { // 0110 -> 2111
        if(this.state > 1) {
            this.state--;
            return;
        }

        if(this.queue.isFull()) {
            this.blocksCount++;
            this.state = 0;
            return;
        }

        this.queue.state++;
        this.queue.run();
        this.state = 2;
        this.total++;
    }
}

const RUN_TIME = 10000000;

const run_kr = (time: number = RUN_TIME, pi1?: number, pi2?: number) => {
    const endChanel = new EndChanel(pi2);
    const chanel1 = new Chanel1(endChanel, pi1);
    const queue = new Queue(chanel1);
    const source = new Source(queue);

    let i = 0;
    const stateMap = new Map();
    const stateMap2 = new Map();
    while (i++ < time) {
        const prevState = source.state+''+queue.state+''+chanel1.state+''+endChanel.state;

        endChanel.run();
        chanel1.run();
        queue.run();
        source.run();

        const curState = source.state+''+queue.state+''+chanel1.state+''+endChanel.state
        const stateCount = stateMap.get(curState) || 0;
        const stateCount2 = stateMap2.get(`${prevState} -> ${curState}`) || 0;
        stateMap.set(curState, stateCount + 1);
        stateMap2.set(`${prevState} -> ${curState}`, stateCount2 + 1); // 2011 - 1001
    }

    for(let e of stateMap.entries()) {
        console.log(e[0] + ' - ' + (e[1] / time).toFixed(4));
    }
    for(let e of stateMap2.entries()) {
        console.log(e[0] + ' - ' + (e[1] / stateMap.get(e[0].substring(0,4))).toFixed(2));
    }

    const res = {
        time,
        total: source.total,
        processedCount: endChanel.processedCount,
        A: (endChanel.processedCount / time).toFixed(4),
        Pot: (chanel1.omited / source.total).toFixed(4),
        Pot2: ((source.total - endChanel.processedCount) / source.total).toFixed(4),
        Pbl: (source.blocksCount / time).toFixed(4),
        Pbl2: (-(source.total - time / 2) / time * 2).toFixed(4),
        Lq: (queue.queueCount / time).toFixed(4),
        Wq: (queue.queueCount / endChanel.processedCount).toFixed(4),
    };

    return res;
}

// console.log(run_kr(RUN_TIME))