import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/anonyx/shell';
export const metadata: Metadata = {title:{default:'Anonyx — Choose what you share',template:'%s · Anonyx'},description:'A privacy-aware AI workspace. Choose your model, control your context, and inspect every request.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en" className="dark"><body><Shell>{children}</Shell></body></html>}
