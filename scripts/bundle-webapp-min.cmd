:: Set the bundle file package
set PACKAGE=webapp

call "%SCRIPTS_PATH%\common\init-bundle.cmd"

:: Concat files
type "%PACKAGES_PATH%\webapp.js" >> "%BUNDLE_FILE%.js"
type "%PACKAGES_PATH%\global-imports.js" >> "%BUNDLE_FILE%.js"

call "%SCRIPTS_PATH%\common\end-bundle.cmd"
