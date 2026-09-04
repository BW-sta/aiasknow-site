(function(){
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

  function optionsFor(q,state){
    if(q.options==='BUSINESS_ITEMS') return (BUSINESS[state.business]||BUSINESS.other).items;
    return q.options;
  }

  function visibleQuestions(state){
    return (Q[state.symptom]||Q.unclear).filter(q=>!q.when||q.when(state));
  }

  function nextQuestion(state){
    const qs=visibleQuestions(state);
    return qs.find(q=>state.answers[q.id]===undefined)||null;
  }

  function result(state){
    const a=state.answers, s=state.symptom;
    let r;
    if(s==='waste'){
      if(a.replenish==='系统建议'&&a.systemWorks==='经常不准') r={problem:'补货规则失真',reason:'你不是没系统，而是系统建议没有跟真实销量和剩货同步。',first:'校准补货规则',second:'盯7天进卖剩坏',pause:'先别继续加货',data:['进货量','卖出量','剩余量','报损量']};
      else if(a.leftoverLog==='不会'||a.leftoverLog==='偶尔') r={problem:'库存损耗看不清',reason:'货在剩，但每天到底剩多少没有形成记录。先把损耗看见。',first:'记7天进卖剩坏',second:'找最常剩的商品',pause:'先别扩品',data:['进货量','卖出量','剩余量','报损量']};
      else r={problem:'补货偏多',reason:'你已经在记录剩货，下一步该验证进货量是否长期高于真实销量。',first:'对比7天进货和销量',second:'给高损耗品设上限',pause:'先别凭感觉加量',data:['进货量','卖出量','剩余量','报损量']};
    }else if(s==='stockout'){
      if(a.replenish==='系统建议'&&a.systemWorks==='经常不准') r={problem:'补货规则失真',reason:'有系统仍缺货，优先检查预测规则而不是继续人工加量。',first:'记录7天缺货时点',second:'校准补货上限',pause:'先别全品类加库存',data:['进货量','卖出量','售罄时间','缺货次数']};
      else if(a.stockoutLog==='不会') r={problem:'缺货没有反馈',reason:'卖完以后没有留下记录，下一次进货仍然只能靠记忆。',first:'记7天缺货',second:'找高频缺货品',pause:'先别全店加量',data:['进货量','卖出量','售罄时间','缺货次数']};
      else r={problem:'补货量偏低',reason:'缺货已经有记录，可以直接验证哪些商品长期低估需求。',first:'对比7天销量和售罄',second:'调整重点商品补货',pause:'先别平均加量',data:['进货量','卖出量','售罄时间','缺货次数']};
    }else if(s==='traffic'){
      if(a.trackSource==='不知道') r={problem:'客流来源看不清',reason:'客人少之前，先知道现有客人从哪里来。否则投钱也不知道该投哪。',first:'记7天客流来源',second:'看来源成交',pause:'先别盲目投广告',data:['进店人数','客源','成交单数']};
      else r={problem:'有效客源不足',reason:'你大致知道客从哪来，下一步比较哪种来源真正会成交。',first:'做7天来源成交表',second:'放大最好来源',pause:'先别平均撒钱',data:['进店人数','客源','成交单数']};
    }else if(s==='basket'){
      if(a.orderData==='不能'||a.orderData==='不知道') r={problem:'每单买什么看不清',reason:'客人已经来了，但你还不知道哪些商品会一起买。先看订单结构。',first:'记7天订单组合',second:'找高频搭配',pause:'先别继续扩SKU',data:['订单数','营业额','商品组合']};
      else if(a.bundles==='没有'||a.recommend==='基本不会') r={problem:'连带购买太弱',reason:'已有客流没有被转成更多购买，先从自然搭配和推荐动作入手。',first:'做3组高频搭配',second:'测试店员推荐',pause:'先别急着拉新',data:['订单数','营业额','商品组合']};
      else r={problem:'客单提升空间',reason:'你已经有搭配和推荐，下一步用订单数据验证哪些组合真的有效。',first:'比较7天组合客单',second:'保留高转化搭配',pause:'先别堆更多套餐',data:['订单数','营业额','商品组合']};
    }else if(s==='repeat'){
      if(a.contact==='基本没有') r={problem:'老客无法识别',reason:'连谁是老客都留不下来，复购就只能靠碰运气。',first:'先留最小客户记录',second:'记录最近消费',pause:'先别群发促销',data:['客户标识','最近消费','金额']};
      else if(a.lastVisit==='不能'||a.cycle==='不知道') r={problem:'复购周期看不清',reason:'有联系方式但不知道谁多久没来，联系动作只能靠感觉。',first:'记老客最近消费',second:'找常见回购周期',pause:'先别群发优惠',data:['客户标识','最近消费','金额']};
      else r={problem:'老客唤回不足',reason:'你已经能识别老客和消费周期，下一步验证什么提醒最容易让人回来。',first:'测试到期提醒',second:'比较回店率',pause:'先别高频打扰',data:['最近消费','联系日期','是否回店']};
    }else if(s==='profit'){
      if(a.skuMargin==='不会'||a.margin==='不知道') r={problem:'商品利润看不清',reason:'营业额有了，但不知道具体是谁在赚钱、谁在占现金。',first:'算Top20商品毛利',second:'叠加损耗',pause:'先别只追营业额',data:['销售额','采购成本','损耗']};
      else if(a.fixedCost==='不知道') r={problem:'固定成本看不清',reason:'商品毛利不等于最后利润，还要把房租人工等固定成本放进去。',first:'列清每月固定成本',second:'算保本营业额',pause:'先别乱打折',data:['销售额','毛利','固定成本']};
      else r={problem:'利润结构需要拆开',reason:'基础数字已经有了，下一步找高销量低利润和低销量高占用的商品。',first:'做商品利润排序',second:'清理低效商品',pause:'先别全面降价',data:['销售额','采购成本','损耗','固定成本']};
    }else{
      if(a.signal==='货越囤越多') r={problem:'库存先失控',reason:'最明显信号是货越积越多，先验证库存和销量是否脱节。',first:'记7天进卖剩',second:'找积压商品',pause:'先别继续加货',data:['进货量','卖出量','剩余量']};
      else if(a.signal==='客人越来越少') r={problem:'客流先变差',reason:'先把每天进店和成交记下来，确认是客流问题还是成交问题。',first:'记7天进店和成交',second:'再看客源',pause:'先别急着改全店',data:['进店人数','成交单数','客源']};
      else if(a.signal==='很忙没利润') r={problem:'利润先看不清',reason:'忙不代表赚钱，先把销售、成本和损耗放到一张表里。',first:'记7天收入成本',second:'找最大漏点',pause:'先别增加工作量',data:['营业额','采购成本','损耗']};
      else r={problem:'经营看不清',reason:'现在还没有足够证据判断哪一环最差，先用7天最小记录把问题逼出来。',first:'记7天关键数字',second:'找最大异常',pause:'先别上复杂系统',data:['营业额','订单数','缺货','损耗']};
    }
    return {...r,days:7,item:a.item||'',business:(BUSINESS[state.business]||BUSINESS.other).label};
  }

  function observeFields(state,diagnosis){
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
    const n=rows.length||1;
    const sum=id=>rows.reduce((t,r)=>t+(parseFloat(r.values[id])||0),0);
    let lines=[];
    if(state.symptom==='waste'){
      const incoming=sum('in'),sold=sum('sold'),left=sum('left'),loss=sum('loss');
      if(incoming>0) lines.push(`7天卖出约 ${Math.round(sold/incoming*100)}% 的进货量`);
      if(loss>0) lines.push(`累计报损 ${loss}`);
      if(left>0) lines.push(`累计剩余 ${left}`);
    }else if(state.symptom==='stockout'){
      lines.push(`7天缺货询问 ${sum('miss')} 次`);
    }else if(state.symptom==='traffic'){
      const v=sum('visitors'),o=sum('orders');
      if(v>0) lines.push(`进店到成交约 ${Math.round(o/v*100)}%`);
      lines.push(`累计进店 ${v} 人`);
    }else if(state.symptom==='basket'){
      const o=sum('orders'),rev=sum('revenue');
      if(o>0) lines.push(`平均客单约 ${Math.round(rev/o)}`);
    }else if(state.symptom==='repeat'){
      const c=sum('contacted'),r=sum('returned');
      if(c>0) lines.push(`联系后回店约 ${Math.round(r/c*100)}%`);
      lines.push(`7天老客单 ${sum('old')} 单`);
    }else if(state.symptom==='profit'){
      const rev=sum('revenue'),p=sum('purchase'),loss=sum('loss');
      if(rev>0) lines.push(`进货+损耗约占营业额 ${Math.round((p+loss)/rev*100)}%`);
    }else{
      const rev=sum('revenue'),o=sum('orders');
      if(o>0) lines.push(`平均客单约 ${Math.round(rev/o)}`);
      lines.push(`7天缺货 ${sum('stockout')} 次`);
    }
    return lines.filter(Boolean).slice(0,3);
  }

  window.BossSkill={BUSINESS,SYMPTOMS,nextQuestion,optionsFor,result,observeFields,summarize};
})();
