// modules

const { Telegraf, Input } = require('telegraf')
const { message } = require('telegraf/filters')
const { readFileSync, createReadStream, appendFileSync, readFile } = require('fs')

// bot setup

const bot = new Telegraf(process.env.TOKEN) // bot unique token
const ownerID = `6712047100` // bot unique id

// sources

const marketing       = './contents/book/Marketing.pdf' // كتــاب التـسويق
const costAccounting  = './contents/book/CostAccounting.pdf' // كتــاب محاسبـة التكــاليف

const marketingSheet  = './contents/sheets/Marketing.pdf' // مـلخص مبادئ التسـويق
const computerSheet   = './contents/sheets/ComputerBasics.pdf' // ملخص اســـاسيات الكمبيــوتر
const commercialSheet = './contents/sheets/Commercial.pdf' // ملخــص القـانون التجاري
const statisticsSheet = './contents/sheets/Statistics.pdf' // ملخص الاحصــاء

// detecting and counting bot users

const countFileLines = (path) => {

    return new Promise((res, rej) => {

        let lineCount = 0;

        createReadStream(path).on('data', (buffer) => {

            let idx = -1
            lineCount-- // Because the loop will run once for idx=-1

            do {

                idx = buffer.indexOf(10, idx+1)
                lineCount++
                
            } while (idx !== -1);    

        }).on('end', () => {

            res(lineCount)

        }).on('error', () => rej(`Error occured`))        
    })
}

const isIncluded = (path, id) => {

    return new Promise ((res, rej) => {

        readFile(path, (err, result) => {

            const data = result.toString()

            if(!err && data.includes(id) == false) {

                appendFileSync(path, `\n${id}`)
                res(`ID included successfully.`)

            } else {

                res(`ID is already included.`)
            }

            // when error occurs

            if (err) { console.log(`Error occured: wrong file path or connection issue.`) }
        })
    })
}

// on start

bot.start( async (ctx) => {

    const name = ctx.chat.first_name   
    const id = ctx.chat.id 
    const msg = readFileSync('./contents/messages/welcome.txt', 'utf-8')

    const check = await isIncluded(`./modules/viewers.txt`, id)
    const count = await countFileLines(`./modules/viewers.txt`)

    console.log(check, count)

    ctx.reply(`مرحبـاً ${name}\n\n${msg}`, {

        reply_markup: {

            inline_keyboard: [

                [{text: 'ملخصــات', callback_data: "sheets"}, {text: 'الكٌـتٌب', callback_data: "books"}],
                [{text: 'امتِحــانات',callback_data: "exams"}],
                [{text: '⁉️', callback_data: 'info'}]
            ]
        }
    })
})

// on callback -> books main

bot.action('books', async (ctx) => {

    const msg = readFileSync('./contents/messages/books.txt', 'utf-8')

    try {

        await ctx.editMessageText(`${msg}`, {

            reply_markup: {
    
                inline_keyboard: [
    
                    [{text: 'محاسبـة تكاليف', callback_data: 'book-1'}, {text: 'مبـادئ التسـويق', callback_data: 'book-2'}],
                    [{text: '↩️', callback_data: 'home'}]
                ]
            }
        })
        
    } catch (error) {
        
        await ctx.answerCbQuery(`عـذراً، حدثت مشـكلة مـا`) 
    }
})

// on backward -> home

bot.action('home', async (ctx) => {

    const name = ctx.chat.first_name
    const msg = readFileSync('./contents/messages/home.txt', 'utf-8')

    try {

        await ctx.editMessageText(`مرحبـاً\n\n${msg}`, {

            reply_markup: {
    
                inline_keyboard: [
    
                    [{text: 'مُلخصــات', callback_data: "sheets"}, {text: 'الكٌــتٌب', callback_data: "books"}],
                    [{text: 'امتِحـانات', callback_data: "exams"}],
                    [{text: '⁉️', callback_data: 'info'}]
                ]
            }
        })
        
    } catch (error) {
        
        await ctx.answerCbQuery(`عـذراً، حدثت مشـكلة مـا`)
    }
})

// on callback -> sheets main

bot.action('sheets', async (ctx) => {

    const msg = readFileSync('./contents/messages/sheets.txt', 'utf-8')

    try {

        await ctx.editMessageText(`${msg}`, {

            reply_markup: {
    
                inline_keyboard: [
    
                    [{text: 'مبـادئ التسويـق', callback_data: 'sheet-1'}, {text: 'حـــاسوب', callback_data: 'sheet-2'}],
                    [{text: 'قــانون تجاري', callback_data: 'sheet-4'}, {text: 'عـلم الاحصــاء', callback_data: 'sheet-3'}],
                    [{text: '↩️', callback_data: 'home'}]
                ]
            }
        })
        
    } catch (error) {

        await ctx.answerCbQuery(`عـذراً، حدثت مشـكلة مـا`)        
    }
})

// on callback -> exams

bot.action('exams', async (ctx) => {

    const msg = readFileSync('./contents/messages/exams.txt')
    await ctx.answerCbQuery(`${msg}`)
})

// on callback -> info

bot.action('info', async (ctx) => {

    const msg = readFileSync('./contents/messages/info.txt', 'utf-8')

    try {

        await ctx.editMessageText(`${msg}`, {

            reply_markup: {
    
                inline_keyboard: [
    
                    [{text: 'راسلنــي', url: `https://t.me/hosamumbaddi`}],
                    [{text: 'المُـستخدميــن', callback_data: 'views'}],              
                    [{text: '↩️', callback_data: 'home'}]
                ]
            }
        })
        
    } catch (error) {     

        await ctx.answerCbQuery(`عـذراً، حدثت مشـكلة مـا`) 
    }
})

// sending files

bot.action('book-1', async (ctx) => {

    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(costAccounting, 'محــاسبة_التكــاليف.pdf'))
    
})

bot.action('book-2', async (ctx) => {

    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(marketing, 'مبـادئ_التســويق.pdf'))
})

bot.action('sheet-1', async (ctx) => {

    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(marketingSheet, 'مٌـلخص_مبادئ_التـسويق.pdf'))
})

bot.action('sheet-2', async (ctx) => {
    
    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(computerSheet, 'مُـلخص_اساسيـات_الحـاسوب.pdf'))
})

bot.action('sheet-3', async (ctx) => {
    
    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(statisticsSheet, 'مُـلخص_علـم_الاحصــاء.pdf'))
})

bot.action('sheet-4', async (ctx) => {
    
    await ctx.answerCbQuery(`⏳`)
    await ctx.replyWithDocument(Input.fromLocalFile(commercialSheet, 'مٌـلخص_القـانون_التجـاري.pdf'))
})

// bot users

bot.action('views', async (ctx) => {

    const count = await countFileLines(`./modules/viewers.txt`)
    await ctx.answerCbQuery(`عـدد الـمٌستخدميـن هو ${count} مُـستخـدم`)
})

// init

bot.launch()

// enable gracefull stop

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('STGTERM'))