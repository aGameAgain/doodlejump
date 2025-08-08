# Changelog 变更日志

本项目的所有显著更改将记录在此文件中。

格式参考 Keep a Changelog，版本号遵循 SemVer。

## [Unreleased]

### Added 新增
- 触屏控制：点击屏幕左/右半边分别等效于方向键左/右。
- 可选重力感应（倾斜）控制：通过 `?tilt=1` 开启，在用户手势内请求权限。
- 平台体系多态化：引入 `PlatformBase`、`NormalPlatform`、`TrampolinePlatform`、`BreakablePlatform`。
- 易碎平台（Breakable）：首次踩踏触发跳跃后即碎裂，浅灰色并带裂纹视觉。
- 页面图例：在 `index.html` 中新增平台图例区域，直接复用平台类的 `draw` 方法绘制示例。
- 测试：新增 `tests/PlatformVariants.test.js` 覆盖不同平台类型的颜色、行为与活跃状态。

### Changed 变更
- 普通平台颜色改为固定 `#444`，不再随机。
- 平台尺寸统一为 `70×15`，生成时不再随机宽度。
- 碰撞着陆逻辑改为调用平台实例 `onLand(player)`，按 `isActive()` 判定平台是否仍可交互。

### Fixed 修复
- 与多输入源（键盘/触摸/倾斜）并存时的优先级与状态同步问题，确保测试通过且行为可预期。

## [1.1.0] - 2025-03-05
### Fixed 修复
- 修复“跳不上去”的核心问题：调整重力、跳跃力度、平台间距与数量，优化碰撞余量与可达性（详见 `DEVELOPMENT.md`）。

### Changed 变更
- 优化平台生成算法与视觉效果，角色表情随移动方向变化。

## [1.0.0]
### Added 新增
- 基础玩法：平台生成、玩家移动与跳跃、分数、开始/结束界面。

[Unreleased]: https://example.com/compare/v1.1.0...HEAD
[1.1.0]: https://example.com/releases/v1.1.0

