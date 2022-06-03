 const scrollParentTo = (parentEl, y = 400) =>{
            if(!parentEl) return;
            parentEl.scroll({
                top: parentEl.scrollTop + y, 
                left: 0, 
                behavior: 'smooth'
            });
    };
export default scrollParentTo;