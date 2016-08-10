# jqdata
Automatic jQuery databinding from JSON to HTML Element or vice versa. This will automatic detect whether target element is input textbox, select, radio button, or just ordinary html container, & then sets it's value.   

# How to Use
Link both jquery & jqdata library (I'll use jquery-1.11.0.min.js for example)
```html
    <script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="js/jquery.jqdata.1.0.js"></script>
```

Prepare your JSON data (you can get this from $.get or $.post method for server request) :
```javascript
	var json1 = {'data':
	              {'obj1': 'data obj1',
	               'obj2': { 'obj21':'data obj21',
	                         'obj22':'data obj22',
	                         'obj23':'2',
	                         'obj24':3000}
	               },
	               'data2':2,
	               'dataArray':[{'col1':'data11',
	                             'col2':'data12',
	                             'col3':[{'d1':'val1'},
	                                     {'d1':'val2'}
	                                    ]},
	                            {'col1':'data21',
	                                'col2':'data22',
	                                'col3':null},
	                            {'col1':'data31',
	                                'col2':'data32',
	                                'col3':[{'d1':'val21'},
	                                        {'d1':'val22'},
	                                        {'d1':'val23'}]
	                             }]
	               };
```

Prepare your HTML :
<br/>
add attribute "data-jqdata" on each element and set it with a json node separated by dot
```html
  <div id="root" >
      <input type="text"  data-jqdata="data.obj2.obj21" /> <!-- value : "data obj21"  -->
      <select data-jqdata="data2"> 
      	<option value="0">- Select -</option>
      	<option value="1">Test1</option>
      	<option value="2">Test2</option> <!-- this option will be selected  -->
      </select>
  </div>    
```

Call jqdata on document ready :
```javascript
  var objData;
  $(function(){
	objData = $('#root').jqdata({'json':json1});
  });
```

# Options

| Key                        | Description                                         | Default       |
|----------------------------|-----------------------------------------------------|---------------|
| dataAttr | Define attribute name used in each element. if set to 'jq', then the attribute shuld be data-jq | jqdata |
| json | JSON data will be used as data source | null |
| beforeBind | Triggered before data binding occured | function(){} |
| afterBind | Triggered after data bound | function(){} |
| dataChanged | triggered after data has been changed | function(){} |

# Element Attributes

> Notes : these attributes will only works with dataAttr option set to 'jqdata'

| Attribute | Description |
|----|----|
| data-jqdata | JSON node tree separated by dot. ex, to access json1['data']['obj1'], the value will be "data.obj1" |
| data-jqdata-bindevent | Event name will be triggered to change data source value based on element value. ex, to change value onblur & onkeyup in a textbox, the value will be "blur keyup" |
| data-jqdata-format | Data formatting. use token {value} to replace the value. See index.htm for details. |
| data-jqdata-databind | Javascript function triggered after databind occured |


# Data Array Handling

Use javascript function passed in data-jqdata-databind attribute to handle array data
```javascript
function generateList(obj,val) { // full parameter : current object, array value, json (source data), key (from data-jqdata attribute)
	obj.empty();
	for (var i in val) {
		obj.append('<li>['+i+'] : '+val[i].col1+' | '+val[i].col2+'<span data-jqdata="data.obj2.obj21"></span></li>');
	}
}
```
Alternatively, you can use html as a template for array data by using {n} token. For example, the following html template can be used to populate data in json1['dataArray'].
```html
<ul data-jqdata="dataArray" >
	<li data-jqdata="dataArray.{n}">
		<span data-jqdata="dataArray.{n}.col1" data-jqdata-format="{value} : "></span> <span data-jqdata="dataArray.{n}.col2"></span>
		<ul >
			<li data-jqdata="dataArray.{n}.col3.{n}">
				<span data-jqdata="dataArray.{n}.col3.{n}.d1"></span>
			</li>
		</ul>
	</li>
</ul>
```
