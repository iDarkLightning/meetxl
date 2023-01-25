import { Heading } from "../system/heading";

export const SectionHeading: React.FC<{ heading: string; sub: string }> = (
  props
) => (
  <div>
    <Heading level="h4">{props.heading}</Heading>
    <p className="opacity-75">{props.sub}</p>
  </div>
);
