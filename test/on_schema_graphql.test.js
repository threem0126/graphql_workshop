import { request, GraphQLClient } from 'graphql-request'
import { single } from '../node_modules/rxjs/operator/single';

const get_userID = ()=> _run.userID;
const client = ()=>{
  let headers = _run.token?{
    Authorization:`Bearer ${_run.token}`  //临时在headers中传入userID，服务器端取此身份
  }:{}
  return new GraphQLClient("http://localhost:4000", { headers })
}

afterEach(async () => {
  //await resolvers.mutation.deleteManyPosts(parent, {})
})

let _run ={
  email : `${Math.random()}@qq.com`
}

test('#注册一个用户，拿到token', async () => {   
  const query = `mutation{
    signup(name: "huangyong", email:"${_run.email}", password:"123456") {
      token,
      user{
        id,
        name,
        email,
        createdAt
      }
    }
  }`
  const {signup} = await client().request(query)
  console.log(signup)
  expect(signup.user.email).toBe(_run.email)
  _run.token = signup.token 
  _run.userID = signup.user.id 
})

test('#用户创建一篇博客b1', async () => {  
  const title = "blog b1"  
  const query = `mutation{
    createBlog(
      title:"${title}"
    ){
      id,
      title
    }
  }`
  const {createBlog} = await client().request(query)
  // console.log(createBlog)
  expect(createBlog.title).toBe(title)
  _run.id_b1 = createBlog.id;
}) 

test('#用户发表一篇博客b1的评论c1', async () => {   
  let content = "i am c1 for b1" 
  const query = `mutation{
    createComment(
      content:"${content}"
      blogID:"${_run.id_b1}"
    ){
      id,
      content,
      blog{
        id,
        title
      }
    }
  }`
  const {createComment} = await client().request(query) 
  // console.log(createComment)
  expect(createComment.content).toBe(content)
  _run.id_b1_c1 = createComment.id;
}) 

test('#用户修改博客b1评论c1', async () => { 
  let  content = "i am c1 for b1 (modified)!" 
  const query = `mutation{
    updateComment(
      commentID:"${_run.id_b1_c1}"
      content:"${content}"
    ){
      id,
      content
    }
  }`
  const {updateComment} = await client().request(query)
  // console.log(updateComment)
  expect(updateComment.content).toBe(content) 
})

test('#用户再发表博客b1评论c2', async () => { 
  let content = "i am c2 for b1!"  
  const query = `mutation{
    createComment(
      content:"${content}"
      blogID:"${_run.id_b1}"
    ){
      id,
      content,
      blog{
        id,
        title
      }
    }
  }`
  const {createComment} = await client().request(query) 
  // console.log(createComment)
  expect(createComment.content).toBe(content)
  _run.id_b1_c2 = createComment.id;
})

test('#用户删除博客评论c2', async () => {  
  const query = `mutation{
    deleteComment( 
      commentID:"${_run.id_b1_c2}"
    ){
      id,
      content
    }
  }`
  const {deleteComment} = await client().request(query)  
  expect(deleteComment.id).toBe(_run.id_b1_c2)
})

test('#用户删除博客b1', async () => { 
  const query = `mutation{
    deleteBlog( 
      blogID:"${_run.id_b1}"
    ){
      id,
      title
    }
  }`
  const {deleteBlog} = await client().request(query) 
  expect(deleteBlog.id).toBe(_run.id_b1)
})

test('#在用户名下创建博客b2', async () => {  
  let title = "i am blog b2"   
  const query = `mutation{
    newblog:createBlogByThisUser( 
      title:"${ title }"
      ownerUserID:"${ _run.userID }"
    ){
      id,
      title,
      owner{
        id,
        name
      }
      comments{
        id,
        content
      }
    }
  }`
  const {newblog} = await client().request(query) 
  expect(newblog.title).toBe(title)
  _run.id_b2 = newblog.id
}) 

test('#用户发表博客b2的评论c3，标题“abc123”', async () => {    
  let content = "i am c3 abc123 for b2!"  
  const query = `mutation{
    newComment:createComment(
      content:"${content}"
      blogID:"${_run.id_b2}"
    ){
      id,
      content,
      blog{
        id,
        title
      }
    }
  }`
  const {newComment} = await client().request(query) 
  // console.log(createComment)
  expect(newComment.content).toBe(content)
  _run.id_b2_c3 = newComment.id;
})  

test('#用户发表博客b2的评论c4，标题“abc456”', async () => {    
  let content = "i am c4 abc456 for b2!"  
  const query = `mutation{
    commentb2c4:createComment(
      content:"${content}"
      blogID:"${_run.id_b2}"
    ){
      id,
      content,
      blog{
        id,
        title
      }
    }
  }`
  const {commentb2c4} = await client().request(query) 
  // console.log(commentb2c4)
  expect(commentb2c4.content).toBe(content)
  _run.id_b2_c4 = commentb2c4.id;
})  

test('#批量更新标题含"abc"的评论（修改为‘abcdef’，c3和c4被修改）', async () => {   
  const query = `mutation{
    updatecoms:updateCommentsByKeyWords(
      keywordsinContent:"abc"
      newContent:"i am abcdef comment for b2."
    ){
      count
    }
  }`
  const {updatecoms} = await client().request(query) 
  // console.log(updatecoms)
  expect(updatecoms.count).toBeGreaterThan(0)  
})  

test('#批量把博客b2名下的评论，转移到博客b1', async () => {   
  const query = `mutation{
    transCommentBetweenBlogs(
      fromBlogID:"${_run.id_b2}"
      toBlogID:"${_run.id_b1}"
    ){
      count
    }
  }`
  const {transCommentBetweenBlogs} = await client().request(query) 
  // console.log(transCommentBetweenBlogs)
  expect(transCommentBetweenBlogs.count).toBeGreaterThan(0)  
})  

test('#批量删除标题含abc的评论（c3和c4被删除）', async () => {   
  const query = `mutation{
    deleteABCcomment:deleteManyCommentsByKeywords(
      keywords:"abc" 
    ){
      count
    }
  }`
  const {deleteABCcomment} = await client().request(query) 
  // console.log(deleteABCcomment)
  expect(deleteABCcomment.count).toBeGreaterThan(0)  
})


test('#查询email中含qq.com的用户清单', async () => {   
  const query = `query{
    users(where:{
        email_contains:"qq.com"
    }){
      id,
      name,
      email
    }
  }`
  const {users} = await client().request(query) 
  // console.log( users )
  expect(users.length).toBeGreaterThan(0) 
})

test('#查询指定email的用户', async () => {   
  const query = `query{
    user(where:{
        email:"${_run.email}"
    }){
      id,
      name,
      email
    }
  }`
  const {user} = await client().request(query) 
  // console.log( users )
  expect(user.email).toBe(_run.email) 
})

test('#查询指定用户下面的所有博客，含评论', async () => {   
  const query = `query{
    user(
      where:{
        email:"${ _run.email }"
      } 
    ){
      id,
      name,
      email,
      blogs{
        id,
        title,
        comments{
          id,
          content
        }
      }
    }
  }`
  const {user} = await client().request(query) 
  // console.log( user )
  expect(user.blogs.length).toBeGreaterThan(0) 
})

test('#查询qq邮箱用户发表的评论，按时间倒序排列', async () => {   
  const query = `query{
    comments(
      where:{
        blog:{
          owner:{
            email_contains:"qq.com"
          }
        }
      },
      first:5,
      orderBy:createdAt_DESC 
    ){
      id
      content,
      createdAt,
      updatedAt,
      blog{
        id
      }
    }
  }`
  const {comments} = await client().request(query) 
  console.log( comments )
  expect(comments.length).toBeGreaterThan(0) 
})

test('#查询qq邮箱用户发表的、且博客标题中含有“b1”字样的评论，最新3条', async () => {   
  const query = `query{
    comments(
      where:{
        AND:[
          {blog:{
              owner:{
                email_contains:"qq.com"
              }
          }},
          {blog:{
              title_contains:"b1"
          }}
        ]
      },
      first:3,
      orderBy:createdAt_DESC 
    ){
      id
      content,
      createdAt,
      updatedAt,
      blog{
        id,
        title
      }
    }
  }` 
  const {comments} = await client().request(query) 
  console.log( comments )
  expect(comments.length).toBeGreaterThanOrEqual(0) 
})

test('#查询发表过至少一篇标题带b1字样的用户', async () => {   
  const query = `query{
    users(
      where:{
        blogs_some:{
          title_contains:"b1"
        }
      },
      first:20,
      orderBy:createdAt_DESC 
    ){
      id,
      name,
      email,
      blogs{
        id,
        title
      }
    }
  }`
  const {users} = await client().request(query) 
  console.log( JSON.stringify(users, null, 2) ) 
  expect(users.length).toBeGreaterThanOrEqual(0) 
})

test('#查询从未发表过标题带b1字样博客的用户', async () => {   
  const query = `query{
    users(
      where:{
        blogs_none:{
          title_contains:"b1"
        }
      },
      first:20,
      orderBy:createdAt_DESC 
    ){
      id,
      name,
      email,
      blogs{
        id,
        title
      }
    }
  }`
  const {users} = await client().request(query) 
  console.log( JSON.stringify(users, null, 2) ) 
  expect(users.length).toBeGreaterThan(0) 
}) 

test('#删除用户u1', async () => {    
  const query = `mutation{
    deleteUserByEmail(
      email:"${ _run.email }" 
    ){
      id,
      name,
      email
    }
  }`
  const {deleteUserByEmail} = await client().request(query) 
  // console.log(deleteUserByEmail)
  expect(deleteUserByEmail.email).toBe(_run.email)
})

test('#创建用户a并关联创建b，关注b,然后b再关注a', async()=>{
  const query=`mutation{
    createUser({
      data:{
        name:"a",
        email:"aaaa@163.com",
        follows:{
          create:{
              name:"b",
              email:"bbbb@163.com"
          }
        }
      }
    }){
        id
        name
        email
        follows{
            id
            name
            email
        }
    }
  }`


})
