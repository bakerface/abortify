var CancellationTokenSource = /** @class */ (function () {
    function CancellationTokenSource() {
        this._fns = [];
        this._settle = this._settle.bind(this);
    }
    CancellationTokenSource.prototype.subscribe = function (fn) {
        var _this = this;
        var handle = setImmediate(this._settle);
        this._fns.push(fn);
        return function () {
            clearImmediate(handle);
            _this._fns = _this._fns.filter(function (f) { return f !== fn; });
        };
    };
    CancellationTokenSource.prototype.cancel = function (err) {
        this._err = err;
        setImmediate(this._settle);
    };
    CancellationTokenSource.prototype._settle = function () {
        var err = this._err;
        if (err) {
            this._fns.splice(0).forEach(function (fn) { return fn(err); });
        }
    };
    return CancellationTokenSource;
}());

var CancellationToken = new CancellationTokenSource();

function sleep(ms, token) {
    if (token === void 0) { token = CancellationToken; }
    return new Promise(function (resolve, reject) {
        var handle = setTimeout(function () {
            unsubscribe(); // eslint-disable-line @typescript-eslint/no-use-before-define
            resolve();
        }, ms);
        var unsubscribe = token.subscribe(function (err) {
            clearTimeout(handle);
            reject(err);
        });
    });
}

export { CancellationToken, CancellationTokenSource, sleep };
