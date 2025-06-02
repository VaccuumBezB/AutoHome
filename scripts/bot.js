// made by Vac'cuum
// https://t.me/VaccuumGames

////////////////////////////// ПРЕПРОЦЕССОРЫ / PREPROCESSORS ///////////////////////////////

const GPIO = require('orange-pi-gpio');
const TGBOT = require('node-telegram-bot-api');
const fs = require('fs');

////////////////////////////// ИНИЦИАЛИЗАЦИЯ / INIT ///////////////////////////////

try 
{
    const data = fs.readFileSync('../data.json', 'utf8');
    const jsonData = JSON.parse(data);
}
catch (err) 
{
    console.error('Error reading or parsing file:', err);
}

let ZONT_TOKEN; // this one will be generated
const ZONT_THINGS = { // paste here your ZONT account details
    login: jsonData.login,
    password: jsonData.password,
    clientEmail: jsonData.clientEmail
}

const API_KEY = jsonData.apiKey; // tg bot api key (get on BotFather)
let whiteList = jsonData.whiteList; // bot users whitelist (telegram username)

let gpio5 = new GPIO({
    pin: 5,
    mode: 'out',
    ready: () => {
        console.log("pin 5 ok");
    }
}); // initializing gpio

const bot = new TGBOT(API_KEY, {
    polling: true
}
); // initializing bot

let flag = false;
let lastChat; // some useless variables

//////////////////////////////////////////// POLLING ////////////////////////////////////////////////////////

bot.on('text', async msg => {

    if (whiteList.includes(msg.from.username)) {
        try {
            var message = msg.text.toLowerCase();
            console.log('New message');

            switch (message) {
                case 'command1':
                    await bot.sendMessage(msg.chat.id, "ye dats command 1.");
                    break;
                case 'write5':
                    if (flag)
                    {
                        gpio5.write(0);
                        await bot.sendMessage(msg.chat.id, "5th pin is 0V 0A now.");
                    }
                    else
                    {
                        gpio5.write(1);
                        await bot.sendMessage(msg.chat.id, "5th pin is 5V 1,5A now.");
                    }
                    flag = !flag;
                    
                    break;
                case '/start':
                    await bot.sendMessage(msg.chat.id, `bot menu`, {
                        reply_markup: {
                            keyboard: [

                                ['COMMAND1', 'MYGEO'],
                                ['WRITE5', 'CLOSE']
                            ]
                        }
                    });
                    break;
                case 'close':
                    await bot.sendMessage(msg.chat.id, "Ы", {
                        reply_markup: {

                            remove_keyboard: true

                        }
                    });
                    break;
                case 'mygeo':
                    await bot.sendMessage(msg.chat.id, `${msg.from.first_name}: \n Долгота: ${msg.from.location.longitude}\n Широта: ${msg.from.location.attitude}`);
                    break;
                default:
                    await bot.sendMessage(msg.chat.id, (Math.random() < 0.5) ? `${msg.from.first_name}, what did ya said bout' my mama?!` : "Это эльфийски. я не могу прочитать...");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        await bot.sendMessage(msg.chat.id, `${msg.from.first_name}, u cant do it rn`);
    } // whitelist check
    lastChat = msg.chat.id;
});

/////////////////////////////////////////////// МЕТОДЫ / METHODS /////////////////////////////////////////////

async function GetAuthToken(){
  const response = await fetch('https://my.zont.online/api/get_authtoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${ZONT_THINGS.login}:${ZONT_THINGS.password}`), // Basic Auth
      'X-ZONT-Client': ZONT_THINGS.clientEmail
    },
    body: JSON.stringify({ client_name: 'AutoHome' }) // AppName
  });

  const data = await response.json();
  return data.token;
}

ZONT_TOKEN = GetAuthToken();

//setInterval(CheckForTemp, 30000);
async function getDevices(token) {
  const response = await fetch('https://my.zont.online/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ZONT-Client': clientEmail,
      'X-ZONT-Token': token
    },
    body: JSON.stringify({ load_io: true })
  });

  const devices = await response.json();
  console.log(devices);
  return devices;
}

///////////////////////////////////////////////////// ОСНОВНАЯ ЧАСТЬ / MAIN PART ////////////////////////////////////////////////

(async () => {
    try
    {
        const _devices = getDevices(ZONT_TOKEN);
    }
    catch(error)
    {
        console.error(error);
    }
})(); // simple request using javascript

// HERE U CAN WRITE SOME COOL CODE USING ZONT AND TG BOT
// ill post examles in this repo later
