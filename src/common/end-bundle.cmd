:: Minify
cmd /C .\node_modules\.bin\uglifyjs "%BUNDLE_FILE%.js" -o "%BUNDLE_FILE%.min.js"

:: Copy the bundled files to the dist folder
copy /Y "%BUNDLE_FILE%.*" "%DIST_PATH%"

rd /S/Q "%OUTPUT_PATH%"
cmd /C meteor --release %METEOR_RELEASE% reset
