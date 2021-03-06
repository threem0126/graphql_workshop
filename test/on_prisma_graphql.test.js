const { Prisma } = require('prisma-binding')

const getPrismaTestInstance = () => {
  return new Prisma({
    typeDefs: './src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
    endpoint: 'http://localhost:6789', // the endpoint of the Prisma API (value set in `.env`)
    debug: true, // log all GraphQL queries & mutations sent to the Prisma API
    // secret: process.env.PRISMA_SECRET, // only needed if specified in `database/prisma.yml` (value set in `.env`)
  })
}
const ctx = {
  db: getPrismaTestInstance(),
}

afterEach(async () => {
  //await ctx.db.mutation.deleteManyPosts({})
})

let _run ={
  email : `${Math.random()}.89479759@qq.com`
}

test('#创建一个用户u1', async () => {   
  const result = await ctx.db.mutation.createUser({data:{
      name:"huangyong",
      email:_run.email
    }})
  expect(result.email).toBe(_run.email)
}) 
  
test('#用户创建一篇博客b1', async () => {  
  const title = "blog b1"
  const result = await ctx.db.mutation.createBlog({data:{ 
    title,
    owner:{
      connect:{
        email:_run.email
      }
    }
  }})
  expect(result.title).toBe(title)
  _run.id_b1 = result.id;
}) 

test('#用户发表一篇博客b1的评论c1', async () => {   
  let content = "i am c1 for b1"
  const result = await ctx.db.mutation.createComment({data:{  
    content,
    blog:{
      connect:{
        id:_run.id_b1
      }
    }
  }})
  expect(result.content).toBe(content)
  _run.id_b1_c1 = result.id;
}) 

test('#用户修改博客b1评论c1', async () => {   
  let  content = "i am c1 for b1 (modified)!" 
  const result = await ctx.db.mutation.updateComment({data:{   
      content 
  },where:{ 
    id:_run.id_b1_c1 
  }})
  console.log(`用户修改博客b1评论c1:`) 
  console.log(result) 
  expect(result.content).toBe(content) 
})

test('#用户再发表博客b1评论c2', async () => {   
  let content = "i am c2 for b1!"
  const result = await ctx.db.mutation.createComment({data:{  
    content,
    blog:{
      connect:{
        id:_run.id_b1
      }
    }
  }})
  console.log(`用户再发表博客b1评论c2:`)
  console.log(result)
  // { id: 'cjjz8bhoo00350746boh9li6q',
  //     content: 'i am c2 for b1!',
  //     dummy: null }
  expect(result.content).toBe(content)
  _run.id_b1_c2 = result.id;
})

test('#用户删除博客评论c2', async () => { 
  const result = await ctx.db.mutation.deleteComment({where:{  
    id:_run.id_b1_c2
  }})
  console.log(`用户删除博客评论c2:`)
  console.log(result)
  expect(result.id).toBe(_run.id_b1_c2)
})

test('#用户删除博客b1', async () => {   
  const result = await ctx.db.mutation.deleteBlog({where:{  
    id:_run.id_b1
  }})
  expect(result.id).toBe(_run.id_b1)
})

test('#在用户名下创建博客b2', async () => {  
  let title = "i am blog b2"  
  const result = await ctx.db.mutation.createBlog({data:{  
    title,
    owner:{
      connect:{
        email:_run.email
      }
    },
    comments:{
      create:[
        {content:"i am default com1 for b2"},
        {content:"i am default com2 for b2"}
      ]
    }
  }}, ` {id, title, owner {id, name}, comments{id, content}} `)
  expect(result.title).toBe(title)
  _run.id_b2 = result.id
}) 

test('#用户发表博客b2的评论c3，标题“abc123”', async () => {   
  const result = await ctx.db.mutation.createComment({data:{  
    content:"i am abc123 comment for b2.",
    blog:{
      connect:{
        id:_run.id_b2
      }
    }
  }})
  expect(result).not.toBeNull()
})  

test('#用户发表博客b2的评论c4，标题“abc456”', async () => {   
  const result = await ctx.db.mutation.createComment({data:{  
    content:"i am abc456 comment for b2.",
    blog:{
      connect:{
        id:_run.id_b2
      }
    }
  }})
  expect(result).not.toBeNull()
})  

test('#批量更新标题含"abc"的评论（修改为‘abcdef’，c3和c4被修改）', async () => {   
  const {count} = await ctx.db.mutation.updateManyComments({
    data:{
      content:"i am abcdef comment for b2.",
    },
    where:{  
      content_contains:"abc"
    }
  })
  console.log(count)
  expect(count).toBeGreaterThan(0)
})  

test('#批量把博客b2名下的评论，转移到博客b1', async () => {   
  const {count} = await ctx.db.mutation.updateManyComments({
    data:{ 
      blog:{
        connect:{
          id:_run.id_b1
        }
      }
    },
    where:{  
      blog:{
        id:_run.id_b2
      }
    }
  })
  console.log(count)
  expect(count).toBeGreaterThan(0)
})  

test('#批量删除标题含hello的评论（c3和c4被删除）', async () => {   
  const {count} = await ctx.db.mutation.deleteManyComments({where:{  
    content_contains:"abc"
  }})
  expect(count).toBeGreaterThan(0)
})

test('#查询用户下面的所有博客，含评论', async () => {   
  const result = await ctx.db.query.user({
    where:{
      email:_run.email,
    }
  },`{id,email,blogs{id, title, comments{id,content}}}`)
  console.log(result)
  expect(result.blogs.length).toBeGreaterThan(0)
})

test('#删除用户u1', async () => {   
  const result = await ctx.db.mutation.deleteUser({where:{ 
    email:_run.email
  }})
  expect(result.email).toBe(_run.email)
}) 