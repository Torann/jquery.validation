/**
 * @file jquery.validation.js
 * @brief Simple form validation using the Laravel validation syntax.
 * @author Daniel Stainback (Torann)
 * @version 1.0.0
 * @license Apache License 2.0
 */

+function ($) {
    'use strict';

    var requests = [];

    var validations = {
        // Checks if a value is present.
        required: {
            validate: function(value) {
                return !value;
            }
        },

        // Checks if a value is truthy
        accepted: {
            validate: function(value) {
                return /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/i.test(value) === false;
            }
        },

        // Checks if a value is in the given array
        in: {
            validate: function(value, params) {
                return $.inArray(value, params) === false;
            }
        },

        // Checks if a value is NOT in the given array
        not_in: {
            validate: function(value, params) {
                return $.inArray(value, params) === true;
            }
        },

        // Checks if number is between a minimum and maximum.
        between: {
            validate: function(value, params) {
                return (parseInt(value) >= parseInt(params[0]) && parseInt(value) <= parseInt(params[1])) === false;
            }
        },

        // Checks if a value is a maximum of n characters.
        max: {
            validate: function(value, params) {
                return value.length > parseInt(params[0]);
            }
        },

        // Checks if a value is a minimum of n characters
        min: {
            validate: function(value, params) {
                return value.length < parseInt(params[0]);
            }
        },

        // Checks if a value contains both letters and numbers.
        alpha_num: {
            validate: function(value) {
                return /[^a-zA-Z\d]/.test(value);
            }
        },

        // Checks if a value is a valid time string.
        time: {
            regex: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
            validate: function(value) {
                return this.regex.test(value);
            }
        },

        // Checks if a value is a valid email address.
        email: {
            validate: function(value) {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value) === false;
            }
        },

        // Checks if a value is a valid date (YYYY[-/]MM[-/]DD).
        date: {
            regex: /^(?:\2)(?:[0-9]{2})?[0-9]{2}([\/-])(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])$/,
            validate: function(value) {
                return this.regex.test(value) === false;
            }
        },

        // Simple checks to see if the stripe CC info was entered
        valid_cc: {
            validate: function(value, params, $el) {
                if ($el.hasClass('StripeElement--complete') === false) {
                    $el.addClass('StripeElement--invalid');
                    return true;
                }

                return false;
            }
        }
    };

    $.validate = function(element, options) {
        var $element = $(element),
            errors = $element.data('errors'),
            value = $element.val(),
            $parent = $element.parents('.input-field').removeClass('has-error'),
            name = $element.attr('name'),
            validation = $element.data('validate'),
            rules = validation.split('|'),
            total = rules.length,
            count = 0;

        // Set options
        options = $.extend({
            check: false,
            alert: false,
            addClass: true,
            onSuccess: null,
            onFailure: null
        }, options);

        // For a quick check just skip if
        if ((options.check === true || $element.data('last.value') === value)
            && errors === false) {
            return errors;
        }

        // Update data values
        $element.data('errors', undefined)
            .data('last.value', value);

        // Hide old messages
        $parent.find('[data-validate-msg]').hide();

        // Run all inline validations
        $.each(rules, function(i, arg) {
            var result = $.validateByRule($element, arg, value, name, function() {
                count++;

                $element.data('errors', count < total);

                if (options.onSuccess && count >= total) options.onSuccess();
            });

            if (result === true) {
                if (options.addClass) $parent.addClass(arg !== 'valid_cc' ? 'has-error' : '');
                errors = true;
                return false;
            }
            else if (result === false) {
                count++;
            }
        });

        $element.data('errors', count < total);

        return $element.data('errors');
    };

    $.validateByRule = function(element, rules, value, name, onSuccess) {
        var $element = $(element).data('failures', false),
            params = rules.split(':'),
            rule = params.shift(),
            $parent = $element.parents('.input-field'),
            $msg = $parent.find('[data-validate-msg="' + rule + '"]'),
            failed = false;

        // Get rule parameters
        params = params[0] ? params[0].split(',') : [];

        //// Inject the simple required message
        //if (rule === 'required' && $msg.length === 0) {
        //    $msg = $('<div class="help-block error" data-validate-msg="required">' +
        //        $.trans('validation.this_field_is_required') +
        //    '</div>');
        //
        //    // Insure it's injected correctly
        //    if ($element.parent().hasClass('input-group')) {
        //        $element.parent().after($msg);
        //    }
        //    else {
        //        $element.after($msg);
        //    }
        //}

        // Perform validation
        failed = rule === 'unique'
            ? this.validateUnique('/ajax/' + params[0] + '/check/' + name, value, params[1], $msg, onSuccess)
            : validations[rule].validate(value, params, $element);

        // Toggle error message for this rule
        $msg.toggleShow(failed);

        return failed;
    };

    $.validateUnique = function(url, value, id, $results, onSuccess) {

        // Abort old request
        if (requests[url] && typeof requests[url].abort === 'function') {
            requests[url].abort();
        }

        requests[url] = $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: {
                value: value,
                id: id
            },
            success: function (response) {
                if (onSuccess && response.status === 'available') {
                    onSuccess();
                }

                $results.show()
                    .html('<span class="badge bg-'
                        + (response.status === 'available' ? 'success' : 'danger') + '">'
                        + response.message + '</span>');
            }
        });

        return null;
    };

    $.fn.validate = function(options) {
        var count = 0;

        this.each(function () {
            var $this = $(this);

            var result = ($this.data('valid') !== true)
                ? $.validate(this, options)
                : false;

            if (result === true) count++;
        });

        if (count === 0) {
            if (options.onSuccess) options.onSuccess();
        }
        else if (count > 0) {
            if (options.onFailure) options.onFailure();

            if (options.alert) {
                $.snackbar({
                    message: $.trans('validation.general_error_message'),
                    style: 'error',
                    timeout: 6000
                });
            }
        }

        return this;
    };

    $(window).on('load', function () {
        $('form.js-validate').on('submit', function(ev) {
            var items = {},
                total = 0;

            // Group elements
            $(this).find('[data-validate]:visible,[data-validate][type="hidden"]').each(function () {
                if (this.name.slice(-2) === '[]') {
                    if (items[this.name] === undefined) items[this.name] = [];
                    items[this.name].push(this);
                }
                else {
                    items[this.name] = this;
                }
            });

            $.each(items, function (name, els) {
                if (Array.isArray(els) === true) {
                    var failures = 0;

                    $.each(els, function (i, el) {
                        if ($.validate(el, {addClass: false})) failures++;
                    });

                    if(failures >= els.length) {
                        $(els).closest('.input-field').addClass('has-error');
                        total++;
                    }
                }
                else {
                    var result = ($(els).data('valid') !== true)
                        ? $.validate(els)
                        : false;

                    if(result) total++;
                }
            });

            if (total > 0) {
                ev && ev.preventDefault();

                $.snackbar({
                    message: $.trans('validation.general_error_message'),
                    style: 'error',
                    timeout: 6000
                });
            }
        });
    });

}(jQuery);