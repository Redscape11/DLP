const constTokens= require("./constants");

exports.checkChars= (t)=>{
    for (const charName in constTokens.specialChars) {
        if(t=='*'+charName+'*'){
            return charName;
        }
    }
    return false;
}

exports.replaceSpecialsChars= (code)=>{
    for (const charName in constTokens.specialChars) {
        const element = constTokens.specialChars[charName];
        code= code.replace(element.regRule, ' *'+charName+'* ');
    }
    return code;
}