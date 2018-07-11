import FirebaseClient from "./firebase/index";
import WebSocketClient from "./websocket/index";
import IClient from "./client.i";
import IActions from "./actions.i";
import IMetrics from "./metrics.i";
import IOptions from "../options.i";

/**
 * @hidden
 */
export default abstract class ApiClient implements IClient {
  /**
   * @hidden
   */
  protected _client: IClient;

  constructor(options: IOptions) {
    if (options.cloud) {
      this.client = new FirebaseClient(options);
    } else {
      this.client = new WebSocketClient(options);
    }

    this.init(options);
  }

  private init(options: IOptions) {
    if (options.autoConnect) {
      this.connect();
    }
  }

  public get actions(): IActions {
    return this.client.actions;
  }

  protected get client() {
    return this._client;
  }

  protected set client(client) {
    this._client = client;
  }

  public async connect(callback?) {
    this.client.connect();
    if (callback) {
      callback();
    }
    await Promise.resolve();
  }

  public async disconnect(callback?) {
    this.client.disconnect();
    if (callback) {
      callback();
    }
    await Promise.resolve();
  }

  public async getInfo() {
    return await this.client.getInfo();
  }

  public get metrics(): IMetrics {
    return this.client.metrics;
  }

  public get timestamp(): number {
    return this.client.timestamp;
  }
}
