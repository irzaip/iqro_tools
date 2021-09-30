let ax = 0;
let bx = 0;
let xw;
let yh;
let mimg;
let cvv;
let allbox = [[0,0,0,0]];
let inputer;
let json_file = [];
let file_pref = './iqro1/';
let counter = '0000';
let namafile;
let fileid;
let ccc;
let ctxx;

function preload() {
    namafile = document.getElementById('namafile').value;
    my_img = loadImage(namafile); // Load the image
}
function setup() {

    cvv = createCanvas(my_img.width / 2 ,my_img.height / 2);

}

function draw() {
    //image(mimg, 0, 0, mimg.width / 2.5, mimg.height / 2.5);
    background(my_img);
    stroke(255,0,0);
    strokeWeight(2);
    for (let i = 0; i < allbox.length; i++) {
        line(allbox[i][0], allbox[i][1], allbox[i][0], allbox[i][3]);
        line(allbox[i][0], allbox[i][1], allbox[i][2], allbox[i][1]);
        line(allbox[i][2], allbox[i][3], allbox[i][2], allbox[i][1]);
        line(allbox[i][2], allbox[i][3], allbox[i][0], allbox[i][3]);
    }
}


function mousePressed() {
    if (ax == 0) {
        ax = parseInt(pmouseX);
        bx = parseInt(pmouseY);
    } else {
        xw = parseInt(pmouseX);
        yh = parseInt(pmouseY);
        allbox.push([ax,bx,xw,yh]);
        ax = 0;
        bx = 0;
    }
  }

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
    } else if (keyCode === RIGHT_ARROW) {
                allbox.pop();
            }
    }

function save_part(box,fn) {
    ccc = document.getElementById('defaultCanvas0');
    ctxx = ccc.getContext("2d");
    let get_window = box;
    cropped = ctxx.getImageData(get_window[0], get_window[1], get_window[2], get_window[3])
    let canvas1 = document.getElementById("canvas1");
    canvas1.width = get_window[2]-get_window[0];
    canvas1.height = get_window[3]-get_window[1];
    let ctx1 = canvas1.getContext("2d");
    ctx1.rect(0, 0, 100, 100);
    ctx1.fillStyle = 'white';
    ctx1.fill();
    ctx1.putImageData(cropped, 0, 0);
    saveCanvas(canvas1, fn)
    console.log("pasted!");
}

  function keyTyped() {
      if (key === 'm') {
          buildjson();
      } else if (key === 'z') {
          allbox.pop();
      }
  }

async function buildjson() {
    let temp;
    counter = 0;
    allbox.shift();
    allbox.forEach(m => {
      let sfn = fileid + "_" + zeroPad(counter, 4) + ".jpg"; 
      temp = {
          'x': m[0],
          'y': m[1],
          'x1' : m[2],
          'y1' : m[3],
          'file': sfn,
          'id': fileid + ".jpg"
      }
      counter++;
      json_file.push(temp);
      console.log('nilai m:' + m);
      save_part(m,sfn);
    })

    fileJSON = JSON.stringify(json_file);
    download(fileJSON, fileid + '_json.txt', 'text/plain');

}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }
  
function openfile() {
    let inputer = document.createElement('input');
    inputer.type = 'file';
 
    inputer.onchange = e => { 
    let file = e.target.files[0];
    document.getElementById('namafile').value = file_pref + file.name;

    fileid = file.name.split(".")[0];
    console.log(fileid); 
    preload();
    }
    inputer.click();
    allbox = [[0,0,0,0]];
}

