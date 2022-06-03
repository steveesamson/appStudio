const scrollElBy = (el, by=200) =>{
    if(!el) return;
    el.scroll({
        top: el.scrollTop + by, 
        left: 0, 
        behavior: 'smooth'
    });
}

export default scrollElBy;