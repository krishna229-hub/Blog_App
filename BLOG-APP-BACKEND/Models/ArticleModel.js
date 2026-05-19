import {Schema,model} from 'mongoose'

//create user comment schema
const userCommentSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    comment:{
        type:String
    }
})
//create article schema
const articleSchema=new Schema({
    author:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:[true,"Author Id is required"]
    },
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    content:{
        type:String,
        required:[true,"content is required"]
    },
    isArticleActive:{
        type:Boolean,
        default:true
    },
    comments:[userCommentSchema],
},{
    timestamps:true,
    strict:"throw",
    versionKey:false
})
export const ArticleModel=model('article',articleSchema)