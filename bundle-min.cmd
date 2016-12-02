:: Run this script from home folder

set METEOR_RELEASE=METEOR@1.3.4.3
call scripts\init.cmd

call %SCRIPTS_PATH%\bundle-meteor-base-min.cmd
call %SCRIPTS_PATH%\bundle-webapp-min.cmd
call %SCRIPTS_PATH%\bundle-hot-code-push-min.cmd

call %SCRIPTS_PATH%\cleanup.cmd
