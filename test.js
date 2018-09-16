var input = prompt("What would you like to watch?");
//allow user to select specific video
//label different buttons on hover
//playlist option to show all videos in playlist
//use a regular expression to see if the input is a full link or a search term

var noSpacesText = input.replace(' ','');
console.log(noSpacesText);
if(noSpacesText){
  refreshState()
  //make option so that the user can input full youtube link as well or just an embed code from any video
  var container = document.createElement("div");
  container.setAttribute('style','position:fixed;right:8px;bottom:8px');
  container.style.width = "360px";
  container.style.height = "215px";
  container.setAttribute("id", "buttons");
  document.body.appendChild(container);
  var button1 = document.createElement("div")
  var button2 = document.createElement("div");
  var enlargebutton = document.createElement("div");
  var closebutton = document.createElement("div");
  button1.setAttribute("id", "button1x"); //not working
  button2.setAttribute("id", "button2x");
    button2.setAttribute("onload", "draw();");
  enlargebutton.setAttribute("id", "enlarge");
  button1.setAttribute('style','box-shadow: 0 9px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);width:28px;height:86%;background-color:black;position:relative;top:2px;right:0px');
  button2.setAttribute('style','box-shadow: 0 9px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);width:28px;height:86%;background-color:black;position:relative;left:332px;top:-183px');
  enlargebutton.setAttribute('style','box-shadow: 0 9px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);width:100%;height:28px;background-color:black;position:relative;left:0px;top:0px');
  closebutton.setAttribute('style','width:6px;height:13%;border-style:solid;background-color:white;position:relative;left:0px;top:0px');
  container.appendChild(enlargebutton);
  container.appendChild(button1);
  container.appendChild(button2);
  button2.appendChild(closebutton);

  var canvas1 = document.createElement("canvas");
  canvas1.setAttribute("id", "canvas");
  canvas1.setAttribute("width", "28");
  canvas1.setAttribute("height", "40");
  button1.appendChild(canvas1);
  getRequest(noSpacesText);
}

function bigger() {
  document.getElementById("myVid").setAttribute('width','560');
  document.getElementById("myVid").setAttribute('height','354');
  document.getElementById("button2x").setAttribute('style','width:28px;height:165%;background-color:black;position:relative;left:332px;top:-352px');
}

function returnToNormal() {
  document.getElementById("myVid").setAttribute('width','300');
  document.getElementById("myVid").setAttribute('height','185');
  document.getElementById("button2x").setAttribute('style','box-shadow: 0 6px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);width:28px;height:86%;background-color:black;position:relative;left:332px;top:-183px');
}

function close() {
  refreshState();
  container.removeChild(document.getElementById("button2x"));
    container.removeChild(document.getElementById("enlarge"));
      container.removeChild(document.getElementById("button1x"));
}

function refreshState() {
    if(document.getElementById("myVid")) {
      document.body.removeChild(document.getElementById("myVid"));
    }
}

function createVideo() {
  var vid = document.createElement("iframe");
  vid.setAttribute("id", "myVid");
  vid.setAttribute('width','300');
  vid.setAttribute('height','185');
  vid.setAttribute('frameborder','0');
  vid.setAttribute('allowfullscreen','');
  vid.setAttribute('style','position:fixed;right:38px;bottom:8px');
  document.body.appendChild(vid);

  return vid;
}

function changeVideo (id,results) {
  var vid = createVideo();
  vid.setAttribute('src','https://www.youtube.com/embed/' + results[id]);
}

function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(15,10);
    ctx.lineTo(28,15);
    ctx.lineTo(28,5);
    ctx.fill();
  }
}

// function getParameterByName(name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, "\\$&");
//     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, " "));
// }

function getRequest(word) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
          if (request.readyState == 4 && request.status == 200) {
            var obj = JSON.parse(request.responseText);
            var x = obj.items[0].id.videoId;
            console.log(obj);
              var count = 0;
              var results = [];
              while (count < 50) {
                if (obj.items[count].id.videoId != undefined) {
                  results[count] = obj.items[count].id.videoId;
                }
              count = count + 1;
              console.log(results);
              }
              count = 0;
              //needd to still fix case where there is no videoId
              button2.addEventListener("click",function (){
                refreshState();
                if (results[count + 1] != undefined) {
                count = count + 1;
                document.getElementById("enlarge").style.visibility = 'visible';
                document.getElementById("button1x").style.visibility = 'visible';
                changeVideo(count,results);
                }});

                button1.addEventListener("click",function (){
                  refreshState();
                  if (results[count - 1] != undefined) {
                  count = count -1;
                  document.getElementById("enlarge").style.visibility = 'visible';
                  document.getElementById("button1x").style.visibility = 'visible';
                  changeVideo(count,results);
                  }});

                closebutton.addEventListener("click", function (event){
                  close();
                  event.stopPropagation();
                });
                button2.addEventListener("mouseover", returnToNormal);
                enlargebutton.addEventListener("click", bigger);

              var vid = createVideo();
              vid.setAttribute('src','https://www.youtube.com/embed/' + x);

          }
      };
      var string = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=" + word+ "&key=AIzaSyCPB_Yu9bNZHyLZ5zehXRl7GL0u-85pCto"
  request.open("GET", string , true);
request.send();
}
