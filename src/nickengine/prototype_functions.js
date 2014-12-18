(function() {

    Object.prototype.uniqueId = (function() {
        var highest_id = 1;
        return function() {
            if (this.unique_obj_id === undefined) {
                this.unique_obj_id = highest_id;
                highest_id++;
            }
            return this.unique_obj_id;
        };
    })();

    Object.prototype.foreach = function(fun) {
        for (key in this) {
            if (this.hasOwnProperty(key)) {
                fun(key, this[key], this);
            }
        }
    };

    Object.prototype.clone = function() {
        var clone = {};
        this.foreach(function(k, v) {
            clone[k] = v;
        });
        return clone;
    };

    Object.prototype.isArray = function() {
        return Utils.isArray(this);
    }

    Array.create = function(dimension, initial) {
        var a = [];
        for (var i = 0; i < dimension; i += 1) {
            a[i] = initial;
        }
        return a;
    };

    Array.matrix = function(m, n, initial) {
        var a, i, j, mat = [];
        for (i = 0; i < m; i += 1) {
            a = [];
            for (j = 0; j < n; j += 1) {
                a[j] = initial;
            }
            mat[i] = a;
        }
        return mat;
    };

    Array.prototype.foreach = function(fun) {
        for (var i = 0; i < this.length; i++) {
            fun(i, this[i], this);
        }
    };

    Array.prototype.reduce = function(f, value) {
        for (var i = 0; i < this.length; i++) {
            value = f(this[i], value);
        }
        return value;
    };

    Array.prototype.sortNumbers = function(decreasing) {
        return this.sort(function(a,b) {
            return decreasing ? b - a : a - b;
        });
    };

    Function.prototype.curry = function() {
        var args = Utils.makeArray(arguments);
        var that = this;
        return function() {
            return that.apply(null, args.concat(Utils.makeArray(arguments)));
        };
    };

    Function.prototype.construct = function(args) {
        var fConstructor = this;
        var fNewConstr = function() {
            fConstructor.apply(this, args);
        };
        fNewConstr.prototype = fConstructor.prototype;
        return new fNewConstr();
    };

    String.prototype.toInt = function() {
        return parseInt(this, 10);
    };

    Number.prototype.toInt = function() {
        return Math[this < 0 ? 'ceiling' : 'floor'](this);
    };

    // sort integer function
    // remove from array (because splice sucks)
    // maybe somehow override [] for arrays to avoid adding weird shit at the end
    // merge objects
    // vector operations for arrays
    // 2d array operations
    // switch foreach parameter order
    // pairwise foreach for two arrays
    // object map function

})();
