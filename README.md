# m5-wifi-connect

[juninry-box](https://github.com/unSerori/juninry-box)のWiFi接続デバッグ用サイト

m5stackにBLEで接続して、入力したWiFiの接続情報を送りつける

アクセスは`https://localhost:${REV_PXY_HTTPS_HOST_PORT:-443}/statics/index.html`

## .ENV

`./.env`: compose.ymlでプロジェクト全体で使う変数

```env:./.env
REV_PXY_HTTPS_HOST_PORT=443:公開ポート
```
