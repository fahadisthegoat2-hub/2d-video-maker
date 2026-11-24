#!/usr/bin/env python3
# edge-tts wrapper: honours SSL_CERT_FILE (corporate/sandbox proxies) and exposes rate/pitch/volume.
# usage: tts.py VOICE RATE PITCH VOLUME OUT.mp3 TEXT
import asyncio, os, ssl, sys, edge_tts
voice, rate, pitch, vol, out, text = sys.argv[1:7]
async def main():
    ca = os.environ.get('SSL_CERT_FILE') or (os.path.exists('/root/.ccr/ca-bundle.crt') and '/root/.ccr/ca-bundle.crt')
    if ca: edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=ca)  # edge-tts pins certifi; use the proxy's bundle
    await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=vol).save(out)
asyncio.run(main())
