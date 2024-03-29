/**
 * Class for the Form Validation, based on jQuery Validator
 * @param {Object} el - Form element
 */

 export default class FormValidationRules {

    static instance = 0;

    constructor(el, elId = $(el).attr('id'), staticValidationRules) {
        this.elId = elId;
        this.el = el;
        this.staticValidationRules = staticValidationRules;
       
        this.groups = {};
        this.rules = {};
        this._multiRules = {};

        this.constructor.instance++;
      
    }

    /**
     * Method for combining checkboxes into a group
     * @param {Array} data - Array of Objects in format:  [{namesOfgroup: '', errorMessage: '', condition}, ... ]
     * @param {string} namesOfgroup - HTML names of checkboxes in format: 'chbx chbx2 chbx3'
     * @param {string} errorMessage
     * @param {Function} condition - in case if needed to rewrite a normal condition.If not - don't use this method. Should return true or false. 
     * @param {number} numMin - minimum number of checkboxes to be checked (default = 1)
     * @param {number} numMax - maximum number of checkboxes to be checked (default = all checkboxes)
     */

    checkboxesGroups(data) {  
       
        $(data).each((i, item) => {
            let index = 'js_checkboxGroup_'+ this.constructor.instance + '-' + i;         

                    

                let arrGroup = item.namesOfgroup.split(' ');
                let newArrGroup = [];
                for (let item of arrGroup) {
                 
                    if ((this.staticValidationRules[item] !== 'false') && (this.staticValidationRules[item] !== false)) {
                      
                        newArrGroup.push(item);
                    }
                }

                item.namesOfgroup = newArrGroup.join(' ');
                if (item.namesOfgroup != '') {
                    this._addClass(index, item);    
                    this._createChbxGroup(index, item);

                              
                $.validator.addMethod(index, function (value) {                 
                    
                    if (!item.condition) {item.condition = ()=>{return false}}
                    if (!item.numMin) {item.numMin = 1} 
                  	if (!item.numMax) {item.numMax = $(`.${index}`).size()} 

         
                  
                  	if (item.condition()) {                        
                          return true;                                     
                    } else if ($(`.${index}`).closest('li').hasClass('MMM--isVisuallyHidden') 
                    || $(`.${index}`).closest('ul').hasClass('MMM--isVisuallyHidden') 
                    || $(`.${index}`).closest('fieldset').hasClass('MMM--isVisuallyHidden')) {
                        return true;
                    }                  
                    else if ($(`.${index}`).is(':checked')) {
                        return (($(`.${index}:checked`).size() >= (item.numMin)) && ($(`.${index}:checked`).size() <= item.numMax));
                    } else {
                        return false;
                    }
                }, $(this.el).find($(`.${index}`)).attr('data-msg-required') ? $(this.el).find($(`.${index}`)).attr('data-msg-required') : item.errorMessage);

                }      

              
        })       

    }

    _addClass(index, item) {

        let names = item.namesOfgroup.split(' ');
        let arr = [];

        $(names).each((i, name)=> {
            arr.push('[name="' + name + '"]');
        })

        let str = arr.toString();

        
        $(this.el).find(str).addClass('js_checkboxGroup');
        $(this.el).find(str).addClass(index);
        $(this.el).find(str).attr('data-checkboxGroup', index);

    }

    _createChbxGroup(index, item) {
        this.groups[index] = item.namesOfgroup;

    }

    
    _getChbxGroups() {
        return this.groups;
    }

    _getRules() {
        return this.rules;
    }

    /**
     * Toggling mandatory/optional
     * @param {Array} arr - array of HTML names
     * @param {boolean} trueOrFalse
     */

    addRule(arr, trueOrFalse) {

        $(arr).each((i, item) => {
            $(`[name="${item}"]`).add('rules', { required: trueOrFalse })               
        })

    }


    /** 
     *  @param {Array} fields
     *  @param {Function} condition
     *
     */

    
    addDependencyRule(fields, condition) {


        $(fields).each((i, item) => {            
            if (($(this.el).find(`[name="${item}"]`))) {

                if (this.rules[item]) {
                    this._addDependencyRule (item, condition);                   
                    this.rules[item] = {
                        required: {
                            depends: (element) => {
                                if (!$(element).closest('li').hasClass('MMM--isVisuallyHidden') 
                                && !$(element).closest('ul').hasClass('MMM--isVisuallyHidden') 
                                && !$(element).closest('fieldset').hasClass('MMM--isVisuallyHidden')) {                                    
                                    return this._isRequired(item);
                                } else return false;
                                
                            }
                        }
                    }

                    
                } else {
                    this._multiRules[item] = condition;                       
                    this.rules[item] = {
                        required: {
                            depends: function depends(element) {
                                if (!$(element).closest('li').hasClass('MMM--isVisuallyHidden') 
                                && !$(element).closest('ul').hasClass('MMM--isVisuallyHidden') 
                                && !$(element).closest('fieldset').hasClass('MMM--isVisuallyHidden')) {
                                    return condition();
                                } else return false;
                                
                            }
                        }
                    }
                }

               
        }

        })

    }
    

    _addDependencyRule (item, condition){
        let currentCond = this._multiRules[item];
        let condArr = [];
        if (Array.isArray(currentCond)) {
            currentCond.push(condition);
            condArr = currentCond;
        }
            else {                
                condArr.push(currentCond);
                condArr.push(condition);                
            }

            this._multiRules[item] = condArr;
    
      
        
    }



        _isRequired(item) {
            
            let trueOrFalse = false;            

        $(this._multiRules[item]).each((i, func) => {                    
          

            if(typeof(func) === 'function') {                

                if(func()) {
                    trueOrFalse = true;
                }
                
                    
            }
        })
        
        return trueOrFalse;
       

       
    }




    /**
     * Should go at the very end, after the others method, being called in this class
     */
    render() {
     
        $(`form#${this.elId}`).validate({
            groups: this._getChbxGroups(),
            rules: this._getRules(),
          
           
            errorPlacement: function errorPlacement(error, element) {

                if ((element.attr('type') === 'checkbox') && (element.hasClass('js_checkboxGroup'))) {
                    let attribute = $(element).attr('data-checkboxgroup');                    
                    let elements = document.querySelectorAll(`[data-checkboxgroup=${attribute}]`);
                 let lastEl =  elements[elements.length - 1];
                  
                  let parentOfLastEl = lastEl.closest('li');		
                  
                  
                    if (parentOfLastEl.nextElementSibling === null || parentOfLastEl.nextElementSibling === undefined) {
                     
                        $(parentOfLastEl).parent().after(error);
                      } else {
                        $(lastEl).parent().after(error);
                      }

                } else {
                    element.closest('li').after(error);
                }

            },
            submitHandler: elqFormHandler,
        });


    }

}

// Show in Global just for the case of separate usage. 
//window.FormValidationRules = FormValidationRules;