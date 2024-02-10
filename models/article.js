const mongoose = require('mongoose')
const { marked } = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
//to get  only  the required dependencies, we use {}
const dompurify = createDomPurify(new JSDOM().window)
//JSDOM is used to connect the domPurify with Nodejs since Nodejs
//doesn't know about JavaScript

const articleScheme = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    markdown:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML:{
        type: String,
        required: true
    }
})

articleScheme.pre('validate',function(next){
    if(this.title){
        this.slug = slugify(this.title,{lower:true, strict:true})
    }

    if(this.markdown){
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Article',articleScheme)