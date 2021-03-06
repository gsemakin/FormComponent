import template from "./index.pug";

import afterform from "./afterform.pug";

 export default class FormAssetsCreator {
    static idGen = parseInt(Math.random() * 1000);
    static busPhoneExist = false;
    static busPhoneNum = 1;

    
    

    constructor(data) {

        this.hiddenFields = data.hiddenFields; 
        this.langTmpl = data.langTemplate;
        this.fieldsTmpl = data.fieldsTemplate;               
        this.el = data.el;
        this.div = data.division;
        this.name = data.name;
        this.idGen = ++this.constructor.idGen;    
        this.settings = data.settings;
        this.selectedItems = data.selectedItems;
        this.customFormClasses = data.customFormClasses;
        
    }

    updateSettings(key,val) {
        const obj = {...this.defaultOptions, ...this.formOptions};
        this.options = obj;
    }

    _addClasses(arr) {
        for (let cl of arr) {
            this.el.classList.add(cl);
        }           
    }  

    _addSettingsToFormTag() {

        if(this.settings.exclusiveCountry) {
            this._addClasses(['eloquaExclusiveCountry']);
        }

        this._addClasses(this.settings.classes);
        this.el.method="POST";
        this.el.id=this.name;
        this.el.setAttribute("novalidate", "novalidate");       
      
        this.el.setAttribute("data-options", `{"submitHandler":"elqFormHandler", "vendor":"${this.settings.vendor}"}`);    
        
    }

   _busPhoneSettings(country) {

        if (this.settings._busPhone && !this.constructor.busPhoneExist) {
           
            this.constructor.busPhoneExist = true;
  
            window.busPhoneid = '#busPhoneID'; // Enter this for the first form on the page
            window.countryselectid = '#countryID'; // Enter this for the first form on the page   
 
        } else if (this.settings._busPhone && this.constructor.busPhoneExist) {
            ++this.constructor.busPhoneNum;
        }
}

    
    render () {        
        this._addSettingsToFormTag();           
        this._createFormTemplate (this.hiddenFields, this.fieldsTmpl.fieldsets, this.langTmpl, this.div, this.fieldsTmpl.addedClasses, this.fieldsTmpl.staticValidationRules, this.idGen, this.selectedItems, this.constructor.busPhoneNum);
        
    }

    _createFormTemplate (hiddenFields, fieldsets, langTmpl, div, addedClasses, staticValidationRules, idGen, selectedItems, busPhoneNum) {      
        
        //this.el.insertAdjacentHTML('beforebegin', preform());
        this.el.insertAdjacentHTML('afterend', afterform({langTmpl}));  
        this._addClasses(this.customFormClasses);

        this.el.innerHTML = template({hiddenFields, fieldsets, langTmpl, div, addedClasses, staticValidationRules, idGen, selectedItems, busPhoneNum}); 
        
        
      
    }  

}
