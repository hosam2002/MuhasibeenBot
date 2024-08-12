// modules

const { Telegraf, Input } = require('telegraf')
const { message } = require('telegraf/filters')
const { readFileSync, appendFileSync } = require('fs')

// bot token and owner id

const bot = new Telegraf(process.env.TOKEN) // bot unique token
const ownerID = `6712047100` // bot unique id

// sources

const marketing       = './contents/book/Marketing.pdf' // كتــاب التـسويق
const costAccounting  = './contents/book/CostAccounting.pdf' // كتــاب محاسبـة التكــاليف

const marketingSheet  = './contents/sheets/Marketing.pdf' // مـلخص مبادئ التسـويق
const computerSheet   = './contents/sheets/ComputerBasics.pdf' // ملخص اســـاسيات الكمبيــوتر
const commercialSheet = './contents/sheets/Commercial.pdf' // ملخــص القـانون التجاري
const statisticsSheet = './contents/sheets/Statistics.pdf' // ملخص الاحصــاء

// on start

bot.start((ctx) => {

    const name = ctx.chat.first_name    
    const msg = readFileSync('./contents/messages/welcome.txt', 'utf-8')

    ctx.reply(`مرحبـاً ${name}\n\n${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'الكٌـتٌب', callback_data: "books"}],
                [{text: 'ملخصــات', callback_data: "sheets"}],
                [{text: 'امتِحــانات',callback_data: "exams"}],
                [{text: 'عن البـوت', callback_data: 'info'}]
            ]
        }
    })
})

// on callback -> books main

bot.action('books', async (ctx) => {

    const msg = readFileSync('./contents/messages/books.txt', 'utf-8')

    await ctx.editMessageText(`${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'محاسبـة تكاليف', callback_data: 'book-1'}],
                [{text: 'مبـادئ التسـويق', callback_data: 'book-2'}],
                [{text: 'رجـوع', callback_data: 'home'}]
            ]
        }
    })
})

// on backward -> home

bot.action('home', async (ctx) => {

    const name = ctx.chat.first_name
    const msg = readFileSync('./contents/messages/welcome.txt', 'utf-8')

    await ctx.editMessageText(`مرحبـاً\n\n${msg}`, {

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

// on callback -> sheets main

bot.action('sheets', async (ctx) => {

    const msg = readFileSync('./contents/messages/sheets.txt', 'utf-8')

    await ctx.editMessageText(`${msg}`, {

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

// on callback -> books

bot.action('book-1', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(costAccounting, 'محــاسبة_التكــاليف'))
})

bot.action('book-2', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(marketing, 'مبـادئ_التســويق'))
})

// callback -> sheets

bot.action('sheet-1', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(marketingSheet, 'مٌـلخص_مبادئ_التـسويق'))
})

bot.action('sheet-2', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(computerSheet, 'مُـلخص_اساسيـات_الحـاسوب'))
})

bot.action('sheet-3', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(statisticsSheet, 'مُـلخص_علـم_الاحصــاء'))
})

bot.action('sheet-4', async (ctx) => {

    await ctx.replyWithDocument(Input.fromLocalFile(commercialSheet, 'مٌـلخص_القـانون_التجـاري'))
})

// on callback -> exams

bot.action('exams', async (ctx) => {

    const msg = readFileSync('./contents/messages/exams.txt')

    await ctx.editMessageText(`${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'راسلنــي', url: 'https://t.me/hosamumbaddi'}],
                [{text: 'رجــوع', callback_data: 'home'}]
            ]
        }
    })
})

// on callback -> info

bot.action('info', async (ctx) => {

    const msg = readFileSync('./contents/messages/info.txt', 'utf-8')

    await ctx.editMessageText(`${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'راسلنــي', url: `https://t.me/hosamumbaddi`}],                    
                [{text: 'رجــوع', callback_data: 'home'}]
            ]
        }
    })
})

// init

bot.launch()