'use strict'

const FormValidationException = use('App/Exceptions/FormValidationException')


class QuestionValidator {
	constructor() {}

	checkQuestionFormat(question) {
		if (question.label === undefined) {
			throw new FormValidationException("Question label is undefined");
		}
		if (question.name === undefined) {
			throw new FormValidationException("Question name is undefined");
		}
		if (question.type === undefined) {
			throw new FormValidationException("Question type is undefined");
		}
	}

	checkQuestionType(question)
	{
		switch (question.type) {
			case 'text' :
			case 'number' :
				break;
			case 'scale' :
				this.hasDataField(question);
				this.validateScale(question);
				break;
			case 'dropdown' :
			case 'radio' :
			case 'option' :
				this.hasDataField(question);
				this.validateMultipleChoice(question);
				break;
			default :
				throw new FormValidationException("Unknown form type") 
		}
	}

	hasDataField(question) {
		if (question.data === undefined || Array.isArray(question.data) === false) {
			throw new FormValidationException("Data is invalid");
		}
	}

	validateScale(question) {
		var data = question.data
		if (data[0].min === undefined || data[0].max === undefined) {
			throw new FormValidationException("Undefined min and max value in question " + question.label);
		}
		if (data[0].min >= data[0].max) {
			throw new FormValidationException("Max value must be greater than Min value in question " + question.label);
		}
	}

	validateMultipleChoice(question) {
		var data = question.data
		data.forEach(element => {
			if (element.label === undefined || element.value === undefined) {
				throw new FormValidationException("Undefined label or value in question " + question.label);
			}
		});
	}
}

class FormValidator {
	static validate(form)
	{
		form.forEach(element => {
			var validator = new QuestionValidator()
			validator.checkQuestionFormat(element)
			validator.checkQuestionType(element)
		});
	}
}

module.exports = FormValidator
