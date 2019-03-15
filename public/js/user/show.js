var button = $("button.btn.btn-danger")
console.log(button);

$(".card").on("mouseenter",function(event){
    event.stopPropagation();
    $("this button").text("Remove");
    console.log($("this button"));
});

button.text(" ");