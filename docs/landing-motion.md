# Landing-page motion revision

The landing page extends the approved disclosure chamber into five distinct chapters. Every animation relates to a product action or boundary, with readable content as the default state.

- Workspace: perspective unfolding on scroll, a scanning sweep after local identifier masking, and a request preview entrance.
- Privacy principles: word-by-word color progression, staggered card movement, and three diagrams for identity separation, selected context, and request review. Diagrams respond to hover and keyboard focus.
- Architecture: a four-plane perspective stack expands as it enters view. Selecting Identity, Context, Inference, or Payment highlights the corresponding plane and displays its explanation.
- Developers: request-route motion and staggered code assembly with a functioning Replay control.
- Closing: two boundary panels move apart as the headline and workspace call to action enter view.

A thin page progress line and chapter rules connect the sections. No scroll pinning, DOM reparenting, automatic navigation, or scroll locking is used. The existing hero and its animation controls remain intact.

Supporting automatic effects are finite (roughly 3–4 seconds). They pause outside the viewport. Larger movements follow scrolling. Reduced-motion preferences disable entrance, hover, scanning, and code-assembly animations, with an expanded readable architecture diagram as the static state. The existing hero follows its own reduced-motion handling.

## Verification

- TypeScript and the production build passed.
- Browser visually inspected workspace, principles, architecture, developer example, and closing section.
- Corrected the animated headline's word spacing after visual inspection.
- Local masking and payload review passed; selected architecture layer updated its highlight and explanatory text.
- Replay remounted the code sequence and restarted its staggered animation.
- Closing CTA opened the Workspace successfully.
- Reduced-motion implementation reviewed; this browser has no media/viewport emulation controls, so mobile and reduced-motion visual rendering were not directly exercised.
