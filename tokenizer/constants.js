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
    openChevron : { regRule: /\</g, value: '"' },
    closeChevron : { regRule: /\>/g, value: '"' },
};

exports.symboleEqual = "equal";
exports.symbolePoint = "point";
exports.symboleVirgule = "virgule";
exports.symboleQuotationMark = "quotationMark";
exports.symboleOpenParenthese = "openParenthese";
exports.symboleCloseParenthese = "closeParenthese";
exports.symboleOpenBracket = "openBracket";
exports.symboleCloseBracket = "closeBracket";
exports.symboleOpenChevron = "openChevron";
exports.symboleCloseChevron = "closeChevron";

exports.booleanValues = ["true", "false"];

exports.typeBoolean = "boolean";
exports.typeNumber = "number";
exports.typeWord = "word";
exports.typeConditionalStatement = "conditionalStatement";
exports.typeIteratorStatement = "iteratorStatement";
exports.typeExpression = "expression";

exports.conditionalStatements = ["if", "else", "else if"];

exports.iteratorStatements = ["while","for"]

exports.errorNoTokenFound = 'No Tokens Found.';

