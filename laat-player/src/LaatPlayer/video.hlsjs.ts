import Hls from "hls.js";
import { fromEvent, merge, Observable, Subject } from "rxjs";
import { filter, map, skipUntil, distinctUntilChanged } from "rxjs/operators";
import { fromHlsjs } from "./helpers/fromHlsjs";
import { is, PlayerEvent } from "./PlayerEvent";
import { as, VideoEvent } from "./VideoEvent";

export const hlsjsPlayer = (player$: Observable<PlayerEvent>) => {
  const hls = new Hls({ enableWorker: false });
  const video = document.createElement("video");
  const videoSubject = new Subject<VideoEvent>();
  const setAttribute = makeSetVideoAttribute(hls, videoSubject, video);
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
  player$.pipe(filter(is.ElementDisconnected)).subscribe(() => hls.destroy());
  player$.pipe(filter(is.PlayAction)).subscribe(() => video.play());
  player$.pipe(filter(is.PauseAction)).subscribe(() => video.pause());

  const video$: Observable<VideoEvent> = videoObservable(
    videoSubject,
    video,
    hls
  );

  return video$;
};

const makeSetVideoAttribute = (
  hls: Hls,
  videoSubject: Subject<VideoEvent>,
  video: HTMLVideoElement
) => (opts: { name: string; newValue: string | null }) => {
  if (opts.name === "src") {
    if (opts.newValue != null) {
      hls.attachMedia(video);
      hls.loadSource(opts.newValue);
      // xxx triggered twice!
      video.addEventListener(
        "canplay",
        () => videoSubject.next(as.loadedMedia()),
        { once: true }
      );
    } else {
      videoSubject.next(as.unloadedMedia());
      hls.detachMedia();
    }
  } else {
    if (opts.newValue == null) {
      video.removeAttribute(opts.name);
    } else {
      video.setAttribute(opts.name, opts.newValue);
    }
  }
};

const videoObservable = (
  videoSubject: Subject<VideoEvent>,
  video: HTMLVideoElement,
  hls: Hls
): Observable<VideoEvent> => {
  return merge(
    videoSubject.asObservable(),
    fromEvent(video, "play").pipe(map(as.play)),
    fromEvent(video, "pause").pipe(map(as.pause)),
    fromEvent(video, "seeked").pipe(map(as.seeked)),
    fromEvent(video, "seeking").pipe(map(as.seeking)),
    fromEvent(video, "timeupdate").pipe(
      filter(() => !video.paused),
      map(() => as.timeUpdate(video.currentTime))
    ),
    fromHlsjs(hls, Hls.Events.LEVEL_SWITCHING).pipe(
      map(({ data }) => as.bitrateSwitch(data.bitrate))
    ),
    buffering(hls)
  );
};

const buffering = (hls: Hls) => {
  const started$ = fromHlsjs(hls, Hls.Events.ERROR).pipe(
    filter(
      ({ data }) => data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR
    ),
    map(as.bufferingStarted)
  );
  const ended$ = fromHlsjs(hls, Hls.Events.FRAG_BUFFERED).pipe(
    skipUntil(started$),
    map(as.bufferingEnded)
  );
  return merge(started$, ended$).pipe(distinctUntilChanged());
};
