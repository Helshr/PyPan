export default {
    "proxy": {
         "/api": {
             "target": "http://0.0.0.0:5000",
             "changeOrigin": true,
             "pathRewrite": { "^/api" : "/api" }
         }
     },
}
