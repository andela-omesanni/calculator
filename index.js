var calculator = function() {
  var operators = ['+', '-', 'x', '÷', '^'];
  var digitKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  var keyCodeOperatorMap = {
    'shift43': '+', 'shift42': 'x', 'shift94': '^',
    '45': '-', '47': '÷', '61': '='
  };

  /**
   * Listen using the keypress event for any time a mathematical operator or 
   * the number key is pressed on the keyboard. 
   * @param  {object} e this is the keypress event object
   */
  document.onkeypress = function(e) {
    e = e || window.event;

    var keyCode = e.keyCode.toString();
    var operator = keyCodeOperatorMap[keyCode];
    
    // Handles operators that need the shift key to be pressed first before them e.g +, * and ^
    if(e.shiftKey) {
      operator = keyCodeOperatorMap['shift' + keyCode];
      if(operator) {
        operatorButtonClicked(operator);
      }
    }
    // Handles operators that don't need the shift key e.g. - and /
    else if(operator) {
      operatorButtonClicked(operator);
    }
    else if(digitKeyCodes.indexOf(e.keyCode) > -1) {
      /** 
       * Gets the actual number pressed on keyboard. For example, if we press 5 on the
       * keyboard, e.code will be Digit5. So we need to split the string to get 5 and then
       * display it in the expression input field
       */
      var actualNumber = e.code.split('Digit')[1];

      updateExpressionInputField(actualNumber);
    }
  };

  var expressionInput = document.getElementById('expression-input-field'); 

  /**
   * Updates the expression input field anytime a new number or operator is clicked
   * @param {string} character button number or operator that was clicked on the calculator
   */
  var updateExpressionInputField = function(character) { 
    if(expressionInput.value == 0) {
      expressionInput.value = character;

      return ;
    }

    expressionInput.value += character;
  };

  // Clears the digit input field
  var clearScreen = function() { 
    expressionInput.value = '';
  }

  // Clears the last character in expression input field
  var clearLastCharacter = function() {
    expressionInput.value = expressionInput.value.replace(/.$/, '');
  };

  /**
   * Sanitizes the expression by replacing placeholder operators with the javascript one
   * @param  {string} expression mathematical expression to be evaluated
   * @return {string} sanitized expression with the appropriate javscript operators
   */
  var sanitizeExpression = function(expression) {
    var lastChar = expression[expression.length - 1];

    // Replace all instances of x and ÷ with * and / respectively
    expression = expression.replace(/x/g, '*').replace(/÷/g, '/');
    
    // If an operator is the last character, remove it
    if(operators.indexOf(lastChar) > -1) {
      expression = expression.replace(/.$/, '');
    }

    /** 
     * Regex checks for any string that has the operator(^) in the middle 
     * with numbers to the right and left of it. e.g. -2^2, 3^5, 3.5^4
     */
    var regex = /([+-]?\d+(?:\.\d+)?)\^([+-]?\d+(?:\.\d+)?)/

    while(expression.indexOf('^') !== -1) {
      expression = expression.replace(regex, function(match, first, second) {
        return Math.pow(first, second);
      });
    }

    return expression;
  };

  /**
   * Evaluates the expression in the input field when the equals button is clicked
   * @param  {string} expressionInputVal the current value in the expression input field
   */
  var evaluateExpression = function(expression) {
    expression = sanitizeExpression(expression);

    if(expression) {
      try {
        expressionInput.value = eval(expression); 
      } catch(e) {
        if(e instanceof SyntaxError) {
          expressionInput.value = 'error';
        }
      }
    }
  }

  /**
   * Click event function for when an operator button gets clicked on
   * @param  {string} operator the operator that was clicked e.g. +
   */
  var operatorButtonClicked = function(operator) {
    var expressionInputVal = expressionInput.value;

    if(operator == '=') {
      evaluateExpression(expressionInputVal);
    }
    // Another operator was clicked
    else if(operators.indexOf(operator) > -1) {
      var lastChar = expressionInputVal[expressionInputVal.length - 1];
      
      // Add operator if the expression input field is not empty and an operator is not the last character
      if(expressionInputVal != '' && operators.indexOf(lastChar) == -1) {
        updateExpressionInputField(operator);
      }
      // Allow minus if the string is empty
      else if(expressionInputVal == '' && operator == '-') {
        updateExpressionInputField(operator);
      }
      // Replace the last character with the newly clicked operator if the last character is an operator
      if(operators.indexOf(lastChar) > -1 && expressionInputVal.length > 1) {
        expressionInput.value = expressionInputVal.replace(/.$/, operator);
      }
    }
  };

  return {
    operatorButtonClicked: operatorButtonClicked,
    evaluateExpression: evaluateExpression,
    clearScreen: clearScreen,
    clearLastCharacter: clearLastCharacter,
    updateExpressionInputField: updateExpressionInputField
  };
}();