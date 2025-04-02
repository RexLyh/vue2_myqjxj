<template>
  <div class="game-container">
    <canvas ref="gameCanvas" width="800" height="600"></canvas>

    <div class="game-info">
      <div class="score">得分：{{ score }}</div>
      <el-button
        type="primary"
        @click="resetGame"
        :disabled="!gameOver"
        class="retry-btn"
      >
        {{ gameOver ? "重新开始" : "游戏中..." }}
      </el-button>
    </div>

    <el-dialog :visible.sync="gameOver" title="游戏结束" width="30%" center>
      <span>最终得分：{{ score }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetGame">再玩一次</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      paddle: {
        x: 350,
        y: 550,
        width: 100,
        height: 10,
        speed: 15,
      },
      ball: {
        x: 400,
        y: 540,
        radius: 8,
        dx: 4,
        dy: -4,
      },
      bricks: [],
      score: 0,
      gameOver: false,
      brickRowCount: 6,
      brickColumnCount: 8,
      brickWidth: 75,
      brickHeight: 20,
      brickPadding: 12,
      brickOffsetTop: 60,
      brickOffsetLeft: 45,
    };
  },
  mounted() {
    this.initGame();
    this.canvas = this.$refs.gameCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.addEventListener("mousemove", this.movePaddle);
    this.animate();
  },
  methods: {
    initGame() {
      // 初始化砖块矩阵
      this.bricks = [];
      for (let c = 0; c < this.brickColumnCount; c++) {
        this.bricks[c] = [];
        for (let r = 0; r < this.brickRowCount; r++) {
          this.bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    },

    movePaddle(e) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.paddle.x = Math.max(
        0,
        Math.min(
          mouseX - this.paddle.width / 2,
          this.canvas.width - this.paddle.width
        )
      );
    },

    drawBall() {
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#e74c3c";
      this.ctx.fill();
      this.ctx.closePath();
    },

    drawPaddle() {
      this.ctx.beginPath();
      this.ctx.roundRect(
        this.paddle.x,
        this.paddle.y,
        this.paddle.width,
        this.paddle.height,
        5
      );
      this.ctx.fillStyle = "#3498db";
      this.ctx.fill();
      this.ctx.closePath();
    },

    drawBricks() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          if (this.bricks[c][r].status === 1) {
            const brickX =
              c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
            const brickY =
              r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
            this.bricks[c][r].x = brickX;
            this.bricks[c][r].y = brickY;

            this.ctx.beginPath();
            this.ctx.roundRect(
              brickX,
              brickY,
              this.brickWidth,
              this.brickHeight,
              4
            );
            this.ctx.fillStyle = `hsl(${(c * 30 + r * 15) % 360}, 70%, 50%)`;
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    },

    collisionDetection() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const b = this.bricks[c][r];
          if (b.status === 1) {
            if (
              this.ball.x > b.x &&
              this.ball.x < b.x + this.brickWidth &&
              this.ball.y > b.y &&
              this.ball.y < b.y + this.brickHeight
            ) {
              this.ball.dy = -this.ball.dy;
              b.status = 0;
              this.score += 10;
              if (
                this.score ===
                this.brickRowCount * this.brickColumnCount * 10
              ) {
                this.gameOver = true;
              }
            }
          }
        }
      }
    },

    animate() {
      if (this.gameOver) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBricks();
      this.drawBall();
      this.drawPaddle();
      this.collisionDetection();

      // 小球运动
      if (
        this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius ||
        this.ball.x + this.ball.dx < this.ball.radius
      ) {
        this.ball.dx = -this.ball.dx;
      }
      if (this.ball.y + this.ball.dy < this.ball.radius) {
        this.ball.dy = -this.ball.dy;
      } else if (
        this.ball.y + this.ball.radius + this.ball.dy > this.paddle.y &&
        this.ball.x + this.ball.radius > this.paddle.x &&
        this.ball.x - this.ball.radius < this.paddle.x + this.paddle.width
      ) {
        // 精确碰撞检测
        const relativeIntersectX =
          this.ball.x - (this.paddle.x + this.paddle.width / 2);
        const normalizedIntersectX =
          relativeIntersectX / (this.paddle.width / 2);

        this.ball.dy = -Math.abs(this.ball.dy);
        this.ball.dx = normalizedIntersectX * 7;

        // 防止小球卡在挡板里
        this.ball.y = this.paddle.y - this.ball.radius - 1;
      }

      this.ball.x += this.ball.dx;
      this.ball.y += this.ball.dy;

      requestAnimationFrame(this.animate);
    },

    resetGame() {
      this.ball.x = 400;
      this.ball.y = 540;
      this.ball.dx = 4;
      this.ball.dy = -4;
      this.score = 0;
      this.gameOver = false;
      this.initGame();
      this.animate();
    },
  },
};
</script>

<style scoped lang="less">
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  canvas {
    border: 2px solid #2c3e50;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: white;
  }

  .game-info {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 30px;

    .score {
      font-size: 24px;
      color: #2c3e50;
      font-weight: bold;
    }

    .retry-btn {
      padding: 12px 24px;
      font-size: 16px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
