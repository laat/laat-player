import "../customElement/register";
import React from "react";
interface Props {
  src?: string;
  muted?: boolean;
  autoplay?: boolean;
}
export const LaatPlayer: React.FC<Props> = props => <laat-player {...props} />;
