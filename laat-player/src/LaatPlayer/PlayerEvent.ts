export type AttributeName = "src" | "muted" | "autoplay";
export type ElementAttributes = { [key in AttributeName]: string | null };
export type ElementConstructor = {
  type: "constructor";
  root: Node;
};
export type ElementConnected = {
  type: "connected";
  attributes: { [key in AttributeName]: string | null };
};
export type ElementDisconnected = {
  type: "disconnected";
};
export type PlayAction = {
  type: "play.action";
};
export type PauseAction = {
  type: "pause.action";
};
export type ElementAttributeChanged = {
  type: "attributeChanged";
  name: AttributeName;
  oldValue: string | null;
  newValue: string | null;
};

export type PlayerEvent =
  | ElementConstructor
  | ElementConnected
  | ElementDisconnected
  | ElementAttributeChanged
  | PlayAction
  | PauseAction;

export const is = {
  ElementConstructor: (evt: PlayerEvent): evt is ElementConstructor =>
    evt.type === "constructor",
  ElementConnected: (evt: PlayerEvent): evt is ElementConnected =>
    evt.type === "connected",
  ElementDisconnected: (evt: PlayerEvent): evt is ElementDisconnected =>
    evt.type === "disconnected",
  ElementAttributeChanged: (evt: PlayerEvent): evt is ElementAttributeChanged =>
    evt.type === "attributeChanged",
  PlayAction: (evt: PlayerEvent): evt is PlayAction =>
    evt.type === "play.action",
  PauseAction: (evt: PlayerEvent): evt is PauseAction =>
    evt.type === "pause.action"
};
