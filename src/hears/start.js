import User from "../models/user.js";
import bot from "../config/bot.js";
import { Keyboard } from "grammy";
import { selectLang } from "../handlers/lang.handler.js";

bot.command("start", async (ctx) => {
  try {
    const user_id = ctx.update.message?.from?.id;
    const username = ctx.update.message?.from?.username || "";
    const first_name = ctx.update.message?.from?.first_name || "";
    const last_name = ctx.update.message?.from?.last_name || "";

    if (!user_id) {
      await ctx.reply(
        "Foydalanuvchi ma’lumotlarini olishda xatolik yuz berdi."
      );
      return;
    }

    // const userExists = await User.findOne({user_id: ctx.from.id})

    // console.log(userExists)

    const user = await User.findOne({ user_id });

    if (!user) {
      const newUser = new User({
        user_id: user_id,
        username: ctx.from.username || "",
        first_name: ctx.from.first_name || "",
        last_name: ctx.from.last_name || "",
      });
      await newUser.save();
      console.log(newUser);

      await selectLang(ctx);
    } else if (!user.user_lang) {
      await selectLang(ctx);
    } else {
      const lang = user.user_lang;

      if (lang === "UZB") {
        await ctx.reply("<b>Bosh sahifa!</b>", {
          parse_mode: "HTML",
          reply_markup: new Keyboard()
            .text("🗃️ Adabiyotlar")
            .text("📣 Xabarlar")
            .row()
            .text("🪧 Murojaatlar")
            .text("🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar")
            .row()
            .text("♻️ Tilni o'zgartirish")
            .row()
            .oneTime()
            .resized(),
        });
      } else if (lang === "RUS") {
        await ctx.reply("<b>Главная страница!</b>", {
          parse_mode: "HTML",
          reply_markup: new Keyboard()
            .text("🗃 Литература")
            .text("📣 Объявления")
            .row()
            .text("🪧 Запросы")
            .text("🧑🏾‍🤝‍🧑🏾 Пользователи")
            .row()
            .text("♻️ Изменить язык")
            .row()
            .oneTime()
            .resized(),
        });
      }
    }
  } catch (error) {
    console.error("Xatolik:", error);
    await ctx.reply("Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
  }
});
