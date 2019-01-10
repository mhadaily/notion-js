import io from "socket.io-client";

/**
 * @hidden
 */
export default class WebsocketClient {
  public serverType: string = "websocket";
  protected socket;
  options;

  constructor(options) {
    this.socket = io(options.socketUrl, {
      path: `/${options.deviceId}`
    });

    this.init();
  }

  public onMetric(subscriptionId, callback) {
    this.socket.on(`metrics/${subscriptionId}`, callback);
  }

  private init() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
