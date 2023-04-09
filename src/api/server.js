
import request from '@/plugins/axios'
/**
 * 获取所有导航
 */
export function GetNavigation () {
  return request({
    url: '/api/SyZero.Blog/Navigation/All',
    method: 'get'
  })
}

/**
 * 获取所有博客
 */
export function GetBlog (params) {
  return request({
    url: '/api/SyZero.Blog/Article/ShowAll',
    method: 'get',
    params
  })
}

/**
 * 获取所有文章分类
 */
export function GetBlogCategory (params) {
  return request({
    url: '/api/SyZero.Blog/ArticleCategory/ShowAll',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 */
export function GetBlogInfo (id) {
  return request({
    url: `/api/SyZero.Blog/Article/ShowInfo/${id}`,
    method: 'get'
  })
}


/**
 * 获取所有友链
 */
export function GetLink () {
  return request({
    url: `/api/SyZero.Blog/Link/All`,
    method: 'get'
  })
}


/**
 * 获取其他设置
 */
export function GetWebConfig () {
  return request({
    url: '/api/SyZero.Blog/Config/WebConfig',
    method: 'get'
  })
}

/**
 * 获取验证码
 */
export function GetVerificationCode (phone) {
  return request({
    url: '/api/Account/VerificationCode',
    method: 'get',
    params: { phone }
  })
}

/**
 * 注册
 */
export function Register (data) {
  return request({
    url: '/api/Account/Register',
    method: 'post',
    data
  })
}

/**
 * 登录
 */
export function Login (data) {
  return request({
    url: '/api/TokenAuth/Login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 */
export function GetUserInfo () {
  return request({
    url: '/api/SyZero.Authorization/User/UserInfo',
    method: 'get'
  })
}

/**
 * 更新用户信息
 */
export function UpdataUserInfo (data) {
  return request({
    url: '/api/SyZero.Authorization/User/UserInfo',
    method: 'put',
    data
  })
}

/**
 * 获取收藏/喜欢博客 Type1 / 2
 */
export function GetCollectionBlog (params) {
  return request({
    url: '/api/SyZero.Blog/Article/ShowCollectionAll',
    method: 'get',
    params
  })
}

/**
 * 更新收藏/喜欢博客 Type1 / 2
 */
export function CollectionBlog (Id, Type, IsAdd = true) {
  return request({
    url: `/api/SyZero.Blog/Article/${Id}/CollectionBlog/${Type}/${IsAdd}`,
    method: 'post'
  })
}

/**
 * 是否收藏/喜欢博客 Type1 / 2
 */
export function IsCollectionBlog (Id, Type) {
  return request({
    url: `/api/SyZero.Blog/Article/${Id}/IsCollectionBlog/${Type}`,
    method: 'get'
  })
}

/**
 * 更新喜欢数
 */
export function AddLikeNum () {
  return request({
    url: '/api/SyZero.Blog/Config/LikeNum',
    method: 'post'
  })
}

/**
 * 获取喜欢数
 */
export function ShowLikeNum () {
  return request({
    url: '/api/SyZero.Blog/Config/ShowLikeNum',
    method: 'get'
  })
}

/**
 * 获取评论
 */
export function GetBlogComment (BlogId, params) {
  return request({
    url: `/api/SyZero.Blog/Comment/Blog/${BlogId}`,
    method: 'get',
    params
  })
}

/**
 * 发生评论
 */
export function SendComment (BlogId, data) {
  return request({
    url:`/api/SyZero.Blog/Comment/Blog/${BlogId}`,
    method: 'post',
    data
  })
}


/**
 * 获取所以博客文章（SEO）
 */
export function GetAllBlog () {
  return request({
    url: '/api/SyZero.Blog/Article/GetAllBlog',
    method: 'get'
  })
}