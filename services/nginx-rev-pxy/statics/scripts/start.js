console.log("読み込めてるやで");

// 要素取得
const btnScan = document.getElementById("scanBtn"); // スキャンボタン
const btnConnect = document.getElementById("connectBtn"); // 接続ボタン
const btnWiFiConnect = document.getElementById("wifiConnectBtn"); // WiFi接続
const lblDeviceScanned = document.getElementById("device_scanned");
const lblDeviceConnected = document.getElementById("device_connected");

// settings
const STANDARD_UUID = "0000XXXX-0000-1000-8000-00805f9b34fb";
const WIFI_CONNECT_SERVICE_UUID = "6b0b";
const WIFI_CONNECT_SSID_CHARACTERISTIC_UUID = "cf09";
const WIFI_CONNECT_PASS_CHARACTERISTIC_UUID = "ee6a";
const WIFI_CONNECT_OUCHI_UUID_CHARACTERISTIC_UUID = "cce8";

let selectedDevice = null; // デバイス
let wifiService = null;

// ヘルパー関数

// 短縮UUIDを標準UUIDに変換
const convertToStandardUUID = (shortUuid) => {
  return STANDARD_UUID.replace("XXXX", shortUuid);
};

// スキャン処理
const scanBle = async () => {
  console.log("scanBle");

  // データをformから取得
  const deviceName = document.getElementById("device_name").value;
  if (!deviceName) {
    console.log("空文字");
    console.log(deviceName);
  } else {
    console.log("有");
    console.log(deviceName);
  }
  if (!deviceName) {
    try {
      selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [convertToStandardUUID(WIFI_CONNECT_SERVICE_UUID)] },
        ],
      });
      lblDeviceScanned.textContent = selectedDevice;
      console.log(`デバイス: ${selectedDevice}`);
      // alert(`デバイス: ${selectedDevice}`);
    } catch (error) {
      console.error(error);

      console.error("スキャンでエラー発生");
      alert("スキャンでエラー発生");
    }
  } else {
    try {
      selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: deviceName }],
      });
      console.log(`デバイス: ${selectedDevice}`);
      // alert(`デバイス: ${selectedDevice}`);
    } catch (error) {
      console.error("スキャンでエラー発生");
      alert("スキャンでエラー発生");
    }
  }
};

// 接続処理
const connectBle = async () => {
  console.log("connectBle");

  if (!selectedDevice) {
    console.log("デバイスをスキャンして選択してください");
    alert("デバイスをスキャンして選択してください");
    return;
  }

  try {
    console.log("デバイスに接続中...");
    const bleServer = await selectedDevice.gatt.connect();
    wifiService = await bleServer.getPrimaryService(
      convertToStandardUUID(WIFI_CONNECT_SERVICE_UUID)
    ); // サービスを取得
    lblDeviceConnected.textContent = bleServer;
    console.log(`デバイス:${selectedDevice}に接続`);
    // alert(`デバイス:${selectedDevice}に接続`);
  } catch (error) {
    console.error(error);

    console.error("接続に失敗");
    alert("接続に失敗");
  }
};

// wifi情報を書き込み
const writeWifiInfo = async () => {
  console.log("writeWifiInfo");

  if (!wifiService) {
    console.log("デバイスを接続してください");
    alert("デバイスを接続してください");
    return;
  }

  // データをformから取得
  const ssid = document.getElementById("wifi_ssid").value;
  const pass = document.getElementById("wifi_pass").value;
  const ouchiUuid = document.getElementById("ouchi_uuid").value;

  // バリデーション
  if (!ssid || !pass || !ouchiUuid) {
    // 両方入力されてることを確認
    console.log("SSID, PASS両方入力してください");
    alert("SSID, PASS両方入力してください");
    return;
  }

  try {
    // キャラクタリスティックを取得し、
    const ssidCharacteristic = await wifiService.getCharacteristic(
      convertToStandardUUID(WIFI_CONNECT_SSID_CHARACTERISTIC_UUID)
    );
    const passCharacteristic = await wifiService.getCharacteristic(
      convertToStandardUUID(WIFI_CONNECT_PASS_CHARACTERISTIC_UUID)
    );
    const ouchiUuidCharacteristic = await wifiService.getCharacteristic(
      convertToStandardUUID(WIFI_CONNECT_OUCHI_UUID_CHARACTERISTIC_UUID)
    );

    //  Uint8Arrayを返すutf8変換用のインスタンス
    const encoder = new TextEncoder(); // new Uint8Array([ssid])

    // 送信
    ssidCharacteristic.writeValue(encoder.encode(ssid));
    passCharacteristic.writeValue(encoder.encode(pass));
    ouchiUuidCharacteristic.writeValue(encoder.encode(ouchiUuid));
    // ssidCharacteristic.writeValue(new Uint8Array([ssid]));
    // passCharacteristic.writeValue(new Uint8Array([ssid]));

    // log
    console.log(
      `WiFi情報をデバイスに書き込みました SSID: ${ssid}, PASS: ${pass}, OuchiUuid: ${ouchiUuid}`
    );
    // alert(`WiFi情報をデバイスに書き込みました SSID: ${ssid}, PASS: ${pass}`);
  } catch (error) {
    console.error(error);

    console.error("WiFi情報の書き込みに失敗した");
    alert("WiFi情報の書き込みに失敗した");
  }
};

// イベントリスナー

// スキャンボタン
btnScan.addEventListener("click", (event) => {
  event.preventDefault();
  scanBle();
});

// BLT接続ボタン
btnConnect.addEventListener("click", (event) => {
  event.preventDefault();
  connectBle();
});

// WiFi接続ボタン
btnWiFiConnect.addEventListener("click", (event) => {
  event.preventDefault();
  writeWifiInfo();
});
