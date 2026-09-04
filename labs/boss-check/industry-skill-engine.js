(function(){
  const VERSION='0.4.0';

  const BUSINESS={
    fresh:{label:'农副生鲜'},
    food:{label:'餐饮'},
    gym:{label:'健身房'},
    beauty:{label:'美容美业'},
    pet:{label:'宠物店'},
    service:{label:'本地服务'},
    other:{label:'其他生意'}
  };

  const INDUSTRIES={
    fresh:{
      symptoms:[
        ['traffic','客人少'],['basket','买得少'],['stockout','总缺货'],
        ['waste','总剩货'],['repeat','老客少'],['profit','不赚钱'],['unclear','说不清']
      ],
      q:{
        traffic:[
          q('source','主要怎么来客？',['路过','老客带来','短视频','微信群','团购平台','没固定来源']),
          q('trackSource','知道客从哪来？',['清楚','大概知道','不知道']),
          q('trackConversion','知道哪路客会买？',['知道','不知道'])
        ],
        basket:[
          q('buyPattern','通常买几样？',['一两样','会多买','看价格','不清楚']),
          q('bundles','有固定搭配？',['有','没有']),
          q('recommend','会主动推荐？',['经常','偶尔','基本不会'])
        ],
        stockout:[
          q('item','最常缺什么？',['蔬菜','水果','蛋奶','肉类','粮油','其他']),
          q('replenish','怎么决定进多少？',['凭经验','看昨天','看库存','供应商建议','系统建议']),
          q('stockoutLog','缺货会记录？',['会','不会'])
        ],
        waste:[
          q('item','剩得最多？',['蔬菜','水果','蛋奶','肉类','粮油','其他']),
          q('replenish','怎么决定进多少？',['凭经验','看昨天','看库存','供应商建议','系统建议']),
          q('leftoverLog','每天记剩多少？',['会','偶尔','不会']),
          q('dispose','卖不完怎么办？',['第二天卖','打折','送人','扔掉','看情况'])
        ],
        repeat:[
          q('contact','有老客联系方式？',['大部分有','少部分有','基本没有']),
          q('cycle','知道多久会再来？',['大概知道','不知道']),
          q('lastVisit','能看到上次消费？',['能','不能','不知道'])
        ],
        profit:[
          q('margin','知道哪些最赚钱？',['知道','大概知道','不知道']),
          q('lossLog','会记损耗？',['每天记','偶尔记','不记']),
          q('fixedCost','知道固定成本？',['清楚','大概知道','不知道'])
        ],
        unclear:[
          q('signal','最近最明显？',['营业额下降','货越囤越多','很忙没利润','客人越来越少','都不明显']),
          q('dailyData','每天看数据？',['会','偶尔','基本不看']),
          q('records','能拿出7天记录？',['能','不能','不知道'])
        ]
      }
    },

    food:{
      symptoms:[
        ['traffic','客人少'],['seat','上座低'],['ticket','客单低'],
        ['turnover','翻台慢'],['repeat','回头客少'],['delivery','外卖差'],
        ['profit','不赚钱'],['unclear','说不清']
      ],
      q:{
        traffic:[
          q('source','主要怎么来客？',['路过','点评团购','短视频','老客','外卖平台','说不清']),
          q('peak','哪个时段最差？',['午餐','晚餐','全天','工作日','周末']),
          q('track','会记进店人数？',['会','不会'])
        ],
        seat:[
          q('emptyTime','空桌最多？',['午餐','晚餐','全天','工作日','周末']),
          q('walkin','进门后会走？',['经常','偶尔','很少','不知道']),
          q('wait','需要排队吗？',['经常','偶尔','很少'])
        ],
        ticket:[
          q('order','客人常点？',['单品为主','套餐为主','多人分享','不清楚']),
          q('add','会加点吗？',['经常','偶尔','很少']),
          q('recommend','服务员会推荐？',['经常','偶尔','基本不会'])
        ],
        turnover:[
          q('slow','慢在哪？',['等位','点单','出餐','吃得久','收台']),
          q('time','知道平均多久一桌？',['知道','大概知道','不知道']),
          q('bottleneck','高峰会卡单？',['经常','偶尔','很少'])
        ],
        repeat:[
          q('identify','认得老客吗？',['大部分','一部分','基本认不出']),
          q('contact','留过联系方式？',['大部分有','少部分有','基本没有']),
          q('cycle','知道多久再来？',['大概知道','不知道'])
        ],
        delivery:[
          q('platform','主要平台？',['美团','饿了么','抖音','多个平台','没做外卖']),
          q('issue','最差在哪？',['曝光少','进店少','下单少','差评多','利润低','说不清']),
          q('rank','会看商品排名？',['会','偶尔','不会'])
        ],
        profit:[
          q('foodCost','知道菜品成本？',['清楚','大概知道','不知道']),
          q('waste','每天会报损？',['会','偶尔','不会']),
          q('gross','知道哪些菜最赚钱？',['知道','大概知道','不知道'])
        ],
        unclear:[
          q('signal','最近最明显？',['客人变少','空桌变多','客单变低','外卖变差','忙但没钱','都不明显']),
          q('daily','每天看哪几个数？',['营业额','桌数','客单','外卖','基本不看']),
          q('records','有7天记录？',['有','没有','不知道'])
        ]
      }
    },

    gym:{
      symptoms:[
        ['leads','线索少'],['arrival','到店少'],['trial','体验不成交'],
        ['pt','私教卖不动'],['attendance','会员不来'],['renewal','续费低'],
        ['capacity','教练排不满'],['profit','不赚钱'],['unclear','说不清']
      ],
      q:{
        leads:[
          q('source','线索从哪来？',['抖音','美团点评','地推','转介绍','私域','没固定来源']),
          q('weekly','一周大概多少？',['0-10','11-30','31-60','60以上','不知道']),
          q('cost','知道每条线索成本？',['知道','大概知道','不知道'])
        ],
        arrival:[
          q('book','有人预约吗？',['很多','一般','很少']),
          q('show','预约后会来吗？',['大部分来','一半左右','经常不来','不知道']),
          q('follow','未到店会跟进？',['当天','隔天','偶尔','基本不跟'])
        ],
        trial:[
          q('close','体验后成交？',['大部分','一半左右','少数','不知道']),
          q('objection','最常卡在哪？',['价格','没时间','没需求','教练信任','再考虑','说不清']),
          q('follow','体验后会再跟？',['当天','1-3天','偶尔','基本不跟'])
        ],
        pt:[
          q('target','主要卖给谁？',['新会员','老会员','都有','说不清']),
          q('pitch','什么时候提私教？',['入会时','体测后','训练后','随机','很少提']),
          q('close','私教成交大概？',['高','一般','低','不知道'])
        ],
        attendance:[
          q('inactive','多久不来算沉默？',['7天','14天','30天','没有标准']),
          q('alert','有人提醒吗？',['自动提醒','人工提醒','偶尔','没人管']),
          q('reason','最常为什么不来？',['没时间','没动力','体验不好','离得远','不知道'])
        ],
        renewal:[
          q('window','提前多久谈续费？',['30天','14天','快到期','到期后','没有固定']),
          q('owner','谁负责续费？',['会籍','教练','店长','没人固定']),
          q('rate','知道续费率？',['知道','大概知道','不知道'])
        ],
        capacity:[
          q('schedule','教练排课饱和？',['很满','一般','很空','两极分化']),
          q('util','会看教练利用率？',['会','偶尔','不会']),
          q('gap','空档最多？',['上午','下午','晚间','工作日','周末'])
        ],
        profit:[
          q('revenueMix','收入主要靠？',['会籍','私教','团课','综合','说不清']),
          q('coachCost','知道教练人效？',['知道','大概知道','不知道']),
          q('fixed','知道保本营业额？',['知道','大概知道','不知道'])
        ],
        unclear:[
          q('signal','最近最明显？',['线索变少','预约不来','体验不买','会员不来','续费变低','忙但没钱','都不明显']),
          q('funnel','会看转化链？',['会','看一点','基本不看']),
          q('records','能拿出7天数据？',['能','不能','不知道'])
        ]
      }
    },

    beauty:{
      symptoms:[
        ['leads','新客少'],['arrival','预约不来'],['trial','体验不转卡'],
        ['ticket','客单低'],['repeat','复购低'],['capacity','技师排不满'],
        ['renewal','卡项续费低'],['profit','不赚钱'],['unclear','说不清']
      ],
      q:{
        leads:[q('source','新客从哪来？',['小红书','抖音','美团点评','转介绍','私域','没固定来源']),q('weekly','一周新客多少？',['0-10','11-30','31-60','60以上','不知道']),q('cost','知道获客成本？',['知道','大概知道','不知道'])],
        arrival:[q('book','预约多吗？',['多','一般','少']),q('show','预约后会来？',['大部分','一半左右','经常不来','不知道']),q('remind','到店前会提醒？',['自动','人工','偶尔','不提醒'])],
        trial:[q('close','体验后办卡？',['大部分','一半左右','少数','不知道']),q('objection','最常卡在哪？',['价格','效果','信任','时间','再考虑','说不清']),q('follow','未成交会跟？',['当天','1-3天','偶尔','基本不跟'])],
        ticket:[q('mix','主要卖什么？',['单次项目','疗程卡','年卡','产品','综合']),q('upgrade','会做项目升级？',['经常','偶尔','基本不会']),q('bundle','有固定组合？',['有','没有'])],
        repeat:[q('cycle','知道复购周期？',['知道','大概知道','不知道']),q('last','能看到上次到店？',['能','不能','不知道']),q('recall','到期会提醒？',['自动','人工','偶尔','不提醒'])],
        capacity:[q('schedule','技师排班？',['很满','一般','很空','两极分化']),q('util','会看利用率？',['会','偶尔','不会']),q('gap','空档最多？',['上午','下午','晚间','工作日','周末'])],
        renewal:[q('window','提前多久续卡？',['30天','14天','快用完','用完后','没固定']),q('owner','谁负责？',['顾问','技师','店长','没人固定']),q('rate','知道续卡率？',['知道','大概知道','不知道'])],
        profit:[q('projectMargin','知道项目毛利？',['知道','大概知道','不知道']),q('labor','知道技师人效？',['知道','大概知道','不知道']),q('fixed','知道保本营业额？',['知道','大概知道','不知道'])],
        unclear:[q('signal','最近最明显？',['新客少','预约爽约','体验不买','老客不来','技师很空','忙但没钱','都不明显']),q('data','每天看数据？',['会','看一点','基本不看']),q('records','有7天记录？',['有','没有','不知道'])]
      }
    },

    pet:{
      symptoms:[['leads','新客少'],['conversion','到店不买'],['groomRepeat','洗护复购低'],['boarding','寄养空档多'],['ticket','客单低'],['retail','商品压货'],['repeat','老客少'],['profit','不赚钱'],['unclear','说不清']],
      q:{
        leads:[q('source','新客从哪来？',['路过','小红书','抖音','美团点评','转介绍','私域','没固定来源']),q('weekly','一周新客？',['0-10','11-30','31-60','60以上','不知道']),q('cost','知道获客成本？',['知道','大概知道','不知道'])],
        conversion:[q('need','来店主要为了？',['洗护','寄养','买粮','用品','咨询','综合']),q('buy','进店后成交？',['大部分','一半左右','少数','不知道']),q('objection','最常卡在哪？',['价格','品类','信任','距离','再考虑','说不清'])],
        groomRepeat:[q('cycle','知道洗护周期？',['知道','大概知道','不知道']),q('last','能看到上次洗护？',['能','不能','不知道']),q('remind','到期会提醒？',['自动','人工','偶尔','不提醒'])],
        boarding:[q('empty','空档最多？',['工作日','周末','节假日前','淡季','说不清']),q('book','提前预约多吗？',['多','一般','少']),q('source','寄养客从哪来？',['老客','平台','转介绍','路过','说不清'])],
        ticket:[q('mix','主要收入？',['洗护','寄养','商品','综合']),q('add','会带购商品？',['经常','偶尔','基本不会']),q('bundle','有组合套餐？',['有','没有'])],
        retail:[q('item','最压什么？',['主粮','零食','用品','保健品','其他']),q('buy','怎么决定进多少？',['凭经验','看销量','供应商建议','系统建议']),q('age','会看库存天数？',['会','偶尔','不会'])],
        repeat:[q('contact','有老客联系方式？',['大部分有','少部分有','基本没有']),q('last','能看最近消费？',['能','不能','不知道']),q('recall','会主动召回？',['经常','偶尔','基本不会'])],
        profit:[q('mix','知道哪块最赚钱？',['知道','大概知道','不知道']),q('labor','知道洗护人效？',['知道','大概知道','不知道']),q('fixed','知道保本营业额？',['知道','大概知道','不知道'])],
        unclear:[q('signal','最近最明显？',['新客少','洗护不复购','寄养空','商品压货','客单低','忙但没钱','都不明显']),q('data','每天看数据？',['会','看一点','基本不看']),q('records','有7天记录？',['有','没有','不知道'])]
      }
    },

    service:{
      symptoms:[['leads','咨询少'],['booking','预约少'],['conversion','成交低'],['ticket','客单低'],['repeat','复购低'],['delivery','交付太忙'],['capacity','人效低'],['profit','不赚钱'],['unclear','说不清']],
      q:{
        leads:[q('source','咨询从哪来？',['短视频','小红书','搜索','转介绍','私域','线下','没固定来源']),q('weekly','一周咨询？',['0-10','11-30','31-60','60以上','不知道']),q('cost','知道获客成本？',['知道','大概知道','不知道'])],
        booking:[q('contact','咨询后会预约？',['大部分','一半左右','少数','不知道']),q('response','多久回复客户？',['5分钟内','30分钟内','当天','经常更久']),q('follow','没预约会跟进？',['当天','1-3天','偶尔','基本不跟'])],
        conversion:[q('close','报价后成交？',['大部分','一半左右','少数','不知道']),q('objection','最常卡在哪？',['价格','信任','周期','方案','再考虑','说不清']),q('follow','报价后会跟？',['当天','1-3天','偶尔','基本不跟'])],
        ticket:[q('offer','主要卖什么？',['单次服务','套餐','长期服务','项目制','综合']),q('upgrade','会升级方案？',['经常','偶尔','基本不会']),q('bundle','有清晰套餐？',['有','没有'])],
        repeat:[q('cycle','知道复购周期？',['知道','大概知道','不知道']),q('last','能看最近服务？',['能','不能','不知道']),q('recall','会主动召回？',['经常','偶尔','基本不会'])],
        delivery:[q('bottleneck','最忙在哪？',['沟通','排期','执行','返工','售后']),q('repeatWork','重复工作多吗？',['很多','一般','少']),q('standard','有标准流程？',['有','一部分','没有'])],
        capacity:[q('util','团队忙闲差异？',['很大','一般','不大','不知道']),q('output','会看人均产出？',['会','偶尔','不会']),q('gap','最常浪费在哪？',['等客户','重复沟通','返工','排期','说不清'])],
        profit:[q('margin','知道每单毛利？',['知道','大概知道','不知道']),q('labor','会算人工时间？',['会','偶尔','不会']),q('fixed','知道保本营业额？',['知道','大概知道','不知道'])],
        unclear:[q('signal','最近最明显？',['咨询变少','预约变少','成交变低','交付很忙','复购变低','忙但没钱','都不明显']),q('data','每天看数据？',['会','看一点','基本不看']),q('records','有7天记录？',['有','没有','不知道'])]
      }
    },

    other:{
      symptoms:[['traffic','客户少'],['conversion','成交低'],['ticket','客单低'],['repeat','复购低'],['capacity','人效低'],['profit','不赚钱'],['unclear','说不清']],
      q:{
        traffic:[q('source','客户从哪来？',['线上','线下','转介绍','私域','没固定来源']),q('track','知道哪个来源会成交？',['知道','大概知道','不知道'])],
        conversion:[q('close','咨询后成交？',['大部分','一半左右','少数','不知道']),q('objection','最常卡在哪？',['价格','信任','需求','时机','说不清'])],
        ticket:[q('offer','主要卖什么？',['单品','套餐','长期服务','综合']),q('upgrade','会做升级？',['经常','偶尔','基本不会'])],
        repeat:[q('cycle','知道复购周期？',['知道','大概知道','不知道']),q('recall','会主动召回？',['经常','偶尔','基本不会'])],
        capacity:[q('util','团队忙闲？',['很满','一般','很空','两极分化']),q('output','会看人均产出？',['会','偶尔','不会'])],
        profit:[q('margin','知道毛利？',['知道','大概知道','不知道']),q('fixed','知道固定成本？',['知道','大概知道','不知道'])],
        unclear:[q('signal','最近最明显？',['客户少','成交低','复购低','团队很忙','忙但没钱','都不明显']),q('records','有7天记录？',['有','没有','不知道'])]
      }
    }
  };

  function q(id,title,options){return {id,title,options};}
  function symptomsFor(business){const x=INDUSTRIES[business]||INDUSTRIES.other;return x.symptoms.map(([id,label])=>({id,label}));}
  function allSymptoms(){const map=new Map();Object.values(INDUSTRIES).forEach(i=>i.symptoms.forEach(([id,label])=>{if(!map.has(id))map.set(id,{id,label});}));return [...map.values()];}

  const LANGUAGE={
    fresh:{traffic:['没客','客人少','客流少','进店少'],basket:['买得少','客单低','加购少'],stockout:['缺货','断货','卖完','不够卖'],waste:['剩货','卖不完','坏掉','损耗','积压'],repeat:['老客少','不复购','不回来'],profit:['不赚钱','利润低','毛利低','亏钱']},
    food:{traffic:['客人少','没客','客流少'],seat:['空桌','上座低','没人坐'],ticket:['客单低','点得少','加点少'],turnover:['翻台慢','出餐慢','等位久','收台慢'],repeat:['回头客少','不复购','不回来'],delivery:['外卖差','外卖少','曝光少','下单少','差评'],profit:['不赚钱','毛利低','成本高','亏钱']},
    gym:{leads:['线索少','咨询少','没线索','获客少'],arrival:['不到店','爽约','预约不来','到店少'],trial:['体验不成交','体验课不买','体验后不买','体验课','办卡少','办卡','转卡'],pt:['私教卖不动','私教少','PT少'],attendance:['会员不来','出勤低','活跃低','沉默会员'],renewal:['续费低','不续费','续卡少','续课少'],capacity:['教练排不满','教练很闲','空课多','课时少'],profit:['不赚钱','利润低','亏钱','人效低']},
    beauty:{leads:['新客少','获客少','咨询少'],arrival:['预约不来','爽约','到店少'],trial:['体验不转卡','体验后不办卡','体验不成交','办卡少','转卡少','体验后'],ticket:['客单低','项目少','升单少'],repeat:['复购低','老客不来','回店少'],capacity:['技师排不满','技师很闲','空档多'],renewal:['续卡低','卡项续费低','不续卡'],profit:['不赚钱','利润低','亏钱']},
    pet:{leads:['新客少','获客少'],conversion:['到店不买','成交低'],groomRepeat:['洗护复购低','洗澡不回来','美容不复购'],boarding:['寄养空','寄养少','空档多'],ticket:['客单低','买得少'],retail:['压货','库存多','商品卖不动'],repeat:['老客少','不回来'],profit:['不赚钱','利润低','亏钱']},
    service:{leads:['咨询少','线索少','获客少'],booking:['预约少','不预约','咨询不留'],conversion:['成交低','报价不成交','签单低'],ticket:['客单低','报价低'],repeat:['复购低','老客少'],delivery:['交付太忙','做不过来','返工多','沟通多'],capacity:['人效低','团队很闲','忙闲不均'],profit:['不赚钱','利润低','亏钱']},
    other:{traffic:['客户少','没客户'],conversion:['成交低','不成交'],ticket:['客单低'],repeat:['复购低','老客少'],capacity:['人效低','团队很闲'],profit:['不赚钱','利润低','亏钱']}
  };

  function classifyText(text,business){const t=(text||'').trim();const dict=LANGUAGE[business]||LANGUAGE.other;const scores={};Object.entries(dict).forEach(([id,words])=>{scores[id]=0;words.forEach(w=>{if(t.includes(w))scores[id]+=w.length>=4?2:1;});});const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const top=ranked[0]||['unclear',0],second=ranked[1]||[null,0];return{symptom:top[1]>0?top[0]:'unclear',secondary:second[1]>0&&second[1]>=top[1]*0.6?second[0]:null,confidence:top[1]>=3?'较强':top[1]>=1?'一般':'不足',scores,text:t};}
  function nextQuestion(state){const industry=INDUSTRIES[state.business]||INDUSTRIES.other;const qs=industry.q[state.symptom]||industry.q.unclear||[];return qs.find(x=>state.answers[x.id]===undefined)||null;}
  function optionsFor(q){return q.options;}
  function R(problem,reason,first,second,pause,metric,experiment){return{problem,reason,first,second,pause,metric,experiment};}

  const RESULTS={
    'fresh:traffic':R('客流来源看不清','先知道现有客人从哪里来，再谈投放。','记7天客源和成交','找成交最好的来源','先别盲目投广告','来源成交率','30天只放大一个高成交来源'),
    'fresh:basket':R('连带购买太弱','已有客流没有变成更多购买。','记7天订单组合','做3组自然搭配','先别继续扩品','客单价','30天只测试3组高频搭配'),
    'fresh:stockout':R('补货判断偏低','缺货需要进入下一次补货决策，而不是只靠记忆。','记7天缺货','找高频缺货品','先别全店加量','缺货次数','只调整最常缺货的3个商品'),
    'fresh:waste':R('库存损耗偏高','先把进、卖、剩、坏看清楚。','记7天进卖剩坏','找高损耗商品','先别继续加货','损耗率','只下调高损耗商品的补货量'),
    'fresh:repeat':R('复购周期看不清','有老客，但不知道谁该什么时候回来。','记最近消费','找常见回购周期','先别群发优惠','复购率','只对到期老客做定向提醒'),
    'fresh:profit':R('利润结构看不清','营业额不等于利润，先拆商品毛利和损耗。','算Top20商品毛利','叠加损耗','先别只追营业额','毛利率','清理低毛利高损耗商品'),

    'food:traffic':R('有效客流不足','先看哪个渠道真正把人带进店。','记7天客源','看来源到店','先别平均投钱','有效到店','只放大最好的一种来客方式'),
    'food:seat':R('上座率偏低','空桌要先区分是没人来，还是来了没坐下。','记7天桌数和进店','找最差时段','先别急着打折','上座率','只优化最差的一个时段'),
    'food:ticket':R('客单偏低','先看客人少点了什么，而不是继续加菜。','记7天桌均消费','找高频加点','先别乱做套餐','桌均消费','测试3组自然加点'),
    'food:turnover':R('翻台瓶颈','翻台慢通常卡在一个环节，不是整家店都慢。','记7天桌时长','找到最慢环节','先别全面提速','平均桌时长','只改一个最慢环节'),
    'food:repeat':R('回头客机制弱','先知道谁多久没来，再谈会员营销。','记老客最近到店','找回店周期','先别群发券','回头率','按周期召回一批老客'),
    'food:delivery':R('外卖漏点不清','先区分曝光、进店、下单还是利润的问题。','记7天平台漏斗','找最大掉点','先别全店降价','下单转化','只修最大掉点'),
    'food:profit':R('菜品利润看不清','先把菜品成本、报损和销量放在一起。','算Top20菜品毛利','叠加报损','先别只追流水','菜品毛利率','下架或改造低毛利高损耗菜'),

    'gym:leads':R('线索不足','健身房先解决有没有人进入销售漏斗，不是库存。','记7天线索来源','看每条线索成本','先别盲目投流','有效线索数','只放大一个高质量线索渠道'),
    'gym:arrival':R('预约到店率低','有人留资但不来店，问题在预约到到店这一段。','记7天预约和到店','找爽约原因','先别继续买更多线索','预约到店率','重做预约确认和未到店跟进'),
    'gym:trial':R('体验成交率低','人已经到店，先修体验到成交，而不是继续获客。','记7天体验和成交','统计拒绝原因','先别加大投放','体验成交率','只改体验后成交话术与跟进'),
    'gym:pt':R('私教转化弱','会籍成交不代表私教成交，先看私教触发和转化。','记7天私教推荐','找高转化触发点','先别硬推所有会员','私教转化率','只在高意向节点触发私教推荐'),
    'gym:attendance':R('会员活跃度低','会员不来是续费前最大的预警。','标记7/14/30天未到店','做分层召回','先别群发促销','活跃会员率','召回一批14天未到店会员'),
    'gym:renewal':R('续费窗口失控','续费不是到期那天才发生。','记录到期前30天会员','固定续费负责人','先别等到期再追','续费率','建立30/14/7天续费节奏'),
    'gym:capacity':R('教练产能利用低','教练有空档就意味着固定成本没有转成收入。','记7天教练排课','找空档时段','先别继续招教练','教练利用率','只填补一个最大空档时段'),
    'gym:profit':R('收入结构或人效失衡','先拆会籍、私教和教练成本，再看利润。','记7天收入结构','算教练人效','先别只看总流水','人均产出','优化最低产出的一个环节'),

    'beauty:leads':R('新客不足','先确认哪种渠道能带来真实新客。','记7天新客来源','看获客成本','先别平均投钱','有效新客数','只放大一个高质量渠道'),
    'beauty:arrival':R('预约到店率低','预约不来会直接浪费顾问和技师产能。','记7天预约和到店','找爽约原因','先别继续买线索','预约到店率','优化到店前提醒'),
    'beauty:trial':R('体验转卡率低','新客已经进店，先修体验到办卡。','记7天体验和办卡','统计拒绝原因','先别加大获客','体验转卡率','只改体验后的成交动作'),
    'beauty:ticket':R('客单提升不足','先看项目升级是否自然发生。','记7天项目组合','找高接受升级','先别堆套餐','客单价','只测试3组项目升级'),
    'beauty:repeat':R('复购周期失控','老客复购靠周期，不靠想起来再联系。','记最近到店','找复购周期','先别群发券','复购率','按周期召回老客'),
    'beauty:capacity':R('技师产能利用低','空档多意味着人工成本没有转成服务收入。','记7天排班','找最大空档','先别继续扩人','技师利用率','填补一个最大空档时段'),
    'beauty:renewal':R('续卡节奏失控','卡快用完时才追，通常已经太晚。','记录卡项剩余','固定续卡节点','先别等用完再追','续卡率','建立30/14/7天续卡节奏'),
    'beauty:profit':R('项目利润或人效失衡','先拆项目毛利与技师产出。','算Top项目毛利','看技师人效','先别只看流水','项目毛利率','优化最低利润的一个项目'),

    'pet:leads':R('新客不足','先确认哪种渠道能带来真实宠物主。','记7天新客来源','看获客成本','先别平均投钱','有效新客数','只放大一个高质量渠道'),
    'pet:conversion':R('到店成交弱','客人已经进店，先看需求有没有被接住。','记7天进店和成交','统计拒绝原因','先别继续拉新','到店成交率','只修一个最大拒绝原因'),
    'pet:groomRepeat':R('洗护复购周期失控','洗护天然有周期，错过提醒就等于把老客送走。','记最近洗护时间','找复购周期','先别群发消息','洗护复购率','按周期提醒一批老客'),
    'pet:boarding':R('寄养产能空置','寄养是时段型产能，先找空档而不是泛促销。','记7天/节假日预订','找最大空档','先别全面降价','寄养入住率','只填一个最大空档'),
    'pet:ticket':R('客单偏低','先看服务和商品是否自然连带。','记7天订单组合','找高频搭配','先别硬推商品','客单价','测试3组服务+商品搭配'),
    'pet:retail':R('商品库存周转慢','宠物店有库存，但它只属于商品零售这条业务线。','记7天销量和库存天数','找高龄库存','先别继续压货','库存周转天数','清理最慢的3类库存'),
    'pet:repeat':R('老客召回不足','先知道谁多久没来。','记最近消费','找回店周期','先别群发券','老客回店率','按周期召回一批老客'),
    'pet:profit':R('业务结构利润不清','洗护、寄养和商品的利润逻辑不同。','拆三类收入毛利','看人效','先别只看总流水','综合毛利率','优化最低利润的一条业务线'),

    'service:leads':R('咨询不足','先看谁真正带来有效咨询。','记7天咨询来源','看有效咨询','先别平均投钱','有效咨询数','只放大一个高质量来源'),
    'service:booking':R('咨询到预约弱','客户有兴趣但没进入下一步。','记7天咨询和预约','找失约点','先别继续拉更多线索','咨询预约率','优化首次回复与跟进'),
    'service:conversion':R('报价成交弱','报价后不成交才是当前漏点。','记7天报价和成交','统计拒绝原因','先别降价','报价成交率','只修一个最大拒绝原因'),
    'service:ticket':R('客单偏低','先看服务方案是否有清晰层级。','记7天成交方案','找升级节点','先别堆套餐','客单价','测试一个清晰升级方案'),
    'service:repeat':R('复购召回弱','先知道客户什么时候再次需要服务。','记最近服务','找复购周期','先别群发优惠','复购率','按周期召回一批客户'),
    'service:delivery':R('交付瓶颈','忙不一定是单多，可能是重复沟通和返工。','记7天工时去向','找最大重复工作','先别继续堆人','有效交付工时','自动化一个最高频重复动作'),
    'service:capacity':R('人效分配失衡','忙闲不均说明任务没有匹配到产能。','记7天人均产出','找最大空档','先别急着招人','人均产出','重排一个低效环节'),
    'service:profit':R('单笔利润看不清','服务业最容易漏掉人工时间成本。','算7天单笔毛利','叠加工时','先别只看收入','单笔毛利率','优化最低毛利的一类订单')
  };

  function evidence(state){const n=Object.keys(state.answers||{}).length;return n>=3?{level:'较强'}:n>=2?{level:'一般'}:{level:'不足'};}
  function result(state){const r=RESULTS[state.business+':'+state.symptom]||R('经营问题还没看清','当前证据不足，先用7天最小记录把问题逼出来。','记7天关键数字','找最大异常','先别上复杂系统','关键转化率','只改一个最大漏点');return{...r,evidence:evidence(state),secondary:state.secondarySymptom||null,business:BUSINESS[state.business]?.label||'其他生意'};}

  function N(id,label){return{id,label,type:'number'};}function T(id,label){return{id,label,type:'text'};}
  const FIELDS={
    fresh:{traffic:[N('visitors','进店'),N('orders','成交'),T('source','主要客源')],basket:[N('orders','订单'),N('revenue','营业额'),T('combo','常见搭配')],stockout:[N('miss','缺货次数'),T('item','缺什么'),T('time','几点卖完')],waste:[N('in','进'),N('sold','卖'),N('left','剩'),N('loss','坏')],repeat:[N('old','老客单'),N('returned','回购'),N('contacted','联系老客')],profit:[N('revenue','营业额'),N('cost','进货成本'),N('loss','损耗')]},
    food:{traffic:[N('visitors','进店'),N('tables','开桌'),T('source','主要客源')],seat:[N('tables','开桌'),N('available','可用桌'),T('worst','最空时段')],ticket:[N('tables','桌数'),N('revenue','营业额'),N('add','加点桌数')],turnover:[N('tables','桌数'),N('minutes','平均桌时'),T('slow','最慢环节')],repeat:[N('old','老客桌'),N('total','总桌数'),N('recalled','召回到店')],delivery:[N('views','曝光'),N('visits','进店'),N('orders','下单')],profit:[N('revenue','营业额'),N('foodCost','食材成本'),N('loss','报损')]},
    gym:{leads:[N('leads','线索'),N('qualified','有效线索'),N('spend','获客花费')],arrival:[N('booked','预约'),N('arrived','到店'),N('noShow','爽约')],trial:[N('trial','体验'),N('closed','成交'),N('follow','跟进')],pt:[N('pitched','私教推荐'),N('closed','私教成交'),N('revenue','私教收入')],attendance:[N('active','到店会员'),N('inactive','14天未到店'),N('recalled','召回到店')],renewal:[N('due','临期会员'),N('renewed','续费'),N('contacted','已跟进')],capacity:[N('available','可排课时'),N('booked','已排课时'),N('revenue','课时收入')],profit:[N('revenue','营业额'),N('coachCost','教练成本'),N('fixed','固定成本')]},
    beauty:{leads:[N('leads','新客线索'),N('arrived','新客到店'),N('spend','获客花费')],arrival:[N('booked','预约'),N('arrived','到店'),N('noShow','爽约')],trial:[N('trial','体验'),N('card','办卡'),N('follow','跟进')],ticket:[N('orders','订单'),N('revenue','营业额'),N('upgrade','升单')],repeat:[N('due','到期老客'),N('returned','回店'),N('contacted','提醒')],capacity:[N('available','可服务时段'),N('booked','已预约时段'),N('revenue','服务收入')],renewal:[N('due','临期卡'),N('renewed','续卡'),N('contacted','已跟进')],profit:[N('revenue','营业额'),N('material','耗材成本'),N('labor','人工成本')]},
    pet:{leads:[N('leads','新客'),N('arrived','到店'),N('spend','获客花费')],conversion:[N('visitors','到店'),N('orders','成交'),T('reason','未成交原因')],groomRepeat:[N('due','到期洗护'),N('returned','复购'),N('contacted','提醒')],boarding:[N('capacity','可寄养位'),N('occupied','已入住'),N('inquiries','寄养咨询')],ticket:[N('orders','订单'),N('revenue','营业额'),N('bundle','连带购买')],retail:[N('sales','商品销售'),N('stock','期末库存'),N('old','高龄库存')],repeat:[N('old','老客到店'),N('total','总订单'),N('recalled','召回')],profit:[N('revenue','营业额'),N('labor','人工'),N('goods','商品成本')]},
    service:{leads:[N('leads','咨询'),N('qualified','有效咨询'),N('spend','获客花费')],booking:[N('inquiries','咨询'),N('booked','预约'),N('follow','跟进')],conversion:[N('quotes','报价'),N('closed','成交'),N('follow','跟进')],ticket:[N('orders','成交单'),N('revenue','营业额'),N('upgrade','升级单')],repeat:[N('due','到期客户'),N('returned','复购'),N('contacted','召回')],delivery:[N('hours','总工时'),N('rework','返工工时'),N('repeat','重复工时')],capacity:[N('hours','可用工时'),N('billable','有效工时'),N('revenue','收入')],profit:[N('revenue','营业额'),N('labor','人工成本'),N('other','其他成本')]}
  };
  function observeFields(state){return FIELDS[state.business]?.[state.symptom]||[N('revenue','营业额'),N('orders','订单'),T('note','异常')];}
  function summarize(state,rows){const sum=id=>rows.reduce((t,r)=>t+(parseFloat(r.values[id])||0),0);const ratio=(a,b)=>b>0?Math.round(a/b*100):null;const k=state.business+':'+state.symptom;let lines=[];const f={
    'gym:arrival':()=>{const x=ratio(sum('arrived'),sum('booked'));if(x!==null)lines.push(`预约到店率约 ${x}%`);lines.push(`7天爽约 ${sum('noShow')} 人`);},
    'gym:trial':()=>{const x=ratio(sum('closed'),sum('trial'));if(x!==null)lines.push(`体验成交率约 ${x}%`);},
    'gym:pt':()=>{const x=ratio(sum('closed'),sum('pitched'));if(x!==null)lines.push(`私教转化率约 ${x}%`);},
    'gym:renewal':()=>{const x=ratio(sum('renewed'),sum('due'));if(x!==null)lines.push(`续费率约 ${x}%`);},
    'gym:capacity':()=>{const x=ratio(sum('booked'),sum('available'));if(x!==null)lines.push(`教练利用率约 ${x}%`);},
    'beauty:trial':()=>{const x=ratio(sum('card'),sum('trial'));if(x!==null)lines.push(`体验转卡率约 ${x}%`);},
    'beauty:renewal':()=>{const x=ratio(sum('renewed'),sum('due'));if(x!==null)lines.push(`续卡率约 ${x}%`);},
    'food:ticket':()=>{const t=sum('tables');if(t)lines.push(`桌均消费约 ${Math.round(sum('revenue')/t)}`);},
    'food:delivery':()=>{const x=ratio(sum('orders'),sum('visits'));if(x!==null)lines.push(`外卖进店下单率约 ${x}%`);},
    'fresh:waste':()=>{const incoming=sum('in');if(incoming)lines.push(`卖出约占进货 ${ratio(sum('sold'),incoming)}%`);lines.push(`累计报损 ${sum('loss')}`);},
    'pet:groomRepeat':()=>{const x=ratio(sum('returned'),sum('due'));if(x!==null)lines.push(`洗护复购率约 ${x}%`);},
    'service:conversion':()=>{const x=ratio(sum('closed'),sum('quotes'));if(x!==null)lines.push(`报价成交率约 ${x}%`);},
    'service:delivery':()=>{const h=sum('hours');if(h)lines.push(`返工+重复约占工时 ${ratio(sum('rework')+sum('repeat'),h)}%`);}
  };(f[k]||(()=>{}))();if(!lines.length){observeFields(state).filter(x=>x.type==='number').slice(0,2).forEach(x=>lines.push(`7天${x.label}：${sum(x.id)}`));}const r=result(state);return{lines,signal:lines[0]||r.problem,metric:r.metric,next:r.experiment};}

  window.BossSkill={VERSION,BUSINESS,symptomsFor,allSymptoms,get SYMPTOMS(){return allSymptoms();},classifyText,nextQuestion,optionsFor,result,observeFields,summarize};
})();