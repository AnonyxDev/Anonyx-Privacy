import {readdir,readFile,mkdir,copyFile} from 'node:fs/promises';
import {join,dirname} from 'node:path';
async function retain(source,destination){
 for(const entry of await readdir(source,{withFileTypes:true})){
  const from=join(source,entry.name),to=join(destination,entry.name);
  if(entry.isDirectory()){await retain(from,to);continue}
  try { await readFile(to); } catch(error) {
   if(error.code!=='ENOENT')throw error;
   await mkdir(dirname(to),{recursive:true});await copyFile(from,to);
  }
 }
}
if(process.argv.includes('--capture')) {
 try { await retain('dist/client/_next/static','compatibility-assets/_next/static'); } catch(error) { if(error.code!=='ENOENT')throw error; }
} else {
 await retain('compatibility-assets/_next/static','dist/client/_next/static');
}
console.log('Retained immutable assets for existing browser sessions.');
