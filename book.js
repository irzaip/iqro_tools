let ax = 0;
let bx = 0;
let xw;
let yh;
let my_img;
let allbox = [];
let save_pref = './iqro1_data';
let bookfile_pref = './iqro1_book/';
let counter = '0000';
let namafile = './iqro1_book/0001.jpg';
let fileid = '0001';
let ccc;
let ctxx;

let div_status = document.getElementById('status');


function preload() {
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
        line(allbox[i]["x"], allbox[i]["y"], allbox[i]["x"], allbox[i]["y1"]);
        line(allbox[i]["x"], allbox[i]["y"], allbox[i]["x1"], allbox[i]["y"]);
        line(allbox[i]["x1"], allbox[i]["y1"], allbox[i]["x1"], allbox[i]["y"]);
        line(allbox[i]["x1"], allbox[i]["y1"], allbox[i]["x"], allbox[i]["y1"]);
    }
};

function mousePressed() {
    if (ax == 0) {
        ax = parseInt(pmouseX);
        bx = parseInt(pmouseY);
    } else {
        xw = parseInt(pmouseX);
        yh = parseInt(pmouseY);
        let sfn = fileid + "_" + zeroPad(counter, 4) + ".jpg"; 
        allbox.push(
            {'x': ax
            , 'y': bx
            , 'x1': xw
            , 'y1': yh
            , 'file': sfn
            , 'id': fileid + ".jpg" });
        ax = 0;
        bx = 0;
        counter++
    }
    redraw();
}


function keyTyped() {
    if (key === 's') {
        saveJson();
    } else if (key === 'z') {
        allbox.pop();
        counter--;
    } else if (key === 'v') {
        savePic();
    } else if (key === 'd') {
        saveJson();
        counter = '0000';
    } else if (key === 'a') {
        counter = '0000';
        allbox = [];
    } else if (key === 'q') {
        status(allbox.shift()['file']);
    }
}

function status(stts) {
  div_status.innerHTML = 'Status :' + stts;
}

async function saveJson() {
    fileJSON = JSON.stringify(allbox);
    const file = await download(fileJSON, fileid + '_json.txt', 'text/plain');
    console.log("file json sudah di save");
    status("file JSON sudah di save");
}


async function savePic() {
    console.log("Total record:"+ allbox.length);
    let fe = await allbox.forEach(async function(m) {
    ccc = document.getElementById('defaultCanvas0');
    ctxx = ccc.getContext("2d");
    cropped = ctxx.getImageData(m["x"],m["y"],m["x1"],m["y1"])
    let canvas1 = document.getElementById("canvas1");
    let ctx1 = canvas1.getContext("2d");
    canvas1.width = m["x1"]-m["x"];
    canvas1.height = m["y1"]-m["y"];
    ctx1.rect(0, 0, canvas1.width, canvas1.height);
    ctx1.fillStyle = 'white';
    ctx1.fill();
    ctx1.putImageData(cropped, 0, 0);
    const fl = await saveCanvas(canvas1, m["file"]);
    console.log('saved');
    status(m["file"] + " File Saved!");
    });
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
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
    namafile = bookfile_pref + file.name;
    fileid = file.name.split(".")[0];
    console.log("membuka halaman:"+fileid);
    allbox = [];
    preload();
    }    
    inputer.click();
    counter='0000';
}

async function loadjson() {
    await fetch(save_pref + "/" + fileid + '_json.txt')
          .then(response => response.json())
          .then(json => allbox = json);
    status(" Loaded " + allbox.length + " records");
    counter = allbox.length;
}
