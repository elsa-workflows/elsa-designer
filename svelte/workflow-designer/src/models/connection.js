export class Connection{
    constructor(fields) {
        this.sourceActivityId = null;
        this.targetActivityId = null;
        this.outcome = null;

        if (fields) Object.assign(this, fields);
    }
}