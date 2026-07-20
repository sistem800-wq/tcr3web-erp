(function(){
  'use strict';
  function clearPanel(button){
    const panel=button.closest('[data-page-filter]');
    if(!panel)return;
    panel.querySelectorAll('input').forEach(input=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));});
    panel.querySelectorAll('select').forEach(select=>{select.selectedIndex=0;select.dispatchEvent(new Event('change',{bubbles:true}));});
    const input=panel.querySelector('input'); if(input) input.focus({preventScroll:true});
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-filter-clear]');if(b)clearPanel(b)});
  window.TCR3FilterComponent={clearPanel};
})();
