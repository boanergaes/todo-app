const path = require("path"); //importin the "path" library for assigning path of locations with node
const HtmlWebpackPlugin = require("html-webpack-plugin"); //importing for bundling and serving the creatiion of index.html in dist
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //for serving creation of style.css
const Dotenv = require("dotenv-webpack"); //for working with .env

module.exports = {

    mode: "production",

    entry: {
        bundle: path.resolve(__dirname, "src/scripts/index.js")
    },

    output: {
        path: path.resolve(__dirname, "dist"), //create a dist file in the root folder used for deployment and building
        filename: "[name][contenthash].js",
        clean: true, // for deleting and recreating on each build
    },

    module: {

        //rules the setted up production env should follow
        rules: [

            //to load html. incase i use img directly in html
            {
                test: /\.html$/,
                use: "html-loader",
                exclude: path.resolve(__dirname, 'src/index.html')
            },

            //ues babel-loader to bundle for old web-browsers
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },

            //for bundilg the css-loader
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader"
                ],
            },

            //for importing and addresssing images
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][ext][query]",
                },
            },
        ],
    },

    //plugins that are installed and used
    plugins: [

        new HtmlWebpackPlugin({
            title: "Work Space",
            filename: "index.html", //the html file webpack creates?
            template: "./src/index.html",
        }),

        new MiniCssExtractPlugin({
            filename: "style.css",
        }),

        new Dotenv({
            path: "./.env",
            systemvars: true,
        }),
    ],
    
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        compress: true,
        port: 5000,
        open: true,
        hot: true,
        watchFiles: ['src/**/*.html'], //every html file in src and its sub directories (html will not hot reload without this)
    },
};
