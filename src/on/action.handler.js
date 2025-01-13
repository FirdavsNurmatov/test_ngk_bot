import bot from "../config/bot.js";
import {
  userSection,
  requestsSection,
  literatureSection,
  messagesSection,
  selectLang,
  saveLang,
  sendHomeMenu,
  handleUserList,
} from "../handlers/menu.handlers.js";

import {
  handleStart,
  handleLanguage,
  handleMenu,
  handleBack,
  complaintSteps,
  handleRequiredDocuments,
  handleCallCenter,
  handleNewMessages,
  handleInterestingMaterials,
  handleVideoTutorials,
  handleSamplefarms,
  handleAllNews,
  startComplaintFlow,
  handleComplaintMessage,
} from "../handlers/common.handlers.js";

import User from "../models/user.js";

// Start command
bot.command("start", async (ctx) => {
  await handleStart(ctx);
});

// Handle non-command text messages
bot.on("message:text", async (ctx) => {
  try {
    const text = ctx.message.text.trim();
    console.log("Received text:", text);

    // Skip if it's a command
    if (text.startsWith("/")) {
      return;
    }

    const user_id = ctx.update.message.from.id;
    let user = await User.findOne({ user_id });

    if (!user) {
      const newUser = new User({
        user_id: user_id,
        username: ctx.from.username || "",
        first_name: ctx.from.first_name || "",
        last_name: ctx.from.last_name || "",
      });
      await newUser.save();
      user = newUser;
    }
    const lang = user?.user_lang || "UZB";

    // Shikoyat jarayonini tekshirish
    if (complaintSteps[user_id]) {
      const result = await handleComplaintMessage(ctx);
      if (result) return;
    }

    // Til tanlash
    if (text === "🇺🇿 O'zbek tili") {
      await saveLang(ctx, "UZB");
      return await sendHomeMenu(ctx, "UZB");
    } else if (text === "🇷🇺 Русский") {
      await saveLang(ctx, "RUS");
      return await sendHomeMenu(ctx, "RUS");
    }

    //     switch (text) {
    //       case "🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar":
    //       case "🧑🏾‍🤝‍🧑🏾 Пользователи":
    //         await userSection(ctx, lang);
    //         break;

    //       case "🪧 Murojaatlar":
    //       case "🪧 Запросы":
    //         await requestsSection(ctx, lang);
    //         break;

    //       case "🗃️ Adabiyotlar":
    //       case "🗃️ Литература":
    //         await literatureSection(ctx, lang);
    //         break;

    //       case "📣 Xabarlar":
    //       case "📣 Сообщения":
    //         await messagesSection(ctx, lang);
    //         break;

    //       case "⬅️ Orqaga":
    //       case "⬅️ Назад":
    //         await handleBack(ctx, lang);
    //         break;

    //       case "📄 Kerakli hujjatlar":
    //       case "📄 Необходимые документы":
    //         await handleRequiredDocuments(ctx, lang);
    //         break;

    //       case "📞 Call Center":
    //       case "📞 Колл-центр":
    //         await handleCallCenter(ctx, lang);
    //         break;

    //       case "📝 Yangi xabar":
    //       case "📝 Новое сообщение":
    //         await handleNewMessages(ctx, lang);
    //         break;

    //       case "📚 Qiziqarli ma'lumotlar":
    //       case "📚 Интересные материалы":
    //         await handleInterestingMaterials(ctx, lang);
    //         break;

    //       case "📹 Video qo'llanmalar":
    //       case "📹 Видео инструкции":
    //         await handleVideoTutorials(ctx, lang);
    //         break;

    //       case "📝 Namunaliy blanklar":
    //       case "📝 Образцы бланков":
    //         await handleSamplefarms(ctx, lang);
    //         break;

    //       case "📰 Barcha xabarlar":
    //       case "📰 Все сообщения":
    //         await handleAllNews(ctx, lang);
    //         break;

    //       default:
    //         // Handle unknown text
    //         if (!ctx.session?.adminAction) {
    //           await ctx.reply(
    //             lang === "UZB"
    //               ? "❌ Mavjud bo'lmagan buyruq. Iltimos, menyudan tanlang."
    //               : "❌ Несуществующая команда. Пожалуйста, выберите из меню."
    //           );
    //           await sendHomeMenu(ctx, lang);
    //         }
    //     }
    //   } catch (error) {
    //     console.error("Error handling text message:", error);
    //     await ctx.reply("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    //   }
    // });
    switch (text) {
      case "🗃️ Adabiyotlar":
      case "🗃 Литература":
        await literatureSection(ctx, lang);
        break;

      case "📚 Qiziqarli ma'lumotlar":
      case "📚 Интересные данные":
        await handleInterestingMaterials(ctx, lang);
        break;

      case "📹 Video qo'llanmalar":
      case "📹 Видео-руководства":
        await handleVideoTutorials(ctx, lang);
        break;

      case "📝 Namunaliy blanklar":
      case "📝 Образцы бланков":
        await handleSamplefarms(ctx, lang);
        break;

      case "📄 Kerakli hujjatlar":
      case "📄 Необходимые документы":
        await handleRequiredDocuments(ctx, lang);
        break;

      case "📝 Shikoyat va takliflar":
      case "📝 Жалобы и предложения":
        await startComplaintFlow(ctx);
        break;

      case "📞 Telefon raqamlar":
      case "📞 Телефонные номера":
        await handleCallCenter(ctx, lang);
        break;

      case "🧑‍🤝‍🧑 Foydalanuvchi ro'yxati":
      case "🧑‍🤝‍🧑 Список пользователей":
        await handleUserList(ctx, lang);
        break;

      case "📣 Xabarlar":
      case "📣 Сообщения":
        await messagesSection(ctx, lang);
        break;

      case "📬 Yangi xabarlar":
      case "📬 Новые сообщения":
        await handleNewMessages(ctx, lang);
        break;

      case "📰 Barcha xabarlar":
      case "📰 Все сообщения":
        await handleAllNews(ctx, lang);
        break;

      case "🪧 Murojaatlar":
      case "🪧 Запросы":
        await requestsSection(ctx, lang);
        break;

      case "📋 Murojaatlar haqida":
      case "📋 О запросах":
        await ctx.reply(
          lang === "UZB"
            ? "Murojaatlar haqida ma'lumot tez orada qo'shiladi."
            : "Информация о запросах будет добавлена в ближайшее время."
        );
        break;

      case "🧑🏾‍🤝‍🧑🏾 Foydalanuvchilar":
      case "🧑🏾‍🤝‍🧑🏾 Пользователи":
        await userSection(ctx, lang);
        break;

      case "♻️ Tilni o'zgartirish":
      case "♻️ Изменить язык":
        await selectLang(ctx);
        break;

      case "⬅️ Orqaga":
      case "⬅️ Назад":
        if (complaintSteps[user_id]) {
          delete complaintSteps[user_id];
        }
        await sendHomeMenu(ctx, lang);
        break;

      default:
        if (!complaintSteps[user_id]) {
          await ctx.reply(
            lang === "UZB"
              ? "❌ Mavjud bo'lmagan buyruq. Iltimos, menyudan tanlang."
              : "❌ Неизвестная команда. Пожалуйста, выберите из меню."
          );
          await sendHomeMenu(ctx, lang);
        }
        break;
    }
  } catch (error) {
    console.error("Message handler error:", error);
  }
});

// Barcha xabarlar uchun qo'shimcha handlers
bot.hears(["📰 Barcha xabarlar", "📰 Все сообщения"], async (ctx) => {
  const lang = ctx.message.text.includes("Barcha") ? "UZB" : "RUS";
  await handleAllNews(ctx, lang);
});
