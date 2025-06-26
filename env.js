module.exports = {
    // 开发环境
    Development: {
      BASE_API: 'http://localhost:5003' // 开发服务器地址
    },
    // 测试环境
    Test: {
      BASE_API: 'https://api.test.syzero.com' // 测试服务器地址
    },
    // 生产环境
    Production: {
      BASE_API: 'https://api.syzero.com' // 正式服务器地址
    }
  }