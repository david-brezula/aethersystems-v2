import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({entryPoints:['server/contact.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {createContactHandler} = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const valid = {name:'Test Person',email:'test@example.com',company:'A&B',scale:'MVP / New product',message:'Line 1\n<img src=x> & line 2',requestId:'a2e47862-572c-4b0a-9335-93fc8959a118',website:''};
function request(data=valid,headers={}) {
  return new Request('https://www.aethersystems.tech/api/contact',{method:'POST',headers:{origin:'https://www.aethersystems.tech','content-type':'application/json',...headers},body:typeof data==='string'?data:JSON.stringify(data)});
}
test('sends only to fixed recipients, keeps input as plain text, and deduplicates retries', async()=>{
  const sent=[];
  const handler=createContactHandler({apiKey:()=> 'test-key',send:async(url,options)=>{sent.push({url,...options});return Response.json({id:'email-id'});}});
  assert.equal((await handler(request({...valid,to:'attacker@example.com',from:'evil@example.com'}))).status,200);
  assert.equal((await handler(request())).status,200);
  const data=JSON.parse(sent[0].body);
  assert.deepEqual(data.to,['info@aethersystems.tech','david.brezula@gmail.com']);
  assert.equal(data.from,'Aether Forms <no-reply@aethersystems.tech>');
  assert.equal(data.reply_to,valid.email);
  assert.equal(data.html,undefined);
  assert.ok(data.text.includes(valid.message));
  assert.equal(sent[0].headers['Idempotency-Key'],sent[1].headers['Idempotency-Key']);
});
test('rejects malformed, oversized, cross-origin, invalid and injected input without sending',async()=>{
  let calls=0;
  const handler=createContactHandler({apiKey:()=> 'test-key',send:async()=>{calls++;throw Error('must not send');}});
  for(const data of ['{',null,[],{...valid,name:' '},{...valid,email:'a@b.com\r\nBcc:evil@b.com'},{...valid,name:'a\nb'},{...valid,scale:'Unknown'},{...valid,message:'x'.repeat(3001)},{...valid,requestId:'bad'}]) assert.equal((await handler(request(data))).status,400);
  assert.equal((await handler(request({...valid,message:'x'.repeat(17000)}))).status,413);
  assert.equal((await handler(request(valid,{origin:'https://evil.example'}))).status,403);
  assert.equal((await handler(request(valid,{'content-type':'text/plain'}))).status,415);
  assert.equal((await handler(new Request('https://www.aethersystems.tech/api/contact'))).status,405);
  assert.equal((await handler(request({...valid,website:'spam.example'}))).status,200);
  assert.equal(calls,0);
});
test('missing configuration and provider errors never report success or expose secrets',async()=>{
  assert.equal((await createContactHandler({apiKey:()=>undefined})(request())).status,503);
  for(const send of [async()=>new Response('secret-provider-error',{status:401}),async()=>{throw Error('private detail');},async()=>Response.json({})]) {
    const response=await createContactHandler({apiKey:()=> 'private-key',send})(request());
    assert.equal(response.status,502);
    assert.deepEqual(await response.json(),{success:false,error:'delivery_failed'});
  }
});
test('per-instance abuse backstop expires without retaining IP addresses',async()=>{
  let time=1000;
  const handler=createContactHandler({apiKey:()=> 'test-key',now:()=>time,send:async()=>Response.json({id:'ok'})});
  for(let i=0;i<5;i++) assert.equal((await handler(request())).status,200);
  assert.equal((await handler(request())).status,429);
  time+=600001;
  assert.equal((await handler(request())).status,200);
});
