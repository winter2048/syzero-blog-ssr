module.exports = {
    // 开发环境
    Development: {
      BASE_API: 'http://localhost:5003' // 开发服务器地址
    },
    // 测试环境
    Test: {
      BASE_API: 'http://192.168.2.130:5003' // 测试服务器地址
    },
    // 生产环境
    Production: {
      BASE_API: 'http://192.168.2.120:5003' // 正式服务器地址
    }
  }