import {PageIntro} from '@/components/anonyx/shared';
import {GuidedWalkthrough} from '@/components/anonyx/guided-walkthrough';
export const metadata={title:'Guided walkthrough',description:'Explore ten practical AI requests with agent selection, selective context, exact-request approval, and prepared example results.'};
export default function Walkthrough(){return <div className="page-wrap"><PageIntro eyebrow="ANONYX IN PRACTICE" title="One task. Every choice visible." description="Follow a practical workflow from your first prompt to an approved request. Choose what the agent can see at each step."/><GuidedWalkthrough/></div>}
