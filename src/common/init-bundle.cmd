cd "%BUNDLER_PATH%"

:: Modify packages
if "%PACKAGE%"=="meteor" (
  copy /Y "%SRC_PATH%\packages" "%BUNDLER_PATH%\.meteor"
) else (
  Rem echo #> "%BUNDLER_PATH%\.meteor\packages"
  Rem cmd /C meteor --release %METEOR_RELEASE% add %PACKAGE%
  echo %PACKAGE%> "%BUNDLER_PATH%\.meteor\packages"
)

:: Build the packages
cmd /C meteor --release %METEOR_RELEASE% build --debug ..\output --directory

SET BUNDLE_FILE=%OUTPUT_PATH%\%PACKAGE%-client-side.bundle
type nul > "%BUNDLE_FILE%.js"
