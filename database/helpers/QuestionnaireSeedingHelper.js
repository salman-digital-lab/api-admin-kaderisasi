'use strict'
/**
@Author: Nur

A wrapper class for seeders to fetch questionnaire data

currently supports : text, number, scale, radio, dropdown, checkbox
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

  static get radioFieldName () {
    return 'radio-45119'
  }

  static get scaleFieldName () {
    return 'scale-15195911'
  }

  static get checkboxFieldName () {
    return 'checkbox-123554'
  }

  static get formObject () {
    return [
      this.textField,
      this.numberField,
      this.dropdownField,
      this.radioField,
      this.scaleField,
      this.checkboxField
    ]
  }

  static get formAnswer () {
    return [
      this.textAnswer,
      this.numberAnswer,
      this.dropdownAnswer,
      this.radioAnswer,
      this.scaleAnswer,
      this.checkboxAnswer
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
      data: this.dropdownData
    }
  }

  static get dropdownData () {
    return [{
        label: 'label1',
        value: 'label1v'
      },
      {
        label: 'label2',
        value: 'label2v'
      },
      {
        label: 'label3',
        value: 'value3v'
    }]
  }

  static get dropdownAnswer () {
    var data = this.dropdownData
    return {
        id_name: this.dropdownFieldName,
        answer: data[Math.floor(Math.random() * data.length)].value
    }
  }

  /** RADIO */
  static get radioField () {
    return {
	        type: 'radio',
	        label: 'An radio',
	        name: this.radioFieldName,
	        data: this.radioData
    }
  }

  static get radioData () {
    return [{
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

  static get radioAnswer () {

    var data = this.radioData
    return {
	        id_name: this.radioFieldName,
	        answer: data[Math.floor(Math.random() * data.length)].value
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

  /** CHECKBOX */
  static get checkboxField () {
    return {
      type: 'checkbox',
      label: 'a checkbox',
      name: this.checkboxFieldName,
      data: this.checkboxData()
    }
  }

  static get checkboxData () {
    return [
    {
      label: "box1",
      value : "a"
    },{
      label: "box2",
      value : "b"
    },{
      label: "box3",
      value: "c"
    }]
  }

  static get checkboxAnswer () {
    return {
      id_name: this.checkboxFieldName,
      answer: ["a", "b", "c"]
    }
  }
}

  


module.exports = QuestionnaireSeedingHelper
