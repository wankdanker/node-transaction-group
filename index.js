module.exports = TransactionGroup;

function TransactionGroup(callback, opts) {
	if (this instanceof TransactionGroup === false) {
		return new TransactionGroup(callback, opts);
	}

	var self = this;

	opts = opts || {};

	self.interval = opts.interval || 30;
	self.max = opts.max;

	self.callback = callback;

	self.swap();
}

TransactionGroup.prototype.swap = function () {
	self = this;

	var items = self.items;

	self.index = {};
	self.items = [];
	self.timeout = null;

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

	if (!self.timeout) {
		self.timeout = setTimeout(function () {
			self.execute();
		}, self.interval);
	}

	return true;
};

TransactionGroup.prototype.execute = function () {
	var self = this;

	var items = self.swap();

	self.callback(items);
};
