//Debug
const test = require('debug')('app:test')
const color = require('debug')('app:color')
test(chalk.green(`Assalamualaikum`))
color(chalk.red(`How are you?`))


//
function add(a,b) {
    if (typeof a === 'number') {
        console.log(a+b);
    }else{
    throw new Error(`Number doesn't match.`)
}

}
add(5,5)



//config
//$env:NODE_ENV="production" $env:NODE_ENV="development"
// const config1 = require('./config/confi')
// console.log(process.env.NODE_ENV);
// if (app.get('env').toLowerCase() === 'development') {
//     console.log(config1.dev.name);
// }else{
//     console.log(config1.prod.name);
// }
// console.log(config2.get('name'));