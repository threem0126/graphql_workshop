import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'

class UpperDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function(...args) {
      console.log("UpperDirective ....... ");
      const result = await resolve.apply(this, args)
      if (typeof result === 'string') {
        return result.toUpperCase()
      }
      return result
    }
  }
}  

export default { 
  upper: UpperDirective
}