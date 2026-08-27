(()=>{
  const cfg=window.SUOLEMA_ANALYTICS;
  if(!cfg||!cfg.base||!cfg.appKey)return;

  const STATE_KEY='suolema_analytics_state_v1';
  const QUEUE_KEY='suolema_analytics_queue_v1';
  const base=cfg.base.replace(/\/$/,'');
  const appKey=cfg.appKey;

  const cnDay=(offset=0)=>{
    const now=new Date(Date.now()+offset*86400000);
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
    return `${map.year}${map.month}${map.day}`;
  };
  const dayDiff=(a,b)=>{
    const p=s=>Date.UTC(+s.slice(0,4),+s.slice(4,6)-1,+s.slice(6,8));
    return Math.round((p(b)-p(a))/86400000);
  };
  const cleanKey=k=>String(k).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,64);
  const load=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch(e){return fallback}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

  function queue(key){
    const q=load(QUEUE_KEY,[]);
    q.push(cleanKey(key));
    save(QUEUE_KEY,q.slice(-80));
  }

  async function bump(key,{requeue=true}={}){
    key=cleanKey(key);
    try{
      let r=await fetch(`${base}/ActOnValue/${encodeURIComponent(appKey)}/${encodeURIComponent(key)}/Increment`,{method:'POST',cache:'no-store'});
      if(!r.ok){
        r=await fetch(`${base}/UpdateValue/${encodeURIComponent(appKey)}/${encodeURIComponent(key)}/1`,{method:'POST',cache:'no-store'});
      }
      if(!r.ok)throw new Error('analytics_write_failed');
      return true;
    }catch(e){
      if(requeue)queue(key);
      return false;
    }
  }

  async function flush(){
    const q=load(QUEUE_KEY,[]);
    if(!q.length)return;
    const pending=q.slice(0,12), rest=q.slice(12), failed=[];
    for(const key of pending){
      const ok=await bump(key,{requeue:false});
      if(!ok)failed.push(key);
    }
    save(QUEUE_KEY,[...failed,...rest].slice(-80));
  }

  function state(){
    const s=load(STATE_KEY,{});
    if(!s.visitorId){
      s.visitorId=(crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    }
    return s;
  }

  async function trackVisit(){
    const s=state(), today=cnDay();
    const isNew=!s.firstDay;
    if(isNew)s.firstDay=today;

    bump('visit_total');
    bump(`pv_${today}`);

    if(isNew){
      bump('uv_total');
      bump(`new_${today}`);
    }

    if(s.lastVisitDay!==today){
      bump(`uv_${today}`);
      const src=new URLSearchParams(location.search).get('src');
      if(src) bump(`src_${cleanKey(src).slice(0,20)}_${today}`);

      const diff=dayDiff(s.firstDay,today);
      if(diff===1&&!s.d1Counted){
        s.d1Counted=true;
        bump('d1_total');
        bump(`d1_${today}`);
      }
      if(diff>=1&&diff<=7&&!s.d7Counted){
        s.d7Counted=true;
        bump('d7_total');
        bump(`d7_${today}`);
      }
      s.lastVisitDay=today;
    }
    save(STATE_KEY,s);
    flush();
  }

  function trackLock(){
    const s=state(), today=cnDay();
    bump('lock_total');
    bump(`lock_${today}`);
    if(!s.everLocked){
      s.everLocked=true;
      bump('lock_users_total');
    }
    if(s.lastLockDay!==today){
      s.lastLockDay=today;
      bump(`lock_uv_${today}`);
    }
    save(STATE_KEY,s);
  }

  function trackReset(){
    const today=cnDay();
    bump('reset_total');
    bump(`reset_${today}`);
  }

  window.SuolemaAnalytics={trackVisit,trackLock,trackReset,flush};
  trackVisit();
})();
