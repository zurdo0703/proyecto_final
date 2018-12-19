export class CommandHelper {
    getCommand(commandName: string, object: Object, type: string = null) {
        var result = [];

        for (let i in object)
            if (object[i].command == commandName)
                if (type) {
                    if (object[i].type)
                        result.push(object[i]);
                } else
                    result.push(object[i]);

        if (result.length > 0) {
            if (result.length == 1) return result.pop();
            else result;
        } else return false;
    }
    replaceCommand(commandName: string, type: string, commands: Object, value: Object) {
        for (let i in commands)
            if (commands[i].command == commandName && commands[i].type == type)
                commands[i] = value;

        return commands;
    }
}