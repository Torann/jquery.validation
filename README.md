# jQuery Validation

Simple form validation using the Laravel validation syntax.

## Getting started

The form containing the inputs that need validation must inlcude the class `js-validate`. This helpers cut down some on the walking the DOM.

### Data Tags

#### `data-validate=":rules"`

This attribute is on the form element that is being validated. It contains the rules used to validate.

#### `data-validate-msg=":rule"`

This attribute is attached the the tag that is used inside of the input group and contains the translated values for the errors. The attributes value indicated the rule that failed.

## Rules

#### accepted

The field under validation must be *yes*, *on*, *1*, or *true*. This is useful for validating "Terms of Service" acceptance.

#### alpha_num

The field under validation must be entirely alpha-numeric characters.

#### between:*min*,*max*

The field under validation must have a size between the given *min* and *max*.

#### date

The field under validation must be a valid date according to the `YYYY-MM-DD` or `YYYY/MM/DD`.

#### email

The field under validation must be formatted as an e-mail address.

#### in:*foo*,*bar*,...

The field under validation must be included in the given list of values.

#### max:*value*

The field under validation must be less than or equal to a maximum *value*.

#### min:*value*

The field under validation must have a minimum *value*.

#### not_in:*foo*,*bar*,...

The field under validation must not be included in the given list of values.

#### required

The field under validation must be present in the input data and not empty.

#### time

The field under validation must be a valid time string.

#### unique:*endpoint*,*except*

The field under validation must be unique. The `endpoint` is used to create the validation AJAX url `/ajax/:endpoint/check/:field`.

## Example

```html
<div class="input-field">
    <select name="country_code" data-validate="required">
        <option value="">Select Country</option>
        <option value="US">United States</option>
        <option value="UK">United Kingdom</option>
    </select>
    <span data-validate-msg="required" hidden>
        A country must be selected.
    </span>
</div>

<div class="input-field">
    <input type="text" name="city" data-validate="required|max:255">
    <span data-validate-msg="required" hidden>
        A city must be entered.
    </span>
    <span data-validate-msg="max" hidden>
        The city name has a max character length of 255.
    </span>
</div>
```

## Required Functions

**Translation**

[jQuery Translation](https://github.com/Torann/jquery-translation)

**Snackbar**

This is built to use a simple snackbar helper function:

```
$.snackbar({
    message: 'Message from the panel event',
    style: 'error',
    timeout: null
});
```
