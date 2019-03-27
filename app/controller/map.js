const Controller = require('egg').Controller;
const execSync = require('child_process').execSync;
const fs = require('fs');
const readline = require('readline');
const path = require('path')

class MapController extends Controller {

    async importAddress(path) {
        return new Promise((resolve, reject) => {
            let r = execSync(`cat ${path} | wc -l`);
            let lines = parseInt(r.toString());
            let done = 0;
            let inStream = fs.createReadStream(path);
            let rl = readline.createInterface(inStream);
            let address = [];

            rl.on('line', (data) => {
                if (data && address.indexOf(data) === -1) address.push(data);
                done++;
                if (done === lines) {
                    resolve(address);
                }
            }).on('close', () => {
                console.log('read file finished');
            }).on('error', (err) => {
                console.log('read file error');
                reject(err);
            });

            inStream.on('error', (error) => {
                console.log('input stream error');
                reject(error)
            });
        });
    }

    async show() {
        const { ctx } = this;
        console.log('map home controller is comming');
        await ctx.render('map');
    }

    async load() {
        const { ctx } = this;
        const addressDir = path.join(__dirname, "../miscs");
        const file = addressDir + '/address.txt';
        let address = await this.importAddress(file);
        console.log('address: ', address);
        ctx.body = address;
    }

}

module.exports = MapController