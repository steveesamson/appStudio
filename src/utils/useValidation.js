import _makeName from './common/makeName';

export const useValidation = (props, setError) => {
	// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it) - MIT license

	// var isUrl = urlValidator.test('http://...');
	const regexes = {
			number: /^[-+]?[0-9]+(\.[0-9]+)?$/g,
			alpha: /^[A-Z\s]+$/gi,
			alphanum: /^[A-Z]+[A-Z0-9]+$/gi,
			integer: /^[-+]?\d+$/g,
			email: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/gi,
			url: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
			ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g
		},
		getErrorText = (inputName, errorType, extra) => {
			inputName = _makeName(inputName);

			switch (errorType.toLowerCase()) {
				case 'required':
					return inputName + ' is mandatory.';
				case 'match':
					return inputName + ' does not match ' + _makeName(extra);
				case 'func':
					return inputName + extra;
				case 'captcha':
					return inputName + ' does not match the image.';
				case 'email':
					return inputName + ' should be a valid email.';
				case 'url':
					return inputName + ' should be a valid URL.';
				case 'cron':
					return inputName + ' should be a valid cron expression.';
				case 'ip':
					return inputName + ' should be a valid IP.';
				case 'integer':
					return inputName + ' must be an integer.';
				case 'number':
					return inputName + ' should be a number.';
				case 'alpha':
					return inputName + ' should be a string of alphabets.';
				case 'alphanum':
					return inputName + ' should be a string of alphanumerics starting with alphabets.';
				case 'min-length':
					return inputName + ' must be at least ' + extra + ' characters long.';
				case 'max-length':
					return inputName + ' must not be more than ' + extra + ' characters long.';
				case 'length':
					return inputName + ' must be exactly ' + extra + ' characters long.';
				case 'length':
					return inputName + ' must not be greater than ' + extra + '.';
				default:
					return errorType;
			}
		},
		validate = async (inputValue, skip) => {
			const { validations, name, captcha } = props;
			let error = null;
			inputValue = ((inputValue || '') + '').trim();
			// console.log(validations, name,  'value:', input_value);
			if (validations) {
				let inputName = name,
					_validations = validations.split('|');

				for (let i = 0; i < _validations.length; ++i) {
					let validation = _validations[i],
						typeDetails = validation.split(':'),
						type = typeDetails[0].trim();

					// var error_found = false;
					switch (type.toLowerCase()) {
						case 'required':
							error =
								!inputValue || !inputValue.length ? getErrorText(inputName, 'required') : null;
							setError(error, skip);
							break;

						case 'match':
							error =
								typeDetails.length < 2
									? inputName + ': match validation requires party target'
									: null;
							setError(error, skip);
							if (error) break;

							// let $party = getInput(type_details[1].trim());
							let $party = document.getElementById(typeDetails[1].trim());
							// console.log($party)
							error =
								!inputValue || inputValue !== $party.value
									? getErrorText(inputName, 'match', typeDetails[1])
									: null;
							setError(error, skip);

							break;

						// case 'func':
						// 	error = type_details.length < 2 ? input_name + ': func validation requires target function name' : null;
						// 	setError(error);
						// 	if (error) break;

						// 	let $func = props[type_details[1].trim()];

						// 	let ret = await $func(input_value);
						// 	console.log('ret: ', ret)
						// 	error = ret ? getErrorText(input_name, 'func', ret) : null;
						// 	setError(error);

						// 	break;

						case 'captcha':
							// console.log('captcha: ', input_value, captcha);
							error =
								!inputValue || inputValue !== captcha.text
									? getErrorText(inputName, 'captcha')
									: null;
							setError(error, skip);
							break;
						case 'email':
							error =
								!inputValue || !inputValue.match(regexes['email'])
									? getErrorText(inputName, 'email')
									: null;
							setError(error, skip);
							break;
						case 'url':
							error =
								!inputValue || !inputValue.match(regexes['url'])
									? getErrorText(inputName, 'url')
									: null;
							setError(error, skip);
							break;
						case 'ip':
							error =
								!inputValue || !inputValue.match(regexes['ip'])
									? getErrorText(inputName, 'ip')
									: null;
							setError(error, skip);
							break;
						case 'integer':
							error =
								!inputValue || !inputValue.match(regexes['integer'])
									? getErrorText(inputName, 'integer')
									: null;
							setError(error, skip);
							break;
						case 'number':
							error =
								!inputValue || !inputValue.match(regexes['number'])
									? getErrorText(inputName, 'number')
									: null;
							setError(error, skip);
							break;
						case 'alpha':
							error =
								!inputValue || !inputValue.match(regexes['alpha'])
									? getErrorText(inputName, 'alpha')
									: null;
							setError(error, skip);
							break;
						case 'alphanum':
							error =
								!inputValue || !inputValue.match(regexes['alphanum'])
									? getErrorText(inputName, 'alphanum')
									: null;
							setError(error, skip);
							break;
						case 'min-length':
							error =
								typeDetails.length < 2
									? inputName + ': min-length validation requires width'
									: null;
							setError(error, skip);
							if (error) break;
							error =
								!inputValue || inputValue.length < parseInt(typeDetails[1], 10)
									? getErrorText(inputName, 'min-length', typeDetails[1])
									: null;
							setError(error, skip);
							break;
						case 'max-length':
							error =
								typeDetails.length < 2
									? inputName + ': max-length validation requires width'
									: null;
							setError(error, skip);
							if (error) break;
							error =
								!inputValue || inputValue.length > parseInt(typeDetails[1], 10)
									? getErrorText(inputName, 'max-length', typeDetails[1])
									: null;
							setError(error, skip);
							break;
						case 'length':
							error =
								typeDetails.length < 2 ? inputName + ': length validation requires width' : null;
							setError(error, skip);

							if (error) break;
							error =
								!inputValue || inputValue.length !== parseInt(typeDetails[1], 10)
									? getErrorText(inputName, 'length', typeDetails[1])
									: null;
							setError(error, skip);
							break;
						case 'max':
							error =
								typeDetails.length < 2 ? inputName + ': max validation requires max value' : null;
							setError(error, skip);

							if (error) break;
							error =
								!inputValue || parseInt(inputValue, 10) !== parseInt(typeDetails[1], 10)
									? getErrorText(inputName, 'max', typeDetails[1])
									: null;
							setError(error, skip);
							break;
						default:
					}
					if (error) {
						setError(error, skip);
						break;
					}
				} //end
			}
		};

	return { validate };
};
