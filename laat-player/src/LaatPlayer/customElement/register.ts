import { LaatPlayerElement } from "./LaatPlayerElement";

declare global {
  // eslint-disable-next-line
  module JSX {
    interface IntrinsicElements {
      "laat-player": any;
    }
  }
}
customElements.define("laat-player", LaatPlayerElement);
export {};
