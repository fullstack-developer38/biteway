(function(){
"use strict";
const CUR="Rs";
const money=n=>CUR+" "+Math.round(n).toLocaleString("en-US");
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const RM=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const LEG1_MS=RM?1200:5000, LEG2_MS=RM?1600:9000;
const pad2=n=>String(n).padStart(2,"0");
const hm=t=>{const d=new Date(t);return pad2(d.getHours())+":"+pad2(d.getMinutes());};
const ago=m=>Date.now()-m*60000;
const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);

const IC={
  home:'<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
  bag:'<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 016 0V8"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.2-6 8-6s6.8 2 8 6"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  call:'<path d="M6.5 3.5h3l1.8 4.6-2.3 1.4a11 11 0 005.5 5.5l1.4-2.3 4.6 1.8v3a2 2 0 01-2 2A15.5 15.5 0 014.5 5.5a2 2 0 012-2z"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  turn:'<path d="M7 20v-7a4 4 0 014-4h7"/><path d="M14 5l4 4-4 4"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  store:'<path d="M4 10v10h16V10"/><path d="M3 10l1.8-5.5h14.4L21 10a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0z"/><path d="M10 20v-5h4v5"/>',
  scooter:'<circle cx="6" cy="17.5" r="2.8"/><circle cx="18" cy="17.5" r="2.8"/><path d="M8.8 17.5h6.4l2.3-7.5H20"/><path d="M15.5 10l-1.5-4h-2.5"/><rect x="3" y="8.5" width="7" height="5.5" rx="1"/>',
  chart:'<path d="M4 4v16h16"/><path d="M8.5 16v-4M12.5 16V8M16.5 16v-6.5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- Food illustrations (drawn, no external images) ---------- */
const PLATE='<circle cx="50" cy="53" r="41" fill="rgba(0,0,0,.16)"/><circle cx="50" cy="50" r="41" fill="#F7F5F0"/><circle cx="50" cy="50" r="31" fill="#ECE8E0"/>';
const BOWL=c=>`<circle cx="50" cy="53" r="39" fill="rgba(0,0,0,.16)"/><circle cx="50" cy="50" r="39" fill="#FBFAF7"/><circle cx="50" cy="50" r="38.2" fill="none" stroke="#E2DDD3" stroke-width="1.5"/><circle cx="50" cy="50" r="30" fill="${c}"/>`;
const leaf=(x,y,r,c)=>`<ellipse cx="${x}" cy="${y}" rx="3.8" ry="1.9" fill="${c||"#5DAF45"}" transform="rotate(${r} ${x} ${y})"/>`;
const basil=(x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="2.6" fill="#3E9142" transform="rotate(${r} ${x} ${y})"/>`;
const PIZZA_BASE='<circle cx="50" cy="53" r="42" fill="rgba(0,0,0,.18)"/><circle cx="50" cy="50" r="42" fill="#D49A4F"/><circle cx="50" cy="50" r="41" fill="none" stroke="#B97F38" stroke-width="2"/><circle cx="50" cy="50" r="35" fill="#C8401F"/><circle cx="50" cy="50" r="33" fill="#F0CC78"/><g fill="#D2522A" opacity=".55"><circle cx="38" cy="29" r="3"/><circle cx="67" cy="63" r="3.5"/><circle cx="29" cy="58" r="2.5"/><circle cx="58" cy="27" r="2"/></g>';
const PIZZA_CUT='<g stroke="#D7A85C" stroke-width="1.3"><path d="M50 16v68M16 50h68M26 26l48 48M74 26L26 74"/></g>';
const GLASS=(liq,top,ly)=>{ly=ly||38;const lx=1.6+(ly-22)*5/64;return `<ellipse cx="50" cy="89" rx="22" ry="4" fill="rgba(0,0,0,.2)"/><path d="M30 22h40l-5 64H35z" fill="rgba(255,255,255,.22)"/><path d="M${(30+lx).toFixed(1)} ${ly}h${(40-2*lx).toFixed(1)}l-${(5-lx+1.6).toFixed(1)} ${86-ly}H35.4z" fill="${liq}"/>${top||""}<path d="M30 22h40l-5 64H35z" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linejoin="round"/><path d="M36 30l2.5 50" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/>`;};
const ICE='<g fill="rgba(255,255,255,.5)"><rect x="37" y="40" width="11" height="11" rx="2.5" transform="rotate(14 42 45)"/><rect x="52" y="44" width="10" height="10" rx="2.5" transform="rotate(-8 57 49)"/></g>';
const BURGER=o=>`<ellipse cx="50" cy="88" rx="32" ry="5" fill="rgba(0,0,0,.2)"/><path d="M22 70h56v5a9 9 0 0 1-9 9H31a9 9 0 0 1-9-9z" fill="#C8792F"/><rect x="19" y="57" width="62" height="14" rx="7" fill="${o.patty}"/>${o.mid||""}<path d="M16 52q4.25-4 8.5 0t8.5 0t8.5 0t8.5 0t8.5 0t8.5 0t8.5 0t8.5 0v6H16z" fill="#6DB34A"/><rect x="23" y="46" width="54" height="6" rx="3" fill="#D8432B"/><path d="M21 48c0-19 13-29 29-29s29 10 29 29z" fill="${o.bun||"#D98E3A"}"/><path d="M31 33c5-6 12-8 19-8" stroke="#EDB574" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#F7E7C4"><ellipse cx="40" cy="31" rx="2" ry="1.2" transform="rotate(-20 40 31)"/><ellipse cx="52" cy="27" rx="2" ry="1.2"/><ellipse cx="62" cy="33" rx="2" ry="1.2" transform="rotate(25 62 33)"/><ellipse cx="47" cy="38" rx="2" ry="1.2"/><ellipse cx="34" cy="41" rx="2" ry="1.2" transform="rotate(-30 34 41)"/><ellipse cx="66" cy="42" rx="2" ry="1.2" transform="rotate(20 66 42)"/></g>`;
const DISHES={
  karahi:'<circle cx="50" cy="53" r="40" fill="rgba(0,0,0,.2)"/><rect x="2" y="44" width="16" height="11" rx="5" fill="#2A2522"/><rect x="82" y="44" width="16" height="11" rx="5" fill="#2A2522"/><circle cx="50" cy="50" r="38" fill="#332C27"/><circle cx="50" cy="50" r="31" fill="#A63E1B"/><circle cx="50" cy="50" r="29" fill="none" stroke="#C8562A" stroke-width="3" opacity=".7"/><g fill="#D97638"><circle cx="38" cy="40" r="7"/><circle cx="61" cy="38" r="6"/><circle cx="57" cy="61" r="7.5"/><circle cx="37" cy="60" r="5.5"/><circle cx="67" cy="52" r="5"/></g><g fill="#F2A867" opacity=".75"><circle cx="36" cy="38" r="2"/><circle cx="59" cy="36" r="1.8"/><circle cx="55" cy="58.5" r="2.2"/></g><g stroke="#4F9A3A" stroke-width="2.6" stroke-linecap="round"><path d="M45 48l6-4"/><path d="M44 68l7 1"/><path d="M69 41l3 6"/></g><g stroke="#F2C76B" stroke-width="1.6" stroke-linecap="round"><path d="M47 54l8 1"/><path d="M29 49l4 6"/><path d="M63 68l6-3"/></g><g fill="#7CC75A"><circle cx="50" cy="34" r="2"/><circle cx="73" cy="61" r="1.8"/><circle cx="43" cy="57" r="1.6"/></g>',
  kebab:PLATE+'<g stroke="#B88A55" stroke-width="2" stroke-linecap="round"><path d="M18 34L84 60"/><path d="M16 48L82 74"/></g><g transform="rotate(21.5 51 47)"><rect x="28" y="41.5" width="46" height="11" rx="5.5" fill="#7E3618"/><path d="M36 42v10M44 42v10M52 42v10M60 42v10M68 42v10" stroke="#4A1D0B" stroke-width="1.6" opacity=".5"/></g><g transform="rotate(21.5 49 61)"><rect x="26" y="55.5" width="46" height="11" rx="5.5" fill="#86391A"/><path d="M34 56v10M42 56v10M50 56v10M58 56v10M66 56v10" stroke="#4A1D0B" stroke-width="1.6" opacity=".5"/></g><circle cx="58" cy="83" r="6.5" fill="#FFFFFF"/><circle cx="58" cy="83" r="4.8" fill="#5FA845"/><circle cx="31" cy="25" r="6.5" fill="#F4D24A"/><circle cx="31" cy="25" r="4.5" fill="#F8E58A"/><g fill="none" stroke="#D9A2C2" stroke-width="1.8"><circle cx="30" cy="74" r="5.5"/><circle cx="74" cy="31" r="5"/></g>',
  tikka:PLATE+'<g fill="#C4511F"><rect x="25" y="33" width="24" height="17" rx="7" transform="rotate(-14 37 41)"/><rect x="50" y="30" width="22" height="16" rx="7" transform="rotate(10 61 38)"/><rect x="38" y="53" width="25" height="17" rx="7" transform="rotate(-4 50 61)"/></g><g stroke="#6E2610" stroke-width="1.8" stroke-linecap="round" opacity=".55"><path d="M31 41l9-3M34 46l9-3M55 36l9 2M54 41l9 2M43 59l11-1M44 64l11-1"/></g><g fill="none" stroke="#D9A2C2" stroke-width="1.8"><path d="M24 62a8 8 0 0 1 12 8"/><path d="M68 56a7 7 0 0 1 8 10"/></g><circle cx="70" cy="72" r="6" fill="#F4D24A"/><circle cx="70" cy="72" r="4" fill="#F8E58A"/><g fill="#7CC75A"><circle cx="46" cy="49" r="1.6"/><circle cx="66" cy="49" r="1.6"/><circle cx="34" cy="54" r="1.4"/></g>',
  naan:PLATE+'<path d="M20 62C15 41 32 22 55 21c19-1 28 14 24 31-5 21-23 31-39 29-11-1-18-9-20-19z" fill="#E6BF7F"/><ellipse cx="52" cy="48" rx="17" ry="12" fill="#F2D399" opacity=".8"/><g fill="#B9762F" opacity=".75"><ellipse cx="38" cy="38" rx="4" ry="3"/><ellipse cx="62" cy="33" rx="3" ry="2.2"/><ellipse cx="30" cy="60" rx="3.5" ry="2.5"/><ellipse cx="58" cy="66" rx="4.5" ry="3"/><ellipse cx="70" cy="50" rx="2.5" ry="2"/></g><g fill="#5DAF45"><circle cx="45" cy="45" r="1.4"/><circle cx="55" cy="55" r="1.4"/><circle cx="48" cy="60" r="1.2"/><circle cx="62" cy="44" r="1.2"/></g>',
  roti:PLATE+'<circle cx="50" cy="50" r="29" fill="#D7AE72"/><circle cx="50" cy="50" r="28" fill="none" stroke="#C0904F" stroke-width="2"/><g fill="#9C6A2C" opacity=".6"><ellipse cx="40" cy="40" rx="4" ry="3"/><ellipse cx="60" cy="44" rx="3" ry="2.4"/><ellipse cx="46" cy="62" rx="4" ry="2.6"/><ellipse cx="63" cy="60" rx="2.6" ry="2"/></g>',
  raita:BOWL("#F1EDE2")+'<g fill="#8C5A2B"><circle cx="44" cy="44" r="1.3"/><circle cx="52" cy="47" r="1.2"/><circle cx="48" cy="54" r="1.3"/><circle cx="57" cy="52" r="1.1"/><circle cx="41" cy="52" r="1.1"/></g>'+leaf(54,40,-30,"#4FA041")+leaf(58,44,25)+leaf(43,58,10,"#4FA041"),
  daal:BOWL("#7A3E1C")+'<path d="M36 50c0-9 15-11 18-3s-8 13-15 8" fill="none" stroke="#F3E3C6" stroke-width="3.2" stroke-linecap="round"/><rect x="56" y="54" width="9" height="7" rx="2" fill="#F2D27A"/>'+leaf(60,40,-20)+leaf(44,64,30)+leaf(66,48,60),
  curry:BOWL("#CF6526")+'<g fill="#F0A35C"><circle cx="40" cy="44" r="6"/><circle cx="58" cy="42" r="5.5"/><circle cx="52" cy="60" r="6.5"/></g><path d="M33 57c6 4 12-2 18 1" fill="none" stroke="#F7E9D3" stroke-width="2.6" stroke-linecap="round"/>'+leaf(66,54,-30)+leaf(47,35,20)+leaf(38,64,70),
  pizza:PIZZA_BASE+'<g fill="#B5622B"><rect x="34" y="38" width="6" height="5" rx="1.5"/><rect x="58" y="44" width="6" height="5" rx="1.5"/><rect x="44" y="62" width="6" height="5" rx="1.5"/><rect x="62" y="30" width="5" height="5" rx="1.5"/></g><g fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M28 44c3-3 6-3 8 0" stroke="#3E9142"/><path d="M60 58c3-3 6-3 8 0" stroke="#3E9142"/><path d="M42 26c3 2 6 2 8 0" stroke="#D63A2B"/><path d="M36 67c3 2 6 2 8 0" stroke="#D63A2B"/><path d="M52 40c2 3 5 4 8 3" stroke="#8E3C78"/></g>'+PIZZA_CUT,
  margherita:PIZZA_BASE+'<g fill="#FBF6EA"><circle cx="38" cy="38" r="6"/><circle cx="62" cy="40" r="5.5"/><circle cx="46" cy="62" r="6"/><circle cx="64" cy="62" r="4.5"/><circle cx="29" cy="52" r="4"/></g>'+basil(49,32,-20)+basil(56,52,30)+basil(35,67,-40)+basil(71,48,70)+PIZZA_CUT,
  garlicbread:PLATE+'<g stroke="#B97F35" stroke-width="2"><rect x="22" y="30" width="24" height="34" rx="6" fill="#E6B866" transform="rotate(-12 34 47)"/><rect x="42" y="28" width="24" height="34" rx="6" fill="#E9BE6E" transform="rotate(6 54 45)"/></g><g fill="#F5D98F"><rect x="26" y="35" width="16" height="24" rx="4" transform="rotate(-12 34 47)"/><rect x="46" y="33" width="16" height="24" rx="4" transform="rotate(6 54 45)"/></g><g fill="#4FA041"><circle cx="32" cy="42" r="1.3"/><circle cx="36" cy="50" r="1.3"/><circle cx="52" cy="40" r="1.3"/><circle cx="56" cy="50" r="1.3"/><circle cx="54" cy="56" r="1.2"/></g><circle cx="68" cy="70" r="9" fill="#FFFFFF"/><circle cx="68" cy="70" r="7" fill="#F2C94C"/>',
  cola:GLASS("#3B1C10",ICE+'<g fill="rgba(255,255,255,.55)"><circle cx="44" cy="64" r="1.2"/><circle cx="54" cy="72" r="1"/><circle cx="58" cy="60" r="1.2"/><circle cx="48" cy="78" r="1"/></g><path d="M56 40L65 8" stroke="#F4F1EC" stroke-width="4" stroke-linecap="round"/>'),
  lime:GLASS("#CFE79B",ICE+leaf(46,58,-30,"#3E8F3A")+leaf(56,66,20,"#3E8F3A")+'<path d="M57 40L66 8" stroke="#F4F1EC" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="24" r="10" fill="#7DB83A"/><circle cx="32" cy="24" r="8" fill="#D9F09C"/><g stroke="#7DB83A" stroke-width="1"><path d="M32 16v16M24 24h16M26.5 18.5l11 11M37.5 18.5l-11 11"/></g>'),
  shake:GLASS("#6B3D27",'<path d="M58 22L66 4" stroke="#F4F1EC" stroke-width="4" stroke-linecap="round"/><path d="M28 27c0-13 44-13 44 0z" fill="#F7EEE2"/><circle cx="50" cy="12" r="5" fill="#C8202F"/><path d="M50 8c1-3 3-5 6-6" stroke="#3E7A2A" stroke-width="1.5" fill="none"/>',27),
  burger:BURGER({patty:"#5A2C17",mid:'<path d="M20 55h60l-7 9-6-5-6 7-6-6-6 7-6-6-6 6-6-5z" fill="#F2B630"/>'}),
  chickenburger:BURGER({patty:"#D9962E",mid:'<g fill="#B87420"><circle cx="30" cy="64" r="1.3"/><circle cx="42" cy="61" r="1.3"/><circle cx="55" cy="65" r="1.3"/><circle cx="68" cy="62" r="1.3"/></g><rect x="22" y="55" width="56" height="3.5" rx="1.75" fill="#FBF3E2"/>'}),
  bunkebab:BURGER({patty:"#7A4A26",mid:'<path d="M22 55h56l-3 5H25z" fill="#F7E6A6"/>',bun:"#C98436"}),
  fries:'<ellipse cx="50" cy="89" rx="22" ry="4" fill="rgba(0,0,0,.2)"/><g fill="#F2C14E" stroke="#D9A23A" stroke-width="1"><rect x="33" y="18" width="6" height="34" rx="2" transform="rotate(-10 36 35)"/><rect x="41" y="12" width="6" height="40" rx="2" transform="rotate(-3 44 32)"/><rect x="49" y="14" width="6" height="38" rx="2" transform="rotate(4 52 33)"/><rect x="57" y="18" width="6" height="34" rx="2" transform="rotate(10 60 35)"/><rect x="45" y="20" width="6" height="30" rx="2" transform="rotate(14 48 35)"/><rect x="37" y="24" width="6" height="28" rx="2" transform="rotate(-18 40 38)"/></g><path d="M27 42h46l-6 45H33z" fill="#C8372D"/><path d="M27 42h46l-1 7H28z" fill="#A92A22"/><path d="M33 64h34" stroke="#FFFFFF" stroke-width="3" opacity=".85"/>',
  grainbowl:BOWL("#F1E8D4")+'<path d="M50 50V20A30 30 0 0 1 80 50z" fill="#74B34E"/><path d="M50 50H80A30 30 0 0 1 50 80z" fill="#C98B4A"/><g stroke="#8E5A26" stroke-width="1.6" opacity=".6"><path d="M56 58h14M55 65h12M54 72h7"/></g><g fill="#E0B05C"><circle cx="34" cy="40" r="2.6"/><circle cx="40" cy="33" r="2.6"/><circle cx="29" cy="50" r="2.6"/><circle cx="36" cy="64" r="2.6"/></g><g fill="#3E8F3A"><ellipse cx="62" cy="31" rx="4" ry="2" transform="rotate(-30 62 31)"/><ellipse cx="70" cy="40" rx="4" ry="2" transform="rotate(20 70 40)"/></g><path d="M28 56c8 4 16-4 24 0s16 4 22-2" stroke="#F7E6BF" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  salad:BOWL("#7DBB5A")+'<g fill="#5E9E3E"><ellipse cx="40" cy="37" rx="9" ry="5" transform="rotate(-30 40 37)"/><ellipse cx="62" cy="39" rx="9" ry="5" transform="rotate(25 62 39)"/><ellipse cx="46" cy="65" rx="9" ry="5" transform="rotate(10 46 65)"/></g><g fill="#D8432B"><circle cx="56" cy="56" r="5"/><circle cx="36" cy="53" r="4.5"/></g><g fill="#FBF8EE"><rect x="48" y="38" width="7" height="7" rx="1.5" transform="rotate(12 51 41)"/><rect x="40" y="44" width="6" height="6" rx="1.5" transform="rotate(-10 43 47)"/></g><g fill="#BFE08A" stroke="#4E8F33" stroke-width="1.2"><circle cx="69" cy="60" r="4.5"/><circle cx="29" cy="63" r="4"/></g><g fill="#2B2420"><circle cx="58" cy="69" r="3"/><circle cx="67" cy="48" r="2.6"/><circle cx="32" cy="44" r="2.6"/></g>',
  wrap:'<ellipse cx="50" cy="86" rx="34" ry="5" fill="rgba(0,0,0,.2)"/><g transform="rotate(-14 50 55)"><rect x="12" y="40" width="64" height="30" rx="15" fill="#E7C48A"/><g stroke="#B98443" stroke-width="2" stroke-linecap="round" opacity=".6"><path d="M24 44l6 22M38 42l6 26M52 42l6 26"/></g><ellipse cx="76" cy="55" rx="11" ry="15" fill="#F4E3BF"/><ellipse cx="76" cy="55" rx="8" ry="12" fill="#6DB34A"/><circle cx="74" cy="51" r="3.5" fill="#D8432B"/><circle cx="78" cy="59" r="3.5" fill="#C98B4A"/><circle cx="74" cy="60" r="2.3" fill="#F7EBC8"/></g>',
  chai:'<circle cx="50" cy="53" r="40" fill="rgba(0,0,0,.16)"/><circle cx="50" cy="50" r="40" fill="#F5F2EC"/><circle cx="50" cy="50" r="32" fill="#EAE5DC"/><rect x="70" y="44" width="18" height="12" rx="6" fill="#FFFFFF" stroke="#E0DACF" stroke-width="1.5"/><circle cx="47" cy="50" r="25" fill="#FFFFFF" stroke="#E0DACF" stroke-width="1.5"/><circle cx="47" cy="50" r="20" fill="#B47A4C"/><circle cx="47" cy="50" r="16" fill="none" stroke="#D2A177" stroke-width="2" opacity=".7"/><ellipse cx="41" cy="44" rx="6" ry="3" fill="#E1B990" opacity=".55" transform="rotate(-25 41 44)"/><g fill="#8DB259"><ellipse cx="24" cy="74" rx="4.2" ry="2.3" transform="rotate(-30 24 74)"/><ellipse cx="31" cy="80" rx="4.2" ry="2.3" transform="rotate(12 31 80)"/></g>',
  samosa:PLATE+'<path d="M20 66L42 27L61 65z" fill="#D99A43" stroke="#B77426" stroke-width="2.4" stroke-linejoin="round"/><path d="M42 71L65 34L81 70z" fill="#E2A74F" stroke="#B77426" stroke-width="2.4" stroke-linejoin="round"/><g fill="#C88634" opacity=".7"><circle cx="38" cy="52" r="1.5"/><circle cx="46" cy="58" r="1.5"/><circle cx="62" cy="58" r="1.5"/><circle cx="68" cy="62" r="1.5"/><circle cx="64" cy="50" r="1.3"/></g><circle cx="28" cy="34" r="7" fill="#FFFFFF"/><circle cx="28" cy="34" r="5.2" fill="#7A3A1E"/>'
};
const dish=k=>`<svg class="dish" viewBox="0 0 100 100" aria-hidden="true">${DISHES[k]||DISHES.roti}</svg>`;
const ITEM_DISH={kh1:"karahi",kh2:"kebab",kh3:"tikka",kh4:"naan",kh5:"raita",ss1:"margherita",ss2:"pizza",ss3:"garlicbread",ss4:"cola",sp1:"burger",sp2:"chickenburger",sp3:"fries",sp4:"shake",gb1:"grainbowl",gb2:"wrap",gb3:"salad",gb4:"lime",cc1:"chai",cc2:"samosa",cc3:"bunkebab",cc4:"wrap",te1:"daal",te2:"curry",te3:"roti"};

/* ---------- Sample data ---------- */
const RESTS=[
  {id:"kh",name:"Karahi House",cuisine:"Karahi, BBQ, naan",cat:"BBQ",eta:"25–35 min",rating:4.7,reviews:1240,fee:80,min:500,color:"#9B3C1F",hero:"karahi",status:"active",orders:38,menu:[
    {id:"kh1",name:"Chicken Karahi (half)",desc:"Cooked in tomato and green chilli. Serves 2.",price:1250,pop:1},
    {id:"kh2",name:"Seekh Kebab, 4 pcs",desc:"Charcoal grilled, with mint chutney",price:650,pop:1},
    {id:"kh3",name:"Chicken Tikka",desc:"Quarter leg, smoked in the tandoor",price:520},
    {id:"kh4",name:"Garlic Naan",desc:"Fresh from the tandoor",price:90},
    {id:"kh5",name:"Mint Raita",desc:"Yogurt, mint and roasted cumin",price:120}]},
  {id:"ss",name:"Slice Street",cuisine:"Pizza, garlic bread",cat:"Pizza",eta:"30–40 min",rating:4.5,reviews:860,fee:100,min:800,color:"#7A2E4A",hero:"pizza",status:"active",orders:27,menu:[
    {id:"ss1",name:"Margherita, 12 inch",desc:"Tomato, mozzarella, basil",price:1450},
    {id:"ss2",name:"Fajita Pizza, 12 inch",desc:"Spiced chicken, peppers, onion",price:1650,pop:1},
    {id:"ss3",name:"Garlic Bread",desc:"With cheese dip",price:390},
    {id:"ss4",name:"Cola, 1.5 L",desc:"Chilled",price:220}]},
  {id:"sp",name:"Smash Point",cuisine:"Burgers, fries, shakes",cat:"Burgers",eta:"20–30 min",rating:4.6,reviews:1530,fee:90,min:500,color:"#5E4A16",hero:"burger",status:"active",orders:41,menu:[
    {id:"sp1",name:"Double Smash Burger",desc:"Two beef patties, cheese, house sauce",price:890,pop:1},
    {id:"sp2",name:"Crispy Chicken Burger",desc:"Buttermilk fried, slaw, pickles",price:720},
    {id:"sp3",name:"Loaded Fries",desc:"Cheese sauce, jalapeño",price:450},
    {id:"sp4",name:"Chocolate Shake",desc:"Thick, made to order",price:480}]},
  {id:"gb",name:"Green Bowl",cuisine:"Bowls, wraps, salads",cat:"Healthy",eta:"25–35 min",rating:4.8,reviews:410,fee:100,min:600,color:"#2F6B3F",hero:"grainbowl",status:"active",orders:16,menu:[
    {id:"gb1",name:"Grilled Chicken Bowl",desc:"Brown rice, greens, tahini",price:980,pop:1},
    {id:"gb2",name:"Falafel Wrap",desc:"Hummus, pickled onion, salad",price:690},
    {id:"gb3",name:"Greek Salad",desc:"Feta, olives, cucumber",price:750},
    {id:"gb4",name:"Fresh Lime Soda",desc:"Sweet or salted",price:250}]},
  {id:"cc",name:"Chai Corner",cuisine:"Chai, rolls, snacks",cat:"Chai",eta:"15–25 min",rating:4.4,reviews:2210,fee:60,min:300,color:"#7A4E1E",hero:"chai",status:"active",orders:52,menu:[
    {id:"cc1",name:"Karak Chai",desc:"Strong, milky, cardamom",price:150,pop:1},
    {id:"cc2",name:"Samosa, 2 pcs",desc:"Potato and pea, with chutney",price:120},
    {id:"cc3",name:"Bun Kebab",desc:"Lentil patty, egg, chutney",price:260},
    {id:"cc4",name:"Chicken Paratha Roll",desc:"Flaky paratha, garlic mayo",price:380}]},
  {id:"te",name:"Tandoor Express",cuisine:"Naan, curries",cat:"BBQ",eta:"30–40 min",rating:0,reviews:0,fee:90,min:400,color:"#3E4F7A",hero:"curry",status:"pending",orders:0,owner:"Rashid N.",menu:[
    {id:"te1",name:"Daal Makhani",desc:"Black lentils, slow cooked",price:480},
    {id:"te2",name:"Butter Chicken",desc:"Tomato, butter, fenugreek",price:1100,pop:1},
    {id:"te3",name:"Tandoori Roti",desc:"Whole wheat",price:40}]}
];
const CATS=["All","BBQ","Pizza","Burgers","Healthy","Chai"];
const PAYL={cod:"Cash on delivery",card:"Card",wallet:"Mobile wallet"};
const PAYS={cod:"Cash",card:"Card",wallet:"Wallet"};
const STATUS={new:["New","warn"],prep:["Preparing","warn"],ready:["Ready","brand"],way:["On the way","brand"],delivered:["Delivered","ok"],cancelled:["Cancelled","bad"]};
const RIDER_PAY=120;

const seedBoard=()=>[
  {id:"BW-1041",cust:"Ayesha M.",items:"1× Chicken Tikka, 2× Garlic Naan",total:780,pay:"Wallet",stage:"new",at:ago(1)},
  {id:"BW-1039",cust:"Sana R.",items:"2× Seekh Kebab, 4× Garlic Naan",total:1740,pay:"Card",stage:"prep",at:ago(9),readyIn:8},
  {id:"BW-1040",cust:"Hamza T.",items:"1× Chicken Karahi (half), 1× Mint Raita",total:1450,pay:"Cash",stage:"ready",at:ago(16),rider:"Usman R."}
];
const seedPast=()=>[
  {id:"BW-1038",rest:"Slice Street",cust:"Usman A.",total:1940,pay:"Card",status:"delivered",at:ago(24)},
  {id:"BW-1037",rest:"Chai Corner",cust:"Ali H.",total:600,pay:"Cash",status:"delivered",at:ago(31)},
  {id:"BW-1036",rest:"Smash Point",cust:"Fatima Z.",total:1430,pay:"Wallet",status:"delivered",at:ago(38)},
  {id:"BW-1035",rest:"Green Bowl",cust:"Mehwish K.",total:1080,pay:"Card",status:"cancelled",at:ago(52)},
  {id:"BW-1034",rest:"Karahi House",cust:"Omar S.",total:2010,pay:"Cash",status:"delivered",at:ago(64)}
];
const seedRiders=()=>[
  {name:"Bilal K.",zone:"Block C",vehicle:"Motorbike",rating:4.9,trips:12,status:"online",docs:"Verified"},
  {name:"Usman R.",zone:"Mall Road",vehicle:"Motorbike",rating:4.8,trips:9,status:"delivering",docs:"Verified"},
  {name:"Zain A.",zone:"Canal Road",vehicle:"Bicycle",rating:4.7,trips:14,status:"delivering",docs:"Verified"},
  {name:"Kashif M.",zone:"Not set",vehicle:"Motorbike",rating:0,trips:0,status:"offline",docs:"Pending review"}
];
const seedPromos=()=>[
  {code:"WELCOME50",type:"pct",val:50,max:150,label:"50% off the first order, up to Rs 150",uses:312,active:true},
  {code:"FREEDEL",type:"fee",min:1000,label:"Free delivery on orders over Rs 1,000",uses:148,active:true},
  {code:"CHAI20",type:"pct",val:20,max:100,label:"20% off, up to Rs 100",uses:41,active:false}
];
const PAST_C=[
  {rest:"ss",when:"Yesterday",items:"1× Fajita Pizza, 12 inch",total:1750},
  {rest:"cc",when:"Last week",items:"2× Karak Chai, 2× Samosa",total:600}
];

/* ---------- State ---------- */
const S={};
function initState(){
  Object.assign(S,{
    view:"customer",cscreen:"home",restId:"kh",cat:"All",q:"",
    cart:{},cartRest:null,promo:"",promoApplied:null,promoMsg:"",promoOk:false,
    pay:"cod",cardNo:"4242 4242 4242 4242",cardExp:"08/28",cardCvc:"123",walletNo:"0300 1234567",paying:false,
    order:null,nextId:1042,prepChoice:20,
    log:[],badges:{customer:0,restaurant:0,rider:0,admin:0},banner:null,
    riderOnline:true,riderEarn:1440,riderTrips:12,cashConfirm:false,
    menuOff:{},closed:{},
    rests:JSON.parse(JSON.stringify(RESTS)),board:seedBoard(),past:seedPast(),riders:seedRiders(),promos:seedPromos(),
    adminTab:"overview",newCode:"",newPct:"15",newMax:"200",promoErr:"",
    notif:{push:true,sms:true,email:true},ob:0,obPhone:"0300 1234567",obName:"Hira",
    playing:false,playText:""
  });
}
initState();

const rest=id=>S.rests.find(r=>r.id===id);
const restOfItem=id=>S.rests.find(r=>r.menu.some(m=>m.id===id));

/* ---------- Map geometry (1 unit = 10 m) ---------- */
const START=[300,100];
const LEG1=[[300,100],[140,100],[140,30],[95,30]];
const LEG2=[[95,30],[140,30],[140,100],[230,100],[230,170],[265,170]];
const LEG2_INS=["Turn right onto Station Road","Turn left onto Canal Road","Turn right onto Park Avenue","Turn left onto Street 6","Arrive at Street 6, Block C"];
const leg1Ins=r=>["Turn right onto Station Road","Turn left onto Mall Road","Arrive at "+r.name];
function along(pts,f){
  const segs=[];let L=0;
  for(let i=0;i<pts.length-1;i++){const d=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);segs.push(d);L+=d;}
  let t=f*L;
  for(let i=0;i<segs.length;i++){
    if(t<=segs[i]||i===segs.length-1){
      const k=segs[i]?Math.min(1,t/segs[i]):1;
      return {x:pts[i][0]+(pts[i+1][0]-pts[i][0])*k,y:pts[i][1]+(pts[i+1][1]-pts[i][1])*k,seg:i,segRemain:segs[i]*(1-k),remain:L*(1-f)};
    }
    t-=segs[i];
  }
}
const endOf=pts=>({x:pts[pts.length-1][0],y:pts[pts.length-1][1],seg:pts.length-2,segRemain:0,remain:0});
function riderPos(o){
  if(!o||!o.rider) return {x:START[0],y:START[1],seg:0,segRemain:0,remain:0};
  if(o.phase==="toRest") return along(LEG1,o.prog);
  if(o.phase==="atRest") return endOf(LEG1);
  if(o.phase==="toCust") return along(LEG2,o.prog);
  return endOf(LEG2);
}
const fmtDist=u=>{const m=u*10;return m<1000?(Math.round(m/10)*10)+" m":(m/1000).toFixed(1)+" km";};
function etaMin(o){const p=riderPos(o);return Math.max(1,Math.ceil(p.remain*10/400));}
function instr(o){
  const r=rest(o.rest),p=riderPos(o);
  if(o.phase==="toRest") return leg1Ins(r)[p.seg];
  if(o.phase==="atRest") return "You're at "+r.name+". Collect order "+o.id+".";
  if(o.phase==="toCust") return LEG2_INS[p.seg];
  return "You've arrived. Hand over order "+o.id+".";
}
function distText(o){
  if(o.phase==="atRest"||o.phase==="atCust"||o.phase==="done") return "Arrived";
  const p=riderPos(o);
  return "In "+fmtDist(p.segRemain)+" · "+fmtDist(p.remain)+" to go";
}
const pts=a=>a.map(p=>p.join(",")).join(" ");
function mapSVG(o,opt){
  opt=opt||{};
  const r=o?rest(o.rest):rest("kh");
  const showPins=!opt.idle;
  const showRider=opt.idle||opt.preview||(o&&o.rider);
  const p=riderPos(o);
  let s=`<svg class="map" viewBox="0 0 320 210" role="img" aria-label="${opt.idle?"Map of busy delivery zones":"Map with the rider, "+esc(r.name)+" and the delivery address"}">`;
  s+=`<rect class="m-bg" width="320" height="210"/>`;
  s+=`<rect class="m-park" x="146" y="36" width="78" height="58" rx="5"/>`;
  s+=`<path class="m-water" d="M0 192 C 70 182, 130 204, 200 194 S 290 188 320 196 L320 210 L0 210 Z"/>`;
  s+=`<g class="m-minor"><path d="M0 65H140M230 65H320M0 135H320M95 100V190M185 100V190M265 0V100"/></g>`;
  s+=`<g class="m-road"><path d="M0 30H320M0 100H320M0 170H320M50 0V200M140 0V200M230 0V200"/></g>`;
  s+=`<text class="m-lbl" x="185" y="68" text-anchor="middle">CITY PARK</text>`;
  s+=`<text class="m-lbl" x="6" y="94">CANAL ROAD</text>`;
  s+=`<text class="m-lbl" x="246" y="23">MALL ROAD</text>`;
  s+=`<text class="m-lbl" x="133" y="165" transform="rotate(-90 133 165)" text-anchor="middle">STATION ROAD</text>`;
  s+=`<text class="m-lbl" x="237" y="62" transform="rotate(90 237 62)" text-anchor="middle">PARK AVENUE</text>`;
  s+=`<text class="m-lbl" x="292" y="140" text-anchor="middle">BLOCK C</text>`;
  if(opt.idle){
    s+=`<circle class="m-heat" cx="265" cy="160" r="30"/><circle class="m-heat" cx="200" cy="30" r="22"/><circle class="m-heat" cx="70" cy="110" r="18"/>`;
  }
  if(showPins){
    if(o&&o.rider&&!o.picked) s+=`<polyline class="m-route1" points="${pts(LEG1)}"/>`;
    s+=`<polyline class="m-route${o&&o.picked?" on":""}" points="${pts(LEG2)}"/>`;
    s+=`<text class="m-tag" x="95" y="14" text-anchor="middle">${esc(r.name)}</text>`;
    s+=`<circle class="m-pin-r" cx="95" cy="30" r="8"/><text class="m-pin-t" x="95" y="33" text-anchor="middle">R</text>`;
    s+=`<text class="m-tag" x="265" y="155" text-anchor="middle">Home</text>`;
    s+=`<circle class="m-pin-h" cx="265" cy="170" r="8"/><text class="m-pin-t h" x="265" y="173" text-anchor="middle">H</text>`;
  }
  if(showRider){
    s+=`<g data-rider transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})"><circle class="m-pulse" r="9"/><circle class="m-rider" r="6"/></g>`;
  }
  return s+"</svg>";
}

/* ---------- Cart and promos ---------- */
function cartCalc(){
  const r=S.cartRest?rest(S.cartRest):null;const lines=[];let sub=0,count=0;
  if(r) r.menu.forEach(m=>{const q=S.cart[m.id];if(q){lines.push({id:m.id,name:m.name,price:m.price,qty:q});sub+=q*m.price;count+=q;}});
  const fee=r?r.fee:0;let disc=0;
  const p=S.promoApplied&&S.promos.find(x=>x.code===S.promoApplied&&x.active);
  if(p){ if(p.type==="pct") disc=Math.min(Math.round(sub*p.val/100),p.max); else if(p.type==="fee"&&sub>=p.min) disc=fee; }
  return {r,lines,sub,count,fee,disc,total:Math.max(0,sub+fee-disc),promo:p&&disc>0?p.code:null};
}
function addItem(id){
  const r=restOfItem(id);if(!r||S.menuOff[id]||S.closed[r.id]) return;
  if(S.cartRest&&S.cartRest!==r.id&&Object.keys(S.cart).length){S.cart={};S.promoApplied=null;S.promoMsg="";toast("Started a new cart for "+r.name);}
  S.cartRest=r.id;S.cart[id]=(S.cart[id]||0)+1;
}
function decItem(id){
  if(!S.cart[id]) return;
  S.cart[id]--; if(!S.cart[id]) delete S.cart[id];
  if(!Object.keys(S.cart).length){S.cartRest=null;S.promoApplied=null;S.promoMsg="";}
}
function applyPromo(){
  const code=(S.promo||"").trim().toUpperCase();const c=cartCalc();
  const p=S.promos.find(x=>x.code===code);
  S.promoOk=false;
  if(!code){S.promoMsg="Type a code first.";return;}
  if(!p){S.promoMsg=code+" isn't a valid code. Check the spelling.";S.promoApplied=null;return;}
  if(!p.active){S.promoMsg=code+" has ended.";S.promoApplied=null;return;}
  if(p.type==="fee"&&c.sub<p.min){S.promoMsg="Add "+money(p.min-c.sub)+" more to use "+code+".";S.promoApplied=null;return;}
  S.promoApplied=code;S.promo=code;
  const c2=cartCalc();S.promoMsg=code+" applied. You save "+money(c2.disc)+".";S.promoOk=true;
}

/* ---------- Order lifecycle ---------- */
function log(ch,to,text){
  if(to==="Customer"&&S.notif[ch]===false) return;
  S.log.push({ch,to,text,time:hm(Date.now())});
  if(S.log.length>60) S.log.shift();
  if(ch==="push"&&(to==="Customer"||to==="Rider")) S.banner={role:to.toLowerCase(),text,at:Date.now(),shown:false};
}
const activeOrder=()=>S.order&&!S.order.delivered&&!S.order.rejected;
function placeOrder(){
  if(activeOrder()){toast("You already have an order in progress. Track it from Orders.");return;}
  const c=cartCalc();if(!c.count) return;
  if(c.sub<c.r.min||S.paying) return;
  if(S.pay==="cod"){createOrder(c);return;}
  S.paying=true;
  setTimeout(()=>{S.paying=false;createOrder(cartCalc());render();},S.pay==="card"?1200:1600);
}
function createOrder(c){
  if(!c.count) return;
  const id="BW-"+(S.nextId++),now=Date.now(),r=c.r;
  S.order={id,rest:r.id,items:c.lines.map(l=>({name:l.name,qty:l.qty,price:l.price})),sub:c.sub,fee:c.fee,disc:c.disc,total:c.total,pay:S.pay,promo:c.promo,
    accepted:false,ready:false,rider:null,picked:false,delivered:false,rejected:false,phase:"idle",prog:0,prep:20,t:{placed:now},rating:0,rDone:false};
  if(c.promo){const p=S.promos.find(x=>x.code===c.promo);if(p)p.uses++;}
  S.cart={};S.cartRest=null;S.promo="";S.promoApplied=null;S.promoMsg="";S.cscreen="track";
  if(S.pay!=="cod") log("sys","Payment gateway",money(c.total)+" authorised by "+(S.pay==="card"?"card ending 4242 (3-D Secure passed)":"mobile wallet")+".");
  log("push","Customer","Order "+id+" placed. Waiting for "+r.name+" to confirm.");
  log("sys","Restaurant panel","New order "+id+" ("+c.count+" items). The tablet rings until someone accepts.");
  S.badges.restaurant++;
}
function acceptLive(){
  const o=S.order;if(!o||o.accepted||o.rejected) return;
  const r=rest(o.rest);
  o.accepted=true;o.prep=S.prepChoice;o.t.accepted=Date.now();
  log("push","Customer",r.name+" accepted your order. Food ready in about "+o.prep+" min.");
  log("sys","Dispatch","Request sent to Bilal K., the nearest free rider (2.8 km away).");
  S.badges.rider++;
}
function rejectLive(){
  const o=S.order;if(!o||o.accepted) return;
  const r=rest(o.rest);o.rejected=true;
  log("push","Customer",r.name+" can't take your order right now. "+(o.pay==="cod"?"You have not been charged.":"Your "+money(o.total)+" refund is on its way."));
  if(o.pay!=="cod") log("sys","Payment gateway","Refund of "+money(o.total)+" issued for "+o.id+".");
}
function readyLive(){
  const o=S.order;if(!o||!o.accepted||o.ready) return;
  o.ready=true;o.t.ready=Date.now();
  log("push","Customer","Your food is packed and ready.");
  if(o.rider) log("push","Rider","Order "+o.id+" is ready for pickup at "+rest(o.rest).name+".");
}
function riderAccept(){
  const o=S.order;if(!o||!o.accepted||o.rider||o.rejected) return;
  o.rider="Bilal K.";o.t.rider=Date.now();o.phase="toRest";o.prog=0;
  log("push","Customer","Bilal K. will deliver your order.");
  log("sys","Restaurant panel","Rider Bilal K. assigned to "+o.id+".");
}
function arriveRest(){
  const o=S.order;o.phase="atRest";o.prog=0;
  log("sys","Rider app","Bilal K. reached "+rest(o.rest).name+".");
}
function riderPick(){
  const o=S.order;if(!o||o.phase!=="atRest"||!o.ready) return;
  o.picked=true;o.t.picked=Date.now();o.phase="toCust";o.prog=0;
  log("push","Customer","Your order is on the way. Arriving in about "+etaMin(o)+" min.");
}
function arriveCust(){
  const o=S.order;o.phase="atCust";o.prog=0;o.t.arrived=Date.now();
  log("push","Customer","Your rider is at the door with order "+o.id+".");
}
function riderDeliver(){
  const o=S.order;if(!o||o.phase!=="atCust") return;
  if(o.pay==="cod"&&!S.cashConfirm){S.cashConfirm=true;return;}
  completeDelivery();
}
function completeDelivery(){
  const o=S.order;if(!o||o.delivered||o.phase!=="atCust") return;
  const r=rest(o.rest);
  o.delivered=true;o.phase="done";o.t.delivered=Date.now();S.cashConfirm=false;
  S.riderEarn+=RIDER_PAY;S.riderTrips++;
  log("push","Customer","Delivered. Enjoy your meal, and rate your order when you're ready.");
  log("sms","Customer","Biteway receipt "+o.id+": "+money(o.total)+" paid by "+PAYL[o.pay].toLowerCase()+". Thank you!");
  log("email","Customer","Itemised receipt for "+o.id+" from "+r.name+", with a PDF copy.");
  log("sys","Finance","Restaurant payout "+money(o.sub*0.85)+" after 15% commission. Rider earned "+money(RIDER_PAY)+".");
  S.badges.admin++;
}

/* ---------- Guide ---------- */
function nextStep(){
  const o=S.order,c=cartCalc();
  if(!o||o.rejected){
    const pre=o&&o.rejected?"The restaurant declined that order. ":"";
    if(c.count) return {txt:pre+"Open the cart, try promo code WELCOME50, choose how to pay and place the order.",view:"customer",screen:"cart",label:"Go to checkout"};
    return {txt:pre+"Open Karahi House in the customer app and add a few dishes, or press Watch a full order above.",view:"customer",screen:"home",label:"Open customer app"};
  }
  if(!o.accepted) return {txt:"The order is ringing in the Restaurant panel. Pick a prep time and accept it.",view:"restaurant",label:"Open Restaurant panel"};
  if(!o.rider) return {txt:"A delivery request went to the nearest rider. Accept it in the Rider app.",view:"rider",label:"Open Rider app"};
  if(!o.ready) return {txt:"The rider is "+(o.phase==="toRest"?"heading to":"waiting at")+" the restaurant. Mark the food ready in the Restaurant panel.",view:"restaurant",label:"Open Restaurant panel"};
  if(!o.picked) return o.phase==="toRest"?{txt:"Food is ready. The rider is still riding to the restaurant.",view:"rider",label:"Watch the Rider app"}:{txt:"The rider is at the counter. Confirm pickup in the Rider app.",view:"rider",label:"Open Rider app"};
  if(o.phase==="toCust") return {txt:"The rider is on the way. Watch the live map and ETA in the customer app.",view:"customer",screen:"track",label:"Track as customer"};
  if(o.phase==="atCust") return {txt:"The rider is at the door. Complete the delivery in the Rider app.",view:"rider",label:"Open Rider app"};
  if(!o.rating) return {txt:"Delivered. Rate the order in the customer app, then see it in the Admin console.",view:"customer",screen:"track",label:"Rate as customer"};
  return {txt:"All done. The Admin console shows the order in today's numbers. Press Start over to begin again.",view:"admin",label:"Open Admin console"};
}

/* ---------- Shared bits ---------- */
const sw=(a,v,on,label)=>`<button class="sw${on?" on":""}" role="switch" aria-checked="${on}" aria-label="${esc(label||"")}" data-a="${a}" data-v="${esc(v)}"><span></span></button>`;
const stepper=(id,q)=>`<span class="stepper"><button data-a="dec" data-id="${id}" aria-label="Remove one">−</button><b class="tnum">${q}</b><button data-a="add" data-id="${id}" aria-label="Add one">+</button></span>`;
function oStatus(o){
  if(o.rejected) return "cancelled";
  if(o.delivered) return "delivered";
  if(!o.accepted) return "new";
  if(o.picked) return "way";
  return o.ready?"ready":"prep";
}
function steps(o){
  const list=[["Order placed",true,o.t.placed],["Restaurant accepted",o.accepted,o.t.accepted],["Rider assigned",!!o.rider,o.t.rider],["Food ready",o.ready,o.t.ready],["Picked up",o.picked,o.t.picked],["Delivered",o.delivered,o.t.delivered]];
  let cur=list.findIndex(x=>!x[1]);
  if(o.rejected) cur=-1;
  return `<ol class="steps">${list.map(([l,d,t],i)=>`<li class="${d?"done":i===cur?"now":""}"><span class="sdot"></span><span>${l}</span><span class="muted tnum">${t?hm(t):""}</span></li>`).join("")}</ol>`;
}
function bill(sub,fee,disc,total,promo){
  return `<div class="bill"><div class="brow"><span>Subtotal</span><span class="tnum">${money(sub)}</span></div><div class="brow"><span>Delivery fee</span><span class="tnum">${money(fee)}</span></div>${disc?`<div class="brow disc"><span>Promo ${esc(promo||"")}</span><span class="tnum">−${money(disc)}</span></div>`:""}<div class="brow tot"><span>Total</span><span class="tnum">${money(total)}</span></div></div>`;
}
function phone(role,inner,nav){
  return `<div class="phone" data-phone="${role}"><div class="sbar"><span class="tnum">${hm(Date.now())}</span><span class="island" aria-hidden="true"></span><span class="sicons" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span></div><div class="pnotif" id="pn-${role}"></div><div class="screen">${inner}</div>${nav||""}</div>`;
}
const tags=(list)=>`<div class="built"><span class="lbl">Built with</span>${list.map(t=>`<span class="tag">${t}</span>`).join("")}</div>`;
function infoCard(eyebrow,title,lead,feats,built){
  return `<div class="info"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p class="lead">${lead}</p><dl class="feats">${feats.map(([t,d])=>`<div><dt>${t}</dt><dd>${d}</dd></div>`).join("")}</dl>${tags(built)}</div>`;
}

/* ---------- Customer app ---------- */
function restList(){
  const q=S.q.trim().toLowerCase();
  const list=S.rests.filter(r=>r.status==="active"&&(S.cat==="All"||r.cat===S.cat)&&(!q||r.name.toLowerCase().includes(q)||r.cuisine.toLowerCase().includes(q)||r.menu.some(m=>m.name.toLowerCase().includes(q))));
  if(!list.length) return `<p class="empty">Nothing matches “${esc(S.q)}”. Try “kebab”, “pizza” or “chai”.</p>`;
  return list.map(r=>`<button class="rcard" data-a="openRest" data-id="${r.id}"><span class="thumb" style="--t:${r.color}">${dish(r.hero)}</span><span class="rinfo"><span class="rname">${esc(r.name)}${r.isNew?'<span class="pill new">New</span>':""}${S.closed[r.id]?'<span class="pill closed">Closed</span>':""}</span><span class="muted">${esc(r.cuisine)}</span><span class="meta"><span class="rt">★ ${r.rating?r.rating.toFixed(1):"New"}</span><span>${r.eta}</span><span>${money(r.fee)} delivery</span></span></span></button>`).join("");
}
function cHome(){
  const o=S.order;
  const n=S.rests.filter(r=>r.status==="active").length;
  return `<div class="c-head"><div class="addr"><span class="lbl">Deliver to</span><b>Home · Street 6, Block C</b></div><button class="avatar" data-a="cnav" data-v="account" aria-label="Account">H</button></div>
  <div class="pad"><label class="search">${ic("search")}<input id="q" type="search" placeholder="Search restaurants or dishes" value="${esc(S.q)}" autocomplete="off" aria-label="Search restaurants or dishes"></label></div>
  ${activeOrder()?`<button class="live-strip" data-a="cnav" data-v="track"><span class="livedot"></span><span><b>${o.id}</b> · ${STATUS[oStatus(o)][0]}</span><span>Track ›</span></button>`:""}
  <div class="chips pad">${CATS.map(c=>`<button class="chip${S.cat===c?" on":""}" data-a="cat" data-v="${c}">${c}</button>`).join("")}</div>
  <div class="pad"><div class="promo-card"><div><span class="eyebrow">First order</span><b>50% off your first order</b><span class="s">Up to Rs 150 off. Add the code at checkout.</span></div><span class="code">WELCOME50</span></div></div>
  <div class="pad sec-h"><h3>Restaurants near you</h3><span class="muted">${n} open</span></div>
  <div id="rlist" class="pad rlist">${restList()}</div>`;
}
function cMenu(){
  const r=rest(S.restId),c=cartCalc(),closed=S.closed[r.id];
  const items=r.menu.map(m=>{
    const off=S.menuOff[m.id],q=S.cartRest===r.id?(S.cart[m.id]||0):0;
    const ctl=off?'<span class="soldout">Sold out today</span>':closed?"":q?stepper(m.id,q):`<button class="add" data-a="add" data-id="${m.id}" aria-label="Add ${esc(m.name)}">+</button>`;
    return `<div class="mitem${off?" off":""}"><div class="mtext"><b>${esc(m.name)}${m.pop?'<span class="pill">Popular</span>':""}</b><span class="muted">${esc(m.desc)}</span><div class="mrow"><span class="price tnum">${money(m.price)}</span>${ctl}</div></div><div class="mthumb">${dish(ITEM_DISH[m.id])}</div></div>`;
  }).join("");
  return `<div class="m-hero" style="--t:${r.color}"><button class="iconbtn" data-a="cnav" data-v="home" aria-label="Back">${ic("back")}</button><span class="cat">${esc(r.cat)}</span><span class="big">${dish(r.hero)}</span></div>
  <div class="pad m-head"><h2>${esc(r.name)}</h2><p class="muted">${esc(r.cuisine)} · ★ ${r.rating?r.rating.toFixed(1)+" ("+r.reviews.toLocaleString("en-US")+")":"New"} · ${r.eta}</p><p class="muted">${money(r.fee)} delivery · Minimum order ${money(r.min)}</p>${closed?'<p class="notice">Not taking orders right now. Check back soon.</p>':""}</div>
  <div class="pad"><h3 class="sm">Menu</h3><div class="mlist">${items}</div></div>
  ${c.count&&S.cartRest===r.id?`<div class="cartbar"><button class="btn brand wide" data-a="cnav" data-v="cart"><span>${c.count} item${c.count>1?"s":""}</span><span>View cart</span><span class="tnum">${money(c.sub)}</span></button></div>`:""}`;
}
function cCart(){
  const c=cartCalc();
  if(!c.count) return `<div class="c-top"><button class="iconbtn" data-a="cnav" data-v="home" aria-label="Back">${ic("back")}</button><h2>Cart</h2></div><div class="pad"><p class="empty">Your cart is empty. Pick a restaurant to start.</p><button class="btn brand wide" data-a="cnav" data-v="home">Browse restaurants</button></div>`;
  const r=c.r,below=c.sub<r.min;
  const lines=c.lines.map(l=>`<div class="cline"><div><b>${esc(l.name)}</b><span class="muted tnum">${money(l.price)}</span></div>${stepper(l.id,l.qty)}<span class="tnum">${money(l.price*l.qty)}</span></div>`).join("");
  const opts=[["cod","Cash on delivery","Pay the rider when the food arrives"],["card","Debit or credit card","Visa and Mastercard, with 3-D Secure"],["wallet","Mobile wallet","Approve the payment in your wallet app"]];
  let extra="";
  if(S.pay==="card") extra=`<div class="payf"><label class="fld full"><span>Card number</span><input id="cardNo" data-bind="cardNo" value="${esc(S.cardNo)}" inputmode="numeric"></label><label class="fld"><span>Expiry</span><input id="cardExp" data-bind="cardExp" value="${esc(S.cardExp)}"></label><label class="fld"><span>CVC</span><input id="cardCvc" data-bind="cardCvc" value="${esc(S.cardCvc)}" inputmode="numeric"></label></div>`;
  if(S.pay==="wallet") extra=`<div class="payf"><label class="fld full"><span>Wallet mobile number</span><input id="walletNo" data-bind="walletNo" value="${esc(S.walletNo)}" inputmode="tel"></label></div>`;
  const payTxt=S.paying?(S.pay==="card"?"Processing card payment…":"Approve in your wallet app…"):below?"Add "+money(r.min-c.sub)+" to reach the minimum":"Place order · "+money(c.total);
  return `<div class="c-top"><button class="iconbtn" data-a="openRest" data-id="${r.id}" aria-label="Back to menu">${ic("back")}</button><h2>Checkout</h2></div>
  <div class="pad stack">
    <section class="box"><h4>${esc(r.name)}</h4>${lines}</section>
    <section class="box"><h4>Deliver to</h4><p><b>Home</b> · Street 6, Block C<br><span class="muted">Note for rider: leave at the gate, call on arrival.</span></p></section>
    <section class="box"><h4>Promo code</h4><div class="promo-row"><input id="promo" data-bind="promo" value="${esc(S.promo)}" placeholder="Enter code" autocomplete="off" aria-label="Promo code">${S.promoApplied?`<button class="btn ghost" data-a="removePromo">Remove</button>`:`<button class="btn ghost" data-a="applyPromo">Apply</button>`}</div>${S.promoMsg?`<p class="pmsg ${S.promoOk?"ok":"bad"}">${esc(S.promoMsg)}</p>`:`<p class="hint">Try WELCOME50 or FREEDEL</p>`}</section>
    <section class="box"><h4>Payment</h4>${opts.map(([k,l,d])=>`<label class="popt${S.pay===k?" on":""}"><input type="radio" name="pay" value="${k}" data-a="pay" data-v="${k}"${S.pay===k?" checked":""}><span><b>${l}</b><span class="muted">${d}</span></span></label>`).join("")}${extra}</section>
    <section class="box">${bill(c.sub,c.fee,c.disc,c.total,c.promo)}</section>
  </div>
  <div class="cartbar"><button class="btn brand wide center" data-a="place"${below||S.paying?" disabled":""}>${payTxt}</button></div>`;
}
function cTrack(){
  const o=S.order;
  if(!o) return `<div class="c-top"><h2>Track order</h2></div><div class="pad"><p class="empty">No order yet.</p><button class="btn brand wide" data-a="cnav" data-v="home">Find something to eat</button></div>`;
  const r=rest(o.rest);let head;
  if(o.rejected) head=`<span class="eyebrow bad">Not accepted</span><h2>${esc(r.name)} couldn't take this order</h2><p class="muted">${o.pay==="cod"?"You haven't been charged.":"Your "+money(o.total)+" refund is on its way."}</p>`;
  else if(o.delivered) head=`<span class="eyebrow ok">Delivered at ${hm(o.t.delivered)}</span><h2>Enjoy your meal</h2>`;
  else if(o.phase==="atCust") head=`<span class="eyebrow">Order ${o.id}</span><h2>Your rider is at the door</h2>`;
  else if(o.picked) head=`<span class="eyebrow">On the way</span><h2>Arriving in <span data-eta>${etaMin(o)} min</span></h2>`;
  else if(o.accepted) head=`<span class="eyebrow">${o.ready?"Food ready":"Preparing your food"}</span><h2>Arriving in about ${o.prep+12} min</h2>`;
  else head=`<span class="eyebrow">Order ${o.id}</span><h2>Waiting for ${esc(r.name)} to accept</h2>`;
  const riderCard=o.rider&&!o.delivered&&!o.rejected?`<section class="box rider-row"><span class="avatar dark">BK</span><div><b>${o.rider}</b><span class="muted">Motorbike · ★ 4.9 · 1,280 trips</span></div><button class="iconbtn" data-a="callRider" aria-label="Call rider">${ic("call")}</button><button class="iconbtn" data-a="chatRider" aria-label="Message rider">${ic("chat")}</button></section>`:"";
  const rate=o.delivered?`<section class="box"><h4>How was it?</h4><div class="stars">${[1,2,3,4,5].map(n=>`<button class="star${o.rating>=n?" on":""}" data-a="rate" data-v="${n}" aria-label="${n} star${n>1?"s":""}">★</button>`).join("")}</div><p class="muted">${o.rating?"Thanks. Your rating goes to "+esc(r.name)+" and your rider.":"Your receipt was sent by SMS and email."}</p></section>`:"";
  return `<div class="c-top"><button class="iconbtn" data-a="cnav" data-v="orders" aria-label="Back to orders">${ic("back")}</button><span class="mono">${o.id}</span></div>
  <div class="pad stack">
    <div class="track-head">${head}</div>
    ${o.rejected?"":`<div class="mapbox">${mapSVG(o)}</div>`}
    ${riderCard}${rate}
    <section class="box">${steps(o)}</section>
    <section class="box"><h4>${esc(r.name)}</h4>${o.items.map(i=>`<div class="brow"><span>${i.qty}× ${esc(i.name)}</span><span class="tnum">${money(i.qty*i.price)}</span></div>`).join("")}<div style="height:8px"></div>${bill(o.sub,o.fee,o.disc,o.total,o.promo)}<p class="hint">Paying by ${PAYL[o.pay].toLowerCase()}</p></section>
    ${o.rejected||o.delivered?`<button class="btn brand wide" data-a="openRest" data-id="${o.rest}">Order again</button>`:""}
  </div>`;
}
function cOrders(){
  const o=S.order;
  const live=o?`<h3 class="sm">${activeOrder()?"Active":"Latest"}</h3><button class="ocard" data-a="cnav" data-v="track"><div><b>${esc(rest(o.rest).name)}</b><span class="muted">${o.id} · ${hm(o.t.placed)} · ${money(o.total)}</span></div><span class="spill ${STATUS[oStatus(o)][1]}">${STATUS[oStatus(o)][0]}</span></button>`:"";
  const past=PAST_C.map(p=>`<div class="ocard"><div><b>${esc(rest(p.rest).name)}</b><span class="muted">${p.when} · ${esc(p.items)}</span><span class="muted">${money(p.total)} · Delivered</span></div><button class="btn ghost sm" data-a="openRest" data-id="${p.rest}">Reorder</button></div>`).join("");
  return `<div class="c-top"><h2>Your orders</h2></div><div class="pad stack">${live}<h3 class="sm">Past orders</h3>${past}</div>`;
}
function cAccount(){
  const N={push:"Push notifications",sms:"SMS updates",email:"Email receipts"};
  return `<div class="c-top"><h2>Account</h2></div>
  <div class="pad stack">
    <div class="prof"><span class="avatar lg">H</span><div><b>Hira S.</b><span class="muted">Phone verified · ends 4567</span></div></div>
    <section class="box"><h4>Saved addresses</h4><div class="lrow"><span>Home</span><span class="muted">Street 6, Block C</span></div><div class="lrow"><span>Office</span><span class="muted">Floor 2, Canal View Plaza</span></div></section>
    <section class="box"><h4>Payment methods</h4><div class="lrow"><span>Visa card</span><span class="muted mono">•••• 4242</span></div><div class="lrow"><span>Mobile wallet</span><span class="muted">Linked</span></div><div class="lrow"><span>Cash on delivery</span><span class="muted">Always available</span></div></section>
    <section class="box"><h4>Order updates</h4>${["push","sms","email"].map(k=>`<div class="lrow"><span>${N[k]}</span>${sw("ntog",k,S.notif[k],N[k])}</div>`).join("")}</section>
    <button class="btn ghost wide" data-a="obStart">Preview the sign-up flow</button>
  </div>`;
}
function cOnboard(){
  const st=S.ob;
  const dots=`<div class="obdots" aria-label="Step ${st+1} of 3">${[0,1,2].map(i=>`<span class="${i<=st?"on":""}"></span>`).join("")}</div>`;
  if(st===0) return `<div class="ob">${dots}<div class="obhero"><span class="mark big" aria-hidden="true">b</span><h2>Food from your city, at your door</h2><p class="muted">Sign up with your mobile number. No password to remember.</p></div><label class="fld"><span>Mobile number</span><input id="obPhone" data-bind="obPhone" value="${esc(S.obPhone)}" inputmode="tel"></label><button class="btn brand wide" data-a="obNext">Send code by SMS</button><button class="linkbtn" data-a="cnav" data-v="account">Cancel</button></div>`;
  if(st===1) return `<div class="ob">${dots}<div class="obhero"><h2>Enter the 4-digit code</h2><p class="muted">Sent to ${esc(S.obPhone)}. The app reads it from the SMS automatically.</p></div><div class="otp">${"4821".split("").map(d=>`<span>${d}</span>`).join("")}</div><button class="btn brand wide" data-a="obNext">Verify</button><button class="linkbtn" data-a="obBack">Change number</button></div>`;
  return `<div class="ob">${dots}<div class="obhero"><h2>What should we call you?</h2><p class="muted">Riders see your first name only.</p></div><label class="fld"><span>First name</span><input id="obName" data-bind="obName" value="${esc(S.obName)}"></label><div class="box"><div class="lrow"><span>Use my location for delivery</span>${sw("noop","",true,"Use my location")}</div><div class="lrow"><span>Send me order updates</span>${sw("noop","",true,"Order updates")}</div></div><button class="btn brand wide" data-a="obDone">Start ordering</button></div>`;
}
function cNav(){
  const s=S.cscreen;
  const tab=(s==="home"||s==="menu"||s==="cart")?"home":(s==="orders"||s==="track")?"orders":"account";
  const it=(k,l,i)=>`<button class="${tab===k?"on":""}" data-a="cnav" data-v="${k}"${tab===k?' aria-current="page"':""}>${ic(i)}${l}</button>`;
  return `<nav class="bnav" aria-label="Customer app">${it("home","Home","home")}${it("orders","Orders","bag")}${it("account","Account","user")}</nav>`;
}
function vCustomer(){
  const scr={home:cHome,menu:cMenu,cart:cCart,track:cTrack,orders:cOrders,account:cAccount,onboard:cOnboard}[S.cscreen]||cHome;
  return `<div class="duo"><div>${phone("customer",scr(),S.cscreen==="onboard"?"":cNav())}</div>${infoCard("Customer app · Android, iOS and web","Browse, order and track in a few taps","The app people in the city open when they're hungry. Everything in the phone is clickable.",[
    ["Discovery","Search by dish or cuisine, filter by category, see fees and delivery time up front."],
    ["Checkout","Cart, promo codes and a clear bill. Pay by cash, card or mobile wallet."],
    ["Tracking","The rider on a live map, with an ETA that counts down."],
    ["Updates","Push at every step, and receipts by SMS and email."],
    ["Sign-up","A mobile number and a one-time SMS code. No password."]],
    ["Flutter","React web","Firebase push"])}</div>`;
}

/* ---------- Rider app ---------- */
function rScreen(){
  const o=S.order;
  const head=`<div class="r-head"><div class="r-id"><span class="avatar dark">BK</span><div><b>Bilal K.</b><span class="muted">Motorbike · ★ 4.9</span></div></div><div class="r-on"><span>${S.riderOnline?"Online":"Offline"}</span>${sw("rOnline","",S.riderOnline,"Online")}</div></div>
  <div class="r-earn pad"><div><span class="lbl">Earned today</span><b class="tnum">${money(S.riderEarn)}</b></div><div><span class="lbl">Trips</span><b class="tnum">${S.riderTrips}</b></div><div><span class="lbl">Acceptance</span><b class="tnum">96%</b></div></div>`;
  const onJob=o&&o.rider&&!o.delivered;
  const hasReq=o&&o.accepted&&!o.rider&&!o.rejected;
  let body;
  if(!S.riderOnline&&!onJob) body=`<div class="pad r-off"><h3>You're offline</h3><p class="muted">Go online to start getting delivery requests near you.</p></div>`;
  else if(hasReq) body=rRequest(o);
  else if(onJob) body=rJob(o);
  else if(o&&o.delivered&&!o.rDone) body=rDone(o);
  else body=`<div class="pad stack"><div class="mapbox">${mapSVG(null,{idle:true})}</div><section class="box"><h4>Waiting for requests</h4><p class="muted">Stay near the busy zones to get orders faster. Busiest right now: Block C and Mall Road.</p></section></div>`;
  return head+body;
}
function rRequest(o){
  const r=rest(o.rest),n=sum(o.items,i=>i.qty);
  return `<div class="pad stack"><div class="req"><div class="req-top"><span class="eyebrow">New delivery request</span><span class="req-pay tnum">${money(RIDER_PAY)}</span></div>
  <div class="jrow"><span class="jdot a"></span><div><span class="lbl">Pick up · 2.8 km away</span><b>${esc(r.name)}</b><span class="muted">${n} items · ready in about ${o.prep} min</span></div></div>
  <div class="jrow"><span class="jdot b"></span><div><span class="lbl">Drop off · 3.1 km trip</span><b>Street 6, Block C</b></div></div>
  <p class="jpay">${o.pay==="cod"?"Collect cash: <b>"+money(o.total)+"</b>":"Paid online. Nothing to collect."}</p>
  <div class="kact"><button class="btn ghost" data-a="rDecline">Decline</button><button class="btn brand" data-a="rAccept">Accept</button></div></div>
  <div class="mapbox">${mapSVG(o,{preview:true})}</div></div>`;
}
function rJob(o){
  const r=rest(o.rest);let btn;
  if(o.phase==="toRest") btn=`<button class="btn brand wide" disabled>Riding to ${esc(r.name)}</button>`;
  else if(o.phase==="atRest"&&!o.ready) btn=`<button class="btn brand wide" disabled>Waiting for the kitchen</button><p class="hint c">The restaurant marks the order ready in its panel.</p>`;
  else if(o.phase==="atRest") btn=`<button class="btn accent wide" data-a="rPick">Confirm pickup</button>`;
  else if(o.phase==="toCust") btn=`<button class="btn brand wide" disabled>Delivering</button>`;
  else if(S.cashConfirm) btn=`<div class="cash"><p>Collect <b>${money(o.total)}</b> in cash from Hira S.</p><div class="kact"><button class="btn ghost" data-a="rCashBack">Back</button><button class="btn accent" data-a="rCash">Cash collected</button></div></div>`;
  else btn=`<button class="btn accent wide" data-a="rDeliver">Mark as delivered</button>`;
  return `<div class="pad stack"><div class="mapbox">${mapSVG(o)}</div>
  <div class="instr">${ic("turn")}<div><b data-instr>${esc(instr(o))}</b><span class="muted" data-dist>${distText(o)}</span></div></div>
  <section class="box job">
    <div class="jrow"><span class="jdot a"></span><div><span class="lbl">Pick up</span><b>${esc(r.name)}</b><span class="muted">Order ${o.id} · ${sum(o.items,i=>i.qty)} items</span></div>${o.picked?'<span class="spill ok">Done</span>':o.ready?'<span class="spill brand">Ready</span>':'<span class="spill warn">Cooking</span>'}</div>
    <div class="jrow"><span class="jdot b"></span><div><span class="lbl">Drop off</span><b>Hira S. · Street 6, Block C</b><span class="muted">Leave at the gate, call on arrival.</span></div></div>
    <p class="jpay">${o.pay==="cod"?"Collect cash: <b>"+money(o.total)+"</b>":"Paid online. Nothing to collect."}</p>
  </section>${btn}</div>`;
}
function rDone(o){
  return `<div class="pad stack"><div class="done"><span class="donei">${ic("check")}</span><h3>Delivered</h3><p class="muted">Order ${o.id} · ${money(RIDER_PAY)} added to today's earnings${o.pay==="cod"?". Deposit "+money(o.total)+" cash at the hub.":"."}</p></div><button class="btn brand wide" data-a="rDone">Back to requests</button></div>`;
}
function vRider(){
  return `<div class="duo"><div>${phone("rider",rScreen(),"")}</div>${infoCard("Rider app · Android and iOS","Clear jobs, live routes, cash tracked","Made for one-handed use on the road, and for low-cost Android phones.",[
    ["Requests","Distance, pay and cash to collect, shown before accepting."],
    ["Navigation","Turn-by-turn to the restaurant, then to the customer."],
    ["Tracking","Live GPS shared with the customer and the admin team."],
    ["Cash","Cash collected on each trip, deposited at the end of the day."],
    ["Onboarding","Documents uploaded in the app, approved by admin."]],
    ["Flutter","Background location","Google Maps"])}</div>`;
}

/* ---------- Restaurant panel ---------- */
function vRestaurant(){
  const o=S.order,rid=o?o.rest:"kh",r=rest(rid);
  const cards=[];
  if(rid==="kh") S.board.forEach(b=>cards.push(Object.assign({},b,{live:false})));
  if(o&&!o.rejected){
    const stage=!o.accepted?"new":!o.ready?"prep":!o.picked?"ready":"out";
    cards.push({id:o.id,cust:"Hira S.",items:o.items.map(i=>i.qty+"× "+i.name).join(", "),total:o.total,pay:PAYS[o.pay],stage,at:o.t.placed,live:true});
  }
  const EMPTY={new:"New orders ring here",prep:"Nothing cooking",ready:"Nothing waiting for a rider"};
  const col=(k,l)=>{const list=cards.filter(c=>c.stage===k).sort((a,b)=>b.live-a.live);return `<section class="kcol"><header><h3>${l}</h3><span class="cnt">${list.length}</span></header>${list.map(kCard).join("")||`<p class="kempty">${EMPTY[k]}</p>`}</section>`;};
  const liveHere=o&&o.rest===rid&&!o.rejected;
  const open=!S.closed[rid];
  const menuRows=r.menu.map(m=>`<tr><td><span class="tname"><span class="thumb xs" style="--t:var(--surface-2)">${dish(ITEM_DISH[m.id])}</span><span>${esc(m.name)}<span class="sub">${esc(m.desc)}</span></span></span></td><td class="r">${money(m.price)}</td><td class="r">${sw("menuToggle",m.id,!S.menuOff[m.id],"Available: "+m.name)}</td></tr>`).join("");
  return `<div class="vhead"><div><span class="eyebrow">Restaurant panel · web and tablet</span><h2>Accept, cook and hand over</h2><p class="lead">Each restaurant signs in to its own panel and sees only its own orders, menu and payouts.</p></div>${tags(["React","Works on tablets"])}</div>
  <div class="panel">
    <div class="panel-bar"><div class="pb-id"><span class="thumb sm" style="--t:${r.color}">${dish(r.hero)}</span><div><b>${esc(r.name)}</b><span class="muted">Counter tablet · signed in as manager</span></div></div>
      <div class="pb-stats"><div><span class="lbl">Orders today</span><b class="tnum">${r.orders+(liveHere?1:0)}</b></div><div><span class="lbl">Sales today</span><b class="tnum">${money(52400+(liveHere?o.sub:0))}</b></div><div><span class="lbl">Avg prep</span><b>18 min</b></div><div><span class="lbl">Rating</span><b>★ ${r.rating||"New"}</b></div></div>
      <div class="pb-open">${sw("restOpen",rid,open,"Open for orders")}<span>${open?"Open for orders":"Closed"}</span></div></div>
    <div class="kanban">${col("new","New orders")}${col("prep","Preparing")}${col("ready","Ready for pickup")}</div>
    <div class="panel-grid">
      <section class="pcard"><header><h3>Menu availability</h3><span class="muted">Changes show in the customer app right away</span></header><div class="tscroll"><table class="tbl"><thead><tr><th>Dish</th><th class="r">Price</th><th class="r">Available</th></tr></thead><tbody>${menuRows}</tbody></table></div></section>
      <section class="pcard"><header><h3>This week's payout</h3><span class="muted">Paid every Monday</span></header><div class="payout"><div class="brow"><span>Order sales</span><span class="tnum">${money(312900)}</span></div><div class="brow"><span>Platform commission, 15%</span><span class="tnum">−${money(46935)}</span></div><div class="brow tot"><span>Payout to bank</span><span class="tnum">${money(265965)}</span></div><p class="hint">Cash orders are settled against the rider's cash deposits, so the payout is the same however customers pay.</p></div></section>
    </div>
  </div>`;
}
function kCard(c){
  const o=S.order;let act="";
  if(c.stage==="new"){
    act=`<div class="prep"><span class="lbl">Prep time</span>${[15,20,30].map(m=>`<button class="pchip${S.prepChoice===m?" on":""}" data-a="prep" data-v="${m}">${m} min</button>`).join("")}</div><div class="kact"><button class="btn ghost sm" data-a="kReject" data-id="${c.id}">Reject</button><button class="btn brand sm" data-a="kAccept" data-id="${c.id}">Accept order</button></div>`;
  } else if(c.stage==="prep"){
    const note=c.live?"Ready in about "+o.prep+" min · "+(o.rider?o.rider+(o.phase==="atRest"?" is waiting at the counter":" is on the way"):"finding a rider"):"Ready in about "+c.readyIn+" min · Zain A. assigned";
    act=`<p class="knote">${note}</p><div class="kact"><button class="btn accent sm" data-a="kReady" data-id="${c.id}">Mark ready</button></div>`;
  } else if(c.stage==="ready"){
    const note=c.live?(!o.rider?"Waiting for a rider to accept":o.phase==="toRest"?o.rider+" arrives in about "+Math.max(1,Math.ceil((1-o.prog)*7))+" min":o.rider+" is at the counter"):c.rider+" arrives in 3 min";
    act=`<p class="knote">${note}</p>`;
  }
  return `<article class="kcard${c.live?" live":""}"><div class="khead"><span class="mono">${c.id}</span>${c.live?'<span class="spill live">Your order</span>':""}<span class="muted tnum">${hm(c.at)}</span></div><b>${esc(c.cust)}</b><p class="kitems">${esc(c.items)}</p><div class="kfoot"><span class="tnum">${money(c.total)}</span><span class="spill">${c.pay}</span></div>${act}</article>`;
}

/* ---------- Admin console ---------- */
function allOrders(){
  const rows=[],o=S.order;
  if(o) rows.push({id:o.id,rest:rest(o.rest).name,cust:"Hira S.",total:o.total,pay:PAYS[o.pay],status:oStatus(o),at:o.t.placed,live:true});
  S.board.forEach(b=>rows.push({id:b.id,rest:"Karahi House",cust:b.cust,total:b.total,pay:b.pay,status:b.stage,at:b.at}));
  S.past.forEach(p=>rows.push(p));
  return rows;
}
function ordersTable(n){
  const rows=allOrders().slice(0,n||99);
  return `<div class="tscroll"><table class="tbl"><thead><tr><th>Order</th><th>Restaurant</th><th>Customer</th><th class="r">Total</th><th>Payment</th><th>Status</th><th class="r">Placed</th></tr></thead><tbody>${rows.map(r=>`<tr class="${r.live?"hl":""}"><td><span class="mono">${r.id}</span></td><td>${esc(r.rest)}</td><td>${esc(r.cust)}</td><td class="r">${money(r.total)}</td><td>${r.pay}</td><td><span class="spill ${STATUS[r.status][1]}">${STATUS[r.status][0]}</span></td><td class="r">${hm(r.at)}</td></tr>`).join("")}</tbody></table></div>`;
}
function chartSVG(){
  const d=[4,7,18,26,15,9,8,12,21,30,24,12];
  const W=560,H=200,L=30,R=8,T=16,B=26,iw=W-L-R,ih=H-T-B,bw=iw/d.length;
  const y=v=>T+ih-(v/30)*ih;let g="";
  [0,10,20,30].forEach(t=>{g+=`<line class="c-grid" x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}"/><text class="c-tx" x="${L-7}" y="${y(t)+4}" text-anchor="end">${t}</text>`;});
  d.forEach((v,i)=>{
    const x=L+i*bw+bw*.18,w=bw*.64,pk=v===30;
    g+=`<rect class="c-bar${pk?" pk":""}" x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${w.toFixed(1)}" height="${(T+ih-y(v)).toFixed(1)}" rx="3"><title>${10+i}:00 · ${v} orders</title></rect>`;
    if(i%2===0) g+=`<text class="c-tx" x="${(L+i*bw+bw/2).toFixed(1)}" y="${H-8}" text-anchor="middle">${10+i}:00</text>`;
    if(pk) g+=`<text class="c-tx pk" x="${(x+w/2).toFixed(1)}" y="${(y(v)-5).toFixed(1)}" text-anchor="middle">${v}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Orders by hour today. 186 orders, peaking at 30 orders in the 19:00 hour.">${g}</svg>`;
}
function riderStatus(rd){
  if(rd.name==="Bilal K."){const o=S.order;if(o&&o.rider&&!o.delivered) return "delivering";return S.riderOnline?"online":"offline";}
  return rd.status;
}
const RST={online:["Online","ok"],delivering:["Delivering","brand"],offline:["Offline",""]};
const A={
  overview(){
    const o=S.order,live=o&&!o.rejected;
    const kpis=[["Orders today",String(186+(live?1:0)),"+12% vs same day last week",1],["Order value today",money(241350+(live?o.total:0)),"Average basket "+money(1298)],["Riders online",(S.riderOnline?23:22)+" of 31","4 riders delivering in Block C"],["Avg delivery time","27 min","Target is under 35 min"]];
    return `<div class="kpis">${kpis.map(k=>`<div class="kpi"><span class="lbl">${k[0]}</span><b>${k[1]}</b><span class="d${k[3]?" up":""}">${k[2]}</span></div>`).join("")}</div>
    <div class="agrid"><section class="pcard"><header><h3>Orders by hour</h3><span class="muted">Today · 186 orders</span></header>${chartSVG()}</section>
    <section class="pcard"><header><h3>How customers pay</h3><span class="muted">Last 30 days</span></header><div class="mix" role="img" aria-label="Cash 58 percent, card 24 percent, mobile wallet 18 percent"><span class="m1" style="width:58%"></span><span class="m2" style="width:24%"></span><span class="m3" style="width:18%"></span></div><ul class="legend"><li><i class="m1"></i>Cash on delivery<b>58%</b></li><li><i class="m2"></i>Card<b>24%</b></li><li><i class="m3"></i>Mobile wallet<b>18%</b></li></ul><p class="hint" style="margin-top:12px">Cash still leads, so rider cash deposits are reconciled every evening.</p></section></div>
    <section class="pcard"><header><h3>Latest orders</h3><button class="linkbtn" data-a="atab" data-v="orders">See all</button></header>${ordersTable(6)}</section>`;
  },
  orders(){return `<section class="pcard"><header><h3>All orders today</h3><span class="muted">Live order highlighted</span></header>${ordersTable()}</section>`;},
  restaurants(){
    const rows=S.rests.map(r=>{
      let st,act="";
      if(r.status==="active") st=`<span class="spill ok">Live</span>`;
      else if(r.status==="pending"){st=`<span class="spill warn">Pending approval</span>`;act=`<div class="acts"><button class="btn ghost sm" data-a="declineRest" data-id="${r.id}">Decline</button><button class="btn brand sm" data-a="approveRest" data-id="${r.id}">Approve</button></div>`;}
      else st=`<span class="spill bad">Declined</span>`;
      const sub=r.status==="pending"?"Applied 2 days ago by "+r.owner+". Food licence and menu uploaded.":esc(r.cuisine);
      return `<tr><td><span class="tname"><span class="thumb xs" style="--t:${r.color}">${dish(r.hero)}</span><span><b>${esc(r.name)}</b><span class="sub">${sub}</span></span></span></td><td>${st}</td><td class="r">${r.orders}</td><td class="r">${r.rating?"★ "+r.rating.toFixed(1):"–"}</td><td class="r">15%</td><td class="r">${act}</td></tr>`;
    }).join("");
    return `<section class="pcard"><header><h3>Restaurants</h3><span class="muted">Approve new partners before they appear in the app</span></header><div class="tscroll"><table class="tbl"><thead><tr><th>Restaurant</th><th>Status</th><th class="r">Orders today</th><th class="r">Rating</th><th class="r">Commission</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  },
  riders(){
    const rows=S.riders.map((rd,i)=>{
      const s=RST[riderStatus(rd)];
      const docs=rd.docs==="Verified"?`<span class="spill ok">Verified</span>`:`<div class="acts" style="justify-content:flex-start"><span class="spill warn">Pending review</span><button class="btn brand sm" data-a="riderDocs" data-v="${i}">Approve</button></div>`;
      const trips=rd.name==="Bilal K."?S.riderTrips:rd.trips;
      return `<tr><td><b>${esc(rd.name)}</b><span class="sub">${rd.vehicle} · zone ${esc(rd.zone)}</span></td><td><span class="spill ${s[1]}">${s[0]}</span></td><td class="r">${trips}</td><td class="r">${rd.rating?"★ "+rd.rating.toFixed(1):"–"}</td><td>${docs}</td></tr>`;
    }).join("");
    return `<section class="pcard"><header><h3>Riders</h3><span class="muted">31 registered · 23 online now</span></header><div class="tscroll"><table class="tbl"><thead><tr><th>Rider</th><th>Status</th><th class="r">Trips today</th><th class="r">Rating</th><th>Documents</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  },
  promos(){
    const rows=S.promos.map(p=>`<tr><td><span class="mono">${p.code}</span></td><td>${esc(p.label)}</td><td class="r">${p.uses}</td><td class="r">${sw("promoToggle",p.code,p.active,"Active: "+p.code)}</td></tr>`).join("");
    return `<section class="pcard"><header><h3>Promo codes</h3><span class="muted">Codes work in the customer app as soon as they're on</span></header><div class="tscroll"><table class="tbl"><thead><tr><th>Code</th><th>Rule</th><th class="r">Uses</th><th class="r">Active</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="pform"><label class="fld"><span>New code</span><input id="newCode" data-bind="newCode" value="${esc(S.newCode)}" placeholder="WEEKEND15" autocomplete="off"></label><label class="fld"><span>Percent off</span><input id="newPct" data-bind="newPct" value="${esc(S.newPct)}" inputmode="numeric"></label><label class="fld"><span>Max discount (${CUR})</span><input id="newMax" data-bind="newMax" value="${esc(S.newMax)}" inputmode="numeric"></label><button class="btn brand" data-a="addPromo">Create code</button></div>${S.promoErr?`<p class="ferr">${esc(S.promoErr)}</p>`:""}</section>`;
  },
  access(){
    const roles=["Restaurant","Rider","Admin","Support"];
    const perms=[["See and accept orders",[1,0,1,1]],["Edit menu and prices",[1,0,1,0]],["See delivery requests and routes",[0,1,1,0]],["Collect cash and confirm delivery",[0,1,0,0]],["Create promo codes",[0,0,1,0]],["Approve restaurants and riders",[0,0,1,0]],["Refunds and customer support",[0,0,1,1]],["City-wide analytics",[0,0,1,0]]];
    return `<section class="pcard"><header><h3>Roles and access</h3><span class="muted">Every sign-in gets one role. The API checks it on every request.</span></header><div class="tscroll"><table class="tbl matrix"><thead><tr><th>Permission</th>${roles.map(r=>`<th>${r}</th>`).join("")}</tr></thead><tbody>${perms.map(([l,v])=>`<tr><td>${l}</td>${v.map(x=>x?'<td class="yes" aria-label="Allowed">✓</td>':'<td class="no" aria-label="Not allowed">–</td>').join("")}</tr>`).join("")}</tbody></table></div></section>`;
  }
};
function vAdmin(){
  const tabs=[["overview","Overview"],["orders","Orders"],["restaurants","Restaurants"],["riders","Riders"],["promos","Promo codes"],["access","Roles and access"]];
  return `<div class="vhead"><div><span class="eyebrow">Admin console · web</span><h2>Run the whole city from one screen</h2><p class="lead">Live numbers, partner approvals, promo codes and who can do what.</p></div>${tags(["React","Role-based access"])}</div>
  <div class="panel"><div class="panel-bar"><div class="pb-id"><span class="mark xs" aria-hidden="true">b</span><div><b>Biteway operations</b><span class="muted">Sample data</span></div></div><nav class="subtabs" aria-label="Admin sections">${tabs.map(([k,l])=>`<button class="${S.adminTab===k?"on":""}" data-a="atab" data-v="${k}">${l}</button>`).join("")}</nav></div>
  <div class="admin-body">${A[S.adminTab]()}</div></div>`;
}

/* ---------- Stations, guide, aside, render ---------- */
const ROLES=[["customer","Customer app","Order and track","phone"],["restaurant","Restaurant panel","Accept and cook","store"],["rider","Rider app","Pick up and deliver","scooter"],["admin","Admin console","Run the city","chart"]];
function stationStatus(k){
  const o=S.order,c=cartCalc();
  if(k==="customer"){
    if(o&&!o.rejected&&!o.delivered) return [STATUS[oStatus(o)][0]+" · "+o.id,"live"];
    if(o&&o.delivered) return [o.rating?"Delivered and rated":"Delivered · waiting for a rating","ok"];
    if(c.count) return ["Cart · "+c.count+" item"+(c.count>1?"s":"")+" · "+money(c.sub),"warn"];
    return [S.rests.filter(r=>r.status==="active").length+" restaurants open",""];
  }
  if(k==="restaurant"){
    const rid=o?o.rest:"kh";
    const n=(rid==="kh"?S.board.filter(b=>b.stage==="new").length:0)+(o&&!o.accepted&&!o.rejected?1:0);
    const p=(rid==="kh"?S.board.filter(b=>b.stage==="prep").length:0)+(o&&o.accepted&&!o.ready&&!o.rejected?1:0);
    return [(n?n+" new":"No new")+" · "+p+" cooking",n?"warn":""];
  }
  if(k==="rider"){
    if(o&&o.rider&&!o.delivered) return [{toRest:"Riding to the restaurant",atRest:"Waiting at the counter",toCust:"Delivering",atCust:"At the door"}[o.phase]||"On a job","live"];
    if(o&&o.accepted&&!o.rider&&!o.rejected) return ["New request waiting","warn"];
    return [S.riderOnline?"Online · "+S.riderTrips+" trips today":"Offline",S.riderOnline?"ok":""];
  }
  const live=o&&!o.rejected;
  return [(186+(live?1:0))+" orders today · "+money(241350+(live?o.total:0)),""];
}
function renderStations(){
  const n=nextStep(),o=S.order;
  const turnTxt=o?"Your turn":"Start here";
  $("#tabs").innerHTML=ROLES.map(([k,l,d,i])=>{
    const turn=!S.playing&&n.view===k;
    const s=stationStatus(k);
    return `<button class="station" role="tab" aria-selected="${S.view===k}" data-a="tab" data-v="${k}"><span class="st-ic">${ic(i)}</span><span class="st-txt"><span class="st-name">${l}</span><span class="st-role">${d}</span></span><span class="st-status"><i class="sd ${s[1]}"></i><span>${esc(s[0])}</span></span>${turn?`<span class="turn"><span class="t">${turnTxt}</span></span>`:""}</button>`;
  }).join("");
}
const CHL={push:"Push",sms:"SMS",email:"Email",sys:"System"};
function renderAside(){
  const o=S.order;let live;
  if(o){const r=rest(o.rest),st=STATUS[oStatus(o)];
    live=`<div class="lo-top"><span class="mono">${o.id}</span><span class="spill ${st[1]}">${st[0]}</span></div><p class="lo-meta">${esc(r.name)} · ${money(o.total)} · ${PAYL[o.pay]}${o.promo?" · "+o.promo:""}</p>${steps(o)}`;
  } else live=`<p class="muted" style="font-size:13.5px;margin-top:6px">No order yet. Place one in the customer app, or press Watch a full order.</p>`;
  const items=S.log.slice().reverse().map(e=>`<li><span class="ch ${e.ch}">${CHL[e.ch]}</span><div><span class="to">${esc(e.to)} · ${e.time}</span><p>${esc(e.text)}</p></div></li>`).join("");
  $("#aside").innerHTML=`<section class="side-card"><div class="side-h"><h3>Live order</h3></div>${live}</section>
  <section class="side-card"><div class="side-h"><h3>Behind the scenes</h3><span class="muted tnum">${S.log.length}</span></div><p class="side-sub">Every push, SMS, email and system event, as it happens.</p>${items?`<ul class="log">${items}</ul>`:`<p class="log-empty">Nothing yet. Messages appear here as soon as the order moves.</p>`}</section>`;
}
function renderGuide(){
  const g=$("#guide");
  if(S.playing){g.className="guide playing";g.innerHTML=`<span class="livedot"></span><p><b>Playing a full order.</b> ${esc(S.playText)}</p><button class="btn ghost sm" data-a="stop">Stop</button>`;return;}
  const n=nextStep();
  const need=n.view!==S.view||(n.view==="customer"&&n.screen&&n.screen!==S.cscreen);
  g.className="guide";
  g.innerHTML=`<span class="gl">${ic("arrow")}Next</span><p>${esc(n.txt)}</p>${need?`<button class="btn brand sm" data-a="goNext">${n.label}</button>`:""}`;
}
const VIEWS={customer:vCustomer,restaurant:vRestaurant,rider:vRider,admin:vAdmin};
function render(){
  S.badges[S.view]=0;
  renderStations();
  const st=$("#stage");
  const sc=st.querySelector(".screen"),top=sc?sc.scrollTop:0;
  const key=S.view+":"+(S.view==="customer"?S.cscreen:"");
  const prevView=st.dataset.view,same=st.dataset.key===key;
  st.innerHTML=VIEWS[S.view]();
  if(same){const s2=st.querySelector(".screen");if(s2)s2.scrollTop=top;}
  else if(prevView&&prevView!==S.view){const f=st.firstElementChild;if(f)f.classList.add("enter");}
  else if(prevView){const s2=st.querySelector(".screen");if(s2)s2.classList.add("enter-x");}
  st.dataset.key=key;st.dataset.view=S.view;
  renderAside();renderGuide();updateMap();showBanner();
  try{if(location.hash.slice(1)!==S.view) location.replace("#"+S.view);}catch(e){}
}
function updateMap(){
  const o=S.order;if(!o) return;
  const p=riderPos(o);
  $$("[data-rider]").forEach(g=>g.setAttribute("transform","translate("+p.x.toFixed(1)+" "+p.y.toFixed(1)+")"));
  if(o.picked&&o.phase==="toCust") $$("[data-eta]").forEach(n=>n.textContent=etaMin(o)+" min");
  $$("[data-instr]").forEach(n=>n.textContent=instr(o));
  $$("[data-dist]").forEach(n=>n.textContent=distText(o));
}
let bTimer=null;
function showBanner(){
  const b=S.banner;if(!b) return;
  const left=4200-(Date.now()-b.at);
  if(left<=0){S.banner=null;return;}
  const host=document.getElementById("pn-"+b.role);if(!host) return;
  host.innerHTML=`<div class="pn${b.shown?" still":""}"><span class="mark xs" aria-hidden="true">b</span><div><b>Biteway</b><p>${esc(b.text)}</p></div><span class="muted">now</span></div>`;
  b.shown=true;
  clearTimeout(bTimer);
  bTimer=setTimeout(()=>{const el=document.querySelector(".pnotif .pn");if(el)el.classList.add("out");setTimeout(()=>{$$(".pnotif").forEach(n=>n.innerHTML="");},260);S.banner=null;},left);
}
let tTimer=null;
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("on");clearTimeout(tTimer);tTimer=setTimeout(()=>t.classList.remove("on"),3200);}
function scrollToId(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:RM?"auto":"smooth",block:"start"});}
function ensureStage(){const t=$("#apps");if(t&&t.getBoundingClientRect().top<-40)scrollToId("apps");}

/* ---------- Actions ---------- */
function kAccept(id){
  if(S.order&&S.order.id===id){acceptLive();return;}
  const b=S.board.find(x=>x.id===id);if(!b) return;
  b.stage="prep";b.readyIn=S.prepChoice;log("push",b.cust,"Karahi House accepted order "+id+".");
}
function kReject(id){
  if(S.order&&S.order.id===id){rejectLive();return;}
  const i=S.board.findIndex(x=>x.id===id);if(i<0) return;
  const b=S.board.splice(i,1)[0];
  log("push",b.cust,"Order "+id+" was declined. Refund issued to the wallet.");
  toast("Order "+id+" rejected. The customer is told and refunded.");
}
function kReady(id){
  if(S.order&&S.order.id===id){readyLive();return;}
  const b=S.board.find(x=>x.id===id);if(!b) return;
  b.stage="ready";b.rider="Zain A.";log("push","Rider","Order "+id+" is ready for pickup at Karahi House.");
}
const ACT={
  tab:v=>{S.view=v;ensureStage();},
  goNext:()=>{const n=nextStep();S.view=n.view;if(n.view==="customer"&&n.screen)S.cscreen=n.screen;ensureStage();},
  goto:v=>scrollToId(v),
  cnav:v=>{S.cscreen=v;},
  openRest:(v,id)=>{S.restId=id;S.cscreen="menu";S.view="customer";},
  cat:v=>{S.cat=v;},
  add:(v,id)=>addItem(id),
  dec:(v,id)=>decItem(id),
  applyPromo:()=>applyPromo(),
  removePromo:()=>{S.promoApplied=null;S.promo="";S.promoMsg="";},
  pay:v=>{S.pay=v;},
  place:()=>placeOrder(),
  rate:v=>{const o=S.order;if(!o)return;const first=!o.rating;o.rating=+v;if(first)log("sys","Reviews","Hira S. rated "+rest(o.rest).name+" "+v+" out of 5.");},
  callRider:()=>toast("Calls go through a masked number, so neither side sees the other's real number."),
  chatRider:()=>toast("In-app chat with quick replies such as “I'm at the gate”."),
  ntog:v=>{S.notif[v]=!S.notif[v];},
  noop:()=>{},
  obStart:()=>{S.ob=0;S.cscreen="onboard";},
  obNext:()=>{if(S.ob===0)log("sms","New user","Your Biteway code is 4821. It expires in 5 minutes.");S.ob=Math.min(2,S.ob+1);},
  obBack:()=>{S.ob=0;},
  obDone:()=>{S.ob=0;S.cscreen="home";toast("Welcome, "+(S.obName||"friend")+". Your account is ready.");},
  restOpen:v=>{S.closed[v]=!S.closed[v];toast(S.closed[v]?rest(v).name+" is closed in the customer app.":rest(v).name+" is open for orders again.");},
  prep:v=>{S.prepChoice=+v;},
  kAccept:(v,id)=>kAccept(id),
  kReject:(v,id)=>kReject(id),
  kReady:(v,id)=>kReady(id),
  menuToggle:v=>{S.menuOff[v]=!S.menuOff[v];if(S.menuOff[v]&&S.cart[v]){delete S.cart[v];if(!Object.keys(S.cart).length)S.cartRest=null;}toast(S.menuOff[v]?"Marked sold out. Customers see it straight away.":"Back on the menu.");},
  rOnline:()=>{S.riderOnline=!S.riderOnline;},
  rAccept:()=>riderAccept(),
  rDecline:()=>toast("In the full build the request moves to the next nearest rider. For now, accept it."),
  rPick:()=>riderPick(),
  rDeliver:()=>riderDeliver(),
  rCash:()=>completeDelivery(),
  rCashBack:()=>{S.cashConfirm=false;},
  rDone:()=>{if(S.order)S.order.rDone=true;},
  atab:v=>{S.adminTab=v;},
  approveRest:(v,id)=>{const r=rest(id);if(!r)return;r.status="active";r.isNew=true;log("email",r.name,"Approved. Login details for the restaurant panel sent to "+r.owner+".");toast(r.name+" is now live in the customer app.");},
  declineRest:(v,id)=>{const r=rest(id);if(!r)return;r.status="declined";log("email",r.name,"Application declined, with the reason and how to reapply.");},
  riderDocs:v=>{const rd=S.riders[+v];if(!rd)return;rd.docs="Verified";rd.zone="Mall Road";log("sms",rd.name,"Your documents are approved. Go online to start delivering.");toast(rd.name+" can now go online.");},
  promoToggle:v=>{const p=S.promos.find(x=>x.code===v);if(p){p.active=!p.active;if(!p.active&&S.promoApplied===v){S.promoApplied=null;S.promoMsg="";}}},
  addPromo:()=>{
    const code=(S.newCode||"").trim().toUpperCase(),pct=parseInt(S.newPct,10),max=parseInt(S.newMax,10);
    if(!/^[A-Z0-9]{4,12}$/.test(code)){S.promoErr="Use 4 to 12 letters or numbers for the code.";return;}
    if(S.promos.some(p=>p.code===code)){S.promoErr=code+" already exists.";return;}
    if(!(pct>=5&&pct<=90)){S.promoErr="Percent off must be between 5 and 90.";return;}
    if(!(max>0)){S.promoErr="Set a maximum discount above zero.";return;}
    S.promos.unshift({code,type:"pct",val:pct,max,label:pct+"% off, up to "+money(max),uses:0,active:true});
    S.promoErr="";S.newCode="";toast(code+" is live. Customers can use it at checkout now.");
  },
  play:()=>{scrollToId("apps");play();},
  stop:()=>{playTok++;S.playing=false;},
  reset:()=>{playTok++;initState();toast("Everything is back to the start.");}
};

document.addEventListener("click",e=>{
  const el=e.target.closest("[data-a]");if(!el||el.disabled) return;
  const fn=ACT[el.dataset.a];if(!fn) return;
  fn(el.dataset.v,el.dataset.id,el);render();
});
document.addEventListener("input",e=>{
  const t=e.target;
  if(t.id==="q"){S.q=t.value;const l=$("#rlist");if(l)l.innerHTML=restList();return;}
  if(t.dataset&&t.dataset.bind) S[t.dataset.bind]=t.value;
});
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter") return;
  const t=e.target;
  if(t.id==="promo"){e.preventDefault();applyPromo();render();}
  else if(t.id==="newCode"||t.id==="newPct"||t.id==="newMax"){e.preventDefault();ACT.addPromo();render();}
});
function fromHash(){const h=location.hash.slice(1);if(VIEWS[h]&&h!==S.view){S.view=h;render();}}
window.addEventListener("hashchange",fromHash);

/* ---------- Full-order autoplay ---------- */
let playTok=0;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function play(){
  const tok=++playTok;
  initState();S.playing=true;
  const ok=()=>tok===playTok;
  const step=async(txt,fn,ms)=>{if(!ok())throw 0;S.playText=txt;if(fn)fn();render();await wait(ms);if(!ok())throw 0;};
  const until=async c=>{while(!c()){await wait(150);if(!ok())throw 0;}};
  try{
    await step("A customer opens the app.",()=>{S.view="customer";S.cscreen="home";},1300);
    await step("They pick Karahi House.",()=>{S.restId="kh";S.cscreen="menu";},1200);
    await step("Add a Chicken Karahi.",()=>addItem("kh1"),700);
    await step("Add Seekh Kebab.",()=>addItem("kh2"),700);
    await step("Add two Garlic Naan.",()=>{addItem("kh4");addItem("kh4");},1000);
    await step("Go to checkout.",()=>{S.cscreen="cart";},1300);
    await step("Apply promo code WELCOME50.",()=>{S.promo="WELCOME50";applyPromo();},1500);
    await step("Choose cash on delivery and place the order.",()=>{S.pay="cod";placeOrder();},2000);
    await step("The restaurant tablet rings with the new order.",()=>{S.view="restaurant";},1700);
    await step("The kitchen accepts it with a 20 minute prep time.",()=>{S.prepChoice=20;acceptLive();},1600);
    await step("The nearest rider gets a delivery request.",()=>{S.view="rider";S.riderOnline=true;},1800);
    await step("The rider accepts and rides to the restaurant.",()=>riderAccept(),200);
    await until(()=>S.order&&S.order.phase==="atRest");
    await step("The kitchen marks the food ready.",()=>{S.view="restaurant";readyLive();},1700);
    await step("The rider confirms pickup.",()=>{S.view="rider";riderPick();},1300);
    await step("The customer follows the rider live on the map.",()=>{S.view="customer";S.cscreen="track";},200);
    await until(()=>S.order&&S.order.phase==="atCust");
    await wait(1000);
    await step("At the door, the rider collects cash.",()=>{S.view="rider";riderDeliver();},1700);
    await step("Delivery complete.",()=>{if(S.cashConfirm)completeDelivery();},1500);
    await step("The customer gets SMS and email receipts.",()=>{S.view="customer";S.cscreen="track";},2200);
    await step("The admin console updates.",()=>{S.view="admin";S.adminTab="overview";},1600);
    S.playing=false;render();toast("That's the full order. Now try any of the apps yourself.");
  }catch(e){ if(tok===playTok){S.playing=false;render();} }
}

/* ---------- Movement loop ---------- */
let lastTs=0;
function tick(ts){
  const o=S.order;
  if(o&&(o.phase==="toRest"||o.phase==="toCust")){
    const dt=lastTs?Math.min(ts-lastTs,120):16;
    o.prog=Math.min(1,o.prog+dt/(o.phase==="toRest"?LEG1_MS:LEG2_MS));
    if(o.prog>=1){if(o.phase==="toRest")arriveRest();else arriveCust();render();}
    else updateMap();
  }
  lastTs=ts;requestAnimationFrame(tick);
}

const h0=location.hash.slice(1);if(VIEWS[h0]) S.view=h0;
render();
requestAnimationFrame(tick);
})();
