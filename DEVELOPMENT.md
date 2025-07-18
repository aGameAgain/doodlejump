# Doodle Jump 开发文档

## 版本历史

### 初始版本 (v1.0)
- 完成基本游戏功能
- 实现角色移动、跳跃物理效果
- 实现平台生成
- 添加开始和结束游戏界面

### 优化版本 (v1.1) - 当前版本
- 修复"跳不上去"的核心游戏问题
- 优化游戏参数和视觉效果
- 改进平台生成算法

## 关键问题修复

### "跳不上去"问题
**问题描述**: 玩家角色无法有效地跳到更高的平台，游戏难度过高。

**修复方案**:
1. **物理系统调整**:
   - 减小重力 (0.25 -> 0.2)
   - 增加跳跃力度 (-10 -> -12)
   - 增加移动速度 (5 -> 6)

2. **平台生成优化**:
   - 减小平台间距 (60-200 -> 40-120)
   - 增加平台数量 (7 -> 8)
   - 实现智能平台间距控制（防止生成无法跳跃的平台）
   - 对生成的平台进行最大跳跃高度检查

3. **碰撞检测改进**:
   - 增加碰撞检测余量，提高踩到平台的成功率

4. **视觉增强**:
   - 平台颜色多样化
   - 添加平台顶部边缘，增强可见性
   - 为角色添加面部表情，增加趣味性

## 代码结构说明

### 主要组件

#### 游戏状态 (`game` 对象)
```javascript
let game = {
    isRunning: false,       // 游戏运行状态
    score: 0,               // 当前分数
    gravity: 0.2,           // 重力加速度
    platformCount: 8,       // 平台数量
    platforms: [],          // 平台数组
    highestPlatform: 0,     // 最高平台的Y坐标
    scrollOffset: 0,        // 屏幕滚动偏移量
    minPlatformSpace: 40,   // 最小平台间距
    maxPlatformSpace: 120   // 最大平台间距
};
```

#### 玩家角色 (`player` 对象)
```javascript
const player = {
    x: canvas.width / 2,    // X位置
    y: canvas.height / 2,   // Y位置
    width: 40,              // 宽度
    height: 40,             // 高度
    velocityY: 0,           // Y方向速度
    velocityX: 0,           // X方向速度
    jumpForce: -12,         // 跳跃力度
    speed: 6,               // 移动速度
    color: '#4CAF50',       // 角色颜色
    jumping: false,         // 跳跃状态
    leftPressed: false,     // 左键按下状态
    rightPressed: false     // 右键按下状态
};
```

#### 平台类 (`Platform`)
```javascript
class Platform {
    constructor(x, y, width = 70, height = 15) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // 随机平台颜色
        const colors = ['#333', '#444', '#555'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        // 绘制平台主体和边缘
    }
}
```

### 核心函数

#### `initGame()`
初始化游戏状态和玩家位置。

#### `generateInitialPlatforms()`
生成初始平台，确保玩家有一个脚下的平台和几个可达平台。

#### `generateNewPlatform()`
在顶部生成新平台，确保它们在玩家可跳跃的范围内。

#### `checkCollision(player, platform)`
检测玩家和平台之间的碰撞，只在玩家下落时检测。

#### `gameLoop()`
游戏主循环，处理玩家移动、碰撞检测、平台滚动和分数计算。

## 游戏参数说明

### 重要参数

| 参数 | 当前值 | 作用 | 调整建议 |
|------|--------|------|----------|
| game.gravity | 0.2 | 控制重力大小 | 增大使游戏难度增加 |
| player.jumpForce | -12 | 控制跳跃高度 | 数值越小（更负）跳跃越高 |
| player.speed | 6 | 控制左右移动速度 | 增大使移动更灵活 |
| game.minPlatformSpace | 40 | 最小平台间距 | 增大使游戏难度增加 |
| game.maxPlatformSpace | 120 | 最大平台间距 | 增大使游戏难度增加 |
| game.platformCount | 8 | 屏幕上平台的数量 | 增大使平台更密集 |

## 后续迭代方向

### 功能扩展
1. **不同类型的平台**:
   - 移动平台 (左右移动)
   - 一次性平台 (踩一次就消失)
   - 弹跳平台 (提供更大的跳跃力)

2. **游戏元素丰富**:
   - 添加收集物 (增加分数、特殊能力)
   - 添加敌人 (需要避开或击败)
   - 添加障碍物 (增加游戏难度)

3. **能力系统**:
   - 超级跳跃
   - 临时飞行
   - 磁铁效果 (吸引收集物)

### 技术改进
1. **性能优化**:
   - 使用精灵图 (sprite sheets) 替代简单矩形
   - 优化碰撞检测算法

2. **代码重构**:
   - 采用模块化设计，将游戏逻辑分离为多个模块
   - 实现游戏状态管理系统

3. **视觉和音频增强**:
   - 添加背景音乐和音效
   - 改进角色和平台的图形
   - 添加背景和粒子效果

4. **游戏进程**:
   - 实现难度随分数增加
   - 添加关卡系统
   - 实现高分记录保存

### 用户体验
1. **移动设备支持**:
   - 添加触摸控制
   - 实现响应式设计，适应不同屏幕尺寸

2. **辅助功能**:
   - 添加游戏教程
   - 实现设置菜单 (调整音量、控制灵敏度等)
   - 支持多语言

## 调试建议

修改游戏参数时，推荐以下步骤：

1. 小幅度调整一个参数
2. 测试游戏感觉
3. 记录变化并逐步优化

关键平衡点在于保持游戏挑战性的同时确保玩家能够进步。

## 已知问题

1. 移动端兼容性尚未测试
2. 没有图像预加载，可能导致视觉延迟
3. 高分数时游戏可能出现性能下降

---

文档维护者：sko00o && claude-3.7-sonnet-thinking
最后更新：2025年3月5日 