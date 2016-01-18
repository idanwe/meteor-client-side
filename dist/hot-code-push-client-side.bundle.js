//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var DDP = Package['ddp-client'].DDP;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var ClientVersions, Autoupdate;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/autoupdate/autoupdate_client.js                                                //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// Subscribe to the `meteor_autoupdate_clientVersions` collection,                         // 1
// which contains the set of acceptable client versions.                                   // 2
//                                                                                         // 3
// A "hard code push" occurs when the running client version is not in                     // 4
// the set of acceptable client versions (or the server updates the                        // 5
// collection, there is a published client version marked `current` and                    // 6
// the running client version is no longer in the set).                                    // 7
//                                                                                         // 8
// When the `reload` package is loaded, a hard code push causes                            // 9
// the browser to reload, so that it will load the latest client                           // 10
// version from the server.                                                                // 11
//                                                                                         // 12
// A "soft code push" represents the situation when the running client                     // 13
// version is in the set of acceptable versions, but there is a newer                      // 14
// version available on the server.                                                        // 15
//                                                                                         // 16
// `Autoupdate.newClientAvailable` is a reactive data source which                         // 17
// becomes `true` if there is a new version of the client is available on                  // 18
// the server.                                                                             // 19
//                                                                                         // 20
// This package doesn't implement a soft code reload process itself,                       // 21
// but `newClientAvailable` could be used for example to display a                         // 22
// "click to reload" link to the user.                                                     // 23
                                                                                           // 24
// The client version of the client code currently running in the                          // 25
// browser.                                                                                // 26
var autoupdateVersion = __meteor_runtime_config__.autoupdateVersion || "unknown";          // 27
var autoupdateVersionRefreshable =                                                         // 28
  __meteor_runtime_config__.autoupdateVersionRefreshable || "unknown";                     // 29
                                                                                           // 30
// The collection of acceptable client versions.                                           // 31
ClientVersions = new Mongo.Collection("meteor_autoupdate_clientVersions");                 // 32
                                                                                           // 33
Autoupdate = {};                                                                           // 34
                                                                                           // 35
Autoupdate.newClientAvailable = function () {                                              // 36
  return !! ClientVersions.findOne({                                                       // 37
               _id: "version",                                                             // 38
               version: {$ne: autoupdateVersion} }) ||                                     // 39
         !! ClientVersions.findOne({                                                       // 40
               _id: "version-refreshable",                                                 // 41
               version: {$ne: autoupdateVersionRefreshable} });                            // 42
};                                                                                         // 43
Autoupdate._ClientVersions = ClientVersions;  // Used by a self-test                       // 44
                                                                                           // 45
var knownToSupportCssOnLoad = false;                                                       // 46
                                                                                           // 47
var retry = new Retry({                                                                    // 48
  // Unlike the stream reconnect use of Retry, which we want to be instant                 // 49
  // in normal operation, this is a wacky failure. We don't want to retry                  // 50
  // right away, we can start slowly.                                                      // 51
  //                                                                                       // 52
  // A better way than timeconstants here might be to use the knowledge                    // 53
  // of when we reconnect to help trigger these retries. Typically, the                    // 54
  // server fixing code will result in a restart and reconnect, but                        // 55
  // potentially the subscription could have a transient error.                            // 56
  minCount: 0, // don't do any immediate retries                                           // 57
  baseTimeout: 30*1000 // start with 30s                                                   // 58
});                                                                                        // 59
var failures = 0;                                                                          // 60
                                                                                           // 61
Autoupdate._retrySubscription = function () {                                              // 62
  Meteor.subscribe("meteor_autoupdate_clientVersions", {                                   // 63
    onError: function (error) {                                                            // 64
      Meteor._debug("autoupdate subscription failed:", error);                             // 65
      failures++;                                                                          // 66
      retry.retryLater(failures, function () {                                             // 67
        // Just retry making the subscription, don't reload the whole                      // 68
        // page. While reloading would catch more cases (for example,                      // 69
        // the server went back a version and is now doing old-style hot                   // 70
        // code push), it would also be more prone to reload loops,                        // 71
        // which look really bad to the user. Just retrying the                            // 72
        // subscription over DDP means it is at least possible to fix by                   // 73
        // updating the server.                                                            // 74
        Autoupdate._retrySubscription();                                                   // 75
      });                                                                                  // 76
    },                                                                                     // 77
    onReady: function () {                                                                 // 78
      if (Package.reload) {                                                                // 79
        var checkNewVersionDocument = function (doc) {                                     // 80
          var self = this;                                                                 // 81
          if (doc._id === 'version-refreshable' &&                                         // 82
              doc.version !== autoupdateVersionRefreshable) {                              // 83
            autoupdateVersionRefreshable = doc.version;                                    // 84
            // Switch out old css links for the new css links. Inspired by:                // 85
            // https://github.com/guard/guard-livereload/blob/master/js/livereload.js#L710
            var newCss = (doc.assets && doc.assets.allCss) || [];                          // 87
            var oldLinks = [];                                                             // 88
            _.each(document.getElementsByTagName('link'), function (link) {                // 89
              if (link.className === '__meteor-css__') {                                   // 90
                oldLinks.push(link);                                                       // 91
              }                                                                            // 92
            });                                                                            // 93
                                                                                           // 94
            var waitUntilCssLoads = function  (link, callback) {                           // 95
              var executeCallback = _.once(callback);                                      // 96
              link.onload = function () {                                                  // 97
                knownToSupportCssOnLoad = true;                                            // 98
                executeCallback();                                                         // 99
              };                                                                           // 100
              if (! knownToSupportCssOnLoad) {                                             // 101
                var id = Meteor.setInterval(function () {                                  // 102
                  if (link.sheet) {                                                        // 103
                    executeCallback();                                                     // 104
                    Meteor.clearInterval(id);                                              // 105
                  }                                                                        // 106
                }, 50);                                                                    // 107
              }                                                                            // 108
            };                                                                             // 109
                                                                                           // 110
            var removeOldLinks = _.after(newCss.length, function () {                      // 111
              _.each(oldLinks, function (oldLink) {                                        // 112
                oldLink.parentNode.removeChild(oldLink);                                   // 113
              });                                                                          // 114
            });                                                                            // 115
                                                                                           // 116
            var attachStylesheetLink = function (newLink) {                                // 117
              document.getElementsByTagName("head").item(0).appendChild(newLink);          // 118
                                                                                           // 119
              waitUntilCssLoads(newLink, function () {                                     // 120
                Meteor.setTimeout(removeOldLinks, 200);                                    // 121
              });                                                                          // 122
            };                                                                             // 123
                                                                                           // 124
            if (newCss.length !== 0) {                                                     // 125
              _.each(newCss, function (css) {                                              // 126
                var newLink = document.createElement("link");                              // 127
                newLink.setAttribute("rel", "stylesheet");                                 // 128
                newLink.setAttribute("type", "text/css");                                  // 129
                newLink.setAttribute("class", "__meteor-css__");                           // 130
                newLink.setAttribute("href", Meteor._relativeToSiteRootUrl(css.url));      // 131
                attachStylesheetLink(newLink);                                             // 132
              });                                                                          // 133
            } else {                                                                       // 134
              removeOldLinks();                                                            // 135
            }                                                                              // 136
                                                                                           // 137
          }                                                                                // 138
          else if (doc._id === 'version' && doc.version !== autoupdateVersion) {           // 139
            handle && handle.stop();                                                       // 140
                                                                                           // 141
            if (Package.reload) {                                                          // 142
              Package.reload.Reload._reload();                                             // 143
            }                                                                              // 144
          }                                                                                // 145
        };                                                                                 // 146
                                                                                           // 147
        var handle = ClientVersions.find().observe({                                       // 148
          added: checkNewVersionDocument,                                                  // 149
          changed: checkNewVersionDocument                                                 // 150
        });                                                                                // 151
      }                                                                                    // 152
    }                                                                                      // 153
  });                                                                                      // 154
};                                                                                         // 155
Autoupdate._retrySubscription();                                                           // 156
                                                                                           // 157
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Reload;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/reload/reload.js                                                               //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/**                                                                                        // 1
 * This code does _NOT_ support hot (session-restoring) reloads on                         // 2
 * IE6,7. It only works on browsers with sessionStorage support.                           // 3
 *                                                                                         // 4
 * There are a couple approaches to add IE6,7 support:                                     // 5
 *                                                                                         // 6
 * - use IE's "userData" mechanism in combination with window.name.                        // 7
 * This mostly works, however the problem is that it can not get to the                    // 8
 * data until after DOMReady. This is a problem for us since this API                      // 9
 * relies on the data being ready before API users run. We could                           // 10
 * refactor using Meteor.startup in all API users, but that might slow                     // 11
 * page loads as we couldn't start the stream until after DOMReady.                        // 12
 * Here are some resources on this approach:                                               // 13
 * https://github.com/hugeinc/USTORE.js                                                    // 14
 * http://thudjs.tumblr.com/post/419577524/localstorage-userdata                           // 15
 * http://www.javascriptkit.com/javatutors/domstorage2.shtml                               // 16
 *                                                                                         // 17
 * - POST the data to the server, and have the server send it back on                      // 18
 * page load. This is nice because it sidesteps all the local storage                      // 19
 * compatibility issues, however it is kinda tricky. We can use a unique                   // 20
 * token in the URL, then get rid of it with HTML5 pushstate, but that                     // 21
 * only works on pushstate browsers.                                                       // 22
 *                                                                                         // 23
 * This will all need to be reworked entirely when we add server-side                      // 24
 * HTML rendering. In that case, the server will need to have access to                    // 25
 * the client's session to render properly.                                                // 26
 */                                                                                        // 27
                                                                                           // 28
// XXX when making this API public, also expose a flag for the app                         // 29
// developer to know whether a hot code push is happening. This is                         // 30
// useful for apps using `window.onbeforeunload`. See                                      // 31
// https://github.com/meteor/meteor/pull/657                                               // 32
                                                                                           // 33
Reload = {};                                                                               // 34
                                                                                           // 35
var KEY_NAME = 'Meteor_Reload';                                                            // 36
                                                                                           // 37
var old_data = {};                                                                         // 38
// read in old data at startup.                                                            // 39
var old_json;                                                                              // 40
                                                                                           // 41
// This logic for sessionStorage detection is based on browserstate/history.js             // 42
var safeSessionStorage = null;                                                             // 43
try {                                                                                      // 44
  // This throws a SecurityError on Chrome if cookies & localStorage are                   // 45
  // explicitly disabled                                                                   // 46
  //                                                                                       // 47
  // On Firefox with dom.storage.enabled set to false, sessionStorage is null              // 48
  //                                                                                       // 49
  // We can't even do (typeof sessionStorage) on Chrome, it throws.  So we rely            // 50
  // on the throw if sessionStorage == null; the alternative is browser                    // 51
  // detection, but this seems better.                                                     // 52
  safeSessionStorage = window.sessionStorage;                                              // 53
                                                                                           // 54
  // Check we can actually use it                                                          // 55
  if (safeSessionStorage) {                                                                // 56
    safeSessionStorage.setItem('__dummy__', '1');                                          // 57
    safeSessionStorage.removeItem('__dummy__');                                            // 58
  } else {                                                                                 // 59
    // Be consistently null, for safety                                                    // 60
    safeSessionStorage = null;                                                             // 61
  }                                                                                        // 62
} catch(e) {                                                                               // 63
  // Expected on chrome with strict security, or if sessionStorage not supported           // 64
  safeSessionStorage = null;                                                               // 65
}                                                                                          // 66
                                                                                           // 67
// Exported for test.                                                                      // 68
Reload._getData = function () {                                                            // 69
  return safeSessionStorage && safeSessionStorage.getItem(KEY_NAME);                       // 70
};                                                                                         // 71
                                                                                           // 72
if (safeSessionStorage) {                                                                  // 73
  old_json = Reload._getData();                                                            // 74
  safeSessionStorage.removeItem(KEY_NAME);                                                 // 75
} else {                                                                                   // 76
  // Unsupported browser (IE 6,7) or locked down security settings.                        // 77
  // No session resumption.                                                                // 78
  // Meteor._debug("XXX UNSUPPORTED BROWSER/SETTINGS");                                    // 79
}                                                                                          // 80
                                                                                           // 81
if (!old_json) old_json = '{}';                                                            // 82
var old_parsed = {};                                                                       // 83
try {                                                                                      // 84
  old_parsed = JSON.parse(old_json);                                                       // 85
  if (typeof old_parsed !== "object") {                                                    // 86
    Meteor._debug("Got bad data on reload. Ignoring.");                                    // 87
    old_parsed = {};                                                                       // 88
  }                                                                                        // 89
} catch (err) {                                                                            // 90
  Meteor._debug("Got invalid JSON on reload. Ignoring.");                                  // 91
}                                                                                          // 92
                                                                                           // 93
if (old_parsed.reload && typeof old_parsed.data === "object") {                            // 94
  // Meteor._debug("Restoring reload data.");                                              // 95
  old_data = old_parsed.data;                                                              // 96
}                                                                                          // 97
                                                                                           // 98
                                                                                           // 99
var providers = [];                                                                        // 100
                                                                                           // 101
////////// External API //////////                                                         // 102
                                                                                           // 103
// Packages that support migration should register themselves by calling                   // 104
// this function. When it's time to migrate, callback will be called                       // 105
// with one argument, the "retry function," and an optional 'option'                       // 106
// argument (containing a key 'immediateMigration'). If the package                        // 107
// is ready to migrate, it should return [true, data], where data is                       // 108
// its migration data, an arbitrary JSON value (or [true] if it has                        // 109
// no migration data this time). If the package needs more time                            // 110
// before it is ready to migrate, it should return false. Then, once                       // 111
// it is ready to migrating again, it should call the retry                                // 112
// function. The retry function will return immediately, but will                          // 113
// schedule the migration to be retried, meaning that every package                        // 114
// will be polled once again for its migration data. If they are all                       // 115
// ready this time, then the migration will happen. name must be set if there              // 116
// is migration data. If 'immediateMigration' is set in the options                        // 117
// argument, then it doesn't matter whether the package is ready to                        // 118
// migrate or not; the reload will happen immediately without waiting                      // 119
// (used for OAuth redirect login).                                                        // 120
//                                                                                         // 121
Reload._onMigrate = function (name, callback) {                                            // 122
  if (!callback) {                                                                         // 123
    // name not provided, so first arg is callback.                                        // 124
    callback = name;                                                                       // 125
    name = undefined;                                                                      // 126
  }                                                                                        // 127
  providers.push({name: name, callback: callback});                                        // 128
};                                                                                         // 129
                                                                                           // 130
// Called by packages when they start up.                                                  // 131
// Returns the object that was saved, or undefined if none saved.                          // 132
//                                                                                         // 133
Reload._migrationData = function (name) {                                                  // 134
  return old_data[name];                                                                   // 135
};                                                                                         // 136
                                                                                           // 137
// Options are the same as for `Reload._migrate`.                                          // 138
var pollProviders = function (tryReload, options) {                                        // 139
  tryReload = tryReload || function () {};                                                 // 140
  options = options || {};                                                                 // 141
                                                                                           // 142
  var migrationData = {};                                                                  // 143
  var remaining = _.clone(providers);                                                      // 144
  var allReady = true;                                                                     // 145
  while (remaining.length) {                                                               // 146
    var p = remaining.shift();                                                             // 147
    var status = p.callback(tryReload, options);                                           // 148
    if (!status[0])                                                                        // 149
      allReady = false;                                                                    // 150
    if (status.length > 1 && p.name)                                                       // 151
      migrationData[p.name] = status[1];                                                   // 152
  };                                                                                       // 153
  if (allReady || options.immediateMigration)                                              // 154
    return migrationData;                                                                  // 155
  else                                                                                     // 156
    return null;                                                                           // 157
};                                                                                         // 158
                                                                                           // 159
// Options are:                                                                            // 160
//  - immediateMigration: true if the page will be reloaded immediately                    // 161
//    regardless of whether packages report that they are ready or not.                    // 162
Reload._migrate = function (tryReload, options) {                                          // 163
  // Make sure each package is ready to go, and collect their                              // 164
  // migration data                                                                        // 165
  var migrationData = pollProviders(tryReload, options);                                   // 166
  if (migrationData === null)                                                              // 167
    return false; // not ready yet..                                                       // 168
                                                                                           // 169
  try {                                                                                    // 170
    // Persist the migration data                                                          // 171
    var json = JSON.stringify({                                                            // 172
      data: migrationData, reload: true                                                    // 173
    });                                                                                    // 174
  } catch (err) {                                                                          // 175
    Meteor._debug("Couldn't serialize data for migration", migrationData);                 // 176
    throw err;                                                                             // 177
  }                                                                                        // 178
                                                                                           // 179
  if (safeSessionStorage) {                                                                // 180
    try {                                                                                  // 181
      safeSessionStorage.setItem(KEY_NAME, json);                                          // 182
    } catch (err) {                                                                        // 183
      // We should have already checked this, but just log - don't throw                   // 184
      Meteor._debug("Couldn't save data for migration to sessionStorage", err);            // 185
    }                                                                                      // 186
  } else {                                                                                 // 187
    Meteor._debug("Browser does not support sessionStorage. Not saving migration state.");
  }                                                                                        // 189
                                                                                           // 190
  return true;                                                                             // 191
};                                                                                         // 192
                                                                                           // 193
// Allows tests to isolate the list of providers.                                          // 194
Reload._withFreshProvidersForTest = function (f) {                                         // 195
  var originalProviders = _.clone(providers);                                              // 196
  providers = [];                                                                          // 197
  try {                                                                                    // 198
    f();                                                                                   // 199
  } finally {                                                                              // 200
    providers = originalProviders;                                                         // 201
  }                                                                                        // 202
};                                                                                         // 203
                                                                                           // 204
// Migrating reload: reload this page (presumably to pick up a new                         // 205
// version of the code or assets), but save the program state and                          // 206
// migrate it over. This function returns immediately. The reload                          // 207
// will happen at some point in the future once all of the packages                        // 208
// are ready to migrate.                                                                   // 209
//                                                                                         // 210
var reloading = false;                                                                     // 211
Reload._reload = function (options) {                                                      // 212
  options = options || {};                                                                 // 213
                                                                                           // 214
  if (reloading)                                                                           // 215
    return;                                                                                // 216
  reloading = true;                                                                        // 217
                                                                                           // 218
  var tryReload = function () { _.defer(function () {                                      // 219
    if (Reload._migrate(tryReload, options)) {                                             // 220
      // Tell the browser to shut down this VM and make a new one                          // 221
      window.location.reload();                                                            // 222
    }                                                                                      // 223
  }); };                                                                                   // 224
                                                                                           // 225
  tryReload();                                                                             // 226
};                                                                                         // 227
                                                                                           // 228
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/reload/deprecated.js                                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
// Reload functionality used to live on Meteor._reload. Be nice and try not to             // 1
// break code that uses it, even though it's internal.                                     // 2
// XXX COMPAT WITH 0.6.4                                                                   // 3
Meteor._reload = {                                                                         // 4
  onMigrate: Reload._onMigrate,                                                            // 5
  migrationData: Reload._migrationData,                                                    // 6
  reload: Reload._reload                                                                   // 7
};                                                                                         // 8
                                                                                           // 9
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.reload = {
  Reload: Reload
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['hot-code-push'] = {};

})();
/* Imports for global scope */

Autoupdate = Package.autoupdate.Autoupdate;
Reload = Package.reload.Reload;

