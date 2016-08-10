# jqdata
Automatic databinding from JSON to HTML Element or vice versa. This will automatic detect whether target element is input textbox, select, radio button, or just ordinary html container, & then sets it's value.   

<h1>How to Use</h1>
Link both jquery & jqdata library (I'll use jquery-1.11.0.min.js for example)
<pre>
    &lt;script type="text/javascript" src="js/jquery-1.11.0.min.js">&lt;/script>
    &lt;script type="text/javascript" src="js/jquery.jqdata.1.0.js">&lt;/script>
</pre>

Prepare your JSON data (you can get this from $.get or $.post method for server request) :
<pre>
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
</pre>

Prepare your HTML :
add attribute "data-jqdata" on each element and set it with a json node separated by dot
<pre>
  &lt;div id="root" >
  	  &lt;input type="text"  data-jqdata="data.obj2.obj21" /> &lt;!-- value : "data obj21"  -->
      &lt;select data-jqdata="data2"> 
      	&lt;option value="0">- Select -&lt;/option>
      	&lt;option value="1">Test1&lt;/option>
      	&lt;option value="2">Test2&lt;/option> &lt;!-- this option will be selected  -->
      &lt;/select>
  &lt;/div>    

</pre>

Call jqdata on document ready :
<pre>
  var objData;
  $(function(){
	objData = $('#root').jqdata({'json':json1});
  });
</pre>


