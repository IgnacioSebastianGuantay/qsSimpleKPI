function _getRefs(data, refName) {
	let ref = data;
	let name = refName;
	let props = refName.split('.');
	if(props.length > 0) {
		for(let i = 0; i < props.length - 1; ++i) {
			if(ref[props[i]])
				ref = ref[props[i]];
		}
		name = props[props.length - 1];
	}
	return {ref, name};
}

function setRefValue(data, refName, value) {
	let {ref, name} = _getRefs(data, refName);
	ref[name] = value;
}

function getRefValue(data, refName) {
	let {ref, name} = _getRefs(data, refName);
	return ref[name];
}


let ColorsComponent = {
	template:
		`<div class="pp-component pp-buttongroup-component" ng-if="visible" tcl="buttongroup">
			<div class="label" ng-if="label" ng-class="{ \'disabled\': readOnly }">
				{{label}}
			</div>
			<div class="value">
				<div class="qv-object-qsstatistic" ng-if="!loading">
						<button ng-repeat="option in options track by option.value" 
							class="ui mini icon {{option.value}} button"
							ng-disabled="readOnly"
							style="margin: 2px;" 
							qva-activate="select(option.value)" tid="{{option.value}}" data-icon="{{definition.icon}}"
							q-title-translation="{{option.tooltip || option.label}}">
							<i class="checkmark icon" style="font-size:18px;" ng-if="option.value == value"></i>
							<i class="icon" style="font-color: white; font-size:18px;" ng-if="option.value != value"></i>
						</button>
				</div>
				<div class="pp-loading-container" ng-if="loading">
					<div class="pp-loader qv-loader"></div>
				</div>
				<div ng-if="errorMessage" class="pp-invalid error">{{errorMessage}}</div>
			</div>
		</div>`
	,	
	controller: 
		["$scope", function(c){
			console.log('c.definition and c.data');
			console.log(c.definition);
			console.log(c.data);

			function initOptions() {
				c.loading = true;
				c.errorMessage = "";
				c.label = c.definition.label;
				c.options = c.definition.options;
				c.value = getRefValue(c.data, c.definition.ref);
				c.visible = true;
				c.loading = false;
			}
			initOptions();

			// see template
			c.select = function (a) {
				console.log(a);
				c.value = a;
				setRefValue(c.data, c.definition.ref, a);
				"function" == typeof c.definition.change && c.definition.change(c.data, c.args.handler);
				c.$emit("saveProperties");
			};

			c.$on("datachanged", function () {
				initOptions;
			});
		}]
};


let ColorsPickerComponent = {
	template:
		`
		<div class="pp-component" ng-if="visible">
					<div class="label" ng-if="label" ng-class="{ \'disabled\': readOnly }">
						{{label}}
					</div>
					<div class="value">
						<div class="qv-object-qsstatistic" ng-if="!loading">
							<div class="ui mini right labeled">
								<input type="color" ng-model="t.value" ng-change="onColorChange()">
								<a title="{{colorExpression}}" class="ui tag label" qva-activate="showPallete()" style="color: white; background-color: {{t.value}};">
									<span ng-if="!isColorExpression" style="font-size: 18px;">{{t.value}}</span>
									<i class="icon-expression" ng-if="isColorExpression" style="font-size: 18px;"></i>
								</a>
							</div>
							<div ng-if="showColorPallete">
								<button ng-repeat="option in options track by option.value" 
									class="ui mini icon button"
									ng-disabled="readOnly"
									style="margin: 2px; background-color: {{option.value}};" 
									qva-activate="onColorChange(option.value)" tid="{{option.value}}" data-icon="{{definition.icon}}"
									q-title-translation="{{option.tooltip || option.label}}">
									<i class="checkmark icon" style="color: white; font-size:18px;" ng-if="option.value == t.value"></i>
									<i class="icon" style="font-size:18px;" ng-if="option.value != t.value"></i>
								</button>
							</div>
						</div>
						<div class="pp-loading-container" ng-if="loading">
							<div class="pp-loader qv-loader"></div>
						</div>
						<div ng-if="errorMessage" class="pp-invalid error">{{errorMessage}}</div>
					</div>
		</div>
		`
	,
	controller: 
		["$scope", "$element", function(c, e){
			console.log('c.definition and c.data');
				console.log(e);
				console.log(c.definition);
				console.log(c.data);

			function initOptions() {
				c.loading = true;
				c.errorMessage = "";
				c.label = c.definition.label;
				c.options = c.definition.options;
				c.isColorExpression = false;
				c.colorExpression = '';

				let val = getRefValue(c.data, c.definition.ref);
				if(typeof val === "object") {
					c.isColorExpression = true;
					c.colorExpression = (val && val.qStringExpression && val.qStringExpression.qExpr) || "";
					val = c.definition.defaultValue;					
				}

				c.t = {	
					value: val
				};

				c.visible = true;
				c.showColorPallete = false;
				c.loading = false;
			}
			initOptions();
			c.onColorChange = function(color) {				
				if(color) {
					c.t.value = color;
				}
				setRefValue(c.data, c.definition.ref, c.t.value);
				"function" == typeof c.definition.change && c.definition.change(c.data, c.args.handler);
				c.$emit("saveProperties");
				c.showColorPallete = false;
			};
			c.showPallete = function() {
				c.showColorPallete = !c.showColorPallete;
			};
			c.$on("datachanged", function () {
				initOptions();
				//console.log('changed!');
			});
		}]
};


let IconsPickerComponent = {
	template:
		`<div class="pp-component pp-buttongroup-component" ng-if="visible">
			<div class="label" ng-if="label" ng-class="{ \'disabled\': readOnly }">
				{{label}}
			</div>
			<div class="value">
				<div class="qv-object-qsstatistic" ng-if="!loading">
					<button 
						class="qui-button" 
						ng-class="{'qui-active': isShowIcons}"
						qva-activate="showHideIcons()"
						ng-disabled="readOnly"
						q-title-translation="{{option.tooltip || option.label}}">
						<i class="{{value}}" style="font-size:18px;"></i>
					</button>
					<span>{{value}}</span>					
					<div ng-if="isShowIcons">
						<button ng-repeat="option in options track by option.value"
							class="ui tiny icon button"
							ng-disabled="readOnly"
							style="margin: 2px;"
							qva-activate="select(option.value)"
							q-title-translation="{{option.tooltip || option.label}}">
							<div><i class="{{option.value}}"></i></div>
						</button>
					</div>
				</div>
				<div class="pp-loading-container" ng-if="loading">
					<div class="pp-loader qv-loader"></div>
				</div>
				<div ng-if="errorMessage" class="pp-invalid error">{{errorMessage}}</div>
			</div>
		</div>`
	,	
	controller: 
		["$scope", function(c){

			function initOptions() {
				c.loading = true;
				c.errorMessage = "";
				c.isShowIcons = false;
				c.label = c.definition.label;
				c.options = c.definition.options;
				c.value = getRefValue(c.data, c.definition.ref);
				c.visible = true;
				c.loading = false;
			}

			initOptions();

			// see template
			c.select = function (a) {
				console.log(a);
				c.value = a;
				setRefValue(c.data, c.definition.ref, a);
				"function" == typeof c.definition.change && c.definition.change(c.data, c.args.handler);
				c.$emit("saveProperties");
			};

			c.showHideIcons = function(){
				c.isShowIcons = !c.isShowIcons;
			};

			c.$on("datachanged", function () {
				//initOptions();
			});
		}]
};


export default {
	ColorsComponent,
	ColorsPickerComponent,
	IconsPickerComponent	
}
