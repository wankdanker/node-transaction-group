var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

module.exports = TransactionGroup;

function TransactionGroup(callback, opts) {
	if (this instanceof TransactionGroup === false) {
		return new TransactionGroup(callback, opts);
	}

	var self = this;

	EventEmitter.call(self);

	opts = opts || {};

	self.interval = opts.interval || 30000;
	self.timeout = opts.timeout || 0;
	self.max = opts.max;

	self.callback = callback;
	self.wait = (callback.length > 1) ? true : false;
	self.waiting = false;
	self.swap();
}

inherits(TransactionGroup, EventEmitter);

TransactionGroup.prototype.swap = function () {
	self = this;

	var items = self.items;

	self.index = {};
	self.items = [];
	self.intervalTimeout = null;
	self.timeoutTimeout = null;

	return items;
}

TransactionGroup.prototype.add = function (item, index) {
	var self = this;

	if (index || index === 0) {
		if (self.index.hasOwnProperty(index)) {
			//replace item with newer version
			self.items[self.index[index]] = item;

			return false;
		}
		else {
			self.index[index] = self.items.length;
		}
	}

	self.items.push(item);

	if (!self.intervalTimeout) {
		self.intervalTimeout = setTimeout(function () {
			self.execute();
		}, self.interval);
	}

	return true;
};

TransactionGroup.prototype.execute = function () {
	var self = this;
	
	//if wait is not enabled (because there is no callback in the callback)
	if (!self.wait) {
		var items = self.swap();

		self.callback(items);
	}
	//if we are not currently waiting on a callback from a previous txg callback
	else if (!self.waiting) {
		items = self.swap();

		self.waiting = true;

		//if we have a truthy timeout value then initialize a callback timeout
		if (self.timeout) {
			self.timeoutTimeout = setTimeout(function () {
				//if we hit this then a timeout has expired and 
				//we will just set waiting to false
				self.timeoutTimeout = null;
				self.waiting = false;

				//emit a timeout event containing the items
				//from the original transaction
				self.emit('timeout', items);
			}, self.timeout);
		}

		self.callback(items, function () {
			self.waiting = false;

			//if we have a timeout running then clear it
			if (self.timeoutTimeout) {
				clearTimeout(self.timeoutTimeout);

				self.timeoutTimeout = null;
			}
		});
	}
};
