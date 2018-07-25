

let _run={
  currentUserID_mock:0
}

const blog = {
  // createBlog(title:String!):Blog #当前用户
  async createBlog(parent, { title }, ctx, info) {
    const {userId = _run.currentUserID_mock} = ctx
    return ctx.db.mutation.createBlog(
      {
        data:{
          title,
          owner:{
            connect:{
              id:userId
            }
          }
        },
      },
      info
    )
  },

  // createComment(blogID:ID!, content:String!):Comment  #当前用户 
  async createComment(parent, { blogID, content }, ctx, info) {
    const {userId = _run.currentUserID_mock} = ctx
    const isBlogExist = ctx.db.exists.Blog({
        id:blogID,
        owner:{
          id:userId
        }
    })
    if(!isBlogExist)
      throw new Error(`被评论的博客文章${blogID}不存在或不是你的！`)

    return ctx.db.mutation.createComment({
        data:{
          content,
          blog:{  
            connect:{
              id:blogID
            }
          },
          author:{
            connect:{
              id:userId
            }
          }
        },
      },
      info
    )
  },

  //updateComment(commentID:ID!, content:String!):Comment  #当前用户
  async updateComment(parent, { commentID, content }, ctx, info) {
    const {userId = _run.currentUserID_mock} = ctx
    const isCommentExist = ctx.db.exists.Comment({
        id:commentID,
        blog:{ 
          owner:{
            id:userId
          } 
        }
    })
    if(!isCommentExist)
      throw new Error(`指定的评论${commentID}不存在或不是你的！`)

    return await ctx.db.mutation.updateComment({
      data:{content },
      where:{id:commentID}
    }, info) 
  },

  // deleteComment(commentID:ID!):Comment  #当前用户 
  async deleteComment(parent, { commentID }, ctx, info) { 
    const {userId = _run.currentUserID_mock} = ctx
    const isCommentExist = ctx.db.exists.Comment({
        id:commentID,
        blog:{ 
          owner:{
            id:userId
          }
        }
    })
    if(!isCommentExist)
      throw new Error(`指定的评论${commentID}不存在或不是你的！`)
      //
    return await ctx.db.mutation.deleteComment({where:{  
      id:commentID
    }}, info) 
  },

  // deleteBlog(blogID:ID!):Blog  #当前用户 
  async deleteBlog(parent, { blogID }, ctx, info) { 
    const {userId = _run.currentUserID_mock} = ctx
    const isBlogExist = ctx.db.exists.Blog({
        id:blogID,
        owner:{
          id:userId
        }
    })
    if(!isBlogExist)
      throw new Error(`指定的博客${blogID}不存在或不是你的！`)
      //
    return await ctx.db.mutation.deleteBlog({where:{  
      id:blogID
    }}, info) 
  },

  // createBlogByThisUser(title:String!,ownerUserID:ID!,defaultComments:[Comment!]):Blog 
  async createBlogByThisUser(parent, { title, ownerUserID }, ctx, info) {  
    return await ctx.db.mutation.createBlog({
      data:{
        title,
        comments:{
          create:[{content:"this is a comment...."}]
        },
        owner:{
          connect:{
            id:ownerUserID
          }
        }
      }
    }, info) 
  }, 

  // updateCommentsByKeyWords(keywordsinContent:String!, newContent:String!):BatchPayload 
  async updateCommentsByKeyWords(parent, { keywordsinContent, newContent }, ctx, info) {  
    return await ctx.db.mutation.updateManyComments({
      data:{
        content:newContent,
      },
      where:{  
        content_contains:keywordsinContent
      }
    }, info)
  },
  // transCommentBetweenBlogs(fromBlogID:ID!,toBlogID:ID!):BatchPayload
  async transCommentBetweenBlogs(parent, { fromBlogID, toBlogID }, ctx, info) {  
    return await ctx.db.mutation.updateManyComments({
      data:{
        blog:{
          connect:{
              id: toBlogID
          } 
        },
      },
      where:{  
        blog:{
          id:fromBlogID
        }
      }
    }, info)
  },


  // deleteManyCommentsByKeywords(keywords:String!):BatchPayload
  async deleteManyCommentsByKeywords(parent, { keywords }, ctx, info) {  
    return await ctx.db.mutation.deleteManyComments({ 
      where:{  
        content_contains:keywords
      }
    }, info)
  },


  // deleteUserByEmail(email:String!):User
  async deleteUserByEmail(parent, { email }, ctx, info) {  
    return await ctx.db.mutation.deleteUser({ 
      where:{  
        email
      }
    }, info)
  }
}

module.exports = { blog } 