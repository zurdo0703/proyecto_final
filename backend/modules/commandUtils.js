/* global config */

let commandUtils = {};

commandUtils.getCommand = (commandName, object, type = false) => {
    let result = [];

    for (let i in object)
        if (object[i].command === commandName)
            if (type) {
                if (object[i].type === type)
                    result.push(object[i]);
            } else
                result.push(object[i]);

    return result.length > 0 ? result : false;
};
commandUtils.replaceCommand = (commandName, type, commands, value) => {
    for (let i in commands)
        if (commands[i].command === commandName && commands[i].type === type)
            commands[i] = value;

    return commands;
};

module.exports = commandUtils;