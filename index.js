// ✅ Web server giữ bot online (dành cho Replit/UptimeRobot)
require('./server');

const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;

const bot = mineflayer.createBot({
  host: "116.98.236.145",    // 🔧 Đổi thành IP server của bạn
  port: 2007,                // 🔧 Đổi nếu không phải 2007
  username: "noledadenafkfarm", // 🔧 Tên bot
  auth: "offline",           // offline nếu dùng tài khoản crack
  version: "1.20.1",         // Chọn đúng version
});

bot.loadPlugin(pathfinder);

bot.on("spawn", () => {
  console.log("✅ Bot đã vào server thành công!");

  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);

  // 🔁 Chu kỳ sneak
  function sneakCycle() {
    if (!bot.entity) return;

    bot.setControlState('sneak', true);
    console.log("🔄 Bot bắt đầu sneak trong 30 giây...");

    setTimeout(() => {
      bot.setControlState('sneak', false);
      console.log("✋ Bot dừng sneak, nghỉ 2 giây.");

      setTimeout(() => {
        sneakCycle();
      }, 2000);

    }, 30000);
  }

  sneakCycle();

  // 🌙 Khi trời tối, thử ngủ
  bot.on('time', () => {
    if (bot.time.isNight) {
      console.log("🌃 Trời tối rồi, bot sẽ tìm giường để ngủ...");
      tryToSleep();
    }
  });

  function tryToSleep() {
    const bed = bot.findBlock({
      matching: block => bot.isABed(block),
      maxDistance: 10
    });

    if (!bed) {
      console.log("❌ Không tìm thấy giường gần đó.");
      return;
    }

    const goal = new GoalNear(bed.position.x, bed.position.y, bed.position.z, 1);
    bot.pathfinder.setGoal(goal);

    bot.once('goal_reached', () => {
      bot.sleep(bed, (err) => {
        if (err) {
          console.log("😴 Không thể ngủ:", err.message);
        } else {
          console.log("✅ Bot đã ngủ.");
        }
      });
    });
  }

  bot.on('wake', () => {
    console.log("☀️ Bot thức dậy vì trời sáng.");
  });

  // 🔒 Ngắt sneak khi bị disconnect
  bot.on('end', () => {
    bot.setControlState('sneak', false);
  });
});

// 🔁 Reconnect khi bị ngắt kết nối
bot.on("end", (reason) => {
  console.log("⚠️ Bot bị ngắt kết nối. Lý do:", reason);
  console.log("🔄 Đang thử kết nối lại sau 10 giây...");
  setTimeout(() => {
    process.exit(1); // Để hệ thống (Replit/Render) tự khởi động lại
  }, 10000);
});

bot.on("error", (err) => {
  console.log("❌ Lỗi:", err.message);
});

bot.on("kicked", (reason) => {
  console.log("👢 Bot bị kick:", reason);
});
npm install mineflayer mineflayer-pathfinder express
