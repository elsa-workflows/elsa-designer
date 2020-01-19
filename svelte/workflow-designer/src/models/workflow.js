export class Workflow {

    constructor(fields) {
        this.activities = [];
        if (fields) Object.assign(this, fields);
    }
    
    getActivity(id) {
        return this.activities.find(x => x.id === id);
    }
}