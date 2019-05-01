import { Subject } from "rxjs";
import { map, filter } from "rxjs/operators";
import { ObjectFromEntries } from "../helpers/typescript";
import { hlsjsPlayer } from "../video.hlsjs";
import { toCustomEvent } from "./customEvents";
import { AttributeName, PlayerEvent } from "../PlayerEvent";
import { is } from "../VideoEvent";

export class LaatPlayerElement extends HTMLElement {
  static observedAttributes: AttributeName[] = ["src", "muted", "autoplay"];
  private _playerSubject = new Subject<PlayerEvent>();
  private _player$ = this._playerSubject.asObservable();
  private _video$ = hlsjsPlayer(this._player$);

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._upgradeProperty("src");
    this._playerSubject.next({
      type: "constructor",
      root: this.shadowRoot!
    });

    this._video$
      .pipe(
        filter(e => is.timeUpdate(e)),
        map(toCustomEvent)
      )
      .subscribe(this.dispatchEvent.bind(this));

    //debug
    this._player$.subscribe(c => console.log("_player$", c));
    this._video$
      .pipe(filter(e => !is.timeUpdate(e)))
      .subscribe(e => console.log("_video2$", e));
  }

  connectedCallback() {
    this._playerSubject.next({
      type: "connected",
      attributes: ObjectFromEntries(
        LaatPlayerElement.observedAttributes.map(
          (name): [AttributeName, string | null] => [
            name,
            this.getAttribute(name)
          ]
        )
      )
    });
  }

  attributeChangedCallback(
    name: AttributeName,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue !== newValue) {
      this._playerSubject.next({
        type: "attributeChanged",
        name,
        oldValue,
        newValue
      });
    }
  }

  play() {
    this._playerSubject.next({ type: "play.action" });
  }
  pause() {
    this._playerSubject.next({ type: "pause.action" });
  }

  get video$() {
    return this._video$;
  }

  set autoplay(newValue: string | null) {
    if (newValue == null) {
      this.removeAttribute("autoplay");
    } else {
      this.setAttribute("autoplay", newValue);
    }
  }

  get autoplay() {
    return this.getAttribute("autoplay");
  }

  set muted(newValue: string | null) {
    if (newValue == null) {
      this.removeAttribute("muted");
    } else {
      this.setAttribute("muted", newValue);
    }
  }

  get muted() {
    return this.getAttribute("muted");
  }

  set src(newValue: string | null) {
    if (newValue == null) {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", newValue);
    }
  }

  get src() {
    return this.getAttribute("src");
  }

  _upgradeProperty(prop: AttributeName) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}
