
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll reveal: section titles and cards rise in quietly, a row at a time */
(function(){
  if(reduce||!('IntersectionObserver' in window)) return;
  document.querySelectorAll('.split .shead,.products > *').forEach(el=>el.classList.add('rv'));
  document.querySelectorAll('.products').forEach(g=>{[...g.children].forEach((c,i)=>c.style.setProperty('--d',((i%3)*0.08)+'s'));});
  document.documentElement.classList.add('js-reveal');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('.rv').forEach(el=>el.classList.add('is-in')),6000);
})();

/* Bag: one small store shared by every page (kept in this browser only; design build, no real cart yet).
   The header badge always shows the total */
window.MDLFBag=(function(){
  const KEY='mdlf-bag', subs=[]; let items={};
  try{items=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){items={};}
  const bag=document.querySelector('.bag'), badge=bag&&bag.querySelector('.bag__n');
  const total=()=>Object.values(items).reduce((a,b)=>a+b,0);
  const paint=bump=>{
    if(!bag) return; const t=total();
    badge.textContent=t; bag.classList.toggle('has-items',t>0);
    bag.setAttribute('aria-label','Bag, '+t+' item'+(t===1?'':'s'));
    if(bump){bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump');}
  };
  paint(false);
  return {
    get:k=>items[k]||0, total,
    set(k,v){const before=total(); v=Math.max(0,Math.min(99,v)); if(v) items[k]=v; else delete items[k];
      try{localStorage.setItem(KEY,JSON.stringify(items));}catch(e){}
      paint(total()>before&&before>0); subs.forEach(f=>f(k));},
    on:f=>subs.push(f)
  };
})();

/* Pickers: one open at a time; outside click, scroll or Escape closes; arrows move through the options; the menu
   opens upward when there is no room below, and shifts left when it would leave the screen */
(function(){
  let open=null;
  const close=focusBtn=>{ if(!open) return; const p=open; open=null; p.classList.remove('is-open','pick--up'); p.querySelector('.pick__btn').setAttribute('aria-expanded','false');
    const c=p.closest('.card'); if(c) c.classList.remove('is-picking'); if(focusBtn) p.querySelector('.pick__btn').focus({preventScroll:true}); };
  document.querySelectorAll('.pick').forEach(p=>{
    const btn=p.querySelector('.pick__btn'), menu=p.querySelector('.pick__menu'), opts=[...p.querySelectorAll('.pick__o')];
    const show=()=>{ close(); open=p; const c=p.closest('.card'); if(c) c.classList.add('is-picking');
      menu.style.left=''; p.classList.add('is-open'); btn.setAttribute('aria-expanded','true');
      const r=btn.getBoundingClientRect(), mh=menu.offsetHeight, mr=menu.getBoundingClientRect();
      // inside the Holiday grid the menu can't pass the grid's bottom edge (the next section sits above the intro's pinned layer)
      const g=p.closest('.hero__grid'), floor=g?Math.min(innerHeight,g.getBoundingClientRect().bottom):innerHeight;
      if(r.bottom+9+mh>floor-8 && r.top-9-mh>8) p.classList.add('pick--up');
      if(mr.right>innerWidth-8) menu.style.left=(-14-(mr.right-(innerWidth-8)))+'px';
      (opts.find(o=>o.getAttribute('aria-selected')==='true')||opts[0]).focus({preventScroll:true}); };
    btn.addEventListener('click',e=>{ e.stopPropagation(); open===p?close():show(); });
    opts.forEach((o,i)=>{
      o.addEventListener('click',e=>{ e.stopPropagation(); const v=o.dataset.v;
        opts.forEach(x=>x.setAttribute('aria-selected',x===o?'true':'false'));
        p.dataset.value=v; p.querySelector('.pick__v').textContent=v; btn.setAttribute('aria-label',p.dataset.label+': '+v);
        close(true); p.dispatchEvent(new CustomEvent('pick',{detail:v})); });
      o.addEventListener('keydown',e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); opts[(i+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length].focus(); }
        else if(e.key==='Escape'){ e.preventDefault(); close(true); } else if(e.key==='Tab') close(); });
    });
    menu.addEventListener('click',e=>e.stopPropagation());
  });
  document.addEventListener('click',()=>close());
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(true); });
  addEventListener('scroll',()=>close(),{passive:true});
})();

/* Product cards: Add puts one in and turns into a quantity stepper; minus to zero takes it out again */
(function(){
  document.querySelectorAll('.buy').forEach(buy=>{
    // with a picker, each option is its own line in the bag ("Lattice Pie · Apple"); the seal shows the chosen one
    const card=buy.closest('.card'), base=buy.dataset.key, n=buy.querySelector('.qty__n'), pick=card.querySelector('.pick');
    const keyOf=()=>pick?base+' · '+pick.dataset.value:base;
    const paint=tick=>{const q=MDLFBag.get(keyOf()); n.textContent=q; card.classList.toggle('in-bag',q>0);
      if(tick){n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick');}};
    paint(false); MDLFBag.on(k=>{if(k===keyOf()) paint(true);});
    if(pick) pick.addEventListener('pick',()=>paint(false));
    buy.querySelector('.add').addEventListener('click',()=>{const k=keyOf(); MDLFBag.set(k,MDLFBag.get(k)+1); buy.querySelector('[data-step="1"]').focus({preventScroll:true});});
    buy.querySelectorAll('.qty__btn').forEach(b=>b.addEventListener('click',()=>{const k=keyOf();
      MDLFBag.set(k,MDLFBag.get(k)+ +b.dataset.step);
      if(!MDLFBag.get(k)) buy.querySelector('.add').focus({preventScroll:true});
    }));
  });
})();

/* Holiday intro.
   The first part is in the visitor's hand: scrolling lifts the blue paper away. Near the end of that lift
   the page takes over and eases the paper the last of the way; straight after, the tower's tile and the
   other pieces fade up into place, a warm light blooms and fades, and a little gold dust rises.
   Scrolling back up reverses it. The tower itself never moves or changes size. */
(function(){
  const sec=document.querySelector('.intro'); if(!sec) return;
  const root=document.documentElement, st=sec.querySelector('.intro__stage'), sheet=sec.querySelector('.sheet'), img=sheet.querySelector('.sheet__tower');
  const orn=sheet.querySelector('.orn'), oclip=sheet.querySelector('.oclip'), ornSh=sheet.querySelector('.orn-sh');
  // the bauble and its shadow, in the tower photo's own pixels (1060 wide): [left, top, width]
  // the bauble leans on the bowl, just behind its rim (48 px to the right of where it was shot); the mask is 1400 px wide
  const ORN=[759,793,312], ORNSH=[639,1124,565], ORNR=152.7, SHO=[.5,.5,195/565], CLIPW=1400;
  const paper=sec.querySelector('.sleeve__paper'), wins=sec.querySelectorAll('.js-win'), slot=sec.querySelector('.hero__slot');
  const pwin=sec.querySelector('.sleeve__win'), pshadow=sec.querySelector('.wshadow');
  const PH={rx:238,ry:332.7,cx:328,cy:422.9,w:656,h:845,tile:480};   // the oval inside paper-window.png / paper-shadow.png
  const htile=sec.querySelector('.htile'), halo=sec.querySelector('.halo'), dust=sec.querySelector('.dust'), set=(k,v)=>st.style.setProperty(k,v);
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const SHAPE=[[50,0],[58,0,62,6,66,10],[72,6,80,8,82,16],[96,40,100,58,100,75],[100,92,96,110,82,134],[80,142,72,144,66,140],[62,144,58,150,50,150],
               [42,150,38,144,34,140],[28,144,20,142,18,134],[4,110,0,92,0,75],[0,58,4,40,18,16],[20,8,28,6,34,10],[38,6,42,0,50,0]];
  const TW=938/1700, TX=533.5/1060, TY=868/1700, AR=1060/1700, TWX=526/1060;   // the tower (without its shadow) inside hol-pastel.jpg
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the order the pieces surface in: the head first, then around the tower
  sec.querySelector('.hero__head').style.setProperty('--dl','.1s');
  const order=[...sec.querySelectorAll('.hero__center .card'),...sec.querySelectorAll('.hero__col .card')];
  const delays=[0,.18,.42,.3,.54];
  order.forEach((c,i)=>c.style.setProperty('--dl',(delays[i]??.6)+'s'));
  sec.querySelectorAll('.itext span').forEach((s,i)=>s.style.setProperty('--dl',(.12+i*.1)+'s'));

  let W,H,box,span,PHS=null; const photo=sec.classList.contains('intro--photo');
  // the printed composition under the oval, as offsets below the oval's centre (cy) for an oval of height wh:
  // the gold ring, then Maison De La Fork, the title, the cupid, and the scroll cue
  // the printed composition under the oval, as offsets below the oval's centre (cy) for an oval of height wh, in units of
  // R, the gold ring's outer width: ring, gap .143R, Maison De La Fork (1.04R wide), gap .071R, the title (1.9R),
  // gap .079R, the cupid (.48R), gap .143R, the scroll cue
  // desktop proportions follow the client's layout exactly (all in oval heights wh below the oval's centre):
  // Maison De La Fork 1.133 x the window's width at .619, the title 2.067 x at .722, the cupid .529 x at .958, the cue at 1.30
  const comp=(wh,W,phone)=>{ const ww=wh*PH.rx/PH.ry, fs=(ww/2*1.03)/190, ring=wh/2*1.03+4*fs;
    if(!phone){ const mw=ww*1.133, mh=mw*52/631, mT=wh*.619, tw=Math.min(ww*2.067,W-48), tH=tw*284/2241, tT=wh*.722,
        cw=ww*.529, ch=cw*232/366, cT=wh*.958, qT=wh*1.30;
      return {ww,fs,ring,mw,mh,mT,tw,tH,tT,cw,ch,cT,qT,end:qT+32}; }
    // phones: the same spacing, with the title on two lines
    const mw=ww*1.0, mh=mw*52/631, mT=ring+wh*.09;
    const tw=Math.min(W*.62,ww*1.15,300), tH=tw*460/1174, tT=mT+mh+wh*.04;
    const cw=Math.min(ww*.42,110), ch=cw*232/366, cT=tT+tH+wh*.045, qT=cT+ch+wh*.08;   // about the cupid's size on desktop
    return {ww,fs,ring,mw,mh,mT,tw,tH,tT,cw,ch,cT,qT,end:qT+32}; };
  const layout=()=>{
    const hh=Math.round(document.querySelector('.header').getBoundingClientRect().bottom+scrollY);
    root.style.setProperty('--hh',hh+'px');
    W=st.clientWidth; H=st.clientHeight; span=sec.offsetHeight-H;
    const phone=W<=900, hero=sec.querySelector('.hero');
    // phones: the crest fills the width, so the composition needs room above and below the tower; the collection's
    // grid is pushed down until the tower's tile is centred where the oval should sit (the tower never moves)
    hero.style.paddingTop='';
    // the ribbon spans 784 px of frame-print2.png around the oval's centre; on phones it reaches to 10 px from the edges
    // on phones the ribbon is drawn smaller (frame-print-m.png: the bow and swags scaled to 80% about the knot), spanning 636 px
    // phones: the crest is sized by the screen alone: the ribbon reaches to 10 px from the edges unless the whole
    // crest (ribbon to scroll cue) would not fit under the header with a small margin, then it shrinks to fit.
    // (frame-print-m.png: the ribbon spans 636 px, reaching .886 wh above the oval's centre.) The collection's grid lays
    // out on its own, and when it appears the tower glides and scales into its tile.
    let whP=0, cyP=0;
    if(phone){ const hhv=Math.round(document.querySelector('.header').getBoundingClientRect().height), Mp=Math.max(14,H*.022);
      whP=(W-20)/636*380/1.03*PH.ry/PH.rx*.95; const room=H-hhv-2*Mp;
      for(let i=0;i<5;i++){ const tot=.886*whP+comp(whP,W,true).end; if(tot<=room+.5) break; whP*=room/tot; }
      const slack=room-(.886*whP+comp(whP,W,true).end); cyP=hhv+Mp+slack*.5+.886*whP; }
    const sr=slot.getBoundingClientRect(), tr=st.getBoundingClientRect();
    box={t:sr.top-tr.top,l:sr.left-tr.left,w:sr.width,h:sr.height};
    let w0=Math.min(box.h*.53/TW*AR, box.w*.53/TWX);
    // on phones the tower sits a little below the middle of its tile, so the tile has headroom above the bow
    let KY=phone?.58:.5;
    // desktop: the whole crest (ribbon to scroll cue) must fit the screen with an even margin above (below the header)
    // and below. In oval heights (wh) the composition runs from .892 wh above the oval's centre to .929 wh + 70 px below,
    // so it shrinks on short screens and is centred in the space; the tower then sits at that height in its tile
    if(!phone){ const hdrH=document.querySelector('.header').getBoundingClientRect().height, M=Math.min(100,Math.max(48,H*.1));
      let wh=w0/AR*TW*.8/.74*.92; const avail=H-hdrH-2*M;
      for(let i=0;i<4;i++){ const tot=.892*wh+comp(wh,W,false).end; if(tot<=avail+.5) break; const f=avail/tot; w0*=f; wh*=f; }
      // centred in the space, nudged a little upward
      const slack=avail-(.892*wh+comp(wh,W,false).end), thT=w0*.68/AR*TW; let c=hdrH+M*.8+slack*.42+.892*wh;
      c=Math.min(Math.max(c, box.t+thT/2+10), box.t+box.h-thT/2-10); KY=(c-box.t)/box.h; }
    if(phone) w0=whP*.74/.92*AR/(TW*.8);
    const w=w0*.85*.8, th0=w0/AR*TW*.8, th=w/AR*TW, cx=phone?W/2:box.l+box.w/2, cy=phone?cyP:box.t+box.h*KY;
    img.style.width=w.toFixed(1)+'px'; img.style.left=(cx-w*TX).toFixed(1)+'px'; img.style.top=(cy-(w/AR)*TY).toFixed(1)+'px';
    const ps=w/1060, il=cx-w*TX, it=cy-(w/AR)*TY;
    if(photo){ const ph=[...sec.querySelectorAll('.hphoto')].find(i=>getComputedStyle(i).display!=='none');
      const [px,py,pth]=ph.dataset.t.split(',').map(Number), [pw,phh]=ph.dataset.s.split(',').map(Number);
      const S=Math.max(W/pw,H/phh), L=(W-pw*S)/2, T=(H-phh*S)*.7, k=th/(pth*S);
      Object.assign(ph.style,{width:(pw*S)+'px',left:L+'px',top:T+'px'});
      PHS={el:ph,k,tx:cx-L-k*S*px,ty:cy-T-k*S*py}; }
    Object.assign(ornSh.style,{left:(il+ORNSH[0]*ps).toFixed(1)+'px',top:(it+ORNSH[1]*ps).toFixed(1)+'px',width:(ORNSH[2]*ps).toFixed(1)+'px'});
    Object.assign(oclip.style,{left:il.toFixed(1)+'px',top:it.toFixed(1)+'px',width:(CLIPW*ps).toFixed(1)+'px',height:(1700*ps).toFixed(1)+'px'});
    oclip.style.setProperty('--ol',(ORN[0]*ps).toFixed(1)+'px'); oclip.style.setProperty('--ot',(ORN[1]*ps).toFixed(1)+'px'); oclip.style.setProperty('--ow',(ORN[2]*ps).toFixed(1)+'px');
    // phones: where the tower goes in the collection (its tile), as a move and a scale about the tower's centre
    if(phone){ for(const el of [img,oclip,ornSh]){ el.style.removeProperty('--dts'); el.style.removeProperty('--dty'); } }
    if(phone){ const th3=Math.min(box.h*.66,box.w*.66), k3=th3/th, bx=box.l+box.w/2, by=box.t+box.h*.5;
      set('--tx',(bx-cx).toFixed(1)+'px'); set('--ty',(by-cy).toFixed(1)+'px'); set('--ts',k3.toFixed(4));
      // the tower scales about its own centre; the bauble and its shadow keep their own centres (so the bauble still
      // rolls about itself) and take the matching move: T + (1 - k)(C - O)
      img.style.transformOrigin=(cx-parseFloat(img.style.left)).toFixed(1)+'px '+(cy-parseFloat(img.style.top)).toFixed(1)+'px';
      img.style.setProperty('--etx',(bx-cx).toFixed(1)+'px'); img.style.setProperty('--ety',(by-cy).toFixed(1)+'px');
      oclip.style.transformOrigin=img.style.transformOrigin; oclip.style.setProperty('--etx',(bx-cx).toFixed(1)+'px'); oclip.style.setProperty('--ety',(by-cy).toFixed(1)+'px');
      for(const [el,o] of [[ornSh,SHO]]){ const l=parseFloat(el.style.left), t=parseFloat(el.style.top), w2=parseFloat(el.style.width);
        const ox=l+w2*o[0], oy=t+w2*o[2]*o[1];
        el.style.setProperty('--etx',(bx-cx+(1-k3)*(cx-ox)).toFixed(1)+'px'); el.style.setProperty('--ety',(by-cy+(1-k3)*(cy-oy)).toFixed(1)+'px'); } }
    else { for(const k of ['--tx','--ty','--ts']) st.style.removeProperty(k);
      // desktop: everything zooms about the tower's centre when the centre card is pointed at
      for(const el of [img,oclip,ornSh]) el.style.transformOrigin=(cx-parseFloat(el.style.left)).toFixed(1)+'px '+(cy-parseFloat(el.style.top)).toFixed(1)+'px';
      for(const el of [img,oclip,ornSh]){ el.style.removeProperty('--etx'); el.style.removeProperty('--ety'); }
      // desktop: once the collection is up, the tower grows into its tile to sit at the same scale as its neighbours,
      // centred in the photo area above the name (one glide, the same timing as the cards)
      const infoH=Math.min(96,box.h*.2), th4=Math.min((box.h-infoH)*.74,box.w*.78), k4=Math.max(1,Math.min(1.6,th4/th))*.9;
      const ty4=(box.t+(box.h-infoH)*.53)-cy;
      for(const el of [img,oclip,ornSh]){ el.style.setProperty('--dts',k4.toFixed(4)); el.style.setProperty('--dty',ty4.toFixed(1)+'px'); } }
    const rd=ORNR*ps*1.1; set('--rd',rd.toFixed(1)+'px'); set('--rt',(rd/(ORNR*ps)*180/Math.PI).toFixed(1)+'deg');
    const hs=Math.max(box.w,box.h)*1.05; Object.assign(halo.style,{width:hs+'px',height:hs+'px',left:(cx-hs/2)+'px',top:(cy-hs/2)+'px'});
    const wh=th0/.74*.92, ww=wh*PH.rx/PH.ry;
    const k=wh/2/PH.ry, rx=ww/2*1.035, ry=wh/2*1.035, d='M'+(cx-rx).toFixed(1)+' '+cy.toFixed(1)+' a'+rx.toFixed(1)+' '+ry.toFixed(1)+' 0 1 0 '+(2*rx).toFixed(1)+' 0 a'+rx.toFixed(1)+' '+ry.toFixed(1)+' 0 1 0 '+(-2*rx).toFixed(1)+' 0 Z';
    for(const el of [pwin,pshadow]) Object.assign(el.style,{width:(PH.w*k)+'px',left:(cx-PH.cx*k)+'px',top:(cy-PH.cy*k)+'px'});
    paper.style.backgroundSize=(PH.tile*k)+'px';
    wins.forEach(p=>p.setAttribute('d',d));
    const mask="url(\"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><path fill-rule="evenodd" d="M0 0H'+W+'V'+H+'H0Z '+d+'"/></svg>')+"\")";
    paper.style.webkitMaskImage=mask; paper.style.maskImage=mask;
    set('--wy',cy+'px'); set('--wwh',(ww/2)+'px');
    // crest frame: its gold oval sits just outside the cut (frame-print2.png: oval rx 190 at 654,585 in a 1070 x 1041 image)
    const fr=sec.querySelector('.sv--frame'), cu=sec.querySelector('.sv--cupid'), ti=sec.querySelector('.sv--title');
    const fs=(ww/2*1.03)/190;
    for(const f of sec.querySelectorAll('.sv--frame')) Object.assign(f.style,{width:(1070*fs)+'px',left:(cx-654.3*fs)+'px',top:(cy-585.2*fs)+'px'});
    const C=comp(wh,W,phone), ma=sec.querySelector('.sv--maison');
    Object.assign(ma.style,{width:C.mw+'px',left:(cx-C.mw/2)+'px',top:(cy+C.mT)+'px'});
    Object.assign(ti.style,{width:C.tw+'px',left:(cx-C.tw/2)+'px',top:(cy+C.tT)+'px'});
    Object.assign(cu.style,{width:C.cw+'px',left:(cx-C.cw*.5)+'px',top:(cy+C.cT)+'px'});
    Object.assign(htile.style,{left:box.l+'px',top:box.t+'px',width:box.w+'px',height:box.h+'px'});
    // phones: the tower's tile is shorter than the screen, so the rest of the collection is pulled up to sit right under it
    const hm=document.querySelector('.hmore');
    if(hm){ if(phone){ const gb=sec.querySelector('.hero__grid').getBoundingClientRect().bottom; hm.style.marginTop=(2-(tr.bottom-gb))+'px'; } else hm.style.marginTop=''; }
    const tl=sec.querySelector('.itext__l'), tr2=sec.querySelector('.itext__r');
    // the introduction, after the client's layout: on desktop the title sits right-aligned to the left of the tower
    // and the text to its right, both centred on the tower; on phones they stack, centred, under it
    const side=!phone||W>H*1.4;
    if(side){ const iw=Math.min(340,cx-.73*th-40), bf=parseFloat(getComputedStyle(tr2.querySelector('.itext__body')).fontSize), rw=bf*16.5;
      tl.style.width=iw+'px'; tr2.style.width=rw+'px';
      Object.assign(tl.style,{left:(cx-.73*th-iw)+'px',textAlign:phone?'right':''}); Object.assign(tr2.style,{left:(cx+.76*th)+'px',textAlign:''});
      tl.style.top=(cy-tl.offsetHeight/2-13)+'px'; tr2.style.top=(cy-tr2.offsetHeight/2+4)+'px'; }
    else { const below=cy+th/2+24; for(const el of [tl,tr2]) Object.assign(el.style,{width:(W-48)+'px',left:'24px',textAlign:'center'});
      tl.style.top=below+'px'; tr2.style.top=(below+tl.offsetHeight)+'px'; }
    if(photo){ // the introduction sits on the dark panelling above the garland, centred
      const w1=phone?W-48:Math.min(760,W-80), w2=phone?W-48:Math.min(520,W-80);
      Object.assign(tl.style,{width:w1+'px',left:((W-w1)/2)+'px',top:(H*(phone?.1:.14))+'px',textAlign:'center'});
      Object.assign(tr2.style,{width:w2+'px',left:((W-w2)/2)+'px',top:(H*(phone?.1:.14)+tl.offsetHeight+(phone?14:18))+'px',textAlign:'center'}); }
    set('--cuey',Math.min(H-44,cy+C.qT)+'px');
    // gold dust, scattered around the tower
    dust.innerHTML=''; const n=W<=900?16:28;
    for(let i=0;i<n;i++){ const m=document.createElement('i'), a=Math.random()*Math.PI*2, r=.25+Math.random()*.55;
      m.style.cssText=`--x:${(cx+Math.cos(a)*box.w*r).toFixed(0)}px;--y:${(cy+Math.sin(a)*box.h*r*.8).toFixed(0)}px;--s:${(2+Math.random()*3.5).toFixed(1)}px;`+
        `--d:${(.7+Math.random()*1.8).toFixed(2)}s;--t:${(2.6+Math.random()*2.2).toFixed(2)}s;--dx:${(Math.random()*40-20).toFixed(0)}px;--dy:${(-40-Math.random()*70).toFixed(0)}px`;
      dust.appendChild(m); }
  };

  const paintPhoto=s=>{ if(!PHS) return; const p=clamp((s-.04)/.96), e=p*p*(3-2*p), k=PHS.k+(1-PHS.k)*e;
    PHS.el.style.transform=`translate(${(PHS.tx*(1-e)).toFixed(1)}px,${(PHS.ty*(1-e)).toFixed(1)}px) scale(${k.toFixed(4)})`; };
  const paintSleeve=s=>{ paintPhoto(s); set('--sy',(-s*H*1.06).toFixed(1)+'px'); set('--so',clamp(s*12).toFixed(3)); set('--uo',(1-clamp(s*12)).toFixed(3)); };
  // three resting places: the paper (0), the introduction (A), the collection (B)
  let A=0,B=0, intro=false, revealed=false, gliding=false, lockUntil=0, lastY=scrollY, raf=0;
  const setStops=()=>{ B=span; A=span/2; };
  const enterIntro=instant=>{ if(intro) return; intro=true; paintSleeve(1); sec.classList.add('is-intro'); if(instant) sec.classList.add('no-anim'); };
  const leaveIntro=()=>{ if(!intro) return; intro=false; sec.classList.remove('is-intro','no-anim'); };
  const reveal=instant=>{ if(revealed) return; revealed=true; enterIntro(instant); sec.classList.add('is-revealed'); root.classList.add('hol-in'); if(instant) root.classList.add('hol-now'); if(instant) sec.classList.add('no-anim'); };
  const unreveal=()=>{ if(!revealed) return; revealed=false; sec.classList.remove('is-revealed'); root.classList.remove('hol-in'); };
  const glide=(to,dur,ease,done)=>{
    gliding=true; cancelAnimationFrame(raf); lockUntil=Infinity;
    const from=scrollY, t0=performance.now();
    const step=now=>{ const t=clamp((now-t0)/dur), y=from+(to-from)*ease(t);
      scrollTo({top:y,behavior:'instant'}); if(!intro) paintSleeve(clamp(y/A));
      if(t<1) raf=requestAnimationFrame(step); else { gliding=false; lastY=scrollY; lockUntil=performance.now()+900; done&&done(); } };
    raf=requestAnimationFrame(step);
  };
  const easeOut=t=>1-Math.pow(1-t,3), easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const toIntro=()=>{ sec.classList.add('is-intro'); glide(A,520+(A-scrollY)/Math.max(1,A)*480,easeOut,()=>enterIntro(false)); };
  const toCollection=()=>{ reveal(false); glide(B,1300,easeIO); };
  const backToIntro=()=>{ unreveal(); glide(A,1100,easeIO); };
  const onScroll=()=>{
    if(gliding) return;
    const y=scrollY, down=y>lastY; lastY=y;
    if(y<A-2){                                                   // the paper: in the visitor's hand
      if(intro&&performance.now()>lockUntil){ unreveal(); leaveIntro(); }
      if(!intro){ const s=clamp(y/A); paintSleeve(s); if(down&&s>=.62&&!reduceMotion) toIntro(); }
      return;
    }
    if(y<B-2){ enterIntro(false); if(y>(A+B)/2) reveal(false); else unreveal(); return; }   // scrollbar or keys between the stops
    reveal(y>B+H*.5);
  };
  // gestures at the introduction move on to the collection; at the top of the collection, back to the introduction
  // a gesture counts only when it is fresh: after a pause, or a new push stronger than the fading momentum
  let lastWheelT=0, lastMag=0;
  const fresh=(mag)=>{ const now=performance.now(), f=(now-lastWheelT>250)||(mag>lastMag*1.4+4); lastWheelT=now; lastMag=mag; return f; };
  const onIntent=(dir,e,mag)=>{
    if(reduceMotion) return;
    const y=scrollY, now=performance.now(), isFresh=mag===undefined?true:fresh(mag);
    if(gliding||now<lockUntil){ if(y<=B+4) e.preventDefault(); return; }
    const atStop=(intro&&!revealed&&Math.abs(y-A)<6)||(revealed&&y<=B+4&&y>=B-6&&dir<0);
    if(atStop&&!isFresh){ e.preventDefault(); return; }
    if(intro&&!revealed&&Math.abs(y-A)<6&&dir>0){ e.preventDefault(); toCollection(); }
    else if(revealed&&y<=B+4&&y>=B-6&&dir<0){ e.preventDefault(); backToIntro(); }
  };
  addEventListener('wheel',e=>{ const m=Math.abs(e.deltaY); if(m>=1) onIntent(Math.sign(e.deltaY),e,m); else fresh(0); },{passive:false});
  let ty=null;
  addEventListener('touchstart',e=>{ty=e.touches[0].clientY;},{passive:true});
  addEventListener('touchmove',e=>{ if(ty===null) return; const dy=ty-e.touches[0].clientY; if(gliding){e.preventDefault();return;} if(Math.abs(dy)>8){ onIntent(Math.sign(dy),e); ty=null; } },{passive:false});
  addEventListener('keydown',e=>{
    if(e.target.closest&&e.target.closest('input,textarea,select')) return;
    const down=['ArrowDown','PageDown',' '].includes(e.key)&&!e.shiftKey, up=['ArrowUp','PageUp'].includes(e.key)||(e.key===' '&&e.shiftKey);
    if(down) onIntent(1,e); else if(up) onIntent(-1,e);
  });

  root.classList.add('js-hero');
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{ layout(); setStops(); if(!intro) paintSleeve(clamp(scrollY/A)); });
  layout(); setStops();
  if(reduceMotion){ reveal(true); }
  else { lastY=scrollY; onScroll(); }
  if(document.fonts) document.fonts.ready.then(layout);
  const hc=sec.querySelector('.hero__center');
  hc.addEventListener('mouseenter',()=>sec.classList.add('tw-hover')); hc.addEventListener('mouseleave',()=>sec.classList.remove('tw-hover'));
  // the tile and the tower follow the grid whenever it moves for any reason a window resize doesn't report
  // (a scrollbar appearing or disappearing, late fonts or images): watch the slot and the stage themselves
  if(window.ResizeObserver){ let q=0, last='';
    const ro=new ResizeObserver(()=>{ cancelAnimationFrame(q); q=requestAnimationFrame(()=>{ const r=slot.getBoundingClientRect(), t=st.getBoundingClientRect();
      const k=[r.left-t.left,r.top-t.top,r.width,r.height,t.width,t.height].map(v=>v.toFixed(1)).join();
      if(k!==last){ last=k; layout(); setStops(); if(!intro) paintSleeve(clamp(scrollY/A)); } }); });
    ro.observe(slot); ro.observe(st); }
})();

/* the seal is pressed on every add, and again on every change of quantity */
document.querySelectorAll('.buy').forEach(b=>b.addEventListener('click',e=>{
  if(!e.target.closest('.qty__btn')) return;
  requestAnimationFrame(()=>{ const s=b.closest('.card').classList.contains('in-bag')?b.querySelector('.seal--n'):b.querySelector('.add .seal');
    if(!s) return; s.classList.remove('is-pressed'); void s.offsetWidth; s.classList.add('is-pressed'); });
}));

/* Corner pieces drift a few pixels against the pointer, as on the Holiday site */
(function(){
  if(reduce||!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const root=document.documentElement; let tx=0,ty=0,cx=0,cy=0,on=false;
  const step=()=>{cx+=(tx-cx)*.06;cy+=(ty-cy)*.06;root.style.setProperty('--mx',cx.toFixed(4));root.style.setProperty('--my',cy.toFixed(4));
    if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001) requestAnimationFrame(step); else on=false;};
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=Math.min(e.clientY/innerHeight,1)-.5;if(!on){on=true;requestAnimationFrame(step);}},{passive:true});
})();
