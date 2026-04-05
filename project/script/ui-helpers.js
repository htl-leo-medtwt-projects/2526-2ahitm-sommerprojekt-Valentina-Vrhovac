function show(element){
    if(element){
        element.classList.remove("hidden");
    }
}

function hide(element){
    if(element){
        element.classList.add("hidden");
    }
}

function toggle(element, className, condition){
    if(element){
       if(condition){
        element.classList.add(className);
       }else{
        element.classList.remove(className);
       }
    }
}