export type BitrateSwitchEvent = {
  type: "bitrateSwitch";
  payload: { newBitRate: number };
};
export type BufferingStartedEvent = {
  type: "bufferingStarted";
};
export type BufferingEndedEvent = {
  type: "bufferingEnded";
};
export type EndedEvent = {
  type: "ended";
};
export type LoadedMediaEvent = {
  type: "loadedMedia";
};
export type PlayEvent = {
  type: "play";
};
export type PlayingEvent = {
  type: "playing";
};
export type PauseEvent = {
  type: "pause";
};
export type SeekedEvent = {
  type: "seeked";
};
export type SeekingEvent = {
  type: "seeking";
};
export type TimeUpdateEvent = {
  type: "timeUpdate";
  payload: { currentTime: number };
};
export type UnloadedMediaEvent = {
  type: "unloadedMedia";
};
export type VideoEvent =
  | BitrateSwitchEvent
  | BufferingStartedEvent
  | BufferingEndedEvent
  | EndedEvent
  | LoadedMediaEvent
  | PlayEvent
  | PlayingEvent
  | PauseEvent
  | SeekedEvent
  | SeekingEvent
  | TimeUpdateEvent
  | UnloadedMediaEvent;

export const is = {
  type: (...types: VideoEvent["type"][]) => (evt: VideoEvent): boolean =>
    types.some(type => type === evt.type),
  bitrateSwitch: (evt: VideoEvent): evt is BitrateSwitchEvent =>
    evt.type === "bitrateSwitch",
  bufferingStarted: (evt: VideoEvent): evt is BufferingStartedEvent =>
    evt.type === "bufferingStarted",
  bufferingEnded: (evt: VideoEvent): evt is BufferingEndedEvent =>
    evt.type === "bufferingEnded",
  ended: (evt: VideoEvent): evt is EndedEvent => evt.type === "ended",
  loadedMedia: (evt: VideoEvent): evt is LoadedMediaEvent =>
    evt.type === "loadedMedia",
  play: (evt: VideoEvent): evt is PlayEvent => evt.type === "play",
  playing: (evt: VideoEvent): evt is PlayingEvent => evt.type === "playing",
  pause: (evt: VideoEvent): evt is PauseEvent => evt.type === "pause",
  seeked: (evt: VideoEvent): evt is SeekedEvent => evt.type === "seeked",
  seeking: (evt: VideoEvent): evt is SeekingEvent => evt.type === "seeking",
  timeUpdate: (evt: VideoEvent): evt is TimeUpdateEvent =>
    evt.type === "timeUpdate",
  unloadedMedia: (evt: VideoEvent): evt is UnloadedMediaEvent =>
    evt.type === "unloadedMedia"
};

export const as = {
  bitrateSwitch: (newBitRate: number): BitrateSwitchEvent => ({
    type: "bitrateSwitch",
    payload: { newBitRate }
  }),
  bufferingStarted: (): BufferingStartedEvent => ({
    type: "bufferingStarted"
  }),
  bufferingEnded: (): BufferingEndedEvent => ({
    type: "bufferingEnded"
  }),
  ended: (): EndedEvent => ({
    type: "ended"
  }),
  loadedMedia: (): LoadedMediaEvent => ({
    type: "loadedMedia"
  }),
  play: (): PlayEvent => ({
    type: "play"
  }),
  playing: (): PlayingEvent => ({
    type: "playing"
  }),
  pause: (): PauseEvent => ({
    type: "pause"
  }),
  seeked: (): SeekedEvent => ({
    type: "seeked"
  }),
  seeking: (): SeekingEvent => ({
    type: "seeking"
  }),
  timeUpdate: (currentTime: number): TimeUpdateEvent => ({
    type: "timeUpdate",
    payload: { currentTime }
  }),
  unloadedMedia: (): UnloadedMediaEvent => ({
    type: "unloadedMedia"
  })
};
