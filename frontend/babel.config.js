module.exports = {
    presets:[
     ['@babel/preset-env',{
        useBuiltIns:'entry',
        corejs:3,
     }]
    ]
}

module.exports ={
    "plugins":[
        "@babel/plugin-transform-runtime",
        {
            "regenrator":true,
            "corejs":3,
        }
    ]
}