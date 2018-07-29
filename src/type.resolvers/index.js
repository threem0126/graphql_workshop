/**
 * GraphqlType的自定义解析器，在Prisma Graphql Schema后面执行
 * @type {{User: {name2: (function(*))}}}
 */
import User from './User'

export default {
    User,
}