const { viewers } = require('./modules/viewers')
const { Telegraf, Input, Types } = require('telegraf')
const { message } = require('telegraf/filters')
const { readFileSync } = require('fs')

// 7289855362:AAFYK8gyT2QN4tbTe8fTiTwjAqLca0eEIZI
const ownerID = `6712047100`
const bot = new Telegraf(process.env.TOKEN)

// on start

bot.start((ctx) => {

    const id = ctx.chat.id
    const username = ctx.chat.username
    const name = ctx.chat.first_name
    
    const msg = readFileSync('./contents/messages/welcome.txt', 'utf-8')


    if (viewers.includes(id) == false) {

        viewers.push(id)
    }

    console.log(viewers) // for production

    ctx.reply(`مرحبـاً ${name}\n\n${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'الكٌـتٌب', callback_data: "books"}],
                [{text: 'ملخصــات', callback_data: "sheets"}],
                [{text: 'امتِحــانات', callback_data: "exams"}],
                [{text: 'عن البـوت', callback_data: 'info'}]
            ]
        }
    })
})

// books

bot.action('books', (ctx) => {

    ctx.editMessageText('الكّـتٌب\n_________________________', {

        reply_markup: {

            inline_keyboard: [

                [{text: 'محاسبـة تكاليف', callback_data: 'book-1'}],
                [{text: 'مبـادئ التسـويق', callback_data: 'book-2'}],
                [{text: 'رجـوع', callback_data: 'home'}]
            ]
        }
    })
})

// sheets

bot.action('sheets', (ctx) => {

    ctx.editMessageText('مُلخصـــات\n_________________________', {

        reply_markup: {

            inline_keyboard: [

                [{text: 'مبـادئ التسويـق', callback_data: 'sheet-1'}],
                [{text: 'حـــاسوب', callback_data: 'sheet-2'}],
                [{text: 'عـلم الاحصــاء', callback_data: 'sheet-3'}],
                [{text: 'قــانون تجاري', callback_data: 'sheet-4'}],
                [{text: 'رجــوغ', callback_data: 'home'}]
            ]
        }
    })
})

// variables

const marketing = './contents/books/Marketing.pdf'
const costAccounting = './contents/books/CostAccounting.pdf'

// marketing

bot.action('sheet-1', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(marketing, 'مبـادئ_التســويق.pdf'))
})

// exams

bot.action('exams', (ctx) => {

    ctx.editMessageText(`عـذراً، لا تـوجد امتحـانات الان!\n\nاذا عندك امتـحانات وعايز تضيفهـا في البوت راسـلني خـاص`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'راسلنــي', url: 'https://t.me/hosamumbaddi'}],
                [{text: 'رجــوع', callback_data: 'home'}]
            ]
        }
    })
})

// info

bot.action('info', (ctx) => {

    const msg = readFileSync('./contents/messages/info.txt', 'utf-8')

    ctx.editMessageText(msg,{

        reply_markup: {

            inline_keyboard: [

                [{text: 'راسلنــي', url: `https://t.me/hosamumbaddi`}],
                [{text: 'رجــوع', callback_data: 'home'}]
            ]
        }
    })
})

// back home

bot.action('home', (ctx) => {

    ctx.editMessageText(`الرئيســــية\n_________________________`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'الكٌـتٌب', callback_data: "books"}],
                [{text: 'مُلخصـــات', callback_data: "sheets"}],
                [{text: 'امتِحــانات', callback_data: "exams"}],
                [{text: 'عن البـوت', callback_data: 'info'}]
            ]
        }
    })
})

// only for owner

bot.on('/views', (ctx) => {

    if (ctx.chat.id == ownerID) {

        ctx.reply(`عدد الـزوار\n${viewers.length}`)
    }
})

/*
// Enable graceful stop

process.once(`SIGINT`, () => bot.stop(`SIGINT`))
process.once('SIGTERM', () => bot.stop(`SIGTERM`))
*/

// initiate

bot.launch()