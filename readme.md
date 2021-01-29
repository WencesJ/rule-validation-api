# A Simple rule-validation API
The rule-validation API has just two routes.

### References:

#. _[FIRST ROUTE](https://github.com/WencesJ/rule-validation-api#1-first-route-is-the-base-route-http-get-)_

#. _[SECOND ROUTE](https://github.com/WencesJ/rule-validation-api#2-second-route-is-the-rule-validation-route-http-post-validate-rule)_

#. _[ENDPOINTS REQUIREMENT/CONSTRAINTS](https://github.com/WencesJ/rule-validation-api#endpoint-requirementsconstraints)_

#. _[SUCCESS VALIDATION RESPONSE](https://github.com/WencesJ/rule-validation-api#success-validation-response)

#. _[FAILED VALIDATION RESPONSE](https://github.com/WencesJ/rule-validation-api#failed-validation-response)_

#. _[HOSTING](https://github.com/WencesJ/rule-validation-api#hosted-on)_

#. _[OTHER EXAMPLES](https://github.com/WencesJ/rule-validation-api#other-examples)_


### 1. First route is the base route. HTTP GET "/"
**It returns my profile data in the following format:**
```JSON
{
    "message": "My Rule-Validation API",
    "status": "success",
    "data": {
        "name": "Wenceslas Emmanuel Jonah",
        "github": "@WencesJ",
        "email": "wenceslasjonah25@gmail.com",
        "mobile": "07053436231",
        "twitter": "@Wences_official"
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

### 2. Second route is the rule validation route. HTTP POST "/validate-rule"
**This route accepts JSON data containing a rule and data field to validate the rule against.**

Example:
```JSON
{
    "rule": {
        "field": "missions",
        "condition": "gte",
        "condition_value": 30
    },
    "data": {
        "name": "James Holden",
        "crew": "Rocinante",
        "age": 34,
        "position": "Captain",
        "missions": 45
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

### Endpoint requirements/constraints:
    a. The rule and data fields are required.
    b. The rule field must be a valid JSON Object.
    c. The data field can be a|an valid Object|Array|String.
    d. The rule fields must contain (field, condition, condition_value).
    e. The rule field value must be valid in the data field.
    f. The rule field can also support nested data object. 
        [PS: The nesting should not be more than two].
_[References](https://github.com/WencesJ/rule-validation-api#references)_

### Success Validation Response:
**When the rule is successfully validated, the endpoint response (HTTP 200 status code) is:**
```JSON
{
    "message": "field [name of field] successfully validated.",
    "status": "success",
    "data": {
        "validation": {
            "error": false,
            "field": "[name of field]",
            "field_value": "[value of field]",
            "condition": "[rule condition]",
            "condition_value": "[condition value]"
        }
    }
}
```
e.g.
```JSON
{
    "message": "field missions successfully validated.",
    "status": "success",
    "data": {
        "validation": {
            "error": false,
            "field": "missions",
            "field_value": 30,
            "condition": "gte",
            "condition_value": 30
        }
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

### Failed Validation Response:
**When the rule validation fails, the endpoint response (HTTP 400 status code) is:**
```JSON
{
    "message": "field [name of field] failed validation.",
    "status": "error",
    "data": {
        "validation": {
            "error": true,
            "field": "[name of field]",
            "field_value": "[value of field]",
            "condition": "[rule condition]",
            "condition_value": "[condition value]"
        }
    }
}
```
e.g.
```JSON
{
    "message": "field missions failed validation.",
    "status": "error",
    "data": {
        "validation": {
            "error": true,
            "field": "missions",
            "field_value": 30,
            "condition": "gte",
            "condition_value": 54
        }
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

### HOSTED ON
[Heroku](https://wences-rule-validation-api.herokuapp.com)

**_Accessible Routes:_**

    a. HTTP [GET] https://wences-rule-validation-api.herokuapp.com/
    b. HTTP [POST] https://wences-rule-validation-api.herokuapp.com/validate-rule
_[References](https://github.com/WencesJ/rule-validation-api#references)_

## OTHER EXAMPLES
**Example JSON request payloads:**

= EX1 =
```JSON
Request:
{
    "rule": {
        "field": "missions.count",
        "condition": "gte",
        "condition_value": 30
    },
    "data": {
        "name": "James Holden",
        "crew": "Rocinante",
        "age": 34,
        "position": "Captain",
        "missions": {
            "count": 45,
            "successful": 44,
            "failed": 1
        }
    }
}

Response: (HTTP 200)
{
    "message": "field missions.count successfully validated.",
    "status": "success",
    "data": {
        "validation": {
            "error": false,
            "field": "missions.count",
            "field_value": 45,
            "condition": "gte",
            "condition_value": 30
        }
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

= EX2 =
```JSON
Request:
{
    "rule": {
        "field": "0",
        "condition": "eq",
        "condition_value": "a"
    },
    "data": "damien-marley"
}

Response: (HTTP 400)
{
    "message": "field 0 failed validation.",
    "status": "error",
    "data": {
        "validation": {
            "error": true,
            "field": "0",
            "field_value": "d",
            "condition": "eq",
            "condition_value": "a"
        }
    }
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_

= EX3 =
```JSON
Request:
{
    "rule": {
        "field": "5",
        "condition": "contains",
        "condition_value": "rocinante"
    },
    "data": ["The Nauvoo", "The Razorback", "The Roci", "Tycho"]
}

Response: (HTTP 400)
{
    "message": "field 5 is missing from data.",
    "status": "error",
    "data": null
}
```
_[References](https://github.com/WencesJ/rule-validation-api#references)_
