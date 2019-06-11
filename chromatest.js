var finresult=[];
var finresult2=[];
var j;

var xx=0;
var yy=0;
var widwid=1280;
var heihei=720;
var originalCan2Wid=1280;
var originalCan2Hei=720;
var flg_chroma;

//測定精度。4で1pixl,64で16pixelごとに検知
var seido=8;


xx=document.getElementById('canvas2X').value;
yy=document.getElementById('canvas2Y').value;
widwid=document.getElementById('canvas2Wid').value;
heihei=document.getElementById('canvas2Hei').value;




var video2 = document.getElementById('video2');
    // video2は非表示にしておく
    video2.style.display = 'none';

    var canvas2 = document.getElementById('canvas2');
    canvas2.width=originalCan2Wid;
    canvas2.height=originalCan2Hei;
    // そのまま表示すると鏡像にならないので反転させておく
    video2.style.transform = 'rotateY(180deg)';

    var context = canvas2.getContext('2d');

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia({
  video:
  {
  //明示的にアスペクト比指定しないとfacetimeHDcamは正方形になるから。
  //aspectRatio: {exact: 1.7777777778},
  optional:[{sourceId:camid}]
  },
  video:
  {
  width: originalCan2Wid,height:originalCan2Hei
  },
  audio: false}, function (stream) {
        video2.srcObject = stream;


        draw();

        /*
        if(finresult.length == 0){
        document.getElementById("kekka").style.color="black";
        }else{document.getElementById("kekka").style.color="red";}
        */

    }, function () {});





    // video2の映像をcanvas2に描画する
    var draw = function () {
        context.clearRect(0, 0, originalCan2Wid, originalCan2Hei);
        //context.drawImage(video2,500,500,100,200,500,500,100,200);
        context.drawImage(video2,xx,yy,widwid,heihei,xx,yy,widwid,heihei);
        // ここでクロマキー処理をする
        chromaKey();
        requestAnimationFrame(draw);
        if(j== null){return}
        //jは透明でない、一番小さいピクセル番号
       document.getElementById("res").innerHTML=j;
       //透明でないピクセル番号をx,yスクリーン座標に変換
        /*d
       k:0から始まるpixel番号、j:透明でないa番号
       xはk/(canvas2.width + 1)の余り
       yはk/(canvas2.width + 1)の商
       3+(k*4)=j (j>=3)
        */
        document.getElementById("analyz_p2x").innerHTML=((j-3)/4)%(parseInt(widwid) + 1) + parseInt(xx);
        document.getElementById("analyz_p2y").innerHTML=parseInt(Math.floor((j-3)/4)/(parseInt(widwid) + 1) + parseInt(yy));
        j=null;
        //p2の検出からxyz変換、距離算出に時間が掛かるから100msの遅延挿入
        //setTimeout(function(){document.getElementById("kekka").innerHTML=document.getElementById("txt5").value;},100);

        if(flg_chroma == 1)
        {
        //spaceで配列空にするパターンの時は下記不要
        //setTimeout(function(){finresult.length=0},8000);
        //flg_chroma=0;
         }


        if(document.getElementById("spaceflg1").innerHTML == 1)
        {
        finresult.length=0;
        flg_chroma=0;
        document.getElementById("spaceflg1").innerHTML =0;
         }

    };


var sto_col_val=localStorage.getItem("sto_col");
sto_col_val = sto_col_val.replace(/^#/, '');

    // 消す色と閾値
        var chromaKeyColor = {r: parseInt(sto_col_val.substr(0, 2), 16),
                              g: parseInt(sto_col_val.substr(2, 2), 16),
                              b: parseInt(sto_col_val.substr(4, 2), 16)}
        //colorDistance = 500;






    // クロマキー処理
    var chromaKey = function ()
    {
        var imageData = context.getImageData(xx,yy,widwid,heihei);
            data = imageData.data; //参照渡し

        // dataはUint8ClampedArray
        // 長さはcanvas2の width * height * 4(r,g,b,a)
        // 先頭から、一番左上のピクセルのr,g,b,aの値が順に入っており、
        // 右隣のピクセルのr,g,b,aの値が続く
        // n から n+4 までが1つのピクセルの情報となる

        for (var i = 0, l = data.length; i < l; i += seido)
        {
            var target = {
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                };

            // chromaKeyColorと現在のピクセルの三次元空間上の距離を閾値と比較する
            // 閾値より小さい（色が近い）場合、そのピクセルを消す
            if (getColorDistance(chromaKeyColor, target) < colorDistance) {
                // alpha値を0にすることで見えなくする
                data[i + 3] = 0;
            }
            else
            {
            finresult.push(i);
            j=finresult.reduce((a,b)=>Math.min(a,b));
            flg_chroma=1;
            /*
            //finresult.length=0;
            if(finresult.length == 0){return false}else
                {setTimeout(function()
                {finresult.length=0},5000);}
                */

            //jは透明でない最小のpixel番号
            //console.log(finresult.length);
            }
            /*var j=finresult.reduce((a,b)=>Math.min(a,b));
            finresult2.push(j);
            var k=finresult2.join(',');
            console.log(k); */
        }

           //finresult.push(i);
           //console.log(finresult.reduce((a,b)=>Math.min(a,b)));

        context.putImageData(imageData,xx,yy);
    };

    // r,g,bというkeyを持ったobjectが第一引数と第二引数に渡される想定
    var getColorDistance = function (rgb1, rgb2) {
        // 三次元空間の距離が返る
        return Math.sqrt(
            Math.pow((rgb1.r - rgb2.r), 2) +
            Math.pow((rgb1.g - rgb2.g), 2) +
            Math.pow((rgb1.b - rgb2.b), 2)
        );
    };

    var color = document.getElementById('color');


    color.addEventListener('change', function () {
        // フォームの値は16進カラーコードなのでrgb値に変換する
        chromaKeyColor = color2rgb(this.value);
    });

       var color2rgb = function (color) {
        color = color.replace(/^#/, '');
        return {
            r: parseInt(color.substr(0, 2), 16),
            g: parseInt(color.substr(2, 2), 16),
            b: parseInt(color.substr(4, 2), 16)
        };
    };





//text要素はcanvas2Wid,canvas2Hei,canvas2X,canvas2Y

    var distance = document.getElementById('distance');
    distance.style.textAlign = 'right';
    distance.addEventListener('change', function () {
        colorDistance = this.value;
    });

//canvasの縦横、位置をUIで変化させる。


    document.getElementById("mask").addEventListener('click', function () {
        xx=document.getElementById("canvas2X").value;
        yy=document.getElementById("canvas2Y").value;
        widwid=document.getElementById("canvas2Wid").value;
        heihei=document.getElementById("canvas2Hei").value;
    });

