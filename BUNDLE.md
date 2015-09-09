## How to create bundle and minfied files

Run `./bundle-min.sh` from the `dist` folder.
It will create `*.bundle.js` and `*.bundle.min.js` files in the dist folder.


Make sure that only the concat packages are export to windows in `*.bundle.js`
```
Meteor = Package.meteor.Meteor;
Log = Package.logging.Log;
Tracker = Package.tracker.Tracker;
DDP = Package.ddp.DDP;
Mongo = Package.mongo.Mongo;
check = Package.check.check;
Match = Package.check.Match;
_ = Package.underscore._;
Random = Package.random.Random;
EJSON = Package.ejson.EJSON;
```

If not, fix it and minified again

`> ./node_modules/.bin/uglifyjs *.bundle.js -o *.bundle.min.js`
