transaction-group
-----------------

Collect [optionally unique] objects over a period of time and then act on them

example
-------

In this example we collect item upates from a hypothetical pubsub module. Once
the interval has elapsed, the function passed to TXG will be excuted with the
items added during the time period.

```js
var sub = require('pubsub');
var TXG = require('transaction-group');

var txg = TXG(function (items) {
	//process updates for items.
	items.forEach(function (item) {
		/* ... */
	});
}, { interval : 5000 }); //process transaction groups every 5 seconds

sub.subscribe('/item/updates', function (item) {
	txg.add(item, item.item_id);
});
```

api
---

### var txg = TXG(callback, opts);

* callback(items[, done]) - [function] the function which will be called to process the transaction group
	* items - [array] the array of items that are part of this txg
	* done - [function] - optional function to call when you are done procesing a txg. If this is specified
		in your callback signature then `callback` will not be called again until after you call `done`.
* opts - [object] options object
	* interval - [integer] the duration of time, in milliseconds to collect objects
	* timeout - [integer] the duration of time, in milliseconds to wait for your callback to finish
		* requires a `done` function in your `callback`
		* value for `timeout` must be greater than 0
		* if `done()` is not called by `timeout` milliseconds then that transaction group will be
			emitted on the timeout event and txg will process the next transaction group

### txg.add(item[, index])

* item - [anything] the object to store for the next transaction group
* index - some value that identifies the uniqueness of the object you are collecting. This
can be used to make sure that there is only one instance of an object waiting to be processed.
If the item already exists in the current transaction group, then the most recent item will over-
write the existing one.

## events

### txg.on('timeout', function (items) {});

Called when timeout has elapsed if opts.timeout is specified and your callback function has a done() function

license
-------

MIT
