// Minimal Node smoke test for LoveLoggy demo server
// Run: node server/smoke_node.js

const base = 'http://localhost:3000/api';

async function run(){
  try{
    const h = await fetch(base + '/health');
    console.log('health', await h.json());

    let r = await fetch(base + '/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', password: 'pass123' })
    });
    const a = await r.json();
    console.log('signup1', a);

    const invite = a.couple && a.couple.inviteCode;
    r = await fetch(base + '/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bob', email: 'bob@example.com', password: 'pass123', inviteCode: invite })
    });
    const b = await r.json();
    console.log('signup2', b);

    const coupleId = a.couple.id;
    await fetch(base + '/keys/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coupleId, userId: a.user.id, publicKeyJwk: { kty: 'EC', crv: 'P-256', x: 'x', y: 'y' } }) });
    await fetch(base + '/keys/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coupleId, userId: b.user.id, publicKeyJwk: { kty: 'EC', crv: 'P-256', x: 'x2', y: 'y2' } }) });

    await fetch(base + '/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ coupleId, senderId: a.user.id, ciphertext: 'TEST_CT', iv: 'TEST_IV' }) });

    r = await fetch(base + '/messages/' + coupleId);
    const msgs = await r.json();
    console.log('messages', msgs);
  }catch(e){
    console.error('Smoke test error', e);
    process.exit(1);
  }
}

run();
