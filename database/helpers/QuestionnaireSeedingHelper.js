'use strict'
/**
@Author: Nur

A wrapper class for seeders to fetch questionnaire data

currently supports : text, number, scale, option, dropdown
*/

class QuestionnaireSeedingHelper {
  static get textFieldName () {
    return 'text-15529591'
  }

  static get numberFieldName () {
    return 'number-4914110595'
  }

  static get dropdownFieldName () {
    return 'dropdown-1414155'
  }

  static get optionFieldName () {
    return 'option-45119'
  }

  static get scaleFieldName () {
    return 'scale-15195911'
  }

  static get formObject () {
    return [
      this.textField,
      this.numberField,
      this.dropdownField,
      this.optionField,
      this.scaleField
    ]
  }

  static get formAnswer () {
    return [
      this.textAnswer,
      this.numberAnswer,
      this.dropdownAnswer,
      this.optionAnswer,
      this.scaleAnswer
    ]
  }

  /** TEXT */
  static get textField () {
    return {
	        type: 'text',
	        label: 'Text Area',
	        name: this.textFieldName
    }
  }

  static get textAnswer () {
    return {
	        id_name: this.textFieldName,
	        answer: 'Something something'
    	}
  }

  /** NUMBER */
  static get numberField () {
    return {
	    	type: 'number',
	        label: 'A Number',
	        name: this.numberFieldName
    }
  }

  static get numberAnswer () {
    return {
        	id_name: this.numberFieldName,
        	answer: Math.floor(Math.random() * 101)
    }
  }

  /** DROPDOWN */
  static get dropdownField () {
    return {
      type: 'dropdown',
      label: 'A dropdown',
      name: this.dropdownFieldName,
      data: [{
	            label: 'label1',
	            value: 'label1'
	            },
	            {
	            label: 'label2',
	            value: 'label2'
      }]
    }
  }

  static get dropdownAnswer () {
    return {
	        id_name: this.dropdownFieldName,
	        answer: 'label1'
    }
  }

  /** OPTIONS */
  static get optionField () {
    return {
	        type: 'option',
	        label: 'An option',
	        name: this.optionFieldName,
	        data: [{
        label: 'Ya',
        value: 'Ya'
	            },
	            {
        label: 'Tidak',
        value: 'Tidak'
	            },
	            {
        label: 'Pernah',
        value: 'Pernah'
	        }]
	    }
  }

  static get optionAnswer () {
    return {
	        id_name: this.optionFieldName,
	        answer: 'Pernah'
    }
  }

  /** SCALE */
  static get scaleField () {
	    return {
		    type: 'scale',
		    label: 'A scale',
		    name: this.scaleFieldName,
		    data: [{
		        min: '1',
		        max: '10'
      }]
	    }
  }

  static get scaleAnswer () {
    return {
        	id_name: this.scaleFieldName,
        	answer: Math.floor(Math.random() * 10) + 1
    }
  }
}

module.exports = QuestionnaireSeedingHelper
