(function(){
  const VERSION='2.0.0';
  function uid(){return 'c_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7)}
  function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
  function diffDays(s){if(!s)return 99;return Math.max(0,Math.floor((Date.now()-new Date(s+'T00:00:00'))/86400000))}

  function isDone(c){return ['成交','不买'].includes(c.result)}

  function priority(c){
    if(isDone(c)) return -999;
    let s=0;
    if(c.stage==='已约到店') s+=60;
    else if(c.stage==='已回复') s+=50;
    else if(c.stage==='待联系') s+=30;
    else if(c.stage==='已发送') s+=10;
    s += c.intent==='高'?20:c.intent==='中'?10:3;
    const d=diffDays(c.trialDate);
    s += d<=1?15:d<=3?10:d<=7?5:0;
    s -= (c.noReply||0)*5;
    return s;
  }

  function firstMessage(c){
    const n=c.name||'你好';
    if(c.objection==='价格') return `${n}，上次体验后你提到价格。我不继续推套餐，想确认一下，你主要卡在总价，还是付款方式和周期？我按这个重新帮你拆。`;
    if(c.objection==='时间') return `${n}，上次你主要卡在时间。如果每周只固定2次，你现在更容易安排早上、中午还是晚上？我先按真正能坚持的时间排。`;
    if(c.objection==='在比较') return `${n}，你上次说还想比较一下。你现在最看重教练、距离、价格还是训练效果？你告诉我最重要的一项，我只把这一项说清楚。`;
    if(c.objection==='没回复') return `${n}，前几天体验后我一直没收到你的想法。不是催你办卡，我只想确认那次体验对你有没有帮助。你回我“有”或“没有”就行。`;
    return `${n}，上次体验后你的目标其实挺明确的。我想确认一下，你现在还准备继续练吗？如果准备，我直接帮你把接下来4周怎么练排清楚。`;
  }

  function followMessage(c){
    const n=c.name||'你好';
    if((c.noReply||0)>=2) return `${n}，我最后确认一次。如果你最近暂时不准备继续，直接告诉我就行，我这边不再反复联系。以后需要再找我。`;
    return `${n}，我补一句，不是催你做决定。你现在如果还考虑，我只需要知道你最卡哪一点，我按那个点处理。`;
  }

  function replyMessage(c){
    const n=c.name||'你好';
    if(c.objection==='价格') return `${n}，明白。那我们不先谈整套，你告诉我你能接受的大概月预算，我按预算倒推最合适的训练频率。`;
    if(c.objection==='时间') return `${n}，那我们先不谈办卡。你给我两个你最稳定的时间段，我先看看能不能排出真正能坚持的方案。`;
    if(c.objection==='在比较') return `${n}，可以。你比较完最在意的那一项告诉我，我只回答那一项，不继续堆信息。`;
    return `${n}，既然你还在考虑，我们直接约个短时间把训练方案确认一下。合适再继续，不合适就到这里。`;
  }

  function task(c){
    if(c.stage==='已约到店') return {goal:'确保按时到店',message:`${c.name}，你这次到店时间已经给你留好了。到店前我会把训练安排准备好，你按约定时间来就行。`};
    if(c.stage==='已回复') return {goal:'推进一个明确下一步',message:replyMessage(c)};
    if(c.stage==='已发送') return {goal:'等待结果',message:'这条已经发出。现在只记录对方结果，不再补发。'};
    const msg=(c.noReply||0)>0?followMessage(c):firstMessage(c);
    return {goal:(c.noReply||0)>0?'做一次低压力跟进':'打开一次有效对话',message:msg};
  }

  function nextCustomer(list){return list.filter(c=>!isDone(c)).sort((a,b)=>priority(b)-priority(a))[0]||null}

  function apply(c,action,amount){
    c.updatedAt=new Date().toISOString();
    if(action==='sent') c.stage='已发送';
    if(action==='replied') c.stage='已回复';
    if(action==='no_reply'){c.noReply=(c.noReply||0)+1;c.stage='待联系';}
    if(action==='booked') c.stage='已约到店';
    if(action==='closed'){c.result='成交';c.stage='已完成';c.amount=Math.max(0,Number(amount)||0);}
    if(action==='lost'){c.result='不买';c.stage='已完成';}
    return c;
  }

  function summary(list){
    const total=list.length,done=list.filter(isDone).length,closed=list.filter(c=>c.result==='成交').length;
    const revenue=list.reduce((s,c)=>s+(c.result==='成交'?(Number(c.amount)||0):0),0);
    return {total,done,closed,revenue,remaining:total-done};
  }

  function demo(){return [
    {id:uid(),name:'王女士',trialDate:daysAgo(1),intent:'高',objection:'价格',stage:'待联系',result:'',noReply:0,amount:0},
    {id:uid(),name:'李先生',trialDate:daysAgo(2),intent:'高',objection:'时间',stage:'已回复',result:'',noReply:0,amount:0},
    {id:uid(),name:'陈女士',trialDate:daysAgo(3),intent:'中',objection:'在比较',stage:'待联系',result:'',noReply:0,amount:0}
  ]}

  window.GymConversionSkill={VERSION,uid,priority,task,nextCustomer,apply,summary,demo,isDone};
})();