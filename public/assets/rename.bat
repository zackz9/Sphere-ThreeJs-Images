@echo off
setlocal EnableDelayedExpansion

set "basename=img"
set "counter=1"

for %%F in (*.jpg *.png *.jpeg *.gif *.bmp) do (
    ren "%%F" "!basename!!counter!%%~xF"
    set /a counter+=1
)

echo Renaming complete!
pause