/**
 * GraphqlType的自定义解析器，在Prisma Graphql Schema后面执行，可用来做自定义属性扩增、校验、修饰等
 */
import User from './User'

export default {
    User,
}