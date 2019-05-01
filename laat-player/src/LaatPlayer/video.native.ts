import { fromEvent, merge, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { is, PlayerElementEvent } from "./customElement";
import { as } from "./VideoEvent";

export const nativePlayer = (player$: Observable<PlayerElementEvent>) => {
  const video = document.createElement("video");
  const setAttribute = makeSetAttribute(video);
  video.style.width = "100%";
  video.style.height = "100%";
  player$.pipe(filter(is.ElementConstructor)).subscribe(evt => {
    evt.root.appendChild(video);
  });
  player$.pipe(filter(is.ElementConnected)).subscribe(({ attributes }) => {
    Object.entries(attributes)
      .map(([name, newValue]) => ({ name, newValue }))
      .forEach(setAttribute);
  });
  player$.pipe(filter(is.ElementAttributeChanged)).subscribe(setAttribute);
  player$.pipe(filter(is.ElementDisconnected)).subscribe(() => {
    video.src = "";
  });
  player$.pipe(filter(is.PlayAction)).subscribe(() => video.play());
  player$.pipe(filter(is.PauseAction)).subscribe(() => video.pause());
  return videoObservable(video);
};

const videoObservable = (video: HTMLVideoElement) =>
  merge(
    fromEvent(video, "play").pipe(map(as.play)),
    fromEvent(video, "pause").pipe(map(as.pause)),
    fromEvent(video, "seeked").pipe(map(as.seeked)),
    fromEvent(video, "seeking").pipe(map(as.seeking)),
    fromEvent(video, "timeupdate").pipe(
      filter(() => !video.paused),
      map(() => as.timeUpdate(video.currentTime))
    )
  );

const makeSetAttribute = (video: HTMLVideoElement) => (opts: {
  name: string;
  newValue: string | null;
}) => {
  if (opts.newValue == null) {
    video.removeAttribute(opts.name);
  } else {
    video.setAttribute(opts.name, opts.newValue);
  }
};
