'use strict';

// 要素
const canvas = document.querySelector('canvas'); // キャンバス
const spriteImg = document.querySelector('img'); // 画像

// スクリプト全体
const script = (event) => {
    const screen = new Screen(canvas); // 画面
    const spriteImage = new Image(spriteImg, 8, 8); // 画像

    // 色変えスプライト
    const colorSprite = [];
    colorSprite[0] = new ColorImage(spriteImage);
    colorSprite[1] = new ColorImage(spriteImage, [[255, 255, 255, 255], [255, 51, 51, 255]]);
    colorSprite[2] = new ColorImage(spriteImage, [[255, 255, 255, 255], [255, 153, 51, 255]]);
    colorSprite[3] = new ColorImage(spriteImage, [[255, 255, 255, 255], [255, 255, 51, 255]]);
    colorSprite[4] = new ColorImage(spriteImage, [[255, 255, 255, 255], [51, 255, 51, 255]]);
    colorSprite[5] = new ColorImage(spriteImage, [[255, 255, 255, 255], [51, 255, 255, 255]]);
    colorSprite[6] = new ColorImage(spriteImage, [[255, 255, 255, 255], [51, 51, 255, 255]]);
    colorSprite[7] = new ColorImage(spriteImage, [[255, 255, 255, 255], [153, 51, 255, 255]]);
    colorSprite[8] = new ColorImage(spriteImage, [[255, 255, 255, 255], [255, 51, 255, 255]]);
    colorSprite[9] = new ColorImage(spriteImage, [[255, 255, 255, 255], [153, 153, 153, 255]]);

    let state = 'title';
    let countdown = 0;
    let stage = 0;
    const kigou = {
        div : 3,
        scroll: {
            dir : 'no', // right, left, down, up, x, y, no
            loop : 0,
        },
        array : null,
        goal : {
            char: 0,
            color: 0,
        },
    };

    // 処理
    const proc = (deltaTime) => {
        if(countdown > 0) countdown -= deltaTime;
        else countdown = 0;
        if(state === 'ready') {
            if(countdown <= 0) {
                state = 'game';
                countdown = 7.999;
                initStage();
            }
        }
        else if(state === 'game') {
            kigou.scroll.loop += deltaTime / 8;
            while (kigou.scroll.loop > 1) kigou.scroll.loop--;
            if(countdown <= 0) {
                state = 'end';
                countdown = 4.9;
                clean();
            }
        }
        else if(state === 'end') {
            if(countdown <= 0) {
                state = 'title';
            }
        }
        else if(state === 'clear') {
            if(countdown <= 0) {
                state = 'game';
                countdown = 7.9;
                stage++;
                initStage();
            }
        }
    };

    // 正解以外の記号を消す
    const clean = () => {
        let c = null;
        for(let i = 0; i < kigou.div * kigou.div; i++)
            if(kigou.array[i].char === kigou.goal.char) c = i;

        for(let i = 0; i < c; i++) kigou.array[i].char = null;
        for(let i = c + 1; i < kigou.div * kigou.div; i++) kigou.array[i].char = null;
    }

    // 記号描画
    const drawKigou = (char = 0, color = 0, x = 0, y = 0, d = 9, sd = 'no', sl = 0) => {
        if(char == null) return;
        const sx = canvas.width / 8 / d;
        const sy = canvas.height / 8 / d * 3 / 4;
        const w = canvas.width;
        if(sd === 'no') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                x * sx * 8, y * sy * 8,
                sx, sy
            );
        } else if(sd === 'left') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 - sl * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 + (1 - sl) * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
        } else if(sd === 'right') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 + sl * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 + (sl - 1) * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
        }else if(sd === 'x') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 + (y%2?-sl:sl) * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sx * 8 + (y%2?1-sl:sl-1) * w),
                Math.floor(y * sy * 8),
                sx, sy
            );
        } else if(sd === 'down') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 + sl * w),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 + (sl - 1) * w),
                sx, sy
            );
        } else if(sd === 'up') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 - sl * w),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 + (1 - sl) * w),
                sx, sy
            );
        }else if(sd === 'y') {
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 + (x%2?-sl:sl) * w),
                sx, sy
            );
            screen.draw(
                colorSprite[color],
                char % 8,
                Math.floor(char / 8),
                1, 1,
                Math.floor(x * sy * 8),
                Math.floor(y * sx * 8 + (x%2?1-sl:sl-1) * w),
                sx, sy
            );
        }
    };

    // 描画
    const draw = () => {
        screen.fill('#000', 0, 0, canvas.width, canvas.height);

        if(state === 'title') {
            for(let i = 0; i < 7; i++) drawKigou(i + 8 * 8, 0, 1 + i, 3);
            for(let i = 0; i < 5; i++) drawKigou(i + 9 * 8, 0, 2 + i, 6);
        }
        if(state === 'ready') {
            drawKigou(Math.floor(countdown) + 11 * 8, 9, 8, 11); // カウントダウン
        }
        if(state === 'clear' || state === 'game' || state === 'end') {
            // 探す記号群
            const d = kigou.div;
            for(let i = 0; i < d * d; i++) {
                const c = kigou.array[i];
                drawKigou(c.char, c.color, i % d, Math.floor(i / d), d, kigou.scroll.dir, kigou.scroll.loop);
            }
            screen.fill('#000', 0, canvas.width, canvas.width, canvas.height - canvas.width); // 下の文字列表示を黒く塗る
        }
        if(state === 'game') {
            drawKigou(kigou.goal.char, kigou.goal.color, 0, 11); // 目的の記号
            for(let i = 0; i < 4; i++) drawKigou(3 + 8 * 8, 9, 2, 11); // を
            for(let i = 0; i < 3; i++) drawKigou((4 + i) + 8 * 8, 9, 3 + i, 11); // さがせ
            drawKigou(7 + 8 * 8, 9, 6, 11); // !

            drawKigou(Math.floor(countdown) + 11 * 8, 9, 8, 11); // カウントダウン
        }
        if(state === 'clear') {
            for(let i = 0; i < 3; i++) drawKigou(i + 5 + 9 * 8, 9, 0 + i, 11); // OK!
            drawKigou(Math.floor(countdown) + 11 * 8, 9, 8, 11); // カウントダウン
        }
        if(state === 'game' || state === 'clear' || state === 'end') {
            let col = 0;
            // ステージ番号
            drawKigou(Math.floor(stage / 100) % 10 + 11 * 8, col, 3, 9); // ステージ番号100の位
            drawKigou(Math.floor(stage / 10) % 10 + 11 * 8, col, 4, 9); // ステージ番号10の位
            drawKigou(stage % 10 + 11 * 8, col, 5, 9); // ステージ番号1の位
        }
        if(state === 'end') {
            // for(let i = 0; i < 3; i++) drawKigou(i + 5 + 9 * 8, 0, 3 + i, 10); // END
            for(let i = 0; i < 8; i++) drawKigou(i + 10 * 8, 9, i, 11); // TIMEOVER
            drawKigou(7 + 8 * 8, 9, 8, 11); // !
        }
    };

    // フレーム
    let prevTimestamp = 0; // 前回フレームのタイムスタンプ
    const frame = (timestamp) => {
        if(pause) return;
        requestAnimationFrame(frame);
        if(prevTimestamp === 0) prevTimestamp = timestamp;
        const deltaTime = (timestamp - prevTimestamp) / 1000;
        proc(deltaTime); // 処理
        draw(); // 描画
        prevTimestamp = timestamp;
    };
    let pause = (document.visibilityState === 'hidden');
    if(!pause) requestAnimationFrame(frame);

    // ランダム整数 mからnまで、lは除く
    const random = (m = 0, n = 8, l = null) => {
        if(l == null) return Math.floor((Math.random() * (n - m)) + m);
        if(l != null) return Math.floor(((l - m + 1) + Math.random() * (n - m - 1)) % (n - m) + m);
    };

    // ステージ開始
    const initStage = () => {
        let d = 3;
        let sd = 'no';
        let gcolor = random(0, 9);
        let gchar = random(0, 64);
        const a = [];
        a[random(0, d * d)] = {
            color: gcolor,
            char: gchar,
        };

        const loop = 16;

        // 各ステージの構成
        if(stage % loop === 0) {
            d = 3;
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8, gcolor);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 1) {
            d = 4;
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8, gcolor);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 2) {
            d = 5;
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8, gcolor);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 3) {
            d = 5;
            sd = 'left';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 4) {
            d = 5;
            sd = 'right';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 5) {
            d = 5;
            sd = 'down';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 6) {
            d = 5;
            sd = 'up';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 7) {
            d = 5;
            sd = 'x';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 8) {
            d = 5;
            sd = 'y';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 9) {
            d = 5;
            sd = 'left';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(Math.floor(gchar / 8) * 8, Math.floor(gchar / 8 + 1) * 8, gchar);
            }
        }
        else if(stage % loop === 10) {
            d = 5;
            sd = 'up';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(Math.floor(gchar / 8) * 8, Math.floor(gchar / 8 + 1) * 8, gchar);
            }
        }
        else if(stage % loop === 11) {
            d = 5;
            sd = 'right';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = gcolor;
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 12) {
            d = 5;
            sd = 'down';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = gcolor;
                a[i].char = random(0, 64, gchar);
            }
        }
        else if(stage % loop === 13) {
            d = 5;
            sd = 'x';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = gcolor;
                a[i].char = random(Math.floor(gchar / 8) * 8, Math.floor(gchar / 8 + 1) * 8, gchar);
            }
        }
        else if(stage % loop === 14) {
            d = 5;
            sd = 'y';
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = gcolor;
                a[i].char = random(Math.floor(gchar / 8) * 8, Math.floor(gchar / 8 + 1) * 8, gchar);
            }
        }
        else if(stage % loop === 15) {
            d = 7;
            for (let i = 0; i < d * d; i++) {
                if(a[i] != null) continue;
                a[i] = {};
                a[i].color = random(0, 8);
                a[i].char = random(0, 64, gchar);
            }
        }

        kigou.div = d;
        kigou.goal.char = gchar;
        kigou.goal.color = gcolor;
        kigou.scroll.dir = sd;
        kigou.scroll.loop = 0;
        kigou.array = a;
    };

    // キャンバスを押した
    canvas.addEventListener('pointerdown', (event) => {
        if(state === 'title') {
            state = 'ready';
            countdown = 2.999;
        }
        else if(state === 'game') {
            // 座標0-1
            const canvasRect = canvas.getBoundingClientRect();
            const x = (event.clientX - canvasRect.left) / canvasRect.width;
            const y = (event.clientY - canvasRect.top) / canvasRect.height;

            if(y >= 0.75) return; // 押す範囲外なら返す

            // スクロール
            const sd = kigou.scroll.dir;
            const sl = kigou.scroll.loop;

            // どの行か
            const lx = Math.floor(x * kigou.div) % 2;
            const ly = Math.floor(y * 4 / 3 * kigou.div) % 2;

            // スクロールを考慮した座標0-1
            let mx = x + (sd==='right' || sd==='x' && ly===0?-sl:0) + (sd==='left' || sd==='x' && ly===1?sl:0);
            let my = (y * 4 / 3) + (sd==='down' || sd==='y' && lx===0?-sl:0) + (sd==='up' || sd==='y' && lx===1?sl:0);
            while(mx > 1) mx--;
            while(mx < 0) mx++;
            while(my > 1) my--;
            while(my < 0) my++;

            // どのキャラか
            const c = Math.floor(mx * kigou.div) + Math.floor(my * kigou.div) * kigou.div;

            // 押した
            if(kigou.array[c].char === kigou.goal.char) {
                clean();
                // 正解
                state = 'clear';
            } else {
                kigou.array[c].char = null; // 違う記号なら消す
            }
        }
        else if(state === 'end') {
            if(countdown <= 0) state = 'title';
        }
    });

    // アクティブ状態変化による停止と再開
    document.addEventListener('visibilitychange', (event) =>
    {
        if (document.visibilityState === 'hidden') {
            pause = true;
            prevTimestamp = 0;
        }
        if (document.visibilityState === 'visible') {
            pause = false;
            requestAnimationFrame(frame);
        }
    });

    // 選択などを禁止
    const cancel = (event) => {
        event.stopPropagation();
        event.preventDefault();
        return false;
    };
    document.addEventListener('selectstart', cancel, { passive: false });
    document.addEventListener('dblclick', cancel, { passive: false });
};

// 画像の読み込みが終わってから実行
spriteImg.addEventListener('load', script);
spriteImg.src = 'sprite.png';