exports.specialChars = {
    newLine: { regRule: /\r\n/g, value: '\n' },
    endInstruct: { regRule: /;/g, value: ';' },
    equal: { regRule: /=/g, value: '=' },
    point: { regRule: /\./g, value: '.' },
    virgule: { regRule: /\,/g, value: ',' },
    quotationMark: { regRule: /\"/g, value: '"' },
    openParenthese: { regRule: /\(/g, value: '"' },
    closeParenthese: { regRule: /\)/g, value: '"' },
    openBracket: { regRule: /\{/g, value: '"' },
    closeBracket: { regRule: /\}/g, value: '"' },
};

exports.symboleEqual = "equal";
exports.symbolePoint = "point";
exports.symboleVirgule = "virgule";
exports.symboleQuotationMark = "quotationMark";
exports.symboleOpenParenthese = "openParenthese";
exports.symboleCloseParenthese = "closeParenthese";
exports.symboleOpenBracket = "openBracket";
exports.symboleCloseBracket = "closeBracket";

exports.booleanValues = ["true", "false"];

exports.typeBoolean = "boolean";
exports.typeNumber = "number";
exports.typeWord = "word";
exports.typeStatement = "statement";

exports.statements = ["if", "else", "else if"];

exports.errorNoTokenFound = 'No Tokens Found.';

