define([
    './OptionController',
    './NumberControllerBox',
    './NumberControllerSlider',
    './StringController',
    './FunctionController',
    './BooleanController',
    '../utils/common'
], function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {
    'use strict';
    const ControllerFactory = function (object, property) {
        const initialValue = object[property];
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
            return new OptionController(object, property, arguments[2]);
        }
        if (common.isNumber(initialValue)) {
            if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {
                if (common.isNumber(arguments[4])) {
                    return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
                }
                return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
            }
            if (common.isNumber(arguments[4])) {
                return new NumberControllerBox(object, property, {
                    min: arguments[2],
                    max: arguments[3],
                    step: arguments[4]
                });
            }
            return new NumberControllerBox(object, property, {
                min: arguments[2],
                max: arguments[3]
            });
        }
        if (common.isString(initialValue)) {
            return new StringController(object, property);
        }
        if (common.isFunction(initialValue)) {
            return new FunctionController(object, property, '');
        }
        if (common.isBoolean(initialValue)) {
            return new BooleanController(object, property);
        }
        return null;
    };
    return ControllerFactory;
});