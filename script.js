// 获取DOM元素
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// 设置canvas大小
canvas.width = 400;
canvas.height = 600;

// 游戏状态
let game = {
    isRunning: false,
    score: 0,
    gravity: 0.2,         // 减小重力，使玩家更容易上升
    platformCount: 8,      // 增加平台数量
    platforms: [],
    highestPlatform: 0,
    scrollOffset: 0,
    minPlatformSpace: 40,  // 减小最小平台间距
    maxPlatformSpace: 120  // 减小最大平台间距
};

// 玩家角色
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    velocityY: 0,
    velocityX: 0,
    jumpForce: -12,        // 增加跳跃力度
    speed: 6,              // 增加左右移动速度
    color: '#4CAF50',
    jumping: false,
    highestPoint: canvas.height,
    leftPressed: false,
    rightPressed: false
};

// 平台类
class Platform {
    constructor(x, y, width = 70, height = 15) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // 随机选择平台颜色，使不同平台有区别
        const colors = ['#333', '#444', '#555'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        // 绘制平台主体
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 绘制平台顶部边缘，让平台更明显
        ctx.fillStyle = '#666';
        ctx.fillRect(this.x, this.y, this.width, 2);
    }
}

// 初始化游戏
function initGame() {
    game.score = 0;
    game.platforms = [];
    game.scrollOffset = 0;
    game.highestPlatform = 0;

    // 重置玩家位置和状态
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.velocityY = 0;
    player.velocityX = 0;
    player.highestPoint = canvas.height;

    // 生成初始平台
    generateInitialPlatforms();

    // 更新分数显示
    updateScore();
}

// 生成初始平台
function generateInitialPlatforms() {
    // 第一个平台位于玩家脚下
    game.platforms.push(new Platform(
        player.x - 35,
        player.y + player.height + 5,
        80,  // 增加第一个平台宽度
        15
    ));

    // 生成其余平台，确保它们的间距是可跳跃的
    const spaceBetweenPlatforms = canvas.height / game.platformCount;

    for (let i = 1; i < game.platformCount; i++) {
        let x = Math.random() * (canvas.width - 90);

        // 确保平台更均匀分布，更容易跳跃
        let y = canvas.height - (i * spaceBetweenPlatforms) - Math.random() * 20;

        // 第一个平台周围分布更多平台，确保开始更容易
        if (i <= 3) {
            // 确保早期平台更大、更容易跳到
            let width = 70 + Math.random() * 30;
            game.platforms.push(new Platform(x, y, width, 15));
        } else {
            game.platforms.push(new Platform(x, y));
        }

        // 跟踪最高的平台
        if (y < game.highestPlatform || game.highestPlatform === 0) {
            game.highestPlatform = y;
        }
    }
}

// 生成新平台
function generateNewPlatform() {
    const gap = Math.random() * (game.maxPlatformSpace - game.minPlatformSpace) + game.minPlatformSpace;
    let x = Math.random() * (canvas.width - 70);
    let y = game.highestPlatform - gap;

    // 确保平台在可跳跃的范围内
    if (game.platforms.length > 0) {
        // 检查最近的平台，确保新平台在可达范围内
        const lastPlatform = game.platforms[game.platforms.length - 1];
        const maxJumpHeight = 180; // 最大跳跃高度

        // 如果平台太高，调整位置
        if (lastPlatform.y - y > maxJumpHeight) {
            y = lastPlatform.y - maxJumpHeight + Math.random() * 40;
        }
    }

    game.platforms.push(new Platform(x, y));
    game.highestPlatform = y;
}

// 更新分数
function updateScore() {
    scoreElement.textContent = Math.floor(game.score);
    finalScoreElement.textContent = Math.floor(game.score);
}

// 碰撞检测
function checkCollision(player, platform) {
    // 只有在下落时才检测碰撞
    if (player.velocityY >= 0) {
        // 检查玩家底部是否接触平台顶部，增加一点余量提高碰撞准确性
        if (
            player.y + player.height >= platform.y - 2 &&
            player.y + player.height <= platform.y + platform.height + 2 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width
        ) {
            return true;
        }
    }
    return false;
}

// 游戏循环
function gameLoop() {
    if (!game.isRunning) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新玩家位置
    player.velocityY += game.gravity;
    player.y += player.velocityY;

    // 处理左右移动
    if (player.leftPressed) {
        player.velocityX = -player.speed;
    } else if (player.rightPressed) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }

    player.x += player.velocityX;

    // 处理水平环绕
    if (player.x + player.width < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = -player.width;
    }

    // 检测碰撞
    game.platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            player.velocityY = player.jumpForce;
            player.jumping = true;

            // 播放跳跃音效
            // jumpSound.play(); // 如果有音效的话
        }
    });

    // 如果玩家上升到屏幕的1/3位置，移动屏幕而不是玩家
    if (player.y < canvas.height / 3 && player.velocityY < 0) {
        game.scrollOffset -= player.velocityY;

        // 移动所有平台
        game.platforms.forEach(platform => {
            platform.y -= player.velocityY;
        });

        // 每上升一定高度增加分数
        game.score -= player.velocityY / 10;
        updateScore();

        // 玩家不会真正上升
        player.y -= player.velocityY;
    }

    // 移除屏幕外的平台
    game.platforms = game.platforms.filter(platform => platform.y < canvas.height + platform.height);

    // 生成新平台
    while (game.platforms.length < game.platformCount) {
        generateNewPlatform();
    }

    // 游戏结束条件
    if (player.y > canvas.height) {
        gameOver();
        return;
    }

    // 绘制平台
    game.platforms.forEach(platform => {
        platform.draw();
    });

    // 绘制玩家
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 添加玩家面部表情，让角色更有趣
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 8, player.y + 10, 8, 8);
    ctx.fillRect(player.x + 24, player.y + 10, 8, 8);
    ctx.fillStyle = '#000';
    if (player.velocityY < 0) {
        // 上升时的表情
        ctx.fillRect(player.x + 16, player.y + 25, 8, 3);
    } else {
        // 下落时的表情
        ctx.fillRect(player.x + 16, player.y + 28, 8, 3);
    }

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 游戏结束
function gameOver() {
    game.isRunning = false;
    gameOverScreen.classList.remove('hidden');
}

// 开始游戏
function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    initGame();
    game.isRunning = true;
    gameLoop();
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.leftPressed = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.rightPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.leftPressed = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.rightPressed = false;
    }
});

// 按钮点击事件
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// 在窗口加载完成后设置
window.onload = () => {
    startScreen.classList.remove('hidden');
}; 