// Defs ids are document-global, so scope them per component instance.
export const svgLocalId = (name: string, instanceId: number): string =>
  `${name}-${instanceId.toString()}`;
