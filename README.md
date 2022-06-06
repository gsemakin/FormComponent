# FormComponent
This constructor (js class) is used for generating either MQL forms depending on a locale, business division and appropriate SMP (Sales and Marketing Partnership agreement) or Contact Acquisition ones.

## How to use 
Business Division (for identifying which SMP template to use), country (which country to be preselected in country field) and language (to select the right language template) are taken from the relevant meta tags on LP ("DCSext.CDC", "DCSext.locale"):
```html
    <meta name="DCSext.CDC" content="EMSD - Electronics Materials Solutions Division">
    <meta name="DCSext.locale" content="en_GB">
```

Form type is taken from the form name exactly:
TEST-EMSD-202202-en_EMEA-`CON`-testLeadGen_emsd

If for example to change -CON- to any non MQL form type, it will use a default non-MQL template. Form name is reflected in 2 places on LP:
```html
    <form name="TEST-EMSD-202202-en_EMEA-CON-testLeadGen_emsd"></form>
```
AND:
```javascript
    new window.FormComponent("TEST-EMSD-202202-en_EMEA-CON-testLeadGen_emsd");
```

### Generation of the form 
### *(initilization of the FormComponent, including all its methods must NOT be included into the domReady)*

1. Call the 'FormComponent' class and pass it to a variable. In case if you have several forms on LP, each of them should be passed to a unique variable, like below:
```javascript
    var form1 = new window.FormComponent("TEST-EMSD-202202-en_EMEA-CON-testLeadGen_emsd");  /* Initializing Form #1 */
    var form2 = new window.FormComponent("TEST-EMSD-202202-en_EMEA-SUB-testSubscribe");     /* Initializing Form #2 */
    /* ... etc ...*/
```
2. Provide settings for the hidden fields. Use method `setHiddenFields()`, called on a relevant form's variable (in example below variable is 'form1')
```javascript
    form1.setHiddenFields({          
	  sFDCLastCampaignName: "EMSD-2002-EMEA-GLC-MUL-Lead_gen_test_campaign-A",
	  sFDCLastCampaignID: "7012K00000169GbQAI",
	  sFDCLastCampaignStatus: "Optional",
	  leadSourceMostRecent1: "Website",
	  CTA: "Contact Us"  
	  })
    /* ... etc ...*/
```
3. In case if the form which is needed to be generated, totally matching with the default SMP template, no actions are needed here. Otherwise relevant methods (described below) should be used for achieving an appropriate result.

4. This is a final step - rendering a form. Just call method `render()` on an appropriate form variable (in example below it is a 'form1'):
```javascript
    form1.render();
```

#### Methods of the FormComponent
##### The two important (and mandatory) methods have been described above (`setHiddenFields()` and `render()`):
+ `setHiddenFields(data)`
Is used for setting hidden fields
```javascript
    /**
         * @param {Object} data  Key - HTML name of the hidden field, Value - its value
    */
```
+ `render()` 
Render a form

##### There are optional methods, used for manipulations with the form directly from LP:

+ `changeOrder(arr)` 
OR
`changeOrder(arr, 'after')`
 Changing order of the fields. 
By default: last item in Array (arr) - is a field, right before which should be placed the rest fields from the Array (arr).
For changing the default behaviour from 'right before' to 'right after' an additional parameter 'place' (equal to 'after') should be added.
```javascript
    /**
     * @param {Array} arr Array of HTML names of the fields
     * @param {string} place Equal to 'after' in case if needed to change a default behaviour
     */
```
**Example:**
```javascript
form1.changeOrder(['salutation','firstName','lastName','EMSD_cust_type']); /* To move fields 'salutation','firstName','lastName' right before the 'EMSD_cust_type' field */
form1.changeOrder(['city','zipPostal'], 'after');   /* To move 'city' right after the 'zipPostal' field */
``` 

+ `newField({ label: '', errMessage: '', type: '', options: '', name: '', value: '', className: '', required: 'false' })`
New field declaration. (Adding a new declarated field to a form is managed via a next method below).
```javascript
 /**
     * 
     * @param {Object} data - Includes settings of the new field:
     * label: '',       - Mandatory
     * errMessage: '',  - Mandatory
     * type: '',        - Mandatory (possible values for type: 'text', 'textarea', checkbox', 'radio', 'select', 'header')
     * options: '',     - only in case if type = 'select'
     * name: '',        - Mandatory (should be matching of the HTML name field of the form) 
     * value: '',       - only in case if type = 'checkbox'/'radio' 
     * className: '',   - Optional class for <li> wrapper of the field
     * required:        - can be 'true' or 'false'. By default it's false.
*/
```
**Example:**
```javascript
  form1.newField({
      label: 'Last custom checkbox', 
      errMessage: 'Please specify', 
      type: 'checkbox', 
      name: 'testChbx', 
      value: 'on', 
      //className: '',      
    });
```

+ `addField(name)`
OR
`addField(name, placeBefore)`
Adds a new field to LP
```javascript
 /**
     * @param {string} name - HTML name of the new form field 
     * @param {string} placeBefore - HTML name of the form field, before which a new field should be added. 
     * If this variable is absent, new field is being added to the very end of the form. 
*/
```
**Example:**
```javascript
  form1.addField('testChbx'); /* Adds field 'testChbx' to the very end of the form */
  form1.addField('testCustomField', 'custEnq'); /* Adds field 'testCustomField' right before the 'custEnq' field */ 
```   

+ `removeField(name)`
Removes a field from the form
```javascript
/**
    * @param {string} name - HTML name of the form
*/
```
**Example:**
```javascript
    form1.removeField('address1'); /* Removes a field with HTML name 'address1' from the form */ 
```    

+ addClass(item, cl)
Adds CSS class, which should be customly added to <li> wrapper of the field (if HTMl name of the field is provided) or to a fieldset (if ID of the fieldset is provided)
```javascript
/**
     * @param {string} item HTML name of the field or ID of the fieldset
     * @param {string} cl class name
     *      
*/
```
**Example:**
```javascript
form1.addClass('leadgen', 'MMM--gapTopMed');
```

+ **Methods for Validation Rules**
Validation Rules of the form is based on jQuery Validator.
All methods should be included in a special function:

```javascript
form1.validationRules = (validation) => {
 /** Add Validation Methods HERE **/
}
```
   - Validation Methods:
      
/**
* Method for combining checkboxes into a group
* @param {Array} data - Array of Objects in format:  [{namesOfgroup: '', errorMessage: '', condition}, ... ]
* @param {string} namesOfgroup - HTML names of checkboxes in format: 'chbx chbx2 chbx3'
* @param {string} errorMessage
* @param {boolean} condition - set condition for making mandatory, if needed. If not - don't use this parameter. Should return true or false. 
* @param {number} numMin - minimum number of checkboxes to be checked (defaul = 1)
* @param {number} numMax - maximum number of checkboxes to be checked (default = all checkboxes)
*/

checkboxesGroups(data)

........TO DO..............

## How to use 



____

## Optional usage (in case if form on LP - is a static HTML form, when FormComponent constructor has not been used for the form generation)
### *(initilization of the FormValidationRules, including all its methods must be included into the domReady)*
#### FormValidationRules 
This constructor (js class) is used for the Form Validation, based on Jquery Validator  

```javascript
let validation = new FormValidationRules(formName);
```
____