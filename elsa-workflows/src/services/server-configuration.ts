import {injectable} from "inversify";

@injectable()
export class ServerConfiguration {

  constructor(public serverUrl: string) {
  }
}
