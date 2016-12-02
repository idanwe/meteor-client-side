:: Set the bundle file package
set PACKAGE=hot-code-push

call "%SCRIPTS_PATH%\common\init-bundle.cmd"

:: Concat files
type "%PACKAGES_PATH%\autoupdate.js" >> "%BUNDLE_FILE%.js"
type "%PACKAGES_PATH%\reload.js" >> "%BUNDLE_FILE%.js"
type "%PACKAGES_PATH%\hot-code-push.js" >> "%BUNDLE_FILE%.js"
type "%PACKAGES_PATH%\global-imports.js" >> "%BUNDLE_FILE%.js"

call "%SCRIPTS_PATH%\common\end-bundle.cmd"
