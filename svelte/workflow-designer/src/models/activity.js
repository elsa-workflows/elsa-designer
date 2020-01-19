export class Activity {
    constructor(fields) {
        this.id = null;
        this.type = null;
        this.name = null;
        this.displayName = null;
        this.state = {};
        this.left = 0;
        this.top = 0;
        this.outcomes = ['Done'];

        if (fields) Object.assign(this, fields);
    }
}