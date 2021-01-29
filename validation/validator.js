const _ = require('lodash');

const _isObject = (value) => (Object.prototype.toString.call(value) === '[object Object]');

// CHECK JSON PAYLOAD - FIRST LEVEL VALIDATION.
function checkJSONPayload(payload) {

    /**
     * checks if payload is a valid JSON Object.
     * checks if payload contains more than the required fields.
    */
   
    if (!(_isObject(payload)) || !(Object.keys(payload).length <= 2)) {
        
        // returns error - object.
        return {
            error: {
                msg: "Invalid JSON payload passed.",
                data: null
            }
        }
    }

    // returns value - payload - object.// returns value - payload - object.
    return {
        value: payload
    };
};

// CHECK THE REQUIRED JSON FIELDS - SECOND LEVEL VALIDATION.
function checkRequiredJSONFields(payload) {

    const requiredFields = ['rule', 'data'];

    for (field of requiredFields) {

        // checks if any of the required fields does not exist.
        if (payload[field] === undefined) {

            // returns error - object.
            return {
                error: {
                    msg: `${field} is required.`,
                    data: null
                }
            }
        }
    }

  // returns value - payload - object.
    return {
        value: payload
    }
}

// CHECK VALID JSON FIELDS - THIRD LEVEL VALIDATION.
function checkValidJSONFields(payload) {
    const { rule, data } = payload;

    // checks if rule value is not an object.
    if (!(_isObject(rule))) {

        // returns error - object.  
        return {
            error: {
                msg: 'rule should be an object.',
                data: null
            }
        }
    }
    
    // checks if data value is not a|an Object | Array | String.
    if (!(_isObject(data)) && !(Array.isArray(data)) && (typeof data !== 'string')) {

        // returns error - object.
        return {
            error: {
                msg: 'data should be a|an (object|array|string).',
                data: null
            }
        }
    }
// returns value - payload - object.
    return {
        value: payload
    }
}

// CHECK REQUIRED RULE FIELDS - FOURTH LEVEL VALIDATION.
function checkRequiredRuleFields(payload) {
    const { rule } = payload;

    const fields = ['field', 'condition', 'condition_value'];
    const conditions = ['eq', 'neq', 'gt', 'gte', 'contains'];

    // checks if rule fields has anything other than the required fields.
    if (Object.keys(rule).length !== 3) {

        // returns error - object.
        return {
            error: {
                msg: `rule fields should be field|condition|condition_value.`,
                data: null
            }
        }
    }

    for (field of fields) {
        
        if (rule[field] === undefined) {

            // returns error - object.
            return {
                error: {
                    msg: `rule.${field} is required.`,
                    data: null
                }
            }
        }
    }

    // checks if the condition is in the required condition array.
    if (!conditions.includes(rule.condition)) {

        // returns error - object.
        return {
            error: {
                msg: 'rule.condition should be eq|neq|gt|gte|contains.',
                data: null
            }
        }
    }
// returns value - payload - object.
    return {
        value: payload
    }
}

// CHECK MISSING DATA FIELDS - FIFTH LEVEL VALIDATION.
function checkMissingDataField(payload) {
    let { rule, data } = payload;

    let field = rule.field;

    let mainData, dataKey;

    // checks if the rule field is nested.
    if (field.includes('.')) {
        let dataKeys = field.split('.');

        let currentFieldName = dataKeys[0];

        let nextObj = { ...data };

        // checks if data fields is nested more than twice.
        if (dataKeys.length > 3) {
        
            // returns error - object.
            return {
                error: {
                    msg: `data fields nesting should not be more than two levels.`,
                    data: null
                }
            }
        }

        // checks if each key of a nested field exists.
        for (key of dataKeys) {
            if (_.get(nextObj, currentFieldName) === undefined) {

                // returns error - object.
                return {
                    error: {
                        msg: `field ${key} is missing from (data.${currentFieldName}).`,
                        data: null
                    }
                }
            }
            if (key === currentFieldName) continue;

            currentFieldName += `.${key}`;
        }

        dataKey = dataKeys.pop();
        mainData = _.get(nextObj, dataKeys.join('.'));

    }
    else {

        // checks if the rule field exists in the data object.
        if (data[rule.field] === undefined) {

            // returns error - object.
            return {
                error: {
                    msg: `field ${field} is missing from data.`,
                    data: null
                }
            }
        }

        mainData = data;
        dataKey = rule.field;
    }

    
    // returns value - (payload, mainData, dataKey) - object.
    return {
        value: {
            ...payload,
           mainData,
           dataKey
        }
    }
}

// EVALUATE THE VALIDATED FIELDS - EVALUATION VALIDATION.
function evaluate(payload) {
    const { rule, mainData, dataKey } = payload;

    // string expressions of the rule evaluation.
    const conditions = {
        eq: "mainData[dataKey] == rule.condition_value",
        neq: "mainData[dataKey] != rule.condition_value",
        gt: "mainData[dataKey] > rule.condition_value",
        gte: "mainData[dataKey] >= rule.condition_value",
        contains: "mainData[dataKey].includes(rule.condition_value)",
    }

    // validation object to be returned.
    const validation = {
        field: rule.field,
        field_value: mainData[dataKey],
        condition: rule.condition,
        condition_value: rule.condition_value
    }

    // execution of the valid string expression.
    if (!eval(conditions[rule.condition])) {

        // returns error - error validation fields - object.
        return {
            error: {
                msg: `field ${rule.field} failed validation.`,
                data: {
                    validation: {
                        error: true,
                        ...validation
                    }
                }
            }
        }
    }

    // returns value - success validation fields - object.
    return {
        value: {
            message: `field ${rule.field} successfully validated.`,
            status: 'success',
            data: {
                error: false,
                ...validation
            }
        }
    }
}

// EXCUTES THE VALIDATION FUNCTIONS - EXECUTION
function executeValidateFns(fns, payload) {
    
    if (fns.length === 1) {
        return fns[0](payload);
    }

    const { error, value } = fns.pop()(payload);

    if (error) {
        return { error };
    }

    return executeValidateFns(fns, value);
}

exports.rule_validate = payload => {
    
    const fns = [
        evaluate, 
        checkMissingDataField, 
        checkRequiredRuleFields, 
        checkValidJSONFields,
        checkRequiredJSONFields,
        checkJSONPayload
    ]
    

    return executeValidateFns(fns, payload);
}