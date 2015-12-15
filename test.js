var test = require('tape');
var TXG = require('./');

test('basic txg use', function (t) {
	t.plan(4);

	var txg = TXG(function (items) {
		t.deepEqual(items, [
			{ a : 1 }
			, { a : 2 }
			, { a : 3 }
			, { a : 4 }
		]);
	}, { interval : 250 });

	var count = 0;

	var interval = setInterval(function () {
		if (count++ == 3) {
			clearInterval(interval);
		}

		txg.add({ a : 1 });
		txg.add({ a : 2 });
		txg.add({ a : 3 });
		txg.add({ a : 4 });
	}, 500);
});

test('txg use with index', function (t) {
	t.plan(4);

	var txg = TXG(function (items) {
		t.deepEqual(items, [
			{ a : 2 }
			, { a : 4 }
		]);
	}, { interval : 250 });

	var count = 0;

	var interval = setInterval(function () {
		if (count++ == 3) {
			clearInterval(interval);
		}

		txg.add({ a : 1 }, 1);
		txg.add({ a : 2 }, 1);
		txg.add({ a : 3 }, 2);
		txg.add({ a : 4 }, 2);
	}, 500);
});

test('txg use with index and one-at-a-time', function (t) {
	t.plan(4);

	var txg = TXG(function (items, cb) {
		t.deepEqual(items, [
			{ a : 2 }
			, { a : 4 }
		]);

		cb();
	}, { interval : 250 });

	var count = 0;

	var interval = setInterval(function () {
		if (count++ == 3) {
			clearInterval(interval);
		}

		txg.add({ a : 1 }, 1);
		txg.add({ a : 2 }, 1);
		txg.add({ a : 3 }, 2);
		txg.add({ a : 4 }, 2);
	}, 500);
});
