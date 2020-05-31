var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var PI1 = 0.55;
var PI2 = 0.5;
var EndChanel = (function () {
    function EndChanel(pi) {
        if (pi === void 0) { pi = PI2; }
        this.pi = PI2;
        this.state = 0;
        this.processedCount = 0;
        this.pi = pi;
    }
    EndChanel.prototype.run = function () {
        if (this.state === 0) {
            return;
        }
        if (this.isProcessed()) {
            this.state = 0;
            this.processedCount++;
        }
    };
    EndChanel.prototype.isProcessed = function () {
        return Math.random() < 1 - this.pi;
    };
    return EndChanel;
}());
var Chanel1 = (function () {
    function Chanel1(endChanel, pi) {
        if (pi === void 0) { pi = PI1; }
        this.pi = PI1;
        this.state = 0;
        this.omited = 0;
        this.endChanel = endChanel;
        this.pi = pi;
    }
    Chanel1.prototype.run = function () {
        if (this.state === 0) {
            return;
        }
        if (!this.isProcessed()) {
            return;
        }
        this.state = 0;
        if (this.endChanel.state === 0) {
            this.endChanel.state = 1;
        }
        else {
            this.omited++;
        }
    };
    Chanel1.prototype.isProcessed = function () {
        return Math.random() < 1 - this.pi;
    };
    return Chanel1;
}());
var Queue = (function () {
    function Queue(chanel) {
        this.maxCount = 1;
        this.state = 0;
        this.chanel1 = chanel;
        this.queueCount = 0;
    }
    Queue.prototype.run = function () {
        if (this.chanel1.state === 0 && this.state > 0) {
            this.state--;
            this.chanel1.state = 1;
        }
        this.queueCount += this.state;
    };
    Queue.prototype.isFull = function () {
        return this.state === this.maxCount;
    };
    return Queue;
}());
var Source = (function () {
    function Source(queue) {
        this.state = 2;
        this.blocksCount = 0;
        this.queue = queue;
        this.total = 0;
    }
    Source.prototype.run = function () {
        if (this.state > 1) {
            this.state--;
            return;
        }
        if (this.queue.isFull()) {
            this.blocksCount++;
            this.state = 0;
            return;
        }
        this.queue.state++;
        this.queue.run();
        this.state = 2;
        this.total++;
    };
    return Source;
}());
var RUN_TIME = 10000000;
var run_kr = function (time, pi1, pi2) {
    var e_1, _a, e_2, _b;
    var endChanel = new EndChanel(pi2);
    var chanel1 = new Chanel1(endChanel, pi1);
    var queue = new Queue(chanel1);
    var source = new Source(queue);
    var i = 0;
    var stateMap = new Map();
    var stateMap2 = new Map();
    while (i++ < time) {
        var prevState = source.state + '' + queue.state + '' + chanel1.state + '' + endChanel.state;
        endChanel.run();
        chanel1.run();
        queue.run();
        source.run();
        var curState = source.state + '' + queue.state + '' + chanel1.state + '' + endChanel.state;
        var stateCount = stateMap.get(curState) || 0;
        var stateCount2 = stateMap2.get(prevState + " -> " + curState) || 0;
        stateMap.set(curState, stateCount + 1);
        stateMap2.set(prevState + " -> " + curState, stateCount2 + 1);
    }
    try {
        for (var _c = __values(stateMap.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var e = _d.value;
            console.log(e[0] + ' - ' + (e[1] / time).toFixed(4));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var _e = __values(stateMap2.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var e = _f.value;
            console.log(e[0] + ' - ' + (e[1] / stateMap.get(e[0].substring(0, 4))).toFixed(2));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var res = {
        time: time,
        total: source.total,
        processedCount: endChanel.processedCount,
        A: (endChanel.processedCount / time).toFixed(4),
        Pot: (chanel1.omited / source.total).toFixed(4),
        Pot2: ((source.total - endChanel.processedCount) / source.total).toFixed(4),
        Pbl: (source.blocksCount / time).toFixed(4),
        Pbl2: (-(source.total - time / 2) / time * 2).toFixed(4),
        Lq: (queue.queueCount / time).toFixed(4),
        Wq: (queue.queueCount / endChanel.processedCount).toFixed(4)
    };
    return res;
};
console.log(run_kr(RUN_TIME));
//# sourceMappingURL=program.js.map