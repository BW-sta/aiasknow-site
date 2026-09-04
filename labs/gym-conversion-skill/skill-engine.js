(function(){
  const VERSION='1.0.0';
  const CLOSED=['已成交','流失'];

  function uid(){return 'c_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7)}
  function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)}
  function diffDays(dateStr){if(!dateStr)return 99;const a=new Date(dateStr+'T00:00:00');const b=new Date();return Math.max(0,Math.floor((b-a)/86400000))}

  function priority(c){
    if(CLOSED.includes(c.status)) return -999;
    let s=0;
    s += c.intent==='高'?32:c.intent==='中'?20:8;
    const d=diffDays(c.trialDate);
    s += d<=1?22:d<=3?15:d<=7?8:1;
    s += ({'价格':9,'时间':6,'还在比较':7,'没回复':2,'没明显卡点':10}[c.objection]||0);
    s += ({'未处理':12,'已联系':8,'已回复':28,'已预约':36,'暂缓':-12}[c.status]||0);
    s -= Math.max(0,(Number(c.followUps)||0)-2)*5;
    if(c.status==='暂缓'&&c.resumeDate){const rd=new Date(c.resumeDate+'T00:00:00');if(rd<=new Date())s+=28;}
    return s;
  }

  function task(c){
    const name=c.name||'这位客户';
    let goal='确认客户现在是否还有训练意愿';
    let message=`${name}，上次体验后我把你的情况重新看了一下。你现在还打算继续把这个目标做下去吗？我可以按你现在的节奏帮你重新安排。`;
    let why='体验后还没有形成明确结果';

    if(c.status==='已预约'){
      goal='确认到店时间，避免再次失约';
      message=`${name}，你这次到店时间我给你留好了。到店前我会把训练安排准备好，你按约定时间来就行。`;
      why='已经预约，当前最重要的是确保到店';
    }else if(c.status==='已回复'){
      if(c.objection==='价格'){
        goal='确认卡在总价还是付款方式';
        message=`${name}，你上次提到价格，我不想一直给你推套餐。我想确认一下，你现在主要卡在总价，还是付款方式和周期？我按这个给你重新拆。`;
        why='客户已回复且明确存在价格异议';
      }else if(c.objection==='时间'){
        goal='找到一个真正能坚持的训练时段';
        message=`${name}，你上次主要卡在时间。你最近一周最稳定能空出来的是早上、中午还是晚上？我先按你真正能坚持的时间排，不硬塞课。`;
        why='客户已回复，主要障碍是时间安排';
      }else if(c.objection==='还在比较'){
        goal='弄清客户真正比较的标准';
        message=`${name}，你还在比较几家我理解。你现在最在意的是教练、距离、价格还是训练效果？你告诉我最重要的一项，我只按这一项跟你说清楚。`;
        why='客户正在比较，继续推销没有意义';
      }else{
        goal='把回复推进到明确预约';
        message=`${name}，既然你还在考虑，我们别一直线上聊。我给你留一个短时间，把训练方案和节奏再确认一次，合适再继续，不合适就到这里。`;
        why='客户已经回复，下一步应推进明确行动';
      }
    }else if(c.objection==='价格'){
      goal='重新打开价格异议对话';
      message=`${name}，上次你问过价格，我后来想了一下，可能我当时讲套餐讲得太快了。你现在如果还考虑，我先不推卡，只把最适合你目标的训练频率和预算拆清楚。`;
      why='问过价格通常代表存在购买意愿';
    }else if(c.objection==='时间'){
      goal='确认是否真的没有时间';
      message=`${name}，你上次主要说时间不太合适。我想确认一下，如果每周只安排2次固定时段，你现在还有没有可能继续？如果没有我就先不打扰。`;
      why='时间异议需要变成可验证的具体安排';
    }else if(c.objection==='没回复'){
      if((Number(c.followUps)||0)>=3){
        goal='做最后一次低压力确认';
        message=`${name}，我最后确认一次，你最近如果暂时不打算继续训练，直接告诉我就行，我这边就不再反复联系你。以后需要再找我。`;
        why='多次未回复，应停止无效追逐并取得明确结果';
      }else{
        goal='用低压力方式重新激活';
        message=`${name}，前几天体验完我一直没收到你的想法。不是催你办卡，我只想知道那次体验对你有没有帮助。你回我“有”或“没有”都行。`;
        why='客户失联，先降低回复门槛';
      }
    }else if(c.objection==='还在比较'){
      goal='确认比较标准';
      message=`${name}，你上次说还想比较一下。我不催结果，你现在最看重哪一项：教练、距离、价格还是环境？我只把这一项给你讲明白。`;
      why='比较型客户需要减少信息，而不是继续堆卖点';
    }else if(c.intent==='高'){
      goal='直接推进下一次到店';
      message=`${name}，你上次体验时目标其实挺明确的。与其一直聊，我给你留一个时间，我们直接把接下来4周怎么练定下来。你今天还是明天方便一点？`;
      why='高意向客户应该尽快推进明确动作';
    }

    return {goal,message,why,score:priority(c)};
  }

  function nextAction(c){
    if(c.status==='已成交') return '已完成';
    if(c.status==='流失') return '退出队列';
    if(c.status==='已预约') return '确认到店';
    if(c.status==='已回复') return '推进预约';
    if(c.status==='已联系') return '等待回复，24小时后复查';
    if(c.status==='暂缓') return c.resumeDate?`到 ${c.resumeDate} 再联系`:'设置再次联系日期';
    return '今天联系';
  }

  function metrics(list){
    const total=list.length;
    const contacted=list.filter(x=>(x.followUps||0)>0||['已联系','已回复','已预约','已成交','暂缓','流失'].includes(x.status)).length;
    const replied=list.filter(x=>['已回复','已预约','已成交'].includes(x.status)).length;
    const booked=list.filter(x=>['已预约','已成交'].includes(x.status)).length;
    const closed=list.filter(x=>x.status==='已成交').length;
    const revenue=list.reduce((s,x)=>s+(x.status==='已成交'?(Number(x.amount)||0):0),0);
    return {
      total,contacted,replied,booked,closed,revenue,
      replyRate:contacted?Math.round(replied/contacted*100):0,
      closeRate:total?Math.round(closed/total*100):0
    };
  }

  function demo(){
    return [
      {id:uid(),name:'王女士',trialDate:daysAgo(1),intent:'高',objection:'价格',status:'未处理',followUps:0,amount:0,source:'抖音'},
      {id:uid(),name:'李先生',trialDate:daysAgo(2),intent:'高',objection:'时间',status:'已回复',followUps:1,amount:0,source:'转介绍'},
      {id:uid(),name:'陈女士',trialDate:daysAgo(3),intent:'中',objection:'还在比较',status:'未处理',followUps:0,amount:0,source:'美团点评'},
      {id:uid(),name:'赵先生',trialDate:daysAgo(5),intent:'中',objection:'没回复',status:'已联系',followUps:2,amount:0,source:'地推'},
      {id:uid(),name:'周女士',trialDate:daysAgo(1),intent:'高',objection:'没明显卡点',status:'已预约',followUps:2,amount:0,source:'私域'},
      {id:uid(),name:'刘先生',trialDate:daysAgo(6),intent:'低',objection:'没回复',status:'已联系',followUps:3,amount:0,source:'抖音'}
    ];
  }

  function csv(list){
    const headers=['姓名','来源','体验日期','意向','卡点','状态','跟进次数','成交金额','下一步'];
    const rows=list.map(c=>[c.name,c.source||'',c.trialDate,c.intent,c.objection,c.status,c.followUps||0,c.amount||0,nextAction(c)]);
    return [headers,...rows].map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');
  }

  window.GymConversionSkill={VERSION,uid,priority,task,nextAction,metrics,demo,csv,diffDays};
})();
