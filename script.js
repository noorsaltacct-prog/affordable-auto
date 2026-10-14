const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const header=$('#header'), progress=$('#progress'), menu=$('#mobileMenu'), toggle=$('#menuBtn');
function onScroll(){header.classList.toggle('scrolled',scrollY>40);const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?scrollY/h*100:0)+'%'}addEventListener('scroll',onScroll,{passive:true});onScroll();
toggle.addEventListener('click',()=>{let open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open?'true':'false');toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
if('IntersectionObserver'in window){const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.04,rootMargin:'0px 0px 40px 0px'});$$('.reveal').forEach(el=>ob.observe(el))}else $$('.reveal').forEach(el=>el.classList.add('visible'));
$('#year').textContent=new Date().getFullYear();
const quote=$('#quoteDialog');$$('[data-open-quote]').forEach(el=>el.addEventListener('click',()=>quote.showModal()));$('#quoteClose').addEventListener('click',()=>quote.close());quote.addEventListener('click',e=>{if(e.target===quote)quote.close()});$('#quoteForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget);const msg=`Hi Mark, I found Affordable Mobile Mechanic online. My name is ${d.get('name')}. Vehicle: ${d.get('vehicle')}. Service: ${d.get('service')}. Issue: ${d.get('details')||'Please contact me about availability.'}`;location.href='sms:+18065004719?body='+encodeURIComponent(msg)});
const tiles=$$('.gallery-tile'), filterBtns=$$('[data-filter]'), track=$('#galleryGrid');
let currentFilter='all';
function visibleTiles(){return tiles.filter(t=>!t.hidden)}
function updateGallery(filter){
  currentFilter=filter;
  filterBtns.forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  tiles.forEach(t=>{t.hidden=filter!=='all'&&t.dataset.type!==filter});
  const count=visibleTiles().length;
  $('#galleryCount').textContent=`${count} ITEMS / SWIPE TO BROWSE`;
  track.scrollTo({left:0,behavior:'smooth'});
}
filterBtns.forEach(b=>b.addEventListener('click',()=>updateGallery(b.dataset.filter)));
function slideGallery(direction){const item=visibleTiles()[0];if(!item)return;const gap=14;track.scrollBy({left:direction*(item.getBoundingClientRect().width+gap),behavior:'smooth'})}
$('#galleryPrev').addEventListener('click',()=>slideGallery(-1));
$('#galleryNext').addEventListener('click',()=>slideGallery(1));
const lightbox=$('#lightbox'),lightMedia=$('#lightboxMedia');let active=0;
function openItem(i){
  const available=visibleTiles();if(!available.length)return;
  active=(i+available.length)%available.length;
  const tile=available[active];lightMedia.replaceChildren();
  if(tile.dataset.type==='video'){
    const video=document.createElement('video');video.src=tile.dataset.src;video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';lightMedia.append(video);
  }else{
    const img=document.createElement('img');img.src=tile.dataset.src;img.alt=`Actual repair photo ${active+1}`;lightMedia.append(img);
  }
  $('#lightboxLabel').textContent=`${tile.dataset.type==='video'?'VIDEO':'PHOTO'} / ${String(active+1).padStart(2,'0')} OF ${available.length}`;
  if(!lightbox.open)lightbox.showModal();
}
tiles.forEach(tile=>tile.addEventListener('click',()=>openItem(visibleTiles().indexOf(tile))));
function closeLight(){const v=lightMedia.querySelector('video');if(v)v.pause();lightbox.close();lightMedia.replaceChildren()}
$('#lightboxClose').addEventListener('click',closeLight);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLight()});
lightbox.addEventListener('close',()=>{const v=lightMedia.querySelector('video');if(v)v.pause()});
$('#prevItem').addEventListener('click',()=>openItem(active-1));
$('#nextItem').addEventListener('click',()=>openItem(active+1));
document.addEventListener('keydown',e=>{if(!lightbox.open)return;if(e.key==='ArrowLeft')openItem(active-1);if(e.key==='ArrowRight')openItem(active+1)});
let touchX=0;
lightMedia.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX},{passive:true});
lightMedia.addEventListener('touchend',e=>{const diff=e.changedTouches[0].screenX-touchX;if(Math.abs(diff)>65)openItem(active+(diff<0?1:-1))},{passive:true});
