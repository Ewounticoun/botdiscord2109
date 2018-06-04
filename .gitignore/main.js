const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('database.json')
const storeadapter = new FileSync('store.json');
const db = low(adapter);
const storedb = low(storeadapter);

db.defaults({ histoires: [], xp: [], inventory: []}).write()

var bot = new Discord.Client();
var prefix = ("/")
var randnum = 0;

var storynumber = db.get('histoires').map('story_value').value();

bot.on('ready', () =>{
    console.log("Bot Ready !");

}); 

bot.on('message', function (message){
    
    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("inventory").find({user: msgauthor}).value()){
        db.get("inventory").push({user: msgauthor, items: "vide"}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp : ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    }

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp : ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    }

    if (message.content === 'Très bien et toi'){
        random();

        if (randnum == 1){
            message.reply('Cool pour toi XD ! Moi aussi');
        }
        if (randnum == 2){
            message.reply('Comme toujour je vais très bien');
         }
         if (randnum == 3){
            message.reply('Pas très bien, merci de te soucier de moi !');
         }
    }
    if (message.content === "Oui et toi"){
        random();

        if (randnum == 1){
            message.reply('Cool pour toi XD ! Moi aussi :)');
        }
        if (randnum == 2){
            message.reply('Comme toujour je vais très bien !');
         }
         if (randnum == 3){
            message.reply('Pas très bien, merci de te soucier de moi !');
         }
    } 
    
    if (message.content === 'Bonjour'){
        message.reply('Bonjour, comment ça va ?')
    }
    if (message.content === 'Salut'){
        message.reply('Salut, ça va ?')
    } 
    if (message.content === prefix + "help"){
        message.channel.sendMessage("Voici les commandes du bot : \n\n/xpstat : Pour voir où en sont tes XP\n/store : Pour afficher le Store\n/buyitem (ID de l'item) : Pour acheter un item du shop\n/ban @... : Pour banir un membre inférieur qui insulte (Attention ne pas bannir sans raison car risque de bannissement)\n/kick @... : Pour Kick un membre inférieur qui le mérite (Attention ne pas kick sans raison car risque de bannissement)  \n\nJe peux vous répondre lorsque vous marquez : \n-Bonjour\n-Salut\n-Oui et toi \n-Très bien et toi")
    }

    if (message.content === "ping"){
        message.reply("pong");
    }
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){
        
        case "newstory":
        var value = message.content.substr(10);
        var author = message.author.toString();
        var number = db.get('histoires').map('id').value();
        //var storyid = number + 1
        console.log(value);
        message.reply("Ajout de l'histoire de la base de données")

        db.get('histoires')
            .push({ story_value: value, story_author: author})
            .write()
        break;
        
        case "tellstory" :
        
        story_random();

        console.log(randnum);

        var story = db.get(`histoires[${randnum}].story_value`).toString().value();
        var author_story = db.get(`histoires[${randnum}].story_author`).toString().value();
        console.log(story);

        message.channel.send(`Voici l'histoire : ${story} (histoire de ${author_story})`)
        
        break;

        case "kick":

        if (!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")){
            message.reply("Tu n'as pas le droit de Kick ! Désoler ;)")
        }else{
            var memberkick = message.mentions.users.first();
            console.log(memberkick)
            console.log(message.guild.member(memberkick).kickable)
            if(!memberkick){
                message.reply("L'utilisateur n'éxiste pas !");
            }else{
                if(!message.guild.member(memberkick).kickable){
                    message.reply("Utilisateur impossible a kick !");
                }else{
                    message.guild.member(memberkick).kick().then((member) => {
                    message.channel.send(`${member.displayName} a été kick !`);
                }).catch(() => {
                    message.channel.send("Kick Refusé !")
                })
            }
        }
    }
        break;

        case "ban":

        if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")){
            message.reply("Tu n'as pas le droit de bannir ! Désoler ;)")
        }else{
            var memberban = message.mentions.users.first();
            console.log(memberban)
            console.log(message.guild.member(memberban).kickable)
            if(!memberban){
                message.reply("L'utilisateur n'éxiste pas !");
            }else{
                if(!message.guild.member(memberban).kickable){
                    message.reply("Utilisateur impossible a bannir !");
                }else{
                    message.guild.member(memberban).kick().then((member) => {
                    message.channel.send(`${memberban.displayName} a été banni !`);
                }).catch(() => {
                    message.channel.send("Ban Refusé !")
                })
            }
        }
    }  
        break;

        case "store":
        var store_embed = new Discord.RichEmbed()
            .setTitle("EDMG-Snake Store ~~ Money utilisé : XP")
            .setDescription("Salut, ici tu trouvera des items et des badges à acheter !")
            .addField("Items:", "-Passage Modo [10000XP][ID: item0001] Description: Ah que c'est bon d'être modo je peut presque tout contrôler !\n\n-Smylet class[100XP][ID: items0002] Description: Je suis jaune et je porte des lunettes de soleil triangulaire, Qui suis-je ?")
            .addField("Pour acheter", "Pour acheter un item, il faut inscrire dans la barre de tchat /buyitem (ID de l'item) noté dans sa description, exemple : Je veux item Smylet class [/buyitem item0002].\nMerci de votre compréhension")

        message.channel.send({embed: store_embed});

        
        break;

        case "buyitem":

            var itembuying = message.content.substr(9);
            if(!itembuying){
                itembuying = "Indéterminé";
            }else{
                console.log(`StoreLogs: Demande d'achat d'item ${itembuying}`)
                if (storedb.get("store_items").find({itemID: itembuying}).value()){
                    console.log("Item trouvé")
                    var info = storedb.get("store_items").filter({itemID: itembuying}).find("name", "desc").value();
                    var iteminfo = Object.values(info);
                    console.log(iteminfo);
                    var buy_embed = new Discord.RichEmbed()
                        .setTitle("EDMG-Snake Store ~~ Facture D'achat")
                        .setDescription("*Attention, ceci est une facture d'achat ! Merci de votre achat*")
                        .addField("Infos", `*ID:* ***${iteminfo[0]}***\n*Nom:* ***${iteminfo[1]}***\n*Description:* ***${iteminfo[2]}***\n*Prix:* ***${iteminfo[3]}***`)

                        message.author.send({embed: buy_embed});

                        var useritem = db.get("inventory").filter({user: msgauthor}).find("items").value();
                        var itemsdb = Object.values(useritem);
                        var userxpdb = db.get("xp").filter({user: msgauthor}).find("xp").value();
                        var userxp = Object.values(userxpdb);
                        
                        if (userxp[1] >= iteminfo[3]){
                            message.reply(`***Information: *** Votre achat(${iteminfo[1]}) a été accepté. Retrait de ${iteminfo[3]} XP`)
                            if (!db.get("inventory").filter({user:msgauthor}).find({items: "vide"}).value()){
                                console.log("Inventaire Pas Vide !");
                                db.get("xp").filter({user: msgauthor}).find("xp").assign({user: msgauthor, xp: userxp[1] -= iteminfo[3]}).write();
                                db.get("inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: itemsdb[1] + " , " + iteminfo[1]}).write();
                            }else{
                                console.log("Inventaire Vide !");
                                db.get("xp").filter({user: msgauthor}).find("xp").assign({user: msgauthor, xp: userxp[1] -= iteminfo[3]}).write();
                                db.get("inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: iteminfo[1]}).write();
                            }
                        }else{
                            message.reply("Erreur ! Achat impossible, nombre d'xp insuffisant !");
                        }
                }
            }


        break;

        case "buyitem item0001":

        if (userxp[1] >= iteminfo[3]){
            msgauthor.setroles(['Modérateur !']).then(console.log).catch(console.error);
        }

        
        
        break;

    }

    if (message.content === prefix + "xpstat"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle(`XP de ${message.author.username}`)
            .setDescription("Voici tout vos XP Messieur !")
            .addField("XP :", `${xpfinal[1]} xp`)
            message.channel.send({embed: xp_embed});
    }
})

bot.on('guildMemberAdd', function (member) {
  member.createDM().then(function (channel) {
        return channel.send("Bienvenu " + member.displayName + " sur le serveur de la team EDMG-Snake. \n-Je te rappelle 2 point important : Pas D'insulte !!! ET Amuse toi bien XD !!! \n-Si tu veux jouer avec d'autres joueur, il te suffit de marquer un message dans la parti du jeu que tu souhaite et de rejoindre la partie vocale prévu pour se jeu. \n-Quand tu envoies un message dans le tchat, tu gagne 1XP. Tap /xpstat pour voir tes XP.\n\nSi tu as des idée pour le serveur et pour la chaine Youtube : EDMG-Snake, n'hésite pas a les dires à Ewounticoun en messages privée, il sera ravi des les mettres en place ! \n-Tape /help pour voir mes commandes !\n\n-Sur ceux éclate toi et n'hésite pas à partager le serveur à tes amis !!!")
    }).catch(console.error)
})

bot.on('ready', function () {
    bot.user.setActivity('/help pour obtenir mes commandes').catch(console.error)
})

bot.login('NDUxMzM4Nzg2MzcxMjcyNzE2.DfBTbw.VeX60_7Nm1KMdg41GDce4ZJsiFs');

function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(3);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}


function story_random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(storynumber);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}


    
    
    
