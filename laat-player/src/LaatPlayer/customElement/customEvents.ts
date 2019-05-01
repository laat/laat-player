import { VideoEvent } from "../VideoEvent";

export type BitrateSwitch = CustomEvent<{ newBitrate: number }>;
export type TimeUpdate = CustomEvent<{ currentTime: number }>;
export type RXJSEvent = CustomEvent<{}> | BitrateSwitch | TimeUpdate;

export const toCustomEvent = (evt: VideoEvent): RXJSEvent => {
  if ("payload" in evt) {
    return new CustomEvent(evt.type, { detail: evt.payload });
  }
  return new CustomEvent(evt.type, { detail: evt });
};
