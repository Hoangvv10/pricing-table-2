function showSuccessToast() {
    toast({
      title: "Success!",
      message: "Your account has been saved.",
      type: "success",
      duration: 5000
    });
}

function showErrorToast() {
    toast({
      title: "Error!",
      message: "Please fill in all the fields.",
      type: "error",
      duration: 5000
    });
}

function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        toast.onclick = function (e) {
            if (e.target.closest(".toast-close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast-body">
                <h3 class="toast-title">${title}</h3>
                <p class="toast-msg">${message}</p>
            </div>
            <div class="toast-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}


function Validator (options) {
    
    let selectorRules = {}
    const submitBtn = document.querySelector('.form-submit')


    function validate (inputE, rule) {

        let errorMessage
        let errorPan = inputE.parentElement.querySelector(options.errorSelector)
        let rules = selectorRules[rule.selector]

        for (let i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputE.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            inputE.parentElement.classList.add('invalid')
            errorPan.innerText = errorMessage
            showErrorToast()
            submitBtn.setAttribute('disabled', '');

        } else {
            inputE.parentElement.classList.remove('invalid')
            errorPan.innerText = ''
            submitBtn.removeAttribute('disabled');
        }
        return !errorMessage
    }

        const formElement = document.querySelector(options.form)

        formElement.addEventListener("submit", (e) => {
            e.preventDefault()
        })

        submitBtn.onclick = function (e) {
            e.preventDefault()

            let isValid = true

            options.rules.forEach(function (rule) {
                let inputE = formElement.querySelector(rule.selector)
                let valid =  validate(inputE, rule)
                if (!valid){
                    isValid = false;
                }
            })

            if (isValid){
                showSuccessToast()
                if (typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');

                    let formValues = Array.from(enableInputs).reduce(function (values, input){
                        (values[input.name] = input.value)
                        return values;
                    }, {});
                    options.onSubmit(formValues)
                }
            } else {
                showErrorToast()
            }
        }


    if (formElement) {
        
        options.rules.forEach(function (rule) {

            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }

            let inputE = formElement.querySelector(rule.selector);

            if (inputE) {
                let errorMessage = rule.test(inputE.value)

                inputE.onblur = function () {
                    validate(inputE, rule)
                }

                inputE.oninput = function () {
                    let errorPan = inputE.parentElement.querySelector(options.errorSelector)
                    inputE.parentElement.classList.remove('invalid')
                    errorPan.innerText = ''
                }
            }
        })
    }
}





Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'This field is required!'
        }
}
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Email is invalid!'

        }
}
}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Password must contain: 1 upper case letter and be at least ${min} letters!`

        }
    }
}

Validator.isConfirmed = function (selector, getConfirm, para) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirm() ? undefined : para || 'Password is not matched!'
        }
    }
}

