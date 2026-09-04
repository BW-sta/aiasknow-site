(function(){
  const VERSION='0.3.0';
  const BUSINESS={
    fresh:{label:'农副生鲜',items:['蔬菜','水果','蛋奶','肉类','粮油','其他']},
    food:{label:'餐饮',items:['主食','小吃','饮品','套餐','其他']},
    gym:{label:'健身房',items:['次卡','月卡','年卡','私教','团课','其他']},
    beauty:{label:'美容美业',items:['体验项目','基础项目','高客单项目','产品','其他']},
    pet:{label:'宠物店',items:['主粮','零食','洗护','寄养','医疗周边','其他']},
    service:{label:'本地服务',items:['咨询','体验','套餐','长期服务','其他']},
    other:{label:'其他生意',items:['主力商品','高毛利商品','引流商品','其他']}
  };

  const SYMPTOMS=[
    {id:'traffic',label:'客人少'},
    {id:'basket',label:'买得少'},
    {id:'stockout',label:'总缺货'},
    {id:'waste',label:'总剩货'},
    {id:'repeat',label:'老客少'},
    {id:'profit',label:'不赚钱'},
    {id:'unclear',label:'说不清'}
  ];

  const LANGUAGE_SIGNALS={
    traffic:['没客','没人','客流','进店少','来的人少','流量少','没流量','找不到客户','获客','曝光少','咨询少'],
    basket:['买得少','客单低','只买一个','只买一点','不加购','不成交','看了不买','进店不买','成交差','转化差'],
    stockout:['缺货','卖完','不够卖','断货','补不上','经常没货','来不及补'],
    waste:['剩货','卖不完','坏掉','损耗','积压','囤货','过期','扔掉','剩很多','压货'],
    repeat:['老客少','不复购','不回来','回头客少','续费少','续课少','流失','会员不来','客户不回'],
    profit:['不赚钱','没利润','利润低','毛利低','营业额高没钱','忙但不赚钱','成本高','房租高','人工高','亏钱'],
    unclear:['不知道问题','说不清','感觉不对','哪里有问题','看不懂','不知道赚没赚']
  };

  const Q={
    traffic:[
      {id:'source',title:'主要怎么来客？',options:['路过','老客带来','短视频','微信群','团购平台','没固定来源']},
      {id:'duration',title:'少多久了？',options:['一两周','一两个月','半年以上','一直不多']},
      {id:'trackSource',title:'知道客从哪来？',options:['清楚','大概知道','不知道']},
      {id:'trackConversion',title:'知道哪路客会买？',options:['知道','不知道'],when:s=>s.answers.trackSource!=='不知道'}
    ],
    basket:[
      {id:'buyPattern',title:'通常买几样？',options:['一两样','会多买','看价格','不清楚']},
      {id:'bundles',title:'有固定搭配？',options:['有','没有']},
      {id:'recommend',title:'会主动推荐？',options:['经常','偶尔','基本不会']},
      {id:'orderData',title:'能看到每单买什么？',options:['能','不能','不知道']}
    ],
    stockout:[
      {id:'item',title:'最常缺什么？',options:'BUSINESS_ITEMS'},
      {id:'replenish',title:'怎么决定进多少？',options:['凭经验','看昨天','看库存','供应商建议','系统建议']},
      {id:'stockoutLog',title:'缺货会记录？',options:['会','不会']},
      {id:'systemWorks',title:'系统建议准吗？',options:['大多准','经常不准','说不清'],when:s=>s.answers.replenish==='系统建议'}
    ],
    waste:[
      {id:'item',title:'剩得最多？',options:'BUSINESS_ITEMS'},
      {id:'replenish',title:'怎么决定进多少？',options:['凭经验','看昨天','看库存','供应商建议','系统建议']},
      {id:'leftoverLog',title:'每天记剩多少？',options:['会','偶尔','不会']},
      {id:'dispose',title:'卖不完怎么办？',options:['第二天卖','打折','送人','扔掉','看情况']},
      {id:'systemWorks',title:'系统建议准吗？',options:['大多准','经常不准','说不清'],when:s=>s.answers.replenish==='系统建议'}
    ],
    repeat:[
      {id:'contact',title:'有老客联系方式？',options:['大部分有','少部分有','基本没有']},
      {id:'contactOld',title:'会主动联系？',options:['经常','偶尔','基本不会']},
      {id:'cycle',title:'知道多久会再来？',options:['大概知道','不知道']},
      {id:'lastVisit',title:'能看到上次消费？',options:['能','不能','不知道']}
    ],
    profit:[
      {id:'margin',title:'知道哪些最赚钱？',options:['知道','大概知道','不知道']},
      {id:'lossLog',title:'会记损耗？',options:['每天记','偶尔记','不记','没有明显损耗']},
      {id:'skuMargin',title:'会按商品看毛利？',options:['会','不会']},
      {id:'fixedCost',title:'知道每月固定成本？',options:['清楚','大概知道','不知道']}
    ],
    unclear:[
      {id:'signal',title:'最近最明显？',options:['营业额下降','货越囤越多','很忙没利润','客人越来越少','都不明显']},
      {id:'dailyData',title:'每天看数据？',options:['会','偶尔','基本不看']},
      {id:'judge',title:'主要凭什么判断？',options:['经验','收银数据','库存','感觉']},
      {id:'records',title:'能拿出7天记录？',options:['能','不能','不知道']}
    ]
  };

  function classifyText(text){
    const t=(text||'').trim();
    const scores={traffic:0,basket:0,stockout:0,waste:0,repeat:0,profit:0,unclear:0};
    Object.entries(LANGUAGE_SIGNALS).forEach(([k,words])=>words.forEach(w=>{if(t.includes(w)) scores[k]+=w.length>=4?2:1;}));
    const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const top=ranked[0];
    const second=ranked[1];
    let symptom=top[1]>0?top[0]:'unclear';
    const confidence=top[1]>=3?'较强':top[1]>=1?'一般':'不足';
    const secondary=second&&second[1]>0&&second[1]>=top[1]*0.6?second[0]:null;
    return {symptom,secondary,confidence,scores,text:t};
  }

  function optionsFor(q,state){
    if(q.options==='BUSINESS_ITEMS') return (BUSINESS[state.business]||BUSINESS.other).items;
    return q.options;
  }
  function visibleQuestions(state){return (Q[state.symptom]||Q.unclear).filter(q=>!q.when||q.when(state));}
  function nextQuestion(state){return visibleQuestions(state).find(q=>state.answers[q.id]===undefined)||null;}

  function evidence(state){
    const n=Object.keys(state.answers||{}).length;
    if(n>=4) return {level:'较强',text:'已有多条经营行为证据'};
    if(n>=2) return {level:'一般',text:'方向已出现，但还需要7天记录验证'};
    return {level:'不足',text:'目前只是一个经营假设'};
  }

  const SUBSKILLS={
    waste(state){
      const a=state.answers;
      if(a.replenish==='系统建议'&&a.systemWorks==='经常不准') return {problem:'补货规则失真',reason:'有系统仍然剩货，先检查建议是否跟真实销量同步。',first:'校准补货规则',second:'盯7天进卖剩坏',pause:'先别继续加货',data:['进货量','卖出量','剩余量','报损量'],metric:'损耗率',experiment:'连续30天只调整高损耗商品的补货上限'};
      if(a.leftoverLog==='不会'||a.leftoverLog==='偶尔') return {problem:'库存损耗看不清',reason:'货在剩，但每天到底剩多少没有形成记录。',first:'记7天进卖剩坏',second:'找最常剩的商品',pause:'先别扩品',data:['进货量','卖出量','剩余量','报损量'],metric:'损耗率',experiment:'先给损耗最高的3个商品设补货上限'};
      return {problem:'补货偏多',reason:'已经在记剩货，下一步验证进货是否长期高于真实销量。',first:'对比7天进货和销量',second:'给高损耗品设上限',pause:'先别凭感觉加量',data:['进货量','卖出量','剩余量','报损量'],metric:'售罄率',experiment:'按近7天真实销量下调高剩货商品补货量'};
    },
    stockout(state){
      const a=state.answers;
      if(a.replenish==='系统建议'&&a.systemWorks==='经常不准') return {problem:'补货规则失真',reason:'有系统仍缺货，优先检查预测规则。',first:'记录7天缺货时点',second:'校准补货上限',pause:'先别全品类加库存',data:['进货量','卖出量','售罄时间','缺货次数'],metric:'缺货次数',experiment:'只提高高频缺货商品的安全库存'};
      if(a.stockoutLog==='不会') return {problem:'缺货没有反馈',reason:'卖完以后没有留下记录，下一次仍靠记忆。',first:'记7天缺货',second:'找高频缺货品',pause:'先别全店加量',data:['进货量','卖出量','售罄时间','缺货次数'],metric:'缺货次数',experiment:'给缺货最高的3个商品单独加安全库存'};
      return {problem:'补货量偏低',reason:'缺货已经有记录，可以直接验证哪些商品长期低估需求。',first:'对比7天销量和售罄',second:'调整重点商品补货',pause:'先别平均加量',data:['进货量','卖出量','售罄时间','缺货次数'],metric:'缺货次数',experiment:'只调整最常缺货商品，不动其他商品'};
    },
    traffic(state){
      const a=state.answers;
      if(a.trackSource==='不知道') return {problem:'客流来源看不清',reason:'客人少之前，先知道现有客人从哪里来。',first:'记7天客流来源',second:'看来源成交',pause:'先别盲目投广告',data:['进店人数','客源','成交单数'],metric:'有效客流',experiment:'把预算只投向7天里成交最好的一个来源'};
      return {problem:'有效客源不足',reason:'你大致知道客从哪来，下一步比较哪种来源真正会成交。',first:'做7天来源成交表',second:'放大最好来源',pause:'先别平均撒钱',data:['进店人数','客源','成交单数'],metric:'来源成交率',experiment:'30天只放大一个高成交来源'};
    },
    basket(state){
      const a=state.answers;
      if(a.orderData==='不能'||a.orderData==='不知道') return {problem:'订单结构看不清',reason:'客人已经来了，但不知道哪些东西会一起买。',first:'记7天订单组合',second:'找高频搭配',pause:'先别继续扩SKU',data:['订单数','营业额','商品组合'],metric:'客单价',experiment:'从真实订单里做3组自然搭配'};
      if(a.bundles==='没有'||a.recommend==='基本不会') return {problem:'连带购买太弱',reason:'已有客流没有被转成更多购买。',first:'做3组高频搭配',second:'测试店员推荐',pause:'先别急着拉新',data:['订单数','营业额','商品组合'],metric:'客单价',experiment:'连续30天只测试3组商品搭配'};
      return {problem:'客单提升空间',reason:'已有搭配和推荐，下一步验证哪些组合真正有效。',first:'比较7天组合客单',second:'保留高转化搭配',pause:'先别堆更多套餐',data:['订单数','营业额','商品组合'],metric:'客单价',experiment:'淘汰低转化搭配，只保留前3名'};
    },
    repeat(state){
      const a=state.answers;
      if(a.contact==='基本没有') return {problem:'老客无法识别',reason:'连谁是老客都留不下来，复购只能靠碰运气。',first:'先留最小客户记录',second:'记录最近消费',pause:'先别群发促销',data:['客户标识','最近消费','金额'],metric:'复购人数',experiment:'只记录愿意留下联系方式的老客，不强推会员'};
      if(a.lastVisit==='不能'||a.cycle==='不知道') return {problem:'复购周期看不清',reason:'有联系方式但不知道谁多久没来。',first:'记老客最近消费',second:'找常见回购周期',pause:'先别群发优惠',data:['客户标识','最近消费','金额'],metric:'回店率',experiment:'按真实购买周期做一次提醒'};
      return {problem:'老客唤回不足',reason:'已经能识别老客和周期，下一步测试什么提醒最有效。',first:'测试到期提醒',second:'比较回店率',pause:'先别高频打扰',data:['最近消费','联系日期','是否回店'],metric:'回店率',experiment:'30天只测试一种提醒方式'};
    },
    profit(state){
      const a=state.answers;
      if(a.skuMargin==='不会'||a.margin==='不知道') return {problem:'商品利润看不清',reason:'营业额有了，但不知道具体谁在赚钱。',first:'算Top20商品毛利',second:'叠加损耗',pause:'先别只追营业额',data:['销售额','采购成本','损耗'],metric:'真实毛利',experiment:'只优化Top20商品，不先动长尾商品'};
      if(a.fixedCost==='不知道') return {problem:'固定成本看不清',reason:'商品毛利不等于最后利润，还要把房租人工放进去。',first:'列清每月固定成本',second:'算保本营业额',pause:'先别乱打折',data:['销售额','毛利','固定成本'],metric:'日保本额',experiment:'先让每天营业额稳定高于保本线'};
      return {problem:'利润结构需要拆开',reason:'基础数字已有，下一步找高销量低利润和低销量高占用。',first:'做商品利润排序',second:'清理低效商品',pause:'先别全面降价',data:['销售额','采购成本','损耗','固定成本'],metric:'真实毛利',experiment:'连续30天减少低效SKU占用'};
    },
    unclear(state){
      const a=state.answers;
      if(a.signal==='货越囤越多') return {...SUBSKILLS.waste({...state,answers:{...a,leftoverLog:'不会'}}),problem:'库存先失控'};
      if(a.signal==='客人越来越少') return {...SUBSKILLS.traffic({...state,answers:{...a,trackSource:'不知道'}}),problem:'客流先变差'};
      if(a.signal==='很忙没利润') return {...SUBSKILLS.profit({...state,answers:{...a,margin:'不知道',skuMargin:'不会'}}),problem:'利润先看不清'};
      return {problem:'经营看不清',reason:'还没有足够证据判断哪一环最差，先用7天记录把问题逼出来。',first:'记7天关键数字',second:'找最大异常',pause:'先别上复杂系统',data:['营业额','订单数','缺货','损耗'],metric:'最大异常',experiment:'30天只处理7天记录里最大的一个异常'};
    }
  };

  function result(state){
    const fn=SUBSKILLS[state.symptom]||SUBSKILLS.unclear;
    const r=fn(state);
    return {...r,days:7,item:state.answers.item||'',business:(BUSINESS[state.business]||BUSINESS.other).label,evidence:evidence(state),secondary:state.secondarySymptom||null};
  }

  function observeFields(state){
    const s=state.symptom;
    if(s==='waste') return [{id:'in',label:'进',type:'number'},{id:'sold',label:'卖',type:'number'},{id:'left',label:'剩',type:'number'},{id:'loss',label:'坏',type:'number'}];
    if(s==='stockout') return [{id:'in',label:'进',type:'number'},{id:'sold',label:'卖',type:'number'},{id:'soldout',label:'几点卖完',type:'text'},{id:'miss',label:'缺货问几次',type:'number'}];
    if(s==='traffic') return [{id:'visitors',label:'进店',type:'number'},{id:'orders',label:'成交',type:'number'},{id:'source',label:'主要客源',type:'text'}];
    if(s==='basket') return [{id:'orders',label:'订单',type:'number'},{id:'revenue',label:'营业额',type:'number'},{id:'combo',label:'常见搭配',type:'text'}];
    if(s==='repeat') return [{id:'old',label:'老客单',type:'number'},{id:'new',label:'新客单',type:'number'},{id:'contacted',label:'联系老客',type:'number'},{id:'returned',label:'回来几人',type:'number'}];
    if(s==='profit') return [{id:'revenue',label:'营业额',type:'number'},{id:'purchase',label:'进货成本',type:'number'},{id:'loss',label:'损耗',type:'number'}];
    return [{id:'revenue',label:'营业额',type:'number'},{id:'orders',label:'订单',type:'number'},{id:'stockout',label:'缺货',type:'number'},{id:'loss',label:'损耗',type:'number'}];
  }

  function summarize(state,rows){
    const sum=id=>rows.reduce((t,r)=>t+(parseFloat(r.values[id])||0),0);
    const out={lines:[],signal:'',metric:'',next:''};
    if(state.symptom==='waste'){
      const incoming=sum('in'),sold=sum('sold'),left=sum('left'),loss=sum('loss');
      const waste=incoming>0?loss/incoming:0;
      const sell=incoming>0?sold/incoming:0;
      if(incoming>0) out.lines.push(`卖出约 ${Math.round(sell*100)}%`);
      if(loss>0) out.lines.push(`累计报损 ${loss}`);
      if(left>0) out.lines.push(`累计剩余 ${left}`);
      out.signal=waste>=.1?'损耗偏高':sell<.75?'进货可能偏多':'先继续校准补货';
      out.metric=`损耗率约 ${Math.round(waste*100)}%`;
      out.next='先调整损耗最高商品的补货上限';
    }else if(state.symptom==='stockout'){
      const miss=sum('miss');out.lines.push(`缺货询问 ${miss} 次`);out.signal=miss>=7?'缺货明显':'缺货存在但样本还小';out.metric=`7天缺货询问 ${miss} 次`;out.next='只提高高频缺货商品的安全库存';
    }else if(state.symptom==='traffic'){
      const v=sum('visitors'),o=sum('orders'),rate=v?o/v:0;out.lines.push(`累计进店 ${v} 人`);out.lines.push(`成交约 ${Math.round(rate*100)}%`);out.signal=v<70?'先补有效客流':rate<.25?'更像成交问题':'先找最好客源';out.metric=`进店成交约 ${Math.round(rate*100)}%`;out.next='只放大一个高成交来源';
    }else if(state.symptom==='basket'){
      const o=sum('orders'),rev=sum('revenue'),ticket=o?rev/o:0;out.lines.push(`平均客单约 ${Math.round(ticket)}`);out.signal='先测试商品搭配';out.metric=`平均客单约 ${Math.round(ticket)}`;out.next='只测试3组自然搭配';
    }else if(state.symptom==='repeat'){
      const c=sum('contacted'),r=sum('returned'),rate=c?r/c:0;out.lines.push(`老客单 ${sum('old')} 单`);if(c)out.lines.push(`联系后回店约 ${Math.round(rate*100)}%`);out.signal=c===0?'还没形成唤回动作':rate<.2?'提醒方式需要换':'已有可复制的唤回信号';out.metric=c?`联系回店约 ${Math.round(rate*100)}%`:'尚无回店率';out.next='30天只测试一种老客提醒';
    }else if(state.symptom==='profit'){
      const rev=sum('revenue'),p=sum('purchase'),loss=sum('loss'),ratio=rev?(p+loss)/rev:0;out.lines.push(`进货+损耗约占营业额 ${Math.round(ratio*100)}%`);out.signal=ratio>.75?'成本压力明显':'还要叠加房租人工';out.metric=`进货+损耗占比 ${Math.round(ratio*100)}%`;out.next='先拆Top20商品真实毛利';
    }else{
      const rev=sum('revenue'),o=sum('orders');if(o)out.lines.push(`平均客单约 ${Math.round(rev/o)}`);out.lines.push(`缺货 ${sum('stockout')} 次`);out.lines.push(`损耗 ${sum('loss')}`);out.signal='已经有第一批经营证据';out.metric='找7天最大异常';out.next='只解决最大异常';
    }
    out.lines=out.lines.filter(Boolean).slice(0,3);
    return out;
  }

  window.BossSkill={VERSION,BUSINESS,SYMPTOMS,classifyText,nextQuestion,optionsFor,result,observeFields,summarize};
})();