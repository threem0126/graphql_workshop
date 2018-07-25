let rootType = {
  Mutation:{},
  Query:{}
}
export const isMutation = function (target, name, descriptor){  
  var oldValue = descriptor.value; 
  descriptor.value = function() { 
    return oldValue.apply(this, arguments);
  };
  if(rootType.Mutation[name])
    throw `${target.name}类中的${name}方法名称已被其他类方法抢注，导致命名冲突，请修改`
  rootType.Mutation[name] = descriptor.value
  return descriptor;
}

export const isQuery = function (target, name, descriptor){  
  var oldValue = descriptor.value; 
  descriptor.value = function() { 
    return oldValue.apply(this, arguments);
  };
  if(rootType.Mutation[name])
    throw `${target.name}类中的${name}方法名称已被其他类方法抢注，导致命名冲突，请修改`
  rootType.Query[name] = descriptor.value
  return descriptor;
}

export const isQuery_forwardTo = async function (target, name, descriptor){   
  if(rootType.Mutation[name])
    throw `${target.name}类中的${name}方法名称已被其他类方法抢注，导致命名冲突，请修改`
  rootType.Query[name] = target[name]()('db'); 
  return descriptor;
} 

export const RegistedResolvers = ()=>{
  return rootType
}