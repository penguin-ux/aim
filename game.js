const gameButton = document.getElementById('gameButton');
const retryButton = document.getElementById('retryButton');
const scoreDisplay = document.getElementById('score');
const circle = document.getElementById('circle');
const gameArea = document.getElementById('gameArea');
const randomModeButton = document.getElementById('randomModeButton');
const slideModeButton = document.getElementById('slideModeButton');
const sizeSlider = document.getElementById('sizeSlider');  // スライダー
const settingsButton = document.getElementById('settingsButton');
const sliderContainer = document.getElementById('sliderContainer');

let score = 0;
let gameInterval;
let circleMoveInterval;
let gameTime = 15000;  // ゲーム時間: 15秒
let gameStartTime;
let moveMode = 'random';  // 初期モードはランダム移動
let hovering = false;
let gameActive = false; // ゲーム中のみ true にする

let scoreInterval; // 得点加算用のインターバル変数（明確に分ける）

function startGame() {
    // スコアリセット
    score = 0;
    scoreDisplay.textContent = `得点: ${score}`;
    gameActive = false;

    // ボタンや設定を非表示
    gameButton.style.display = 'none';
    retryButton.style.display = 'none';
    randomModeButton.style.visibility = 'hidden';
    slideModeButton.style.visibility = 'hidden';
    sliderContainer.style.visibility = 'hidden';
    settingsButton.style.visibility = 'hidden';

    // 円を中央に表示
    const centerX = (gameArea.offsetWidth - circle.offsetWidth) / 2;
    const centerY = (gameArea.offsetHeight - circle.offsetHeight) / 2;
    circle.style.left = `${centerX}px`;
    circle.style.top = `${centerY}px`;
    circle.style.display = 'block';

    // カウントダウンを表示
    const countdownDisplay = document.getElementById('countdown');
    countdownDisplay.style.display = 'block';
    let count = 3;
    countdownDisplay.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            beginGame(); // 本当のスタート処理をここで呼ぶ
        }
    }, 1000);
}

// 実際のゲーム開始処理を分離
function beginGame() {
    gameActive = true;
    gameStartTime = Date.now();

    setTimeout(endGame, gameTime);

    if (moveMode === 'random') {
        circleMoveInterval = setInterval(moveCircleRandom, 900);
    } else if (moveMode === 'slide') {
        circleMoveInterval = setInterval(moveCircleSlide, 20);
    }

    updateScoreInterval();
}



// ゲーム終了の処理
function endGame() {
    clearInterval(scoreInterval);
    clearInterval(circleMoveInterval);

    gameActive = false;
    hovering = false;
    
    gameButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    randomModeButton.style.visibility = 'visible';
    slideModeButton.style.visibility = 'visible';
    sliderContainer.style.visibility = 'visible';
    settingsButton.style.visibility = 'visible';

    // 評価ランクを決定
    let rank;
    if (score >= 450) {
        tier = 'Out of this World';
        rank = 'おめでとうございます\n全てを超越した別次元のエイム力です';
    } else if (score >= 400) {
        tier = 'God Zeus';
        rank = '神のようなエイム力です\nあなた以上のエイム力の持ち主はこの世に存在しません';
    } else if (score >= 375) {
        tier = 'Demon';
        rank = 'あなたのエイム力は人間の限界を超えています\n対人ゲームは退屈で仕方ないことでしょう';
    } else if (score >= 350) {
        tier = 'Cheater';
        rank = 'あなたはチーターです\nチートは制作会社の努力を踏みにじる行為なので即刻やめてください';
    } else if (score >= 300) {
        tier = 'Star Professional Gamer';
        rank = 'プロゲーマーとして輝かしい成績を残し、\n数々のタイトルの歴史に名を刻むでしょう';
    } else if (score >= 280) {
        tier = 'Shooting Master';
        rank = '最強すぎて眩しい\n大半のゲームはエイムのみで解決できるでしょう';
    } else if (score >= 260) {
        tier = 'Veteran Soldier';
        rank = '10年に一人の逸材\n伝説の兵士として語り継がれるでしょう';
    } else if (score >= 240) {
        tier = 'Sniper';
        rank = '誰もが憧れるエイムの持ち主\n努力次第ではプロも夢ではないはず';
    } else if (score >= 220) {
        tier = 'S+';
        rank = 'どのゲームでも常にキャリーできる\n攻めマーシャルでエース取れるレベル\nエコラウンドで味方に買ってもらおう';
    } else if (score >= 200) {
        tier = 'S';
        rank = 'かなりのエイム強者\nウィドウメイカーをピックしても光のOWが保てるはず';
    } else if (score >= 180) {
        tier = 'A+';
        rank = 'シューティングの素質アリ\nパーティを組めばみんなのヒーロー間違いなし';
    } else if (score >= 160) {
        tier = 'A';
        rank = '上達の可能性はある\n数人の友達の中ではイキれるかな、虚しいだろうけど';
    } else if (score >= 140) {
        tier = 'B+';
        rank = 'まあ悪くはない\nそれ以上でもそれ以下でもない';
    } else if (score >= 120) {
        tier = 'B';
        rank = '最低限できてるかなって感じ\n胴撃ちしかできないから勝てないタイマンも多かろうね';
    } else if (score >= 100) {
        tier = 'C';
        rank = 'どのゲームやらせてもブロンズ程度\n目も当てられない下手さ';
    } else if (score >= 80) {
        tier = 'D';
        rank = 'かなりのレベルでセンスがない\nふざけてやってるとしか思えない';
    } else if (score >= 60) {
        tier = 'E';
        rank = 'あまりにも初心者すぎる\nしかも才能がない初心者';
    } else {
        tier = '判定不能';
        rank = '味方に迷惑を掛けるのでシューティングやる資格なし\n今すぐゲームをアンインストールして別の趣味を見つけよう！';
    }

    alert(`ゲーム終了!\n最終得点: ${score}\nランク: ${tier}\n評価: ${rank}`);
}

// ゲームをリセットして再スタート
function retryGame() {
    score = 0;
    scoreDisplay.textContent = `得点: ${score}`;

    gameActive = false;

    circle.style.display = 'none';
    retryButton.style.display = 'none';
    gameButton.style.display = 'inline-block';
    randomModeButton.style.visibility = 'visible';
    slideModeButton.style.visibility = 'visible';
    sliderContainer.style.visibility = 'visible';
    settingsButton.style.visibility = 'visible';

    clearInterval(scoreInterval);
    clearInterval(circleMoveInterval);
}

// ランダムに円を動かす関数
function moveCircleRandom() {
    const gameAreaWidth = gameArea.offsetWidth;
    const gameAreaHeight = gameArea.offsetHeight;
    const circleSize = circle.offsetWidth;

    const x = Math.random() * (gameAreaWidth - circleSize);
    const y = Math.random() * (gameAreaHeight - circleSize);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
}

// スライドして円を動かす関数
let targetX, targetY, currentX, currentY, speed = 6;  // 速度を一定に設定

function moveCircleSlide() {
    if (currentX === undefined || currentY === undefined) {
        currentX = circle.offsetLeft;
        currentY = circle.offsetTop;
        targetX = Math.random() * (gameArea.offsetWidth - circle.offsetWidth);
        targetY = Math.random() * (gameArea.offsetHeight - circle.offsetHeight);
    }

    // 目標地点と現在位置の差を計算
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;

    // 目標位置に向かう方向ベクトルを計算し、単位ベクトルを取得
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 目標方向に対して、一定の速さで移動
    const moveX = (deltaX / distance) * speed;
    const moveY = (deltaY / distance) * speed;

    // 現在位置を更新
    currentX += moveX;
    currentY += moveY;


    // 円がゲームエリア内に収まるように制限
    currentX = Math.max(0, Math.min(currentX, gameArea.offsetWidth - circle.offsetWidth));
    currentY = Math.max(0, Math.min(currentY, gameArea.offsetHeight - circle.offsetHeight));

    circle.style.left = `${currentX}px`;
    circle.style.top = `${currentY}px`;

    // 目標位置に近づいたら、新しい目標を設定
    if (distance < speed) {
        targetX = Math.random() * (gameArea.offsetWidth - circle.offsetWidth);
        targetY = Math.random() * (gameArea.offsetHeight - circle.offsetHeight);
    }
}

// モード選択のイベントリスナー
randomModeButton.addEventListener('click', () => {
    moveMode = 'random';
    document.body.style.backgroundColor = 'darkgreen';
    retryGame(); // ゲームをリセット
});

slideModeButton.addEventListener('click', () => {
    moveMode = 'slide';
    document.body.style.backgroundColor = 'skyblue';
    retryGame(); // ゲームをリセット
});

settingsButton.addEventListener('click', () => {
    sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';
});

// スライダーの値を変更したとき
sizeSlider.addEventListener('input', (e) => {
    const newSize = e.target.value; // スライダーで設定した新しい円のサイズ
    circle.style.width = `${newSize}px`;
    circle.style.height = `${newSize}px`;

    // 円の大きさが小さいほど得点の加算速度を上げる
    updateScoreInterval();
});

// 得点加算速度を円の大きさに基づいて更新する関数
function updateScoreInterval() {
    const currentCircleSize = circle.offsetWidth;

    const speedFactor = currentCircleSize;

    clearInterval(scoreInterval);

    scoreInterval = setInterval(() => {
        if (hovering && gameActive) {
            score++;
            scoreDisplay.textContent = `得点: ${score}`;
        }
    }, speedFactor);
}

circle.addEventListener('mouseover', () => {
    hovering = true;
    circle.style.backgroundColor = 'orange';
});

circle.addEventListener('mouseout', () => {
    hovering = false;
    circle.style.backgroundColor = '';
});

window.addEventListener('resize', () => {
    // ゲーム中以外は無視
    if (!gameActive) return;

    const maxLeft = gameArea.offsetWidth - circle.offsetWidth;
    const maxTop = gameArea.offsetHeight - circle.offsetHeight;

    let left = parseFloat(circle.style.left);
    let top = parseFloat(circle.style.top);

    // はみ出そうなら調整
    if (left > maxLeft) circle.style.left = `${maxLeft}px`;
    if (top > maxTop) circle.style.top = `${maxTop}px`;
});



// ゲームスタート・再挑戦ボタンのイベントリスナー
gameButton.addEventListener('click', startGame);
retryButton.addEventListener('click', retryGame);
