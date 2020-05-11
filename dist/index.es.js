function abortify(factory) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var token = args.pop();
        return new Promise(function (resolve, reject) {
            var abortable = factory.apply(void 0, args);
            var unsubscribe = function () {
                reject(new Error("Resolve or reject called synchronously"));
            };
            unsubscribe = token.subscribe(abortable(function (val) {
                unsubscribe();
                resolve(val);
            }, function (err) {
                unsubscribe();
                reject(err);
            }));
        });
    };
}

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

var wait = function (ms) { return function (resolve, reject) {
    var handle = setTimeout(resolve, ms);
    return function (err) {
        clearTimeout(handle);
        reject(err);
    };
}; };
/**
 * Sleeps for the specified duration (in milliseconds).
 *
 * @param {number} ms - The number of milliseconds.
 * @param {import("./cancellation-token").CancellationToken} token - The cancellation token.
 * @returns {Promise<void>}
 */
var sleep = abortify(wait);

export { CancellationTokenSource, abortify, sleep };
