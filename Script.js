$().ready(init_QvVariableInput);
Qva.LoadCSS("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/QvVariableInput/qvvariableinput.css");
if (Qva.Mgr.mySelect == undefined) {
    Qva.Mgr.mySelect = function (owner, elem, name, prefix) {
        if (!Qva.MgrSplit(this, name, prefix)) return;
        owner.AddManager(this);
        this.Element = elem;
        this.ByValue = true;
 
        elem.binderid = owner.binderid;
        elem.Name = this.Name;
 
        elem.onchange = Qva.Mgr.mySelect.OnChange;
        elem.onclick = Qva.CancelBubble;
    }
    Qva.Mgr.mySelect.OnChange = function () {
        var binder = Qva.GetBinder(this.binderid);
        if (!binder.Enabled) return;
        if (this.selectedIndex < 0) return;
        var opt = this.options[this.selectedIndex];
        binder.Set(this.Name, 'text', opt.value, true);
    }
    Qva.Mgr.mySelect.prototype.Paint = function (mode, node) {
        this.Touched = true;
        var element = this.Element;
        var currentValue = node.getAttribute("value");
        if (currentValue == null) currentValue = "";
        var optlen = element.options.length;
        element.disabled = mode != 'e';
        //element.value = currentValue;
        for (var ix = 0; ix < optlen; ++ix) {
            if (element.options[ix].value === currentValue) {
                element.selectedIndex = ix;
            }
        }
        element.style.display = Qva.MgrGetDisplayFromMode(this, mode);
 
    }
}

function init_QvVariableInput() {
	Qva.AddExtension('QvVariableInput', function() {
		var _this = this
		_this.version = '1.0'
		_this._uniqueId = _this.Layout.ObjectId.replace("\\","_");
		_this._variable = getQVStringProp(0) //Variable name
		_this._placeholder = getQVStringProp(1) //0.3 - 0.8
		_this._inputType = getQVStringProp(2) ? getQVStringProp(2) : "text" //0.3 - 0.8
		
		_this.getVariable = function(vName,callbackFn) {
			var myDoc = Qv.GetCurrentDocument();
			var theVar = null
			myDoc.GetAllVariables(function(vars) {
				if (vars) {
					theVar = $.grep(vars, function(elem, idx){
						return (elem.name == vName)
					})
					if (theVar && theVar[0]) {
						_this._value = theVar[0].value
					} else {
						_this._value = 0
					}
				} else {
					_this._value = 0
				}
				callbackFn()
			})

		}
		
		
		_this._paintInitial = function() {
			var styled = [];
			styled['font-size'] = _this.Layout.Style.fontsize
			styled['font-family'] = _this.Layout.Style.fontfamily
			styled['font-style'] = _this.Layout.Style.fontstyle
			styled['font-weight'] = _this.Layout.Style.fontweight
			styled['text-decoration'] = _this.Layout.Style.textdecoration
			
			$(_this._input).unbind('change')
			$(_this.Element).empty()
			_this._input = $('<input>').attr({'id':'qvvariableinput_'+_this._uniqueId,'type':_this._inputType,'placeholder':_this._placeholder}).addClass("qvvariableinput").val(_this._value).attr('title',_this._variable)
			_this._input.css(styled)
			$(_this.Element).append(_this._input)
			//hook on standard change event
			_this._input.change(function(ev){_this._onChange($(ev.target).val())})
			//initialize knob control
		}
		
		_this._onChange = function(value) {
		SetVarValue(_this._variable,value)
		}
		
		_this.getVariable(_this._variable, function(){_this._paintInitial()})
		//--------------------------------------------------------------------------------------------------
		function SetVarValue(varName,val) {
            var qvDoc = Qv.GetCurrentDocument();
            qvDoc.SetVariable(varName, val);
        }
		
		function getQVStringProp(idx) {
            var p = '';
			try {
                if (_this.Layout['Text' + idx]) {
                    p = _this.Layout['Text' + idx].text
                }
			} catch (Exception) {
				alert("Exception")
			}
            return p;
        }		
	});
}; /*init_QvVariableInput*/