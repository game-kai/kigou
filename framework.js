'use strict';

// 画面クラス
const Screen = class {
    #canvas = null;
    #context = null;

    constructor (canvas = null) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d'); 
        this.#context.imageSmoothingEnabled = false;
    }

    clear () {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    // 画像描画メソッド
    draw (image = null, sx = 0, sy = 0, sw = 1, sh = 1, dx = 0, dy = 0, dw = 1, dh = 1, alpha = 1, xReverse = false, yReverse = false, operation = 'source-over') {
        if(image == undefined) return;

        // 反転の状態を保存
        this.#context.save();

        // 左右反転
        if(xReverse) {
            this.#context.scale(-1, 1);
            dx = -dx;
            dw = -dw;
        }
        // 上下反転
        if(yReverse) {
            this.#context.scale(1, -1);
            dy = -dy;
            dh = -dh;
        }

        this.#context.globalAlpha = alpha; // 不透明度
        this.#context.globalCompositeOperation = operation; // 合成の仕方

        this.#context.drawImage(
            image.element,
            sx * image.cw,
            sy * image.ch,
            sw * image.cw,
            sh * image.ch,
            dx,
            dy,
            dw * image.cw,
            dh * image.ch
        );
        
        this.#context.restore();
    }

    fill (color, x, y, w, h) {
        this.#context.fillStyle = color;
        this.#context.fillRect(x, y, w, h);
    }

    get context() {
        return this.#context;
    }
}

// 画像クラス
const Image = class {
    #image = null;
    #cw = 8;
    #ch = 8;

    constructor (img = null, cw = 8, ch = 8) {
        this.#image = img;
        this.#cw = cw;
        this.#ch = ch;
    }

    // ゲッター
    get cw () {
        return this.#cw;
    }
    get ch () {
        return this.#ch;
    }

    // 要素を得る
    get element () {
        return this.#image;
    }
}

// 色変更画像クラス
const ColorImage = class {
    #canvas = null;
    #cw = 8;
    #ch = 8;

    constructor (image = null, colorChangeAllay = []) {
        this.#cw = image.cw;
        this.#ch = image.ch;

        // キャンバスを準備
        this.#canvas = document.createElement('canvas');
        this.#canvas.width = image.element.width;
        this.#canvas.height = image.element.height;
        const context = this.#canvas.getContext('2d');
        context.drawImage(image.element, 0, 0);

        // 色変換
        const pixelLength = this.#canvas.width * this.#canvas.height * 4;
        const dstPixel = context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);

        const srcPixelData = [];
        for (let p = 0; p < pixelLength; p++) {
            srcPixelData[p] = dstPixel.data[p];
        }

        for(let c = 0; c < colorChangeAllay.length / 2; c++) {
            const srcColor = colorChangeAllay[c * 2 + 0];
            const dstColor = colorChangeAllay[c * 2 + 1];

            for(let p = 0; p < pixelLength; p += 4) {
                if(
                    srcPixelData[p + 0] === srcColor[0] &&
                    srcPixelData[p + 1] === srcColor[1] &&
                    srcPixelData[p + 2] === srcColor[2] &&
                    srcPixelData[p + 3] === srcColor[3]
                ) {
                    dstPixel.data[p + 0] = dstColor[0];
                    dstPixel.data[p + 1] = dstColor[1];
                    dstPixel.data[p + 2] = dstColor[2];
                    dstPixel.data[p + 3] = dstColor[3];
                    continue;
                }
                
                dstPixel.data[p + 0] = srcPixelData[p + 0];
                dstPixel.data[p + 1] = srcPixelData[p + 1];
                dstPixel.data[p + 2] = srcPixelData[p + 2];
                dstPixel.data[p + 3] = srcPixelData[p + 3];
            }
        }
            
        context.putImageData(dstPixel, 0, 0);
    }

    // ゲッター
    get cw () {
        return this.#cw;
    }
    get ch () {
        return this.#ch;
    }

    // 要素を得る
    get element () {
        return this.#canvas;
    }
}


// 音声クラス
const Audio = class {

    //Web Audioのオブジェクト
    #audioContext;
    #gainNode = [];
    #oscillatorNode = [];

    #isStarted = false; // 開始済み
    #isOn = false; // 有効
    #frequency = []; // 音の高さから周波数への変換

    // 初期化
    constructor () {
        // 音声の周波数計算
        this.#frequency = [];
        let nextFreq = Math.pow(2, 1 / 12);
        let f;
        f = 440;
        for (let n = 49; n < 128; n++) {
            this.#frequency[n] = f;
            f *= nextFreq;
        }
        f = 440;
        for (let n = 49; n >= 0; n--) {
            this.#frequency[n] = f;
            f /= nextFreq;
        }
    }

    start (noteNum) {
        if(this.#isStarted) return false;

        this.#audioContext = new AudioContext();

        for(let n = 0; n < noteNum; n++) {
            this.#oscillatorNode[n] = this.#audioContext.createOscillator();
            this.#oscillatorNode[n].type = "sine";

            this.#gainNode[n] = this.#audioContext.createGain();
            this.#gainNode[n].gain.setValueAtTime(0, this.#audioContext.currentTime);

            this.#oscillatorNode[n].connect(this.#gainNode[n]).connect(this.#audioContext.destination);
            this.#oscillatorNode[n].start(0);
        }
        this.#isStarted = true;

        return true;
    }

    // 既に開始しているか
    get isStarted () {
        return this.#isStarted;
    }

    // 既に開始しているかを設定
    set isStarted (s) {
        this.#isStarted = s;
    }

    // 有効化
    on () {
        this.#isOn = true;
    }

    // 無効化
    off () {
        this.#isOn = false;
        this.stop();
    }

    // 有効かどうか
    get isOn () {
        return this.#isOn;
    }

    // 鳴らす
    play (note = [51]) {
        if(!this.#isStarted) return;
        if(!this.#isOn) return;

        const currentTime = this.#audioContext.currentTime;

        for(let n = note.length; n < this.#oscillatorNode.length; n++) {
            const v = this.#gainNode[n].gain.value;
            this.#gainNode[n].gain.cancelScheduledValues(currentTime);
            this.#gainNode[n].gain.setValueAtTime(v, currentTime);
            this.#gainNode[n].gain.linearRampToValueAtTime(0, currentTime + 0.1);
        }

        for(let n = 0; n < note.length; n++) {
            const v = this.#gainNode[n].gain.value;
            this.#oscillatorNode[n].frequency.setValueAtTime(this.#frequency[note[n]], currentTime);
            this.#gainNode[n].gain.setValueAtTime(v, currentTime);
            this.#gainNode[n].gain.linearRampToValueAtTime(0.2, currentTime + 0.1);
        }
    }

    // 止める
    stop () {
        if(!this.#isStarted) return;
        
        const currentTime = this.#audioContext.currentTime;
        for(let n = 0; n < this.#oscillatorNode.length; n++) {
            const v = this.#gainNode[n].gain.value;
            this.#gainNode[n].gain.cancelScheduledValues(currentTime);
            this.#gainNode[n].gain.setValueAtTime(v, currentTime);
            this.#gainNode[n].gain.linearRampToValueAtTime(0, currentTime + 0.1);
        }
    }
}
