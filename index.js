const config = require("./config.json")

const Discord = require('discord.js');
const client = new Discord.Client();

const cheerio = require("cheerio");
const userAgent = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const puppeteer = require("puppeteer-extra");

const ranks = [
    "<:johnohno:746441494289973310>",
    "<:skillgroup1:790415720244183060>",
    "<:skillgroup2:790415760673079327>",
    "<:skillgroup3:790415798140141588>",
    "<:skillgroup4:790415811558637628>",
    "<:skillgroup5:790415823973515294>",
    "<:skillgroup6:790415835705376829>",
    "<:skillgroup7:790415849655238696>",
    "<:skillgroup8:790415864558125086>",
    "<:skillgroup9:790415879636254730>",
    "<:skillgroup10:790415892701773854>",
    "<:skillgroup11:790415928830853171>",
    "<:skillgroup12:790415941204836374>",
    "<:skillgroup13:790416009638182933>",
    "<:skillgroup14:790416023853203506>",
    "<:skillgroup15:790416035035086879>",
    "<:skillgroup16:790416047139717120>",
    "<:skillgroup17:790416058112147526>",
    "<:skillgroup18:790416078991654972>"
]

let browser;

async function fetchRanks(id) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    await page.setUserAgent(userAgent.toString())
    await page.goto(`${config.base}/${id}`);
    const resp = await page.content();
    page.close()
    const $ = cheerio.load(resp);
    const rankBox = $(`[style*="float:right; width:92px; height:120px; padding-top:56px; margin-left:32px"]`);
    const curimg = $(rankBox).find("img").toArray()[0];
    const cursrc = $(curimg).attr("src");
    if(cursrc == undefined) return [0, 0];
    const currank = Number(cursrc.slice(41, -4));

    const img = $(rankBox).find("img").toArray()[1];
    const src = $(img).attr("src");
    let rank = src == undefined ? currank : Number(src.slice(41, -4));

    return [currank, rank];
}

client.once("ready", async () => {
    console.log("Client initialized");
    browser = await puppeteer.launch({});
    console.log("Browser initialized");
});

client.on("message", async (message) => {
    if(message.author.id === client.user.id) return;
    if(config.channels.indexOf(message.channel.id) >= 0) {
        let result;
        if(result = message.content.match(/\d{17}/)) {
            const data = await fetchRanks(result);
            message.channel.send(`Rank: ${ranks[data[0]]}, Highest ${ranks[data[1]]}`);
        }
    }
});

client.login(config.token);
