const constTokens = require("../tokenizer/constants");
const constParser = require("./constants");
// const factory = require("./expressionsFactory");

module.exports = parser;

function parser(tokens) {
  let AST = [];
  let variables = []; // { type: boolean, name: "isTrue", value: true }
  for (let i = 0; i < tokens.length; i++) {
    let expression = null;
    //déclaration de variable

    if (tokens[i].type == constTokens.typeWord && constParser.declarationVariable.indexOf(tokens[i].value) != -1) {
      expression = create(constParser.expressionDeclaration, tokens, i);
      i++;
      //utilisation symbole égale
    } else if (tokens[i].type == constTokens.symboleEqual) {
      expression = create(constParser.expressionAffectation, tokens, i);
      i = expression.end;
      //utilisation de methode
    } else if (i < tokens.length - 1 && tokens[i].type == constTokens.typeWord && tokens[i + 1].type == constTokens.symbolePoint) {
      expression = create(constParser.expressionMethodCall, tokens, i);
      i = expression.end;
    } else if (tokens[i].type == constTokens.typeConditionalStatement) {
      expression = create(constParser.expressionConditionalStatement, tokens, i);
      i = expression.end;
    }
    else if (tokens[i].type == constTokens.typeIteratorStatement) {
      expression = create(constParser.expressionIteratorStatement, tokens, i);
      i = expression.end;
    }
    if (expression) {
      AST.push(expression);
    } else if (tokens[i].type != constTokens.typeWord) {
      AST.push(tokens[i]);
    }
  }
  return AST;
}


const variables = [];

create = (type, tokens, start) => {
  switch (type) {
    case constParser.expressionMethodCall:
      return objectMethodCall(tokens, start);
    case constParser.expressionDeclaration:
      return variableDeclaration(tokens, start);
    case constParser.expressionAffectation:
      return variableAffectation(tokens, start);
    case constParser.expressionConditionalStatement:
      return expressionConditionalStatement(tokens, start);
    case constParser.expressionIteratorStatement:
      return expressionIteratorStatement(tokens, start);
  }
}

function expressionIteratorStatement(tokens, start) {
  if (tokens[start].value == "while") {
    return expressionConditionalStatement(tokens, start);
  }
  // for (int i = 0; i < 10; i=i+1) {
  if (tokens[start + 1].type !== constTokens.symboleOpenParenthese)
    throw constParser.errorMissingOpenParenthesis;

  let forInit = [];
  let i = start + 2;
  while (tokens[i].type !== constTokens.symboleEndInstruct && i < tokens.length) {
    forInit.push(tokens[i]);
    i++;
  }
  if (i < tokens.length && tokens[i].type !== constTokens.symboleEndInstruct)
    throw constParser.errorMissingEndInstruct;
  forInit.push(tokens[i]);
  const init = parser(forInit);

  if (init[1].variableValue.type !== constTokens.typeNumber)
    throw constParser.errorBadType;

  i++;
  let forCondition = [];
  while (tokens[i].type !== constTokens.symboleEndInstruct && i < tokens.length) {
    forCondition.push(tokens[i]);
    i++;
  }
  if (i < tokens.length && tokens[i].type !== constTokens.symboleEndInstruct)
    throw constParser.errorMissingEndInstruct;
  forCondition.push(tokens[i]);
  i++;
  const condition = forCondition;

  let forStep = [];
  while (tokens[i].type !== constTokens.symboleCloseParenthese && i < tokens.length) {
    forStep.push(tokens[i]);
    i++;
  }
  const step = parser(forStep);
  /*
  forCondition.unshift({ type: 'word', value: '__b' });
  forCondition.unshift({ type: 'equal' });
  forCondition.unshift({ type: 'number', value: forCondition[forCondition.length-2].value });
  forCondition.unshift({ type: 'endInstruct' });
  forCondition.unshift({ type: 'word', value: '__b' });
  forCondition.unshift({ type: 'word', value: 'int' });
  forCondition.splice(forCondition.length-2, 1);
  */


  let iteratorBody = [];
  if (i < tokens.length && tokens[i].type !== constTokens.symboleCloseParenthese)
    throw constParser.errorMissingCloseParenthesis;

  i++;
  if (i < tokens.length && tokens[i].type !== constTokens.symboleOpenBracket)
    throw constParser.errorMissingOpenBracket;

  i++;
  while (tokens[i].type !== constTokens.symboleCloseBracket && i < tokens.length) {
    iteratorBody.push(tokens[i]);
    i++;
  }


  if (i < tokens.length && tokens[i].type !== constTokens.symboleCloseBracket)
    throw constParser.errorMissingCloseBracket;
  const body = parser(iteratorBody);

  return { type: constParser.expressionIteratorStatement, initialisation: init, condition: condition, step: step, body: body, end: i };

  //const head = { init, condition, increment };
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
  let i = start + 5;
  let countBracketOpen = 1;
  while (countBracketOpen != 0 && i < tokens.length) {
    if (tokens[i].type == constTokens.symboleOpenBracket) {
      countBracketOpen++;
    }
    if (tokens[i].type == constTokens.symboleCloseBracket) {
      countBracketOpen--;
    }
    tokensBodyIf.push(tokens[i]);
    i++;
  }
  tokensBodyIf.pop();
  const body = parser(tokensBodyIf);

  if (tokens[start].type == constTokens.typeIteratorStatement) {
    return { type: constParser.expressionIteratorStatement, header: header, body: body, end: i };
  }

  return { type: constParser.expressionConditionalStatement, header: header, body: body, end: i };
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
  let end = start + 1;
  if (tokens.length > 5 && (tokens[start + 2].type == constTokens.symboleOpenChevron || tokens[start + 2].type == constTokens.symboleCloseChevron)) {
    if (tokens[start + 1].type != tokens[start + 3].type && tokens[start + 1].type != constTokens.typeNumber) {
      throw constParser.errorBadType;
    }
    let comp;
    if (tokens[start + 2].type == constTokens.symboleOpenChevron) {
      comp = '' + (tokens[start + 1].value < tokens[start + 3].value);
    } else {
      comp = '' + (tokens[start + 1].value > tokens[start + 3].value);
    }
    tokens[start + 1].value = comp;
    variableValue = tokens[start + 1];
    end = start + 3;
    variableValue.type = constTokens.typeBoolean;
  }
  else if (tokens[start + 1].type == constTokens.typeNumber) {
    variableValue = tokens[start + 1];
    variableType = constTokens.typeNumber;
  } else if (tokens[start + 1].type == constTokens.symboleQuotationMark) {
    variableValue = helper.searchString(tokens, start + 1);
    end = variableValue.end;
  } else if (tokens[start + 1].type == constTokens.symboleQuotationMark) {
    variableValue = tokens[start + 1];
  } else if (tokens[start + 1].type == constTokens.typeBoolean) {
    variableValue = tokens[start + 1];
    variableType = constTokens.typeBoolean;
  } else if (tokens[start + 1].type == constTokens.typeExpression) {
    variableValue = tokens[start + 1];
    variableType = constTokens.typeExpression;
  }
  variables.push({ variableName: variableName, variableValue: variableValue.value, variableType: variableType });
  return { type: constParser.expressionAffectation, variableName: variableName, variableValue: variableValue, end: end };
}

function getVariableByName(name) {
  for (let i = 0; i < variables.length; ++i) {
    if (variables[i].variableName === name)
      return variables[i];
  }
  return null;
}