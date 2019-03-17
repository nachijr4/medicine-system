var wel = $("div p"), word="Welcome!";
var i=0;
console.log(wel.text());
wel.text("        ");
function graphics(){
    if(i<word.length){
        if(i==0){
        wel.text("        ");
        }
        wel.text(wel.text()+word.charAt(i++));
        // console.log(i);
        setTimeout(graphics,500);
    }
    else{
        i=0;
        console.log(i);
        // wel.text("        ");
        setTimeout(graphics,100);
    }
}
graphics();