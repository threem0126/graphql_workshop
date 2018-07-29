
const User = {
    name(parent, {name, email, password}, ctx, info) {
        return "my name is " + parent.name;
    },
    name2(parent, {name, email, password}, ctx, info) {
        return "i am another. " + parent.name;
    }
}
export default User