/**
 * Class for displaying fields
 * @param {Object} el - Form Element
 */

 class DisplayFormFields {    

  constructor (el) {
      this.el = el;
     
  }      

  /**
   * Sets dependencies between field №1 and hidden field №2 to be shown
   * @param {string} f1_name - HTML name of the field 1
   * @param {string} f2_name - HTML name of the dependable field
   * @param {string} value - if tag name of field1 is 'SELECT', val - is a value which should trigger field2 (= "Other" by default)
   * 
   */
  
  showOther(f1_name, f2_name, val = "Other") {        
      let source = $(this.el).find("[name=\"".concat(f1_name, "\"]"));
      let depend = $(this.el).find("[name=\"".concat(f2_name, "\"]"));
   
      let dependId = $(depend).attr('id') ? $(depend).attr('id') : f2_name;        
  
      if ($(source).attr('type') === 'checkbox') {
         
        $(source).on('change', function () {
          $(depend).closest('li').toggleClass('MMM--isVisuallyHidden');
          $("#".concat(dependId, "-error")).hide();            
        });
      }
  
      if ($(source).prop("tagName") === 'SELECT') {
        
        $(source).on('change', function () {
          $("#".concat(dependId, "-error")).hide();
  
          if ($(source).val() === val) {
            $(depend).closest('li').removeClass('MMM--isVisuallyHidden');
          } else {
            $(depend).closest('li').addClass('MMM--isVisuallyHidden');
          }
        });
      }
    }
    
    dependIdFromName (f1_name, f2_id, val) {
      let source = $(this.el).find("[name=\"".concat(f1_name, "\"]"));
      let depend = $(this.el).find("[id=\"".concat(f2_id, "\"]"));

      if ($(source).attr('type') === 'checkbox') {
         
          $(source).on('change', () => {
            
            $(depend).toggleClass('MMM--isVisuallyHidden');
            
          });
        }
    
        if ($(source).prop("tagName") === 'SELECT') {
          
            $(source).on('change', () => {
             
          let valIsDeclared =  val ? true : false;
          let selectIsBlank = !$(source).val() ? true : false;
          let valIsSelected = ($(source).val() === val) ? true : false;
             
          let ifTrue = valIsSelected || (!valIsDeclared && !selectIsBlank) ? true : false;           
          
          if (ifTrue) {
            $(depend).removeClass('MMM--isVisuallyHidden')              
          }

          if (!ifTrue) {
            $(depend).addClass('MMM--isVisuallyHidden');             
          }       
             
              });

        }
    }
  
    /**
     * To add 'optional' in label for the first name/last name/salutation fields for Contact Acquisition Form and removing 'optional' from label in a lead gen one
     * @param {Object} data
     * @param {Array} data.labelOptionalNames
     * @param {String} data.optionalText
     * @param {String} data.triggerName
     * @param {String} data.val
     */

      
    addOptionalToLabel (data) { 

      let element = $(this.el).find(`[name="${data.triggerName}"]`);
        
      $(this.el).find(`[name="${data.triggerName}"]`).on('change', () => {       
      $(data.labelOptionalNames).each((i,name) => {
          var targetEl = $(this.el).find("[name='".concat(name, "']"));    
          var _id = $(targetEl).attr('id');
          var labelText = $('label[for="' + _id + '"].MMM--blockLabel').text();
          if (($(element).attr('type') === 'checkbox') && ($(element).is(':checked'))) {this._removeOptionalText(_id, name, labelText, data.optionalText)}
          else if (($(element).prop("tagName") === 'SELECT') && ((!data.val) || ($(element).val() === data.val))) {            
            this._removeOptionalText(_id, name, labelText, data.optionalText)}
        else {this._addOptionalText(_id, name, labelText, data.optionalText)};
          
          })
  
    })
  }

  _removeOptionalText (_id, name, labelText,optionalText) {
      $('label[for="' + _id + '"].MMM--blockLabel').text(labelText.replace(optionalText, ""));
  }

  _addOptionalText (_id, name, labelText,optionalText) {
      $('label[for="' + $("[name='".concat(name, "']")).attr('id') + '"].MMM--blockLabel').text(labelText + optionalText); 
      $("#".concat(_id, "-error")).hide();
      $("[name='".concat(name, "']")).removeClass('error');
  }


  complexDependency (className, attributeName, fNameToShow) {
      $(`.${className}`).on("change", () => {
          let apps = $(this.el).find(`.${className}:checked`);
          let optNum = 0;
          let lastChosenOpt = '';

          if (apps.length) {
              $(this.el).find(`[name="mmmIndustry1"] option[data-${attributeName}]`).each(function (i, opt) {
              let attr = $(opt).data(attributeName);
              let optToShow = false;
              $(opt).hide();

              if (typeof attr !== 'undefined' && attr !== false) {
              let attrArr = attr.split(' ');
              $(apps).each(function (i, app) {
                  let appName = $(app).attr('name');
                  $(attrArr).each(function (i, item) {
                  if (appName === item) {
                      optToShow = true;
                      lastChosenOpt = $(opt).val();
                  }
                  });
              });
              }

              if (optToShow) {
              $(opt).show();
              optNum++;
              }
          });

          if (optNum === 1) {
              $(this.el).find(`[name="${fNameToShow}"]`).val(lastChosenOpt);
              $(this.el).find(`[name="${fNameToShow}"]`).closest('li').addClass('MMM--isVisuallyHidden');
          } else {
              $(this.el).find(`[name="${fNameToShow}"]`).closest('li').removeClass('MMM--isVisuallyHidden');
          }
          } else {
              $(this.el).find(`[name="${fNameToShow}"]`).closest('li').addClass('MMM--isVisuallyHidden');
              $(this.el).find(`[name="${fNameToShow}"]`).val('');
          }
      
  }); 

}

complexDepFromSelect (fName1, fName2, scheme) {

 let fName2Opts = $(this.el).find(`[name="${fName2}"] option`);   



 $(this.el).find(`[name="${fName1}"]`).on('change', () => {

  
  let lastChosenOpt = '';
  let optNum = 0;
  let arrOfOpts = [];
  let fName1Val = $(this.el).find(`[name="${fName1}"]`).val();



 scheme.forEach((value, key) => {

     $(value).each((i, item) => {

          if (item === fName1Val) {arrOfOpts.push(key)}
     });
});




 $(fName2Opts).each((i2,opt) => {
  

     if ($(opt).val() != null) {
      $(opt).hide();
      $(arrOfOpts).each((i,item) => {
          if (item === $(opt).val()) {                
              lastChosenOpt = $(opt).val();
              optNum++;
              $(opt).show();
              return;                
          }
     
     })
      

 }
 })



 if (optNum === 1) {
              $(this.el).find(`[name="${fName2}"]`).val(lastChosenOpt);
              $(this.el).find(`[name="${fName2}"]`).closest('li').addClass('MMM--isVisuallyHidden');
          } else {
              $(this.el).find(`[name="${fName2}"]`).closest('li').removeClass('MMM--isVisuallyHidden');
          }
          




})
}

updateHidden (f1Name, f2Name, scheme) {

  let field1 = $(this.el).find(`[name="${f1Name}"]`);
  let field2 = $(this.el).find(`[name="${f2Name}"]`);


  $(field1).on('change', () => {
     let chosenVal =  $(field1).val();
     let value = scheme.get(chosenVal);

      if(value) {
          $(field2).val(value);
      }    
      else {
          $(field2).val('');
      }  
      
  })

}

}