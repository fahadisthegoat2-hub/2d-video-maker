#!/bin/sh
# usage: audio/dl.sh SCENE URL  -> downloads ElevenLabs line, removes it from todo/pending
cd "$(dirname "$0")" && curl -s -f -o "black-panther/vo$1.mp3" "$2" && sed -i "/^$1\t/d" todo-voice.txt pending-sessions.txt && echo "ok $1 ($(wc -l < todo-voice.txt) left)"
