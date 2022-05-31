
const helper = require("./helper");
const constTokens = require("./constants");

module.exports = function (code) {
    code = helper.replaceSpecialsChars(code);
    var _tokens = code.split(/[\t\f\v ]+/);
    var tokens = []
    for (var i = 0; i < _tokens.length; i++) {
        var t = _tokens[i]

        //si le token n'est pas un nombre
        if (t.length <= 0 || isNaN(t)) {
            //on check si c'est un caractère spéciale
            let typeChars = helper.checkChars(t);
            if (typeChars) {
                tokens.push({ type: typeChars })
                //sinon c'est un mot
            } else if (constTokens.conditionalStatements.indexOf(t) != -1) {
                tokens.push({ type: constTokens.typeConditionalStatement, value: t })
            } else if (constTokens.booleanValues.indexOf(t) !== -1) {
                tokens.push({ type: constTokens.typeBoolean, value: t });
            } else if (constTokens.iteratorStatements.indexOf(t) != -1) {
                
                    tokens.push({ type: constTokens.typeIteratorStatement, value: t })
            } else if (i!=0 && _tokens[i-1].substring(1, _tokens[i-1].length-1)==constTokens.symboleEqual){
                let value="";
                    while( i-1<_tokens.length && _tokens[i].substring(1, _tokens[i].length-1) != "endInstruct" && _tokens[i].substring(1, _tokens[i].length-1)!=constTokens.symboleCloseParenthese ){
                        console.log( _tokens[i].substring(1, _tokens[i].length-1),"",constTokens.symboleCloseParenthese)
                        value += _tokens[i];
                        i++;
                    }
                i--;
                tokens.push({ type: constTokens.typeExpression, value: value });
                }
            else {
                tokens.push({ type: constTokens.typeWord, value: t })
            }
            //sinon c'est un nombre
        } else {
            tokens.push({ type: constTokens.typeNumber, value: parseInt(t) })
        }
    }
    if (tokens.length < 1) {
        throw constTokens.errorNoTokenFound;
    }
    return tokens
}