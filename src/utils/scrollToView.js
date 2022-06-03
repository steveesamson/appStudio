const scrollToView = (el) =>{
    if(!el) return;
    el.scrollIntoView({behavior: "smooth", block:'nearest', inline: "start"});
}

export default scrollToView;