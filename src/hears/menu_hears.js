import { bot } from "../config/bot.js";
import {
  userSection,
  requestsSection,
  literatureSection,
  messagesSection,
  selectLang,
  saveLang,
  sendHomeMenu,
} from "../handlers/menu.handlers.js";
import {
  handleInterestingMaterials,
  handleVideoTutorials,
  handleSamplefarms,
  handleRequiredDocuments,
  handleCallCenter,
  startComplaintFlow,
} from "../handlers/common.handlers.js";
import User from "../models/user.js";

// Til tanlash
bot.hears("🇺🇿 O'zbek tili", async (ctx) => {
  await saveLang(ctx, "UZB");
});

bot.hears("🇷🇺 Русский", async (ctx) => {
  await saveLang(ctx, "RUS");
});

// Asosiy bo'limlar
bot.hears(["🗃️ Adabiyotlar", "🗃 Литература"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await literatureSection(ctx, lang);
});

bot.hears(["📣 Xabarlar", "📣 Сообщения"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await messagesSection(ctx, lang);
});

bot.hears(["🪧 Murojaatlar", "🪧 Запросы"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await requestsSection(ctx, lang);
});

bot.hears(["🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar", "🧑🏾‍🤝‍🧑🏾 Пользователи"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await userSection(ctx, lang);
});

// Adabiyotlar bo'limi
bot.hears(["📚 Qiziqarli ma'lumotlar", "📚 Интересные данные"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await handleInterestingMaterials(ctx, lang);
});

bot.hears(["📹 Video qo'llanmalar", "📹 Видео-руководства"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await handleVideoTutorials(ctx, lang);
});

bot.hears(["📝 Namunaliy blanklar", "📝 Образцы бланков"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await handleSamplefarms(ctx, lang);
});

bot.hears(["📄 Kerakli hujjatlar", "📄 Необходимые документы"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await handleRequiredDocuments(ctx, lang);
});

// Murojaatlar bo'limi
bot.hears(["📋 Murojaatlar haqida", "📋 О запросах"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await ctx.reply(
    lang === "UZB"
      ? "Murojaatlar haqida ma'lumot tez orada qo'shiladi."
      : "Информация о запросах будет добавлена в ближайшее время."
  );
});

// bot.hears(["📝 Shikoyat va takliflar", "📝 Жалобы и предложения"], async (ctx) => {
//     const user = await User.findOne({ user_id: ctx.message.from.id });
//     const lang = user?.user_lang || "UZB";
//     await handleComplaint(ctx, lang);
// });

// Shikoyat va takliflar uchun
// bot.hears(["📝 Shikoyat va takliflar", "📝 Жалобы и предложения"], async (ctx) => {
//     const user_id = ctx?.from?.id;
//     const user = await User.findOne({ user_id });
//     await handleComplaint(ctx, user?.user_lang || "UZB");
// });
bot.hears(
  ["📝 Shikoyat va takliflar", "📝 Жалобы и предложения"],
  async (ctx) => {
    const lang =
      ctx.message.text === "📝 Shikoyat va takliflar" ? "UZB" : "RUS";
    await startComplaintFlow(ctx, lang);
  }
);

// Foydalanuvchilar bo'limi
bot.hears(["📞 Telefon raqamlar", "📞 Телефонные номера"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await handleCallCenter(ctx, lang);
});

bot.hears(
  ["🧑‍🤝‍🧑 Foydalanuvchi ro'yxati", "🧑‍🤝‍🧑 Список пользователей"],
  async (ctx) => {
    const user = await User.findOne({ user_id: ctx.message.from.id });
    const lang = user?.user_lang || "UZB";
    await ctx.reply(
      lang === "UZB"
        ? "Foydalanuvchilar ro'yxati tez orada qo'shiladi."
        : "Список пользователей будет добавлен в ближайшее время."
    );
  }
);

// Xabarlar bo'limi
bot.hears(["📬 Yangi xabarlar", "📬 Новые сообщения"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await ctx.reply(
    lang === "UZB"
      ? "Yangi xabarlar tez orada qo'shiladi."
      : "Новые сообщения будут добавлены в ближайшее время."
  );
});

bot.hears(["📨 Barcha xabarlar", "📨 Все сообщения"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await ctx.reply(
    lang === "UZB"
      ? "Barcha xabarlar tez orada qo'shiladi."
      : "Все сообщения будут добавлены в ближайшее время."
  );
});

// Tilni o'zgartirish
bot.hears(["♻️ Tilni o'zgartirish", "♻️ Изменить язык"], async (ctx) => {
  await selectLang(ctx);
});

// Orqaga
bot.hears(["⬅️ Orqaga", "⬅️ Назад"], async (ctx) => {
  const user = await User.findOne({ user_id: ctx.message.from.id });
  const lang = user?.user_lang || "UZB";
  await sendHomeMenu(ctx, lang);
});
