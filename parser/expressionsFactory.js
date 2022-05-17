const constTokens = require("../tokenizer/constants");
const constParser = require("./constants");
const helper = require("./helper");
const bob = require("./parser");

const variables = [];

exports.create = (type, tokens, start) => {
    switch (type) {
        case constParser.expressionMethodCall:
            return objectMethodCall(tokens, start);
        case constParser.expressionDeclaration:
            return variableDeclaration(tokens, start);
        case constParser.expressionAffectation:
            return variableAffectation(tokens, start);
        case constParser.expressionConditionalStatement:
            return expressionConditionalStatement(tokens, start);
    }
}

function expressionConditionalStatement(tokens, start) {
    // check des parentheses -> head sinon error
    if (tokens[start + 1].type !== constTokens.symboleOpenParenthese)
        throw constParser.errorMissingOpenParenthesis;
    const token = tokens[start + 2];
    if (token.type !== constTokens.typeWord)
        throw constParser.errorMissingWord;

    if (getVariableByName(token.value).variableType !== constTokens.typeBoolean)
        throw constParser.errorBadType;

    if (getVariableByName(token.value) === null)
        throw constParser.errorVariableNotExists;

    if (tokens[start + 3].type !== constTokens.symboleCloseParenthese)
        throw constParser.errorMissingCloseParenthesis;

    // { type: "conditionalStatement", header: {...}, body: {...} }
    // cree le header
    const variable = getVariableByName(token.value);
    const header = { ...variable, variableType: variable.variableType };

    // check des accolades -> body sinon error
    // un body peut avoir plusieurs instructions à l'intérieur
    if (tokens[start + 4].type !== constTokens.symboleOpenBracket)
        throw constParser.errorBadType;

    const tokensBodyIf = [];
    for (let i = start + 5; i < tokens.length; ++i) {
        if (tokens[i].type !== constTokens.symboleCloseBracket) {
            tokensBodyIf.push(tokens[i]);
        }
    }
    const body = bob(tokensBodyIf);

    return { type: constParser.expressionConditionalStatement, header: header, body: body, end: start + 5 };
}

function objectMethodCall(tokens, start) {
    let objectName = tokens[start].value;
    if (tokens[start + 2].type != constTokens.typeWord) throw constParser.errorMissingWord;
    let methodName = tokens[start + 2].value;
    let arguments = helper.searchArgs(tokens, start + 3);
    return { type: constParser.expressionMethodCall, objectName: objectName, methodName: methodName, arguments: arguments.args, end: arguments.end };
}

function variableDeclaration(tokens, start) {
    if (tokens[start + 1].type != constTokens.typeWord) throw constParser.errorMissingWord;
    let variableName = tokens[start + 1].value;
    return { type: constParser.expressionDeclaration, variableName: variableName };
}

function variableAffectation(tokens, start) {
    if (tokens[start - 1].type != constTokens.typeWord) throw constParser.errorMissingWord;
    let variableName = tokens[start - 1].value;
    let variableValue = null;
    let variableType;
    if (tokens[start + 1].type == constTokens.typeNumber) {
        variableValue = tokens[start + 1];
        variableType = constTokens.typeNumber;
    } else if (tokens[start + 1].type == constTokens.symboleQuotationMark) {
        variableValue = helper.searchString(tokens, start + 1);
    } else if (tokens[start + 1].type == constTokens.symboleQuotationMark) {
        variableValue = tokens[start + 1];
    } else if (tokens[start + 1].type == constTokens.typeBoolean) {
        variableValue = tokens[start + 1];
        variableType = constTokens.typeBoolean;
    }
    console.log("value " + variableValue);
    variables.push({ variableName: variableName, variableValue: variableValue.value, variableType: variableType });
    return { type: constParser.expressionAffectation, variableName: variableName, variableValue: variableValue };
}

function getVariableByName(name) {
    for (let i = 0; i < variables.length; ++i) {
        if (variables[i].variableName === name)
            return variables[i];
    }
    return null;
}