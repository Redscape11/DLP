const tokenizer = require("../tokenizer/tokenizer");
const parser = require("../parser/parser");
const helper = require("./helper");
const util = require('util')

exports.from = (code) => {
    console.log("--------", "Tokens", "--------");
    let tokens = tokenizer(code);
    console.log(tokens);

    try {
        console.log("--------", "AST", "--------");
        let ast = parser(tokens);
        console.log(util.inspect(ast, { showHidden: false, depth: null, colors: true }));
        let result = {
            allDeclaredIsUsed: helper.allDeclaredIsUsed(ast),
            allUsedIsDeclared: helper.allUsedIsDeclared(ast),
            allExpressionFinished: helper.allExpressionFinished(ast),
            numberLine: helper.numberLine(ast),
            indentation: helper.indentation(ast)
        };
        return {
            score: result.allDeclaredIsUsed +
                result.allUsedIsDeclared +
                result.allExpressionFinished +
                result.indentation +
                result.numberLine,
            details: result
        }
    } catch (e) {
        throw e;
    }
};