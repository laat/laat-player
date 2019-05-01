import Hls from "hls.js";
import { Observable } from "rxjs";

export function fromHlsjs(
  hls: Hls,
  event: typeof Hls.Events.LEVEL_SWITCHING
): Observable<{
  event: typeof Hls.Events.LEVEL_SWITCHING;
  data: Hls.levelSwitchingData;
}>;
export function fromHlsjs(
  hls: Hls,
  event: typeof Hls.Events.ERROR
): Observable<{
  event: typeof Hls.Events.ERROR;
  data: Hls.errorData;
}>;
export function fromHlsjs(
  hls: Hls,
  event: typeof Hls.Events.FRAG_BUFFERED
): Observable<{
  event: typeof Hls.Events.FRAG_BUFFERED;
  data: Hls.fragBufferedData;
}>;
export function fromHlsjs(
  hls: Hls,
  name: any
): Observable<{
  event: string;
  data: any;
}> {
  return new Observable(subscriber => {
    const handler = (event: string, data: any) => {
      subscriber.next({ event, data });
    };
    hls.on(name, handler);
    subscriber.add(() => {
      hls.off(name, handler);
    });
  });
}
