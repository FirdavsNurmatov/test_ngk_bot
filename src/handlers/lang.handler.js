import User from "../models/user.js";
import { Keyboard } from "grammy";

const getHomeMenu = (lang) => {
  if (lang === "UZB") {
    return new Keyboard()
      .text("🗃️ Adabiyotlar")
      .text("📣 Xabarlar")
      .row()
      .text("🪧 Murojaatlar")
      .text("🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar")
      .row()
      .text("♻️ Tilni o'zgartirish")
      .row()
      .oneTime()
      .resized();
  }
  return new Keyboard()
    .text("🗃 Литература")
    .text("📣 Объявления")
    .row()
    .text("🪧 Запросы")
    .text("🧑🏾‍🤝‍🧑🏾 Пользователи")
    .row()
    .text("♻️ Изменить язык")
    .row()
    .oneTime()
    .resized();
};

export const selectLang = async (ctx) => {
  await ctx.reply(`<b>Tilni tanlang / Пожалуйста, выберите язык:</b>`, {
    parse_mode: "HTML",
    reply_markup: new Keyboard()
      .text("🇺🇿 O'zbek tili")
      .text("🇷🇺 Русский")
      .row()
      .oneTime()
      .resized(),
  });
};

export const saveLang = async (ctx, lang) => {
  try {
    const user_id = ctx?.from?.id || ctx?.chat?.id;

    if (!user_id) {
      return await ctx.reply(
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    }

    let user = await User.findOne({ user_id });

    if (!user) {
      await User.create({ user_id, user_lang: lang });
      await selectLang(ctx);
      return;
    }

    await User.updateOne({ user_id }, { user_lang: lang });
    const menu = getHomeMenu(lang);
    const message =
      lang === "UZB" ? "<b>Bosh sahifa!</b>" : "<b>Главная страница!</b>";
    await ctx.reply(message, { parse_mode: "HTML", reply_markup: menu });
  } catch (error) {
    console.error(error);
    await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  }
};
