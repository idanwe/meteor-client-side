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
mkdir -p $DIST_PATH

# Create temp meteor project
rm -rf $BUNDLER_PATH
meteor create $BUNDLER_PATH
cd $BUNDLER_PATH

# Build the packages
PACKAGE_DIRS=$PROJECT_PARENT meteor build --debug .
tar -zxf $BUNDLER_TEMP.tar.gz

OUTPUT_PATH="$DIST_PATH/$NAME-bundler-output"
PACKAGES_PATH="$DIST_PATH/$BUNDLER_TEMP/bundle/programs/web.browser/packages"

# Create output folder and copy the dependencies files
rm -rf $OUTPUT_PATH
mkdir $OUTPUT_PATH

# Concat files
cat "$PACKAGES_PATH/underscore.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/meteor.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/base64.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/json.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ejson.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/check.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/random.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/tracker.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/retry.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/id-map.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ordered-dict.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/geojson-utils.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/minimongo.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/logging.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/ddp.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/mongo.js" >> $OUTPUT_PATH/$NAME.bundle.js
cat "$PACKAGES_PATH/global-imports.js" >> $OUTPUT_PATH/$NAME.bundle.js

# Minify
npm install uglify-js
$PROJECT_ROOT/node_modules/.bin/uglifyjs $OUTPUT_PATH/$NAME.bundle.js -o $OUTPUT_PATH/$NAME.bundle.min.js

# Copy the bundled files to the dist folder
cp $OUTPUT_PATH/$NAME.bundle.* $DIST_PATH

# Cleanup
rm -rf $BUNDLER_PATH $OUTPUT_PATH
