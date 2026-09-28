/* One entrance for the whole site: the hero's soft rise.
   Every block in a page section fades up 14px as it reaches the viewport;
   blocks that arrive together are staggered so they settle one after another.
   Uses the `translate` property, not `transform`, so hover lifts still work. */
(function(){
  if(!('IntersectionObserver' in window)) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var main=document.getElementById('main'); if(!main) return;

  var picked=[];
  function add(el){
    if(!el||el.nodeType!==1||picked.indexOf(el)>-1) return;
    var cs=getComputedStyle(el);
    // leave alone: already self-animating (home hero), hidden, or pinned
    if(cs.animationName!=='none'||cs.display==='none'||cs.position==='fixed'||cs.position==='sticky') return;
    if(el.closest('.rv')) return;
    picked.push(el);
  }
  main.querySelectorAll('.reveal').forEach(add);
  main.querySelectorAll(':scope > section, :scope > article, :scope > div').forEach(function(sec){
    var box=sec.querySelector(':scope > .container')||sec;
    [].forEach.call(box.children,function(c){
      // a two-column grid reads better if each column rises on its own
      if(c.children.length>1&&c.children.length<=4&&/grid|flex/.test(getComputedStyle(c).display)&&c.offsetHeight>window.innerHeight*.5){
        [].forEach.call(c.children,add);
      }else add(c);
    });
  });
  if(!picked.length) return;
  picked.forEach(function(el){ el.classList.add('rv'); });
  document.documentElement.classList.add('js-motion');

  var io=new IntersectionObserver(function(es){
    var i=0;
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.style.setProperty('--rv-d',Math.min(i++,5)*90+'ms');
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  },{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  picked.forEach(function(el){ io.observe(el); });
})();
