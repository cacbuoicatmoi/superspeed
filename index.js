require('./server'); // chạy web server để giữ online
const mineflayer = require("mineflayer");

const bot = mineflayer.createBot({
  host: "116.98.236.145",
  port: 2007,
  username: "noledadenafkfarm",
  auth: "offline",
  version: "1.20.1",
});

bot.on("spawn", () => {
  console.log("✅ Bot đã vào server thành công!");

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

  bot.on('end', () => {
    bot.setControlState('sneak', false);
  });
});

bot.on("end", (reason) => {
  console.log("⚠️ Bot bị ngắt kết nối. Lý do:", reason);
  console.log("🔄 Đang thử kết nối lại sau 10 giây...");
  setTimeout(() => {
    process.exit(1); // Thoát để Replit tự restart bot
  }, 10000);
});

bot.on("error", (err) => {
  console.log("❌ Lỗi:", err.message);
});

bot.on("kicked", (reason) => {
  console.log("👢 Bot bị kick:", reason);
});
