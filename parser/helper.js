const constTokens= require("../tokenizer/constants");
const constParser= require("./constants");

const searchString= (tokens, start)=>{
    var string=[];
    let findend= false;
    let end= 0;
    for(let i= start+1; i< tokens.length;i++){
        if(tokens[i].type==constTokens.symboleQuotationMark){
            findend= true;
            end= i;
            break;
        }else{
            string.push(tokens[i].value);
        }
    }
    if(!findend) throw constParser.errorMissingQuotationMark;
    return {type:constParser.typeString, value: string.join(' '), start: start, end: end};
}
exports.searchString = searchString;

exports.searchArgs= (tokens, start)=>{
    if(tokens[start].type!=constTokens.symboleOpenParenthese) throw constParser.errorMissingOpenParenthesis;
    let findEnd= false;
    let end= null;
    let args= [];
    for(let i= start+1; i< tokens.length; i++){
        if(tokens[i].type==constTokens.symboleCloseParenthese){
            findEnd= true;
            end=i;
            break;
        }else if(tokens[i].type==constTokens.typeWord){
            args.push({type:constParser.typeVariable, variableName:tokens[i].value});
        }else if(tokens[i].type==constTokens.typeNumber){
            args.push(tokens[i]);
        }else if(tokens[i].type==constTokens.symboleQuotationMark){
            let temp= searchString(tokens, i);
            args.push(temp);
            i=temp.end;
        }
    }
    if(!findEnd) throw constParser.errorMissingCloseParenthesis;
    return {args: args, end: end};
}