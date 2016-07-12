@echo on
cls

:: The folder that the bundled files will be copy in to
SET DIST_FOLDER=dist

:: run time variables
SET PROJECT_ROOT=%__CD__%
SET SCRIPTS_PATH=%PROJECT_ROOT%scripts
SET SRC_PATH=%PROJECT_ROOT%src
SET DIST_PATH=%PROJECT_ROOT%%DIST_FOLDER%
SET BUNDLER_NAME=tmp-bundler
SET BUNDLER_PATH=%DIST_PATH%\%BUNDLER_NAME%
set OUTPUT_PATH=%DIST_PATH%\output
set PACKAGES_PATH=%OUTPUT_PATH%\bundle\programs\web.browser\packages

:: Ansure that the dist folder exists
rd /S/Q "%DIST_PATH%"
mkdir "%DIST_PATH%"

:: Create temp meteor project
cd %DIST_PATH%
cmd /C meteor --release %METEOR_RELEASE% create %BUNDLER_NAME%
cd %BUNDLER_NAME%
rd /S/Q server
cmd /C npm install uglify-js
