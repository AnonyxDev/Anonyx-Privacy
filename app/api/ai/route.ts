import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {aiCatalog, aiChat, type AIEnvironment} from '@/lib/ai-gateway';
export const dynamic = 'force-dynamic';
export async function GET() {return aiCatalog(env as AIEnvironment);}
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  return aiChat(request, env as AIEnvironment, user?.userId || null);
}
