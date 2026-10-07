# Approved direction A: disclosure chamber

Published revision intent: turn selective context into a visible sequence of gathering, selection, passage, and request assembly.

- Reuses the generated Meshy filter as two translucent shutter leaves inside a luminous layered gate.
- A shared deterministic motion model drives WebGL and an animated Canvas 2D perspective view. The old still-image fallback is no longer used in the hero.
- Each context selection maps to a separate particle lane. Identity fragments and unselected context stop on the private side and dissipate from the illustration. Only selected fragments turn teal and assemble on the model side.
- The camera pushes toward the passage during the WebGL sequence. The Canvas version uses a perspective zoom.
- Sequence phases are shown above the gate. Receipt contents derive directly from the current selection. Replay restarts the sequence; changing a selection cancels it.
- Pause and reduced-motion settings display results immediately. Both renderers stop animation while offscreen. The paused Canvas skips unchanged frames.
- Mobile layout puts the chamber first and stacks readable context controls and the request below it on narrow screens.

## Verification

TypeScript and the production build passed. Deterministic motion tests cover every selection combination across 101 points in the sequence, checking that excluded context never crosses the boundary, only selected particles turn teal, all positions remain finite, and the selected particle count matches the output.

Browser checks passed for zero context, goal only, writing preference only, and both selections; replay, selection cancellation, pausing during a sequence, rotation, and navbar Privacy navigation were exercised. The animated Canvas fallback was visually inspected while idle and during request assembly. This browser disables WebGL, so actual GPU rendering is not visually verified. Mobile breakpoints are implemented, but this browser offers no viewport-emulation control.

No new Meshy generation was needed; the existing optimized asset is reused.
