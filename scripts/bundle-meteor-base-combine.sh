# Run this script from home folder

# configs variables
NAME=meteor-client-side # Set the bundle file name
DIST_FOLDER=dist # The folder that the bundled files will be copy in to

# run time variables
PROJECT_ROOT=$(pwd)
PROJECT_PARENT=$PROJECT_ROOT/..
DIST_PATH=$PROJECT_ROOT/$DIST_FOLDER
BUNDLER_TEMP="tmp-$NAME-bundler"
BUNDLER_PATH=$DIST_PATH/$BUNDLER_TEMP


# Ansure that the dist folder exists
#mkdir -p $DIST_PATH

# Create temp meteor project
#rm -rf $BUNDLER_PATH
#curl https://install.meteor.com | sh
#meteor create $BUNDLER_PATH

# Move packages to meteor folder
#cp src/packages $BUNDLER_PATH/.meteor/
cd $BUNDLER_PATH

# Build the packages
PACKAGE_DIRS=$PROJECT_PARENT
#meteor-build-client ./build
#tar -zxf $BUNDLER_TEMP.tar.gz

OUTPUT_PATH="$DIST_PATH/$NAME-bundler-output"
PACKAGES_PATH="$DIST_PATH/$BUNDLER_TEMP/build/.build19571.bundle/programs/web.browser/packages"

# Create output folder and copy the dependencies files
rm -rf $OUTPUT_PATH
mkdir $OUTPUT_PATH

# Concat files
cat "$PACKAGES_PATH/underscore.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/meteor-runtime-config.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/meteor.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/tracker.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/base64.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/reactive-var.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/modules-runtime.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/modules.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ejson.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/check.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/promise.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ecmascript-runtime.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ecmascript.js">> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/babel-compiler.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/babel-runtime.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/random.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/id-map.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/retry.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp-common.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/diff-sequence.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/mongo-id.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp-client.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp-common.js " >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ordered-dict.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/geojson-utils.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/minimongo.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp-server.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/allow-deny.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp-rate-limiter.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/localstorage.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/callback-hook.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/jquery.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/deps.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/htmljs.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/observe-sequence.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/sha.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/srp.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/blaze.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/mongo.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/accounts-base.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/accounts-password.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/coffeescript.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/url.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/http.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/spacebars.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/templating.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ostrio_cookies.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ostrio_files.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/global-imports.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/service-configuration.js" >> $OUTPUT_PATH/$NAME.bundle.js

# Minify
#npm install uglify-js
uglifyjs $OUTPUT_PATH/$NAME.bundle.js -o $OUTPUT_PATH/$NAME.bundle.min.js

# Copy the bundled files to the dist folder
cp $OUTPUT_PATH/$NAME.bundle.* $DIST_PATH

# Cleanup
#rm -rf $BUNDLER_PATH $OUTPUT_PATH
