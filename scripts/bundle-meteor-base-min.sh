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
#curl https://install.meteor.com | sh
meteor create $BUNDLER_PATH

# Move packages to meteor folder
cp src/packages $BUNDLER_PATH/.meteor/
cd $BUNDLER_PATH

# Build the packages
PACKAGE_DIRS=$PROJECT_PARENT
meteor-build-client ./build
#tar -zxf $BUNDLER_TEMP.tar.gz
