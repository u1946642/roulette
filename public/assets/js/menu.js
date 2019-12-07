const hostname =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;


const enterRoom = (e) =>{
    var url = event.target.href;   
     // Prevent default action (e.g. following the link)
    event.preventDefault();
    var request = new XMLHttpRequest();
    const apiPath = "/api/users/";
    request.open("POST",hostname+apiPath,true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 201) {
            var json = JSON.parse(request.responseText);
            console.log(json);
            sessionStorage.setItem("userId",json.user.id);
            window.open(url, '_self');
        }
    };
    var data = JSON.stringify({
        name:sessionStorage.getItem("name")
    });
    request.send(data);
    


};
const saveName = (e) =>{

}