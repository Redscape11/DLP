
const helper = require("./helper");
const constTokens = require("./constants");

module.exports = function (code) {
    code = helper.replaceSpecialsChars(code);
    var _tokens = code.split(/[\t\f\v ]+/);
    var tokens = []
    for (var i = 0; i < _tokens.length; i++) {
        var t = _tokens[i]
        if (i < 3) console.log(t);
    
        //si le token n'est pas un nombre

        console.log(constTokens.symboleEqual)
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
            } else if(i!=0 &&_tokens[i-1].substring(1,_tokens.length[i-1]-1)==constTokens.symboleEqual){
                tokens.push({ type: constTokens.typeExpression, value: t })
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