(()=>{
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
  const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  if(standalone) return;
  let deferredPrompt=null;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari=/safari/i.test(navigator.userAgent)&&!/crios|fxios|edgios/i.test(navigator.userAgent);
  const btn=document.createElement('button');
  btn.type='button';
  btn.textContent='安装到桌面';
  btn.setAttribute('aria-label','安装压岁钱你做主到桌面');
  btn.style.cssText='position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:9999;border:0;border-radius:999px;padding:11px 15px;background:#2F2A25;color:#fff;font:700 13px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.18);display:none';
  document.body.appendChild(btn);
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault(); deferredPrompt=e; btn.style.display='block';
  });
  window.addEventListener('appinstalled',()=>{btn.remove();deferredPrompt=null;});
  if(isIOS&&isSafari){btn.style.display='block';}
  btn.addEventListener('click',async()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      try{await deferredPrompt.userChoice;}catch(e){}
      deferredPrompt=null; btn.style.display='none'; return;
    }
    if(isIOS){
      const panel=document.createElement('div');
      panel.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(34,29,24,.38);display:flex;align-items:flex-end;justify-content:center;padding:16px';
      panel.innerHTML='<div style="width:min(100%,460px);background:#FFF9EF;border-radius:24px;padding:20px 18px 18px;color:#2F2A25;font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.22)"><div style="font-size:20px;font-weight:900;margin-bottom:8px">把它放到桌面</div><div style="font-size:14px;line-height:1.7;color:#675e55">点 Safari 底部的“分享”，再选“添加到主屏幕”。以后从桌面打开，就会像独立 App 一样运行。</div><button id="pwaGotIt" style="margin-top:14px;width:100%;border:0;border-radius:16px;padding:13px;background:#E5523F;color:#fff;font-size:16px;font-weight:900">知道了</button></div>';
      document.body.appendChild(panel);
      panel.addEventListener('click',e=>{if(e.target===panel||e.target.id==='pwaGotIt')panel.remove();});
    }
  });
})();
