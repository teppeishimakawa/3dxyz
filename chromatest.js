var finresult=[];
var finresult2=[];
var j;


var video2 = document.getElementById('video2');
    // video2は非表示にしておく
    video2.style.display = 'none';

    var canvas2 = document.getElementById('canvas2');
    // そのまま表示すると鏡像にならないので反転させておく
    video2.style.transform = 'rotateY(180deg)';

    var context = canvas2.getContext('2d');

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia({video:
  {
  //明示的にアスペクト比指定しないとfacetimeHDcamは正方形になるから。
  //aspectRatio: {exact: 1.7777777778},
  width: 1280,height:720}, audio: false}, function (stream) {
        video2.srcObject = stream;


        draw();


        //draw();
    }, function () {});

    // video2の映像をcanvas2に描画する
    var draw = function () {
        context.drawImage(video2, 0, 0, canvas2.width,canvas2.height,0, 0, canvas2.width, canvas2.height);
        // ここでクロマキー処理をする
        chromaKey();
        requestAnimationFrame(draw);
        if(j== null){return}
        console.log(j);
       document.getElementById("res").innerHTML=j;
        j=null;
    };

    // 消す色と閾値
    var chromaKeyColor = {r: 0, g: 255, b: 0},
        colorDistance = 500;

    // クロマキー処理
    var chromaKey = function ()
    {
        var imageData = context.getImageData(0, 0, canvas2.width, canvas2.height),
            data = imageData.data; //参照渡し

        // dataはUint8ClampedArray
        // 長さはcanvas2の width * height * 4(r,g,b,a)
        // 先頭から、一番左上のピクセルのr,g,b,aの値が順に入っており、
        // 右隣のピクセルのr,g,b,aの値が続く
        // n から n+4 までが1つのピクセルの情報となる

        for (var i = 0, l = data.length; i < l; i += 64)
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
            setTimeout(function(){finresult.length=0;},5000);
            }
            /*var j=finresult.reduce((a,b)=>Math.min(a,b));
            finresult2.push(j);
            var k=finresult2.join(',');
            console.log(k); */

        }

           //finresult.push(i);
           //console.log(finresult.reduce((a,b)=>Math.min(a,b)));

        context.putImageData(imageData, 0, 0);
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





    var distance = document.getElementById('distance');
    distance.style.textAlign = 'right';
    distance.addEventListener('change', function () {
        colorDistance = this.value;
    });

//canvasの縦横、位置をUIで変化させる。
    canvas2Wid.style.textAlign = 'right';
    canvas2Wid.addEventListener('change', function () {
        document.getElementById("canvas2").width = this.value;
    });

        canvas2Hei.style.textAlign = 'right';
    canvas2Hei.addEventListener('change', function () {
        document.getElementById("canvas2").height = this.value;
    });

            canvas2X.style.textAlign = 'right';
    canvas2X.addEventListener('change', function () {
        document.getElementById("canvas2").style.left = this.value + "px";
    });

            canvas2Y.style.textAlign = 'right';
    canvas2Y.addEventListener('change', function () {
        document.getElementById("canvas2").style.top = this.value + "px";
    });
